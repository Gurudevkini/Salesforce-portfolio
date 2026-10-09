/**
 * Handles the public contact form.
 * Runs "without sharing" on purpose: site guest users cannot own or create records
 * under normal sharing rules, so validation is done here instead.
 */
public without sharing class PortfolioContactController {
    @TestVisible
    private static final Integer MAX_NAME = 80;
    @TestVisible
    private static final Integer MAX_SUBJECT = 150;
    @TestVisible
    private static final Integer MAX_MESSAGE = 5000;
    @TestVisible
    private static final Integer MAX_PER_HOUR = 5;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        '^[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}$'
    );

    public class SubmitResult {
        @AuraEnabled
        public Boolean success;
        @AuraEnabled
        public String message;

        public SubmitResult(Boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }

    /**
     * @param website honeypot field; real visitors never fill it in.
     */
    @AuraEnabled
    public static SubmitResult submitMessage(
        String senderName,
        String senderEmail,
        String subject,
        String message,
        String website
    ) {
        // Bots fill hidden fields. Pretend success and store nothing.
        if (String.isNotBlank(website)) {
            return new SubmitResult(true, Label.Portfolio_Contact_Success);
        }

        String name = clean(senderName);
        String email = clean(senderEmail);
        String subj = clean(subject);
        String body = message == null ? '' : message.trim();

        String validationError = validate(name, email, body);
        if (validationError != null) {
            return new SubmitResult(false, validationError);
        }

        if (isRateLimited(email)) {
            return new SubmitResult(false, Label.Portfolio_Contact_Rate_Limit);
        }

        Portfolio_Message__c record = new Portfolio_Message__c(
            Sender_Name__c = name,
            Sender_Email__c = email,
            Subject__c = String.isBlank(subj) ? 'Portfolio enquiry' : subj.left(MAX_SUBJECT),
            Message__c = body.left(MAX_MESSAGE),
            Status__c = 'New'
        );
        Id ownerId = resolveOwnerId();
        if (ownerId != null) {
            record.OwnerId = ownerId;
        }

        Database.SaveResult result = Database.insert(record, false);
        if (!result.isSuccess()) {
            System.debug(LoggingLevel.ERROR, 'Portfolio contact insert failed: ' + result.getErrors());
            return new SubmitResult(false, Label.Portfolio_Contact_Error);
        }

        notifyOwner(record);
        return new SubmitResult(true, Label.Portfolio_Contact_Success);
    }

    private static String validate(String name, String email, String body) {
        if (String.isBlank(name) || String.isBlank(email) || String.isBlank(body)) {
            return 'Please fill in your name, email and message.';
        }
        if (name.length() > MAX_NAME) {
            return 'Name must be ' + MAX_NAME + ' characters or fewer.';
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return 'Please enter a valid email address.';
        }
        if (body.length() > MAX_MESSAGE) {
            return 'Message must be ' + MAX_MESSAGE + ' characters or fewer.';
        }
        return null;
    }

    private static Boolean isRateLimited(String email) {
        Integer recent = [
            SELECT COUNT()
            FROM Portfolio_Message__c
            WHERE Sender_Email__c = :email AND CreatedDate = LAST_N_HOURS:1
        ];
        return recent >= MAX_PER_HOUR;
    }

    private static Id resolveOwnerId() {
        String username = PortfolioSettings.messageOwnerUsername();
        if (username == null) {
            return null;
        }
        List<User> owners = [
            SELECT Id
            FROM User
            WHERE Username = :username AND IsActive = TRUE
            LIMIT 1
        ];
        return owners.isEmpty() ? null : owners[0].Id;
    }

    private static void notifyOwner(Portfolio_Message__c record) {
        String recipient = PortfolioSettings.notificationEmail();
        if (recipient == null) {
            return;
        }
        try {
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setToAddresses(new List<String>{ recipient });
            mail.setReplyTo(record.Sender_Email__c);
            mail.setSenderDisplayName('Portfolio contact form');
            mail.setSubject('[Portfolio] ' + record.Subject__c);
            mail.setPlainTextBody(
                'From: ' + record.Sender_Name__c + ' <' + record.Sender_Email__c + '>\n\n' + record.Message__c
            );
            Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{ mail });
        } catch (Exception e) {
            // A failed notification must never lose the stored message.
            System.debug(LoggingLevel.WARN, 'Portfolio notification failed: ' + e.getMessage());
        }
    }

    private static String clean(String value) {
        return value == null ? null : value.trim();
    }
}
