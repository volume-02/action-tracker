import type { ITracker, TrackSendEvent } from './types';

export class Tracker implements ITracker {
    private buffer: TrackSendEvent[] = [];
    private sending = false;
    private lastSendAttempt = 0;
    private flushTimeout: number | null = null;

    constructor(
        private endpoint: string = `http://localhost:${process.env.PORT}/track`
    ) {
        this.setupBeforeUnload();
    }

    track(event: string, ...tags: string[]): void {
        const trackEvent: TrackSendEvent = {
            event,
            tags,
            url: window.location.href,
            title: document.title,
            ts: Math.floor(Date.now() / 1000),
        };
        this.buffer.push(trackEvent);
        this.attemptSend();
        this.scheduleFlush();
    }

    private attemptSend(): void {
        if (this.sending) return;

        const now = Date.now();
        if (this.buffer.length >= 3 || now - this.lastSendAttempt >= 1000) {
            this.sendEvents();
        }
    }

    private scheduleFlush() {
        if (this.flushTimeout) {
            clearTimeout(this.flushTimeout);
        }
        this.flushTimeout = window.setTimeout(
            () => this.bufferFlush(),
            1000 - (Date.now() - this.lastSendAttempt) + 1
        );
    }

    private bufferFlush() {
        if (this.buffer.length > 0) {
            this.attemptSend();
        }
    }

    private async sendEvents(): Promise<void> {
        if (this.buffer.length === 0) {
            return;
        }

        this.sending = true;

        // for concurency safety
        const events = [...this.buffer];
        this.buffer = [];

        this.lastSendAttempt = Date.now();
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(events),
            });

            if (!response.ok) {
                throw new Error('Failed to send events ' + response.status);
            }
        } catch (error) {
            console.error('Error sending events:', error);
            this.buffer = [...events, ...this.buffer];
            this.scheduleFlush();
        } finally {
            this.sending = false;
        }
    }

    private setupBeforeUnload(): void {
        window.addEventListener('beforeunload', () => {
            if (this.flushTimeout !== null) {
                clearTimeout(this.flushTimeout);
            }
            if (this.buffer.length > 0) {
                navigator.sendBeacon(
                    this.endpoint,
                    JSON.stringify(this.buffer)
                );
            }
        });
    }
}

const tracker = new Tracker();

window.tracker = tracker;

export { tracker };
