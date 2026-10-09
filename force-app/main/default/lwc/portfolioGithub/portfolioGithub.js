import { LightningElement } from 'lwc';
import getSnapshot from '@salesforce/apex/GitHubService.getSnapshot';
import { profile } from 'c/portfolioData';
import { buildActivityGrid, formatMonthYear } from 'c/portfolioUtils';

const FALLBACK_ERROR = 'GitHub data is unavailable right now.';

export default class PortfolioGithub extends LightningElement {
    profileUrl = profile.githubUrl;
    isLoading = true;
    snapshot;
    errorMessage;

    connectedCallback() {
        this.loadSnapshot();
    }

    async loadSnapshot() {
        this.isLoading = true;
        this.errorMessage = undefined;
        try {
            this.snapshot = await getSnapshot();
        } catch (error) {
            this.snapshot = undefined;
            this.errorMessage = (error && error.body && error.body.message) || FALLBACK_ERROR;
        } finally {
            this.isLoading = false;
        }
    }

    handleRetry() {
        this.loadSnapshot();
    }

    get hasSnapshot() {
        return Boolean(this.snapshot);
    }

    get displayName() {
        return this.snapshot.displayName || this.snapshot.username;
    }

    get hasBio() {
        return Boolean(this.snapshot && this.snapshot.bio);
    }

    get activityCells() {
        return buildActivityGrid(this.snapshot ? this.snapshot.activity : []);
    }

    get hasActivity() {
        return this.activityCells.length > 0;
    }

    get activitySummary() {
        return `${this.snapshot.totalEvents} public GitHub events in the last 12 weeks`;
    }

    get repos() {
        return (this.snapshot.repos || []).map((repo) => ({
            ...repo,
            key: repo.name,
            hasDescription: Boolean(repo.description),
            hasLanguage: Boolean(repo.language),
            updated: formatMonthYear(repo.pushedAt)
        }));
    }

    get hasRepos() {
        return this.repos.length > 0;
    }
}
