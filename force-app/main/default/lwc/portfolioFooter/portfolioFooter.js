import { LightningElement } from 'lwc';
import { profile } from 'c/portfolioData';

export default class PortfolioFooter extends LightningElement {
    profile = profile;

    get year() {
        return new Date().getFullYear();
    }

    handleTop(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('navigate', { detail: { id: 'top' } }));
    }
}
