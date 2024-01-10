import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { Prueba } from './models/prueba.model';

import bodyParser from 'body-parser';
import flushRoutes from './routes/flush';

const app = express(); //packete que permite hacer una api
app.use(express.json()); //lee el json porfavor
app.use(cors());
 
mongoose.connect('mongodb://admin:multisyncv72mongodb@server.flushfinder.es:27017/?authMechanism=DEFAULT&authSource=admin');

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

//PRRUEBAS

// Middleware para el manejo de solicitudes JSON
app.use(bodyParser.json());

// Configuración de las rutas
app.use('/api', flushRoutes);

//FIN PRUEBAS

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

// crud: CREATE READ UPDATE DELETE
