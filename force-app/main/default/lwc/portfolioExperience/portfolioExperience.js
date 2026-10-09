import { LightningElement } from 'lwc';
import { involvement } from 'c/portfolioData';

export default class PortfolioExperience extends LightningElement {
    openId = involvement.length ? involvement[0].id : null;

    get items() {
        return involvement.map((item) => {
            const expanded = item.id === this.openId;
            return {
                ...item,
                expanded,
                ariaExpanded: expanded ? 'true' : 'false',
                chevronClass: expanded ? 'chevron open' : 'chevron',
                points: item.points.map((text, index) => ({ text, key: `${item.id}-${index}` }))
            };
        });
    }

    handleToggle(event) {
        const { id } = event.currentTarget.dataset;
        this.openId = this.openId === id ? null : id;
    }
}
