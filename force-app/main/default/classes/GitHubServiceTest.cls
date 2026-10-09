@IsTest
private class GitHubServiceTest {
    private class GitHubMock implements HttpCalloutMock {
        private final Integer status;

        public GitHubMock(Integer status) {
            this.status = status;
        }

        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setStatusCode(status);
            if (status != 200) {
                res.setBody('{"message":"error"}');
                return res;
            }
            String endpoint = req.getEndpoint();
            if (endpoint.contains('/events/public')) {
                String today = String.valueOf(Datetime.now().dateGmt());
                res.setBody(
                    '[{"type":"PushEvent","created_at":"' + today + 'T10:00:00Z"},' +
                    '{"type":"PushEvent","created_at":"' + today + 'T11:00:00Z"},' +
                    '{"type":"PushEvent","created_at":"2001-01-01T00:00:00Z"},' +
                    '{"type":"PushEvent"}]'
                );
            } else if (endpoint.contains('/repos')) {
                res.setBody(
                    '[{"name":"Keep","description":"d","html_url":"https://github.com/u/Keep","language":"C++","stargazers_count":3,"forks_count":1,"pushed_at":"2026-01-01T00:00:00Z","fork":false,"archived":false},' +
                    '{"name":"Forked","fork":true,"archived":false},' +
                    '{"name":"Old","fork":false,"archived":true},' +
                    '{"name":"Hidden","html_url":"https://github.com/u/Hidden","fork":false,"archived":false}]'
                );
            } else {
                res.setBody(
                    '{"name":"Test User","bio":"hi","public_repos":9,"followers":4,"html_url":"https://github.com/u"}'
                );
            }
            return res;
        }
    }

    @IsTest
    static void buildsSnapshotAndFiltersRepos() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt(
            GitHub_Username__c = 'u',
            Excluded_Repos__c = 'hidden'
        );
        Test.setMock(HttpCalloutMock.class, new GitHubMock(200));

        Test.startTest();
        GitHubService.Snapshot snap = GitHubService.getSnapshot();
        Test.stopTest();

        System.assertEquals('Test User', snap.displayName);
        System.assertEquals(9, snap.publicRepos);
        System.assertEquals(1, snap.repos.size(), 'Forks, archived and excluded repos are hidden');
        System.assertEquals('Keep', snap.repos[0].name);
        System.assertEquals(3, snap.repos[0].stars);
        System.assertEquals(84, snap.activity.size());
        System.assertEquals(2, snap.totalEvents, 'Only events inside the 12-week window count');
        System.assertEquals(2, snap.activity[83].count);
    }

    @IsTest
    static void reportsFailureWhenGitHubRejectsEveryCall() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt(GitHub_Username__c = 'u');
        Test.setMock(HttpCalloutMock.class, new GitHubMock(403));

        String message;
        Test.startTest();
        try {
            GitHubService.getSnapshot();
        } catch (AuraHandledException e) {
            message = e.getMessage();
        }
        Test.stopTest();

        System.assertNotEquals(null, message, 'Total failure must surface as an exception');
        System.assert(message.contains('rate limit'));
    }

    @IsTest
    static void reportsMissingUser() {
        PortfolioSettings.testOverride = new Portfolio_Setting__mdt(GitHub_Username__c = 'nobody');
        Test.setMock(HttpCalloutMock.class, new GitHubMock(404));

        String message;
        Test.startTest();
        try {
            GitHubService.getSnapshot();
        } catch (AuraHandledException e) {
            message = e.getMessage();
        }
        Test.stopTest();

        System.assertNotEquals(null, message);
        System.assert(message.contains('not found'));
    }
}
