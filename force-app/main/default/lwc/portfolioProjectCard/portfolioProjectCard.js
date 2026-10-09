import { LightningElement, api } from 'lwc';
import { isHttpUrl, isPlaceholder } from 'c/portfolioUtils';

export default class PortfolioProjectCard extends LightningElement {
    @api project;

    get rowClass() {
        return this.project && this.project.featured ? 'row featured' : 'row';
    }

    get resultClass() {
        return this.project && isPlaceholder(this.project.result.value)
            ? 'result-value placeholder'
            : 'result-value';
    }

    get highlights() {
        return ((this.project && this.project.highlights) || []).map((text, index) => ({
            key: `${this.project.id}-h-${index}`,
            text,
            className: isPlaceholder(text) ? 'point placeholder' : 'point'
        }));
    }

    get stack() {
        return ((this.project && this.project.stack) || []).map((label) => ({ label, key: label }));
    }

    get liveUrl() {
        return this.project && isHttpUrl(this.project.links.live) ? this.project.links.live : null;
    }

    get githubUrl() {
        return this.project && isHttpUrl(this.project.links.github)
            ? this.project.links.github
            : null;
    }

    get hasLinks() {
        return Boolean(this.liveUrl || this.githubUrl);
    }

    get liveLabel() {
        return `Live demo of ${this.project.title}`;
    }

    get githubLabel() {
        return `${this.project.title} source on GitHub`;
    }
}
