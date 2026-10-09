import { profile, navLinks, projects, involvement, skillGroups, about } from '../portfolioData';
import { isHttpUrl, isPlaceholder } from 'c/portfolioUtils';

describe('portfolioData', () => {
    it('exposes the required hero identity', () => {
        expect(profile.name).toBeTruthy();
        expect(profile.role).toBeTruthy();
        expect(profile.githubUrl).toBeTruthy();
        expect(profile.linkedinUrl).toBeTruthy();
        expect(profile.resumeUrl).toContain('Gurudev-Kini-Resume.pdf');
    });

    it('has unique nav ids that all map to a page section', () => {
        const ids = navLinks.map((link) => link.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids).toEqual(['about', 'projects', 'github', 'involvement', 'skills', 'contact']);
    });

    it('lists the four required projects in order', () => {
        expect(projects.map((p) => p.id)).toEqual(['pagemint', 'linksense', 'stockly', 'dpi']);
    });

    it('gives every project the fields the card needs', () => {
        projects.forEach((project) => {
            expect(project.title).toBeTruthy();
            expect(project.summary).toBeTruthy();
            expect(project.result.value).toBeTruthy();
            expect(project.stack.length).toBeGreaterThan(0);
            expect(project.highlights.length).toBeGreaterThan(0);
        });
    });

    it('uses only real http(s) links or explicit placeholders for project links', () => {
        projects.forEach((project) => {
            ['live', 'github'].forEach((key) => {
                const url = project.links[key];
                expect(url === '' || isHttpUrl(url) || isPlaceholder(url)).toBe(true);
            });
        });
    });

    it('marks every unknown DPI detail as a placeholder instead of inventing it', () => {
        const dpi = projects.find((p) => p.id === 'dpi');
        expect(dpi.featured).toBe(true);
        expect(dpi.highlights.every((text) => isPlaceholder(text))).toBe(true);
    });

    it('has unique ids across content collections', () => {
        [involvement, skillGroups, about.pillars, projects].forEach((collection) => {
            const ids = collection.map((item) => item.id);
            expect(new Set(ids).size).toBe(ids.length);
        });
    });
});
