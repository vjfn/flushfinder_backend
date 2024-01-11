import { Schema, Document, model } from 'mongoose';


//Crear modelos (mongodb schema)
//Pensar modelos y propiedades de flush item, crear los modelos
const flushSchema = new Schema({
    nombre: {
        unique: true,
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
        type: String
    },
    longitude: {
        type: String
    },
    handicaped: {
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
        type: String,
        default: '1'
    }
});

flushSchema.pre<IFlush>('save', function (next) {
    this.created = new Date();
    next();
});

interface IFlush extends Document {
    nombre: string;
    image: string;
    score: string;
    condition: string;
    latitude: string;
    longitude: string;
    handicaped: boolean;
    changingstation: boolean;
    free: boolean;
    created: Date;
    count: string;

}
 

export const Flush = model<IFlush>('Flush', flushSchema);
export { IFlush };