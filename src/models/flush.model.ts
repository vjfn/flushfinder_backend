// Mongoose Schema para el modelo Flush
import { Schema, Document, model } from 'mongoose';

const flushSchema = new Schema({
    // Propiedades del Flush
    name: {
/*         unique: true, */
        type: String
    },
    image: {
        type: String
    },
    //estrellas del flush
    score: {
        type: Number
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    //Filtros
    handicapped: {
        type: Boolean
    },
    changingstation: {
        type: Boolean
    },
    free: {
        type: Boolean
    },
    // Marcas de tiempo para el control de la creación y última actualización
    created: {
        type: Date
    },
    lastUpdate: {
        type: Date
    },
    //Número de votos
    rating: {
        type: Number,
        default: 0
    },
    //número de "vidas" inicial del flush
    count: {
        type: Number,
        default: 10
    }
});

// Middleware para actualizar las marcas de tiempo antes de guardar
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
// Exportar el modelo Flush y la interfaz IFlush para poder usarlo en todo el proyecto
export const Flush = model<IFlush>('Flush', flushSchema);
export { IFlush };