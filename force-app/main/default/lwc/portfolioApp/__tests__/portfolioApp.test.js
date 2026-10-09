import { createElement } from 'lwc';
import PortfolioApp from 'c/portfolioApp';

jest.mock('@salesforce/apex/GitHubService.getSnapshot', () => ({ default: jest.fn(() => new Promise(() => {})) }), {
    virtual: true
});
jest.mock('@salesforce/apex/PortfolioContactController.submitMessage', () => ({ default: jest.fn() }), {
    virtual: true
});

describe('c-portfolio-app', () => {
    let element;

    beforeEach(() => {
        Element.prototype.scrollIntoView = jest.fn();
        element = createElement('c-portfolio-app', { is: PortfolioApp });
        document.body.appendChild(element);
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('composes navbar, every section and the footer', () => {
        const root = element.shadowRoot;
        const sections = [...root.querySelectorAll('[data-section]')].map((el) => el.dataset.section);
        expect(sections).toEqual(['top', 'about', 'projects', 'github', 'involvement', 'skills', 'contact']);
        [
            'c-portfolio-navbar',
            'c-portfolio-hero',
            'c-portfolio-about',
            'c-portfolio-projects',
            'c-portfolio-github',
            'c-portfolio-experience',
            'c-portfolio-skills',
            'c-portfolio-contact',
            'c-portfolio-footer'
        ].forEach((tag) => expect(root.querySelector(tag)).not.toBeNull());
    });

    it('renders the hero with the three call-to-action buttons', () => {
        const hero = element.shadowRoot.querySelector('c-portfolio-hero').shadowRoot;
        expect(hero.querySelector('h1').textContent).toBe('c.Portfolio_Name');
        const labels = [...hero.querySelectorAll('.cta .btn')].map((b) => b.textContent.trim());
        expect(labels).toEqual(['View Projects', 'Download Resume', 'Contact Me']);
    });

    it('renders the four projects including the DPI systems project', () => {
        const projects = element.shadowRoot.querySelector('c-portfolio-projects').shadowRoot;
        const cards = projects.querySelectorAll('c-portfolio-project-card');
        expect(cards).toHaveLength(4);
        expect(cards[3].shadowRoot.querySelector('.name').textContent).toBe('Deep Packet Inspection System');
    });

    it('scrolls to a section when a child fires navigate', () => {
        const hero = element.shadowRoot.querySelector('c-portfolio-hero');
        hero.shadowRoot.querySelector('.cta button').click();
        expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
        const target = Element.prototype.scrollIntoView.mock.instances[0];
        expect(target.dataset.section).toBe('projects');
    });
});
