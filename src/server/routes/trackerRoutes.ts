import express from 'express';
import path from 'path';
import { saveEvents } from '../services/eventService';
import { TEvent } from '../models/event';

function isTEvent(obj: unknown): obj is TEvent {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'event' in obj &&
        'tags' in obj &&
        'url' in obj &&
        'title' in obj &&
        'ts' in obj &&
        typeof obj.event === 'string' &&
        Array.isArray(obj.tags) &&
        obj.tags.every((tag: unknown) => typeof tag === 'string') &&
        typeof obj.url === 'string' &&
        typeof obj.title === 'string' &&
        typeof obj.ts === 'number'
    );
}

function areTEvents(arr: unknown): arr is TEvent[] {
    return Array.isArray(arr) && arr.every(isTEvent);
}

const router = express.Router();

router.get('/tracker', (req, res) => {
    res.sendFile(path.join(__dirname, '../../../dist/tracker.js'));
});

router.post('/track', async (req, res) => {
    try {
        const data =
            typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

        if (!areTEvents(data)) {
            throw new Error('Invalid event data');
        }

        saveEvents(data);
        res.status(200).send('OK');
    } catch (error) {
        res.status(422).send('Invalid data');
        console.error(`Error in trackerRoutes ${error}`);
    }
});

export { router as trackerRoutes };
