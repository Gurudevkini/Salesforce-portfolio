import {
    isHttpUrl,
    isPlaceholder,
    isEmail,
    activityLevel,
    buildActivityGrid,
    formatMonthYear
} from '../portfolioUtils';

describe('portfolioUtils', () => {
    it('detects http(s) urls', () => {
        expect(isHttpUrl('https://example.com')).toBe(true);
        expect(isHttpUrl('[ADD REPOSITORY URL]')).toBe(false);
        expect(isHttpUrl(undefined)).toBe(false);
    });

    it('detects placeholders', () => {
        expect(isPlaceholder('Packet inspection: [ADD IMPLEMENTATION DETAIL]')).toBe(true);
        expect(isPlaceholder('Real text')).toBe(false);
    });

    it('validates emails', () => {
        expect(isEmail('a@b.co')).toBe(true);
        expect(isEmail('[ADD EMAIL ADDRESS]')).toBe(false);
        expect(isEmail('no-at-sign')).toBe(false);
    });

    it('maps counts to heat levels', () => {
        expect([0, 1, 2, 3, 4, 6, 7, 40].map(activityLevel)).toEqual([0, 1, 2, 2, 3, 3, 4, 4]);
    });

    it('pads the grid so the first day lands on its weekday', () => {
        // 2026-10-07 is a Wednesday (getUTCDay() === 3)
        const cells = buildActivityGrid([
            { day: '2026-10-07', count: 0 },
            { day: '2026-10-08', count: 2 }
        ]);
        expect(cells).toHaveLength(5);
        expect(cells.slice(0, 3).every((c) => c.className === 'cell pad')).toBe(true);
        expect(cells[4].className).toBe('cell level-2');
        expect(cells[4].label).toBe('2 public events on 2026-10-08');
    });

    it('handles empty activity and bad dates', () => {
        expect(buildActivityGrid([])).toEqual([]);
        expect(buildActivityGrid(undefined)).toEqual([]);
        expect(formatMonthYear('not a date')).toBe('');
        expect(formatMonthYear('2026-01-15T00:00:00Z')).toBe('Jan 2026');
    });
});
