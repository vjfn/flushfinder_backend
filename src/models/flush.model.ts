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
        type: String
    },
    condition: {
        type: String
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
    count: {
        type: Number,
        default: 1
    }
});

flushSchema.pre<IFlush>('save', function (next) {
    this.created = new Date();
    next();
});

interface IFlush extends Document {
    name: string;
    image: string;
    score: string;
    condition: string;
    latitude: number;
    longitude: number;
    handicapped: boolean;
    changingstation: boolean;
    free: boolean;
    created: Date;
    count: number;

}
 
export const Flush = model<IFlush>('Flush', flushSchema);
export { IFlush };