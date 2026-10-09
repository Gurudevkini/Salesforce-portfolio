import { LightningElement, api } from 'lwc';

// 24x24 stroke icons (paths follow the Lucide icon style).
const ICONS = {
    github: [
        'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4',
        'M9 18c-4.51 2-5-2-7-2'
    ],
    linkedin: [
        'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z',
        'M2 9h4v12H2z',
        'M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z'
    ],
    mail: [
        'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
        'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'
    ],
    download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
    external: [
        'M15 3h6v6',
        'M10 14 21 3',
        'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'
    ],
    menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
    close: ['M18 6 6 18', 'm6 6 12 12'],
    chevron: ['m6 9 6 6 6-6'],
    star: [
        'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
    ],
    fork: [
        'M12 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
        'M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
        'M18 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
        'M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9',
        'M12 12v3'
    ],
    send: ['m22 2-7 20-4-9-9-4z', 'M22 2 11 13']
};

export default class PortfolioIcon extends LightningElement {
    @api name;
    @api size = 'md'; // sm | md | lg

    get paths() {
        return (ICONS[this.name] || []).map((d, index) => ({ key: `${this.name}-${index}`, d }));
    }

    get sizeClass() {
        return `icon icon-${this.size}`;
    }
}
