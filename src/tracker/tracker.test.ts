/* eslint @typescript-eslint/no-explicit-any: 1 */ // cuz we testing private methods
import { Tracker } from './tracker';

describe('Tracker', () => {
    let tracker: Tracker;
    const mockEndpoint = 'http://localhost:8888/track';

    beforeEach(() => {
        // mock the global fetch function here for atomicity
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            } as Response)
        );

        tracker = new Tracker(mockEndpoint);
        jest.useFakeTimers();
        (global.fetch as jest.Mock).mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.resetAllMocks();
    });

    test('should initialize with empty buffer', () => {
        expect((tracker as any).buffer).toEqual([]);
    });

    test('should add event to buffer on track call', () => {
        (tracker as any).lastSendAttempt = Date.now();
        tracker.track('testEvent', 'tag1', 'tag2');
        expect((tracker as any).buffer.length).toBe(1);
        expect((tracker as any).buffer[0].event).toBe('testEvent');
        expect((tracker as any).buffer[0].tags).toEqual(['tag1', 'tag2']);
    });

    test('should send events when buffer reaches 3 items', () => {
        tracker.track('event0');
        Promise.resolve(() => {
            tracker.track('event1');
            tracker.track('event2');
            tracker.track('event3');

            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(global.fetch).toHaveBeenCalledWith(
                mockEndpoint,
                expect.any(Object)
            );
        });
    });

    test('should send events after 1 second of inactivity', () => {
        tracker.track('event1');
        Promise.resolve(() => {
            jest.advanceTimersByTime(1100);
            tracker.track('event2');
            expect((tracker as any).buffer).toEqual([]);

            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });

    test('should not send events if less than 1 second has passed', () => {
        tracker.track('event1');
        Promise.resolve(() => {
            jest.advanceTimersByTime(800);
            tracker.track('event2');
            expect(global.fetch).not.toHaveBeenCalledTimes(1);
        });
    });

    test('should clear buffer after successful send', () => {
        tracker.track('event1');
        tracker.track('event2');
        tracker.track('event3');

        Promise.resolve(() => {
            expect((tracker as any).buffer).toEqual([]);
        });
    });

    test('should retry sending on failure', () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject('Network error')
        );

        Promise.resolve(() => {
            tracker.track('event1');
            tracker.track('event2');

            jest.advanceTimersByTime(1100);

            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });

    test('should use sendBeacon on beforeunload', () => {
        const mockSendBeacon = jest.fn();
        navigator.sendBeacon = mockSendBeacon;

        tracker.track('event1');
        window.dispatchEvent(new Event('beforeunload'));

        expect(mockSendBeacon).toHaveBeenCalledWith(
            mockEndpoint,
            expect.any(String)
        );
    });
});
