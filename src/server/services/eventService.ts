import { TEvent, Event } from '../models/event';

export async function saveEvents(events: TEvent[]) {
    try {
        console.log(events);
        await Event.insertMany(events);
        console.log('Events saved successfully');
    } catch (error) {
        console.error('Error saving events:', error);
        throw error;
    }
}
