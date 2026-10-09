import { LightningElement } from 'lwc';
import { about } from 'c/portfolioData';

export default class PortfolioAbout extends LightningElement {
    paragraphs = about.paragraphs.map((text, index) => ({ text, key: `p-${index}` }));
    pillars = about.pillars;
}
