import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { Prueba } from './models/prueba.model';
import { Flush } from './models/flush.model';

import bodyParser from 'body-parser';
/* import flushRoutes from './routes/flush'; */

const app = express(); //packete que permite hacer una api
app.use(express.json()); //lee el json porfavor
app.use(cors());
 
mongoose.connect('mongodb://admin:multisyncv72mongodb@server.flushfinder.es:27017/?authMechanism=DEFAULT&authSource=admin');

app.get('/', (req, res) => {
    res.send('Hello World with TypeScript!');
});

/* app.get('/prueba', async (req, res) => {
    
    const prueba = await Prueba.find({ nombre: 'Nombreprueba2'});

    res.json(prueba)
}); */

app.get('/prueba', async (req, res) => {
    const prueba = await Prueba.findOne({ nombre: 'Prueba con nombre' });
  
    if (prueba) {
      res.json(prueba);
    } else {
      res.json({ error: 'No se encontró el documento' });
    }
  });

app.post('/prueba', async (req, res) => {
    const newFlush =  req.body
    const prueba = await Prueba.create(newFlush);

    res.json(prueba)
});

//CRUD FLUSH
//CREATE
app.post('/flush', async (req, res) => {
    const newFlush = {
      nombre: req.body.nombre,
      image: req.body.image,
      score: req.body.score,
      condition: req.body.condition,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      handicaped: req.body.handicaped,
      changingstation: req.body.changingstation,
      free: req.body.free,
    };
  
    const flush = await Flush.create(newFlush);
/*     flush.nombre = flush.nombre.toUpperCase();
    flush.save(); */
    res.json(flush);
});

//READ
app.get('/flushes', async (req, res) => {
    const flushes = await Flush.find();
    res.json(flushes);
});

//UPDATE
app.put('/flush/:id', async (req, res) => {
    const id = req.params.id;
    const flush = await Flush.findByIdAndUpdate(id, req.body);
    if (flush) {
      res.json(flush);
    } else {
      res.json({ error: 'No se encontró el documento' });
    }
});

//DELETE
app.delete('/flush/:id', async (req, res) => {
    const id = req.params.id;
    await Flush.findByIdAndDelete(id);
    res.json({ message: 'El documento se eliminó correctamente' });
  });


//PRUEBAS

// Middleware para el manejo de solicitudes JSON
app.use(bodyParser.json());

/* // Configuración de las rutas
app.use('/api', flushRoutes); */

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
