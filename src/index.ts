import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

import { Flush } from './models/flush.model';

import flushRoutes from './routes/flush';

const app = express(); //packete que permite hacer una api

app.use(express.json()); //lee el json porfavor
app.use(cors());
app.use(bodyParser.json()); // Middleware para el manejo de solicitudes JSON

//Conexion segura a BD
mongoose.connect(`mongodb://${process.env.DB_URL}/?authMechanism=DEFAULT&authSource=admin`);

app.get('/', (req, res) => {
    res.send('Hello World with TypeScript!');
});

//Rutas
app.use('/flush', flushRoutes)

//Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // estamos conectados!
  console.log('Connected to MongoDB');
});