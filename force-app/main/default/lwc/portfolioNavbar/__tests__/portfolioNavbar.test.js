import { createElement } from 'lwc';
import PortfolioNavbar from 'c/portfolioNavbar';

const flush = () => Promise.resolve();

describe('c-portfolio-navbar', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    function mount(props = {}) {
        const element = createElement('c-portfolio-navbar', { is: PortfolioNavbar });
        Object.assign(element, props);
        document.body.appendChild(element);
        return element;
    }

    it('renders all six desktop links and marks the active section', async () => {
        const element = mount({ activeSection: 'projects' });
        await flush();
        const links = element.shadowRoot.querySelectorAll('.nav-desktop a');
        expect(links).toHaveLength(6);
        const active = element.shadowRoot.querySelector('.nav-desktop a.active');
        expect(active.textContent.trim()).toBe('Projects');
        expect(active.getAttribute('aria-current')).toBe('location');
    });

    it('toggles the mobile menu and reports aria-expanded', async () => {
        const element = mount();
        const button = element.shadowRoot.querySelector('.menu-btn');
        expect(button.getAttribute('aria-expanded')).toBe('false');
        expect(element.shadowRoot.querySelector('.mobile-panel')).toBeNull();

        button.click();
        await flush();
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(element.shadowRoot.querySelector('.mobile-panel')).not.toBeNull();

        element.shadowRoot
            .querySelector('header')
            .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await flush();
        expect(element.shadowRoot.querySelector('.mobile-panel')).toBeNull();
    });

    it('fires a navigate event with the section id and closes the menu', async () => {
        const element = mount();
        const handler = jest.fn();
        element.addEventListener('navigate', handler);

        element.shadowRoot.querySelector('.menu-btn').click();
        await flush();
        element.shadowRoot.querySelector('.mobile-panel a[data-id="contact"]').click();
        await flush();

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0].detail).toEqual({ id: 'contact' });
        expect(element.shadowRoot.querySelector('.mobile-panel')).toBeNull();
    });

    it('links the resume button to the static resource file', () => {
        const element = mount();
        const resume = element.shadowRoot.querySelector('a.resume');
        expect(resume.getAttribute('href')).toContain('Gurudev-Kini-Resume.pdf');
        expect(resume.getAttribute('rel')).toBe('noopener');
    });
});
