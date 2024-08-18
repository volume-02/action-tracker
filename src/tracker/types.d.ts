export interface ITracker {
    track(event: string, ...tags: string[]): void;
}

export interface TrackSendEvent {
    event: string;
    tags: string[];
    url: string;
    title: string;
    ts: number;
}

declare global {
    interface Window {
        tracker: ITracker;
    }
}
