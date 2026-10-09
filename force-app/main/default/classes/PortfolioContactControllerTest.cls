@IsTest
private class PortfolioContactControllerTest {
    private static PortfolioContactController.SubmitResult submit(String email, String message) {
        return PortfolioContactController.submitMessage('Ada', email, 'Hello', message, null);
    }

    @IsTest
    static void storesValidMessage() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt(
            Message_Owner_Username__c = UserInfo.getUserName(),
            Notification_Email__c = 'owner@example.com'
        );

        Test.startTest();
        PortfolioContactController.SubmitResult result = submit('ada@example.com', 'Nice portfolio');
        Test.stopTest();

        System.assert(result.success);
        List<Portfolio_Message__c> saved = [
            SELECT Sender_Name__c, Sender_Email__c, Subject__c, Status__c, OwnerId
            FROM Portfolio_Message__c
        ];
        System.assertEquals(1, saved.size());
        System.assertEquals('ada@example.com', saved[0].Sender_Email__c);
        System.assertEquals('New', saved[0].Status__c);
        System.assertEquals(UserInfo.getUserId(), saved[0].OwnerId);
    }

    @IsTest
    static void defaultsSubjectWhenBlank() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt();
        PortfolioContactController.submitMessage('Ada', 'ada@example.com', '  ', 'Hi', null);
        System.assertEquals('Portfolio enquiry', [SELECT Subject__c FROM Portfolio_Message__c].Subject__c);
    }

    @IsTest
    static void rejectsMissingFields() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt();
        PortfolioContactController.SubmitResult result = PortfolioContactController.submitMessage(
            '', 'ada@example.com', 'x', 'y', null
        );
        System.assertEquals(false, result.success);
        System.assertEquals(0, [SELECT COUNT() FROM Portfolio_Message__c]);
    }

    @IsTest
    static void rejectsInvalidEmail() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt();
        PortfolioContactController.SubmitResult result = submit('not-an-email', 'Hi');
        System.assertEquals(false, result.success);
        System.assert(result.message.contains('valid email'));
    }

    @IsTest
    static void rejectsOversizedInput() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt();
        System.assertEquals(
            false,
            submit('ada@example.com', 'x'.repeat(PortfolioContactController.MAX_MESSAGE + 1)).success
        );
        System.assertEquals(
            false,
            PortfolioContactController.submitMessage(
                    'n'.repeat(PortfolioContactController.MAX_NAME + 1), 'ada@example.com', 's', 'm', null
                )
                .success
        );
    }

    @IsTest
    static void honeypotIsSilentlyDropped() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt();
        PortfolioContactController.SubmitResult result = PortfolioContactController.submitMessage(
            'Bot', 'bot@example.com', 's', 'm', 'http://spam.example'
        );
        System.assert(result.success);
        System.assertEquals(0, [SELECT COUNT() FROM Portfolio_Message__c]);
    }

    @IsTest
    static void rateLimitsRepeatSenders() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt();
        for (Integer i = 0; i < PortfolioContactController.MAX_PER_HOUR; i++) {
            System.assert(submit('ada@example.com', 'Message ' + i).success);
        }
        PortfolioContactController.SubmitResult blocked = submit('ada@example.com', 'One too many');
        System.assertEquals(false, blocked.success);
        System.assertEquals(
            PortfolioContactController.MAX_PER_HOUR,
            [SELECT COUNT() FROM Portfolio_Message__c]
        );
    }
}
