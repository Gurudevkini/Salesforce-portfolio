const PLACEHOLDER_MARKER = '[ADD';

export function isHttpUrl(value) {
    return typeof value === 'string' && /^https?:\/\//i.test(value);
}

export function isPlaceholder(value) {
    return typeof value === 'string' && value.includes(PLACEHOLDER_MARKER);
}

export function isEmail(value) {
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function prefersReducedMotion() {
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
        return false;
    }
}

export function formatMonthYear(isoString) {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
        date
    );
}

export function activityLevel(count) {
    if (!count || count < 1) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 6) return 3;
    return 4;
}

/**
 * Turns [{day: 'YYYY-MM-DD', count}] into heat-map cells. Leading blank cells align the
 * first day with its weekday so the grid reads as Sunday-first week columns.
 */
export function buildActivityGrid(activity) {
    if (!Array.isArray(activity) || activity.length === 0) {
        return [];
    }
    const firstDay = new Date(`${activity[0].day}T00:00:00Z`);
    const leadingBlanks = Number.isNaN(firstDay.getTime()) ? 0 : firstDay.getUTCDay();
    const cells = [];
    for (let i = 0; i < leadingBlanks; i++) {
        cells.push({ key: `pad-${i}`, className: 'cell pad', label: '' });
    }
    activity.forEach((entry) => {
        const events = entry.count || 0;
        cells.push({
            key: entry.day,
            className: `cell level-${activityLevel(events)}`,
            label: `${events} public event${events === 1 ? '' : 's'} on ${entry.day}`
        });
    });
    return cells;
}
