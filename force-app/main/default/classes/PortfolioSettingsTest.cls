@IsTest
private class PortfolioSettingsTest {
    @IsTest
    static void usesDefaultsWhenSettingMissing() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt();
        System.assertEquals(PortfolioSettings.DEFAULT_GITHUB_USERNAME, PortfolioSettings.githubUsername());
        System.assertEquals(PortfolioSettings.DEFAULT_MAX_REPOS, PortfolioSettings.maxRepos());
        System.assert(PortfolioSettings.excludedRepos().isEmpty());
        System.assertEquals(null, PortfolioSettings.namedCredential());
        System.assertEquals(null, PortfolioSettings.messageOwnerUsername());
        System.assertEquals(null, PortfolioSettings.notificationEmail());
    }

    @IsTest
    static void readsAndClampsConfiguredValues() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt(
            GitHub_Username__c = ' octocat ',
            GitHub_Max_Repos__c = 99,
            Excluded_Repos__c = 'Hello-World, Spoon-Knife ,',
            GitHub_Named_Credential__c = 'GitHub_NC',
            Message_Owner_Username__c = 'owner@example.com',
            Notification_Email__c = 'me@example.com'
        );
        System.assertEquals('octocat', PortfolioSettings.githubUsername());
        System.assertEquals(PortfolioSettings.MAX_REPOS_CAP, PortfolioSettings.maxRepos());
        System.assertEquals(2, PortfolioSettings.excludedRepos().size());
        System.assert(PortfolioSettings.excludedRepos().contains('hello-world'));
        System.assertEquals('GitHub_NC', PortfolioSettings.namedCredential());
        System.assertEquals('owner@example.com', PortfolioSettings.messageOwnerUsername());
        System.assertEquals('me@example.com', PortfolioSettings.notificationEmail());
    }

    @IsTest
    static void clampsLowRepoCount() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt(GitHub_Max_Repos__c = 0);
        System.assertEquals(1, PortfolioSettings.maxRepos());
    }
}
