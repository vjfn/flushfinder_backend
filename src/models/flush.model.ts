import { Schema, Document, model } from 'mongoose';

const flushSchema = new Schema({
    name: {
/*         unique: true, */
        type: String
    },
    image: {
        type: String
    },
    score: {
        type: Number
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    handicapped: {
        type: Boolean
    },
    changingstation: {
        type: Boolean
    },
    free: {
        type: Boolean
    },
    created: {
        type: Date
    },
    lastUpdate: {
        type: Date
    },
    rating: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 10
    }
});

flushSchema.pre<IFlush>('save', function (next) {
    this.created = new Date();
    this.lastUpdate = new Date();
    next();
});

interface IFlush extends Document {
    name: string;
    image: string;
    score: number;
    condition: string;
    latitude: number;
    longitude: number;
    handicapped: boolean;
    changingstation: boolean;
    free: boolean;
    created: Date;
    lastUpdate: Date;
    rating: number;
    count: number;

}
 
export const Flush = model<IFlush>('Flush', flushSchema);
export { IFlush };