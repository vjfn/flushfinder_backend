import { Schema, Document, model } from 'mongoose';

const pruebaSchema = new Schema({
    nombre: {
        type: String
    }
});

interface IPrueba extends Document {
    nombre: string;
}

export const Prueba = model<IPrueba>('Prueba', pruebaSchema)