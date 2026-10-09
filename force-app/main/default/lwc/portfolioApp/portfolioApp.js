import { LightningElement } from 'lwc';
import { prefersReducedMotion } from 'c/portfolioUtils';

export default class PortfolioApp extends LightningElement {
    activeSection = 'top';
    observer;

    renderedCallback() {
        if (!this.observer) {
            this.observeSections();
        }
    }

    disconnectedCallback() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = undefined;
        }
    }

    /** Scroll-spy: highlights the nav link of the section crossing the middle of the viewport. */
    observeSections() {
        if (typeof IntersectionObserver === 'undefined') {
            return;
        }
        const sections = this.template.querySelectorAll('[data-section]');
        if (!sections.length) {
            return;
        }
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.activeSection = entry.target.dataset.section;
                    }
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );
        sections.forEach((section) => this.observer.observe(section));
    }

    handleNavigate(event) {
        const { id } = event.detail;
        const target = this.template.querySelector(`[data-section="${id}"]`);
        if (target) {
            target.scrollIntoView({
                behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    }

    handleSkip(event) {
        event.preventDefault();
        const main = this.template.querySelector('main');
        if (main) {
            main.focus();
        }
    }
}
