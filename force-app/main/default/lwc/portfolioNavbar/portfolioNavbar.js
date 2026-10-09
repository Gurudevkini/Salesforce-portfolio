import { LightningElement, api } from 'lwc';
import { profile, navLinks } from 'c/portfolioData';

export default class PortfolioNavbar extends LightningElement {
    /** Section id currently in view; highlights the matching link. */
    @api activeSection = 'top';

    profile = profile;
    menuOpen = false;
    scrolled = false;

    connectedCallback() {
        this.handleScroll = () => {
            this.scrolled = window.scrollY > 8;
        };
        window.addEventListener('scroll', this.handleScroll, { passive: true });
        this.handleScroll();
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    get links() {
        return navLinks.map((link) => {
            const isActive = link.id === this.activeSection;
            return {
                ...link,
                href: `#${link.id}`,
                className: isActive ? 'nav-link active' : 'nav-link',
                ariaCurrent: isActive ? 'location' : null
            };
        });
    }

    get headerClass() {
        return this.scrolled || this.menuOpen ? 'header scrolled' : 'header';
    }

    get menuExpanded() {
        return this.menuOpen ? 'true' : 'false';
    }

    get menuIcon() {
        return this.menuOpen ? 'close' : 'menu';
    }

    get menuLabel() {
        return this.menuOpen ? 'Close menu' : 'Open menu';
    }

    handleNavClick(event) {
        event.preventDefault();
        this.menuOpen = false;
        this.navigateTo(event.currentTarget.dataset.id);
    }

    handleBrandClick(event) {
        event.preventDefault();
        this.menuOpen = false;
        this.navigateTo('top');
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }

    handleKeydown(event) {
        if (event.key === 'Escape' && this.menuOpen) {
            this.menuOpen = false;
        }
    }

    navigateTo(id) {
        this.dispatchEvent(new CustomEvent('navigate', { detail: { id } }));
    }
}
