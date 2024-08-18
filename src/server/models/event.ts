import mongoose from 'mongoose';

export type TEvent = {
    event: string;
    tags: string[];
    url: string;
    title: string;
    ts: number;
};

const eventSchema = new mongoose.Schema<TEvent>(
    {
        event: { type: String, required: true },
        tags: { type: [String], default: [] },
        url: { type: String, required: true },
        title: { type: String, required: true },
        ts: { type: Number, required: true },
    },
    { timestamps: true }
);

export const Event = mongoose.model<TEvent>('tracks', eventSchema);
