import { LightningElement } from 'lwc';
import { skillGroups } from 'c/portfolioData';

export default class PortfolioSkills extends LightningElement {
    groups = skillGroups.map((group) => ({
        ...group,
        items: group.items.map((label) => ({ label, key: `${group.id}-${label}` }))
    }));
}
