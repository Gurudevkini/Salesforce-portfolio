/**
 * Server-side GitHub integration for the portfolio.
 * - Public REST API by default (no secret needed, 60 requests/hour/IP).
 * - Optional Named Credential (see Portfolio_Setting__mdt) for authenticated calls.
 * Nothing secret is stored in this repository.
 */
public with sharing class GitHubService {
    private static final String PUBLIC_API = 'https://api.github.com';
    private static final Integer ACTIVITY_DAYS = 84; // 12 weeks
    private static final Integer TIMEOUT_MS = 10000;

    public class GitHubException extends Exception {
    }

    public class Snapshot {
        @AuraEnabled
        public String username;
        @AuraEnabled
        public String profileUrl;
        @AuraEnabled
        public String displayName;
        @AuraEnabled
        public String bio;
        @AuraEnabled
        public Integer publicRepos;
        @AuraEnabled
        public Integer followers;
        @AuraEnabled
        public Integer totalEvents = 0;
        @AuraEnabled
        public List<Repo> repos = new List<Repo>();
        @AuraEnabled
        public List<ActivityDay> activity = new List<ActivityDay>();
    }

    public class Repo {
        @AuraEnabled
        public String name;
        @AuraEnabled
        public String description;
        @AuraEnabled
        public String url;
        @AuraEnabled
        public String language;
        @AuraEnabled
        public Integer stars;
        @AuraEnabled
        public Integer forks;
        @AuraEnabled
        public String pushedAt;
    }

    public class ActivityDay {
        @AuraEnabled
        public String day;
        @AuraEnabled
        public Integer count;
    }

    @AuraEnabled(cacheable=true)
    public static Snapshot getSnapshot() {
        Snapshot snap = new Snapshot();
        snap.username = PortfolioSettings.githubUsername();
        snap.profileUrl = 'https://github.com/' + snap.username;

        Integer failures = 0;
        String firstError;

        // Each block fails independently so a partial result can still render.
        try {
            loadProfile(snap);
        } catch (Exception e) {
            failures++;
            firstError = e.getMessage();
        }
        try {
            loadRepos(snap);
        } catch (Exception e) {
            failures++;
            firstError = firstError == null ? e.getMessage() : firstError;
        }
        try {
            loadActivity(snap);
        } catch (Exception e) {
            failures++;
            firstError = firstError == null ? e.getMessage() : firstError;
        }

        if (failures == 3) {
            // Thrown (not returned) so the failure is never cached by the LWC client cache.
            AuraHandledException ex = new AuraHandledException(firstError);
            ex.setMessage(firstError);
            throw ex;
        }
        return snap;
    }

    // ---------- loaders ----------

    private static void loadProfile(Snapshot snap) {
        Map<String, Object> user = (Map<String, Object>) JSON.deserializeUntyped(
            callGitHub('/users/' + EncodingUtil.urlEncode(snap.username, 'UTF-8'))
        );
        snap.displayName = (String) user.get('name');
        snap.bio = (String) user.get('bio');
        snap.publicRepos = toInteger(user.get('public_repos'));
        snap.followers = toInteger(user.get('followers'));
        String htmlUrl = (String) user.get('html_url');
        if (String.isNotBlank(htmlUrl)) {
            snap.profileUrl = htmlUrl;
        }
    }

    private static void loadRepos(Snapshot snap) {
        String body = callGitHub(
            '/users/' +
                EncodingUtil.urlEncode(snap.username, 'UTF-8') +
                '/repos?per_page=100&sort=pushed&type=owner'
        );
        Set<String> excluded = PortfolioSettings.excludedRepos();
        Integer maxItems = PortfolioSettings.maxRepos();

        for (Object item : (List<Object>) JSON.deserializeUntyped(body)) {
            Map<String, Object> raw = (Map<String, Object>) item;
            String name = (String) raw.get('name');
            Boolean isFork = Boolean.TRUE.equals(raw.get('fork'));
            Boolean isArchived = Boolean.TRUE.equals(raw.get('archived'));
            if (isFork || isArchived || excluded.contains(name.toLowerCase())) {
                continue;
            }
            Repo repo = new Repo();
            repo.name = name;
            repo.description = (String) raw.get('description');
            repo.url = (String) raw.get('html_url');
            repo.language = (String) raw.get('language');
            repo.stars = toInteger(raw.get('stargazers_count'));
            repo.forks = toInteger(raw.get('forks_count'));
            repo.pushedAt = (String) raw.get('pushed_at');
            snap.repos.add(repo);
            if (snap.repos.size() >= maxItems) {
                break;
            }
        }
    }

    /**
     * Builds a 12-week activity series from GitHub's public events feed.
     * This is NOT the full contribution graph (that needs the GraphQL API and a token).
     */
    private static void loadActivity(Snapshot snap) {
        String body = callGitHub(
            '/users/' + EncodingUtil.urlEncode(snap.username, 'UTF-8') + '/events/public?per_page=100'
        );
        Date today = Datetime.now().dateGmt();
        Date start = today.addDays(-(ACTIVITY_DAYS - 1));
        Map<Date, Integer> perDay = new Map<Date, Integer>();

        for (Object item : (List<Object>) JSON.deserializeUntyped(body)) {
            Map<String, Object> event = (Map<String, Object>) item;
            String createdAt = (String) event.get('created_at');
            if (String.isBlank(createdAt) || createdAt.length() < 10) {
                continue;
            }
            Date eventDate = Date.valueOf(createdAt.substring(0, 10));
            if (eventDate < start || eventDate > today) {
                continue;
            }
            Integer current = perDay.get(eventDate);
            perDay.put(eventDate, current == null ? 1 : current + 1);
            snap.totalEvents++;
        }

        for (Integer offset = 0; offset < ACTIVITY_DAYS; offset++) {
            Date day = start.addDays(offset);
            ActivityDay entry = new ActivityDay();
            entry.day = String.valueOf(day);
            entry.count = perDay.containsKey(day) ? perDay.get(day) : 0;
            snap.activity.add(entry);
        }
    }

    // ---------- HTTP ----------

    private static String callGitHub(String path) {
        String credential = PortfolioSettings.namedCredential();
        String base = credential == null ? PUBLIC_API : 'callout:' + credential;

        HttpRequest req = new HttpRequest();
        req.setEndpoint(base + path);
        req.setMethod('GET');
        req.setTimeout(TIMEOUT_MS);
        req.setHeader('Accept', 'application/vnd.github+json');
        req.setHeader('User-Agent', 'salesforce-experience-cloud-portfolio');
        req.setHeader('X-GitHub-Api-Version', '2022-11-28');

        HttpResponse res = new Http().send(req);
        Integer status = res.getStatusCode();
        if (status == 403 || status == 429) {
            throw new GitHubException('GitHub rate limit reached. Please try again later.');
        }
        if (status == 404) {
            throw new GitHubException('GitHub user was not found. Check Portfolio_Setting__mdt.');
        }
        if (status != 200) {
            throw new GitHubException('GitHub returned status ' + status + '.');
        }
        return res.getBody();
    }

    private static Integer toInteger(Object value) {
        if (value == null) {
            return 0;
        }
        return Decimal.valueOf(String.valueOf(value)).intValue();
    }
}
