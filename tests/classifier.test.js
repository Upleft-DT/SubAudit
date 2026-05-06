const { classifyChannel } = require('../script.js');

function daysAgo(days) {
    return new Date(Date.now() - days * 86_400_000).toISOString();
}

describe('classifyChannel', () => {
    test('returns unknown for null', () => {
        expect(classifyChannel(null)).toBe('unknown');
    });

    test('returns unknown for undefined', () => {
        expect(classifyChannel(undefined)).toBe('unknown');
    });

    test('returns active for upload today', () => {
        expect(classifyChannel(daysAgo(0))).toBe('active');
    });

    test('returns active for upload 89 days ago', () => {
        expect(classifyChannel(daysAgo(89))).toBe('active');
    });

    test('returns dormant for upload exactly 90 days ago', () => {
        expect(classifyChannel(daysAgo(90))).toBe('dormant');
    });

    test('returns dormant for upload 180 days ago', () => {
        expect(classifyChannel(daysAgo(180))).toBe('dormant');
    });

    test('returns dormant for upload 364 days ago', () => {
        expect(classifyChannel(daysAgo(364))).toBe('dormant');
    });

    test('returns dead for upload exactly 365 days ago', () => {
        expect(classifyChannel(daysAgo(365))).toBe('dead');
    });

    test('returns dead for upload 500 days ago', () => {
        expect(classifyChannel(daysAgo(500))).toBe('dead');
    });
});
