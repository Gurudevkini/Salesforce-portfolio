import { createElement } from 'lwc';
import PortfolioExperience from 'c/portfolioExperience';

describe('c-portfolio-experience', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('opens the first item by default and toggles one at a time', async () => {
        const element = createElement('c-portfolio-experience', { is: PortfolioExperience });
        document.body.appendChild(element);
        const root = element.shadowRoot;
        const buttons = () => root.querySelectorAll('button.trigger');

        expect(buttons()[0].getAttribute('aria-expanded')).toBe('true');
        expect(root.querySelectorAll('ul.points')).toHaveLength(1);

        buttons()[1].click();
        await Promise.resolve();
        expect(buttons()[0].getAttribute('aria-expanded')).toBe('false');
        expect(buttons()[1].getAttribute('aria-expanded')).toBe('true');
        expect(root.querySelectorAll('ul.points')).toHaveLength(1);

        buttons()[1].click();
        await Promise.resolve();
        expect(root.querySelectorAll('ul.points')).toHaveLength(0);
    });
});
