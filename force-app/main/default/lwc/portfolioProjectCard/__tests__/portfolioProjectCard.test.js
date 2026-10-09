import { createElement } from 'lwc';
import PortfolioProjectCard from 'c/portfolioProjectCard';

const baseProject = {
    id: 'x',
    title: 'Demo',
    kind: 'Kind',
    featured: false,
    summary: 'Summary',
    result: { value: '83%', label: 'faster' },
    highlights: ['Real point', 'Detail: [ADD IMPLEMENTATION DETAIL]'],
    stack: ['React.js', 'Redis'],
    links: { live: 'https://example.com', github: '[ADD REPOSITORY URL]' }
};

function mount(project) {
    const element = createElement('c-portfolio-project-card', { is: PortfolioProjectCard });
    element.project = project;
    document.body.appendChild(element);
    return element;
}

describe('c-portfolio-project-card', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders title, result, highlights and stack', () => {
        const element = mount(baseProject);
        const root = element.shadowRoot;
        expect(root.querySelector('.name').textContent).toBe('Demo');
        expect(root.querySelector('.result-value').textContent).toBe('83%');
        expect(root.querySelectorAll('.point')).toHaveLength(2);
        expect(root.querySelectorAll('.stack .tag')).toHaveLength(2);
    });

    it('renders only links that are real urls, never placeholders', () => {
        const root = mount(baseProject).shadowRoot;
        const hrefs = [...root.querySelectorAll('.links a')].map((a) => a.getAttribute('href'));
        expect(hrefs).toEqual(['https://example.com']);
    });

    it('hides the links row when there are no usable links', () => {
        const root = mount({ ...baseProject, links: { live: '', github: '[ADD REPOSITORY URL]' } })
            .shadowRoot;
        expect(root.querySelector('.links')).toBeNull();
    });

    it('styles placeholder highlights and flags featured rows', () => {
        const root = mount({ ...baseProject, featured: true }).shadowRoot;
        expect(root.querySelectorAll('.point.placeholder')).toHaveLength(1);
        expect(root.querySelector('article').classList.contains('featured')).toBe(true);
    });
});
