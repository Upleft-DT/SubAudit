const { exportCSV } = require('../script.js');

let capturedCsv;

beforeEach(() => {
    capturedCsv = null;
    global.Blob = jest.fn((parts) => { capturedCsv = parts[0]; return {}; });
    URL.createObjectURL = jest.fn(() => 'blob:test');
    URL.revokeObjectURL = jest.fn();
    jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

function getLines(channels) {
    exportCSV(channels);
    return capturedCsv.replace(/^﻿/, '').split('\r\n').filter(l => l.length > 0);
}

const BASE_CHANNEL = {
    channelId: 'UCabc',
    channelTitle: 'Test Channel',
    channelUrl: 'https://www.youtube.com/channel/UCabc',
    subscriberCount: '12000',
    lastUploadDate: '2025-01-15T00:00:00.000Z',
    lastVideoTitle: 'My Latest Video',
    status: 'active',
};

describe('exportCSV', () => {
    test('CSV has the correct header row', () => {
        const lines = getLines([BASE_CHANNEL]);
        expect(lines[0]).toBe('Channel Name,Channel URL,Subscriber Count,Last Upload Date,Last Video Title,Status');
    });

    test('CSV row count matches channel count', () => {
        const channels = [BASE_CHANNEL, { ...BASE_CHANNEL, channelId: 'UCdef', channelTitle: 'Other' }];
        const lines = getLines(channels);
        expect(lines).toHaveLength(3); // header + 2 data rows
    });

    test('channel names containing commas are quoted', () => {
        getLines([{ ...BASE_CHANNEL, channelTitle: 'Channel, With Comma' }]);
        expect(capturedCsv).toContain('"Channel, With Comma"');
    });

    test('channel names containing double quotes are escaped', () => {
        getLines([{ ...BASE_CHANNEL, channelTitle: 'Channel "Quoted"' }]);
        expect(capturedCsv).toContain('"Channel ""Quoted"""');
    });

    test('unknown status channels have empty optional fields', () => {
        const unknown = {
            channelId: 'UCxyz',
            channelTitle: 'Gone Channel',
            channelUrl: 'https://www.youtube.com/channel/UCxyz',
            subscriberCount: null,
            lastUploadDate: null,
            lastVideoTitle: null,
            status: 'unknown',
        };
        const lines = getLines([unknown]);
        const fields = lines[1].split(',');
        expect(fields[2]).toBe('');       // subscriber count
        expect(fields[3]).toBe('');       // last upload date
        expect(fields[4]).toBe('');       // last video title
        expect(fields[5]).toBe('unknown');
    });

    test('channels with dates produce a non-empty date field', () => {
        const lines = getLines([BASE_CHANNEL]);
        const fields = lines[1].split(',');
        expect(fields[3]).not.toBe('');
    });

    test('status is included for all classification categories', () => {
        for (const status of ['active', 'dormant', 'dead', 'unknown']) {
            const lines = getLines([{ ...BASE_CHANNEL, status }]);
            expect(lines[1]).toContain(status);
        }
    });
});
