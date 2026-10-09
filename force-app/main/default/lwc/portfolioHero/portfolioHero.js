import { LightningElement } from 'lwc';
import { profile } from 'c/portfolioData';

export default class PortfolioHero extends LightningElement {
    profile = profile;

    get photoAlt() {
        return `Portrait of ${profile.name}`;
    }

    get focusItems() {
        return profile.focus.map((label) => ({ label, key: label }));
    }

    showProjects() {
        this.navigate('projects');
    }

    showContact() {
        this.navigate('contact');
    }

    navigate(id) {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { id } }));
    }
}
