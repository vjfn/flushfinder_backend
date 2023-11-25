import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { Prueba } from './models/prueba.model';

const app = express(); //packete que permite hacer una api
app.use(express.json()); //lee el json porfavor
app.use(cors());

mongoose.connect('mongodb://localhost:27017/flushfinder');

app.get('/', (req, res) => {
    res.send('Hello World with TypeScript!');
});

app.get('/prueba', async (req, res) => {
    const prueba = await Prueba.find({ nombre: 'Nombreprueba2'});

    res.json(prueba)
});

app.post('/prueba', async (req, res) => {
    const newFlush =  req.body
    const prueba = await Prueba.create(newFlush);

    res.json(prueba)
});

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

// crud: CREATE READ UPDATE DELETE