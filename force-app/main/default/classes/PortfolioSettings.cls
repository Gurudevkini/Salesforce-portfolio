/**
 * Reads Portfolio_Setting__mdt (record "Default") and applies safe defaults,
 * so the site keeps working even if the record is missing or partially filled.
 */
public with sharing class PortfolioSettings {
    public static final String DEFAULT_GITHUB_USERNAME = 'Gurudevkini';
    public static final Integer DEFAULT_MAX_REPOS = 6;
    public static final Integer MAX_REPOS_CAP = 12;

    @TestVisible
    private static Portfolio_Setting__mdt testOverride;

    private static Portfolio_Setting__mdt current() {
        if (testOverride != null) {
            return testOverride;
        }
        return Portfolio_Setting__mdt.getInstance('Default');
    }

    public static String githubUsername() {
        Portfolio_Setting__mdt setting = current();
        String value = setting == null ? null : setting.GitHub_Username__c;
        return String.isBlank(value) ? DEFAULT_GITHUB_USERNAME : value.trim();
    }

    public static Integer maxRepos() {
        Portfolio_Setting__mdt setting = current();
        if (setting == null || setting.GitHub_Max_Repos__c == null) {
            return DEFAULT_MAX_REPOS;
        }
        Integer value = setting.GitHub_Max_Repos__c.intValue();
        return Math.min(Math.max(value, 1), MAX_REPOS_CAP);
    }

    public static Set<String> excludedRepos() {
        Set<String> names = new Set<String>();
        Portfolio_Setting__mdt setting = current();
        if (setting != null && String.isNotBlank(setting.Excluded_Repos__c)) {
            for (String name : setting.Excluded_Repos__c.split(',')) {
                if (String.isNotBlank(name)) {
                    names.add(name.trim().toLowerCase());
                }
            }
        }
        return names;
    }

    public static String namedCredential() {
        Portfolio_Setting__mdt setting = current();
        String value = setting == null ? null : setting.GitHub_Named_Credential__c;
        return String.isBlank(value) ? null : value.trim();
    }

    public static String messageOwnerUsername() {
        Portfolio_Setting__mdt setting = current();
        String value = setting == null ? null : setting.Message_Owner_Username__c;
        return String.isBlank(value) ? null : value.trim();
    }

    public static String notificationEmail() {
        Portfolio_Setting__mdt setting = current();
        String value = setting == null ? null : setting.Notification_Email__c;
        return String.isBlank(value) ? null : value.trim();
    }
}
