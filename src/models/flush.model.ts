import { Schema, Document, model } from 'mongoose';


//Crear modelos (mongodb schema)
//Pensar modelos y propiedades de flush item, crear los modelos
const flushSchema = new Schema({
    nombre: {
        type: String
    },
    cosas: {
        type: String
    }
});

interface IPrueba extends Document {
    nombre: string;
}


export const Prueba = model<IPrueba>('Prueba', flushSchema)