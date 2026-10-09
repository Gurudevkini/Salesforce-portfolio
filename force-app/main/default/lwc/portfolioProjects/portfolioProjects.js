import { LightningElement } from 'lwc';
import { projects } from 'c/portfolioData';

export default class PortfolioProjects extends LightningElement {
    projects = projects;
}
