import { createElement } from 'lwc';
import PortfolioGithub from 'c/portfolioGithub';
import getSnapshot from '@salesforce/apex/GitHubService.getSnapshot';

jest.mock('@salesforce/apex/GitHubService.getSnapshot', () => ({ default: jest.fn() }), {
    virtual: true
});

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

const snapshot = {
    username: 'octocat',
    profileUrl: 'https://github.com/octocat',
    displayName: 'The Octocat',
    bio: 'Hello',
    publicRepos: 8,
    followers: 3,
    totalEvents: 3,
    repos: [
        {
            name: 'repo-one',
            description: 'First repo',
            url: 'https://github.com/octocat/repo-one',
            language: 'C++',
            stars: 5,
            forks: 1,
            pushedAt: '2026-09-01T00:00:00Z'
        }
    ],
    activity: [
        { day: '2026-10-06', count: 0 },
        { day: '2026-10-07', count: 1 },
        { day: '2026-10-08', count: 2 }
    ]
};

describe('c-portfolio-github', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    function mount() {
        const element = createElement('c-portfolio-github', { is: PortfolioGithub });
        document.body.appendChild(element);
        return element;
    }

    it('shows a loading state first', () => {
        getSnapshot.mockReturnValue(new Promise(() => {}));
        const root = mount().shadowRoot;
        expect(root.querySelector('.skeleton')).not.toBeNull();
    });

    it('renders profile, activity cells and repositories', async () => {
        getSnapshot.mockResolvedValue(snapshot);
        const root = mount().shadowRoot;
        await flushPromises();
        expect(root.querySelector('.display-name').textContent).toBe('The Octocat');
        expect(root.querySelectorAll('.heat .cell:not(.pad)')).toHaveLength(3);
        expect(root.querySelector('.heat').getAttribute('aria-label')).toContain('3 public GitHub events');
        expect(root.querySelectorAll('.repo')).toHaveLength(1);
        expect(root.querySelector('.repo-name').getAttribute('href')).toBe(
            'https://github.com/octocat/repo-one'
        );
    });

    it('falls back to a message with a profile link when Apex fails, and can retry', async () => {
        getSnapshot.mockRejectedValueOnce({ body: { message: 'GitHub rate limit reached.' } });
        const root = mount().shadowRoot;
        await flushPromises();
        expect(root.querySelector('.notice-text').textContent).toBe('GitHub rate limit reached.');
        // Jest stubs custom labels with their names, so assert the link is wired to the label value.
        expect(root.querySelector('.notice a').getAttribute('href')).toBe('c.Portfolio_GitHub_Url');

        getSnapshot.mockResolvedValueOnce(snapshot);
        root.querySelector('.notice button').click();
        await flushPromises();
        expect(root.querySelector('.notice')).toBeNull();
        expect(root.querySelectorAll('.repo')).toHaveLength(1);
    });
});
