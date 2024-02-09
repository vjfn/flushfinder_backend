import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';

import path from 'path';
import multer, { Multer, StorageEngine,MulterError } from 'multer';

import { Flush } from './models/flush.model';
import flushRoutes from './routes/flush';


const app = express(); //packete que permite hacer una api

app.use(cors());

app.use(express.json()); //lee el json porfavor
app.use(bodyParser.json()); // Middleware para el manejo de solicitudes JSON


app.get('/', (req, res) => {
    res.send('Hello World with TypeScript!');
});

//Multer config

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname,  /* '..', */ '..',  'uploads')); // Define la carpeta de destino
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Define el nombre del archivo
  },
});

// Manejo de errores de Multer
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof MulterError) {
    console.error('Multer Error:', err.message);
    res.status(400).json({ error: 'Error en la carga del archivo' });
  } else {
    next(err);
  }
});

export const upload: Multer = multer({ storage: storage });

//Rutas
app.use('/flush',upload.single('image'), flushRoutes)

// Middleware para servir archivos estáticos desde la carpeta 'uploads'
/* app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); */
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
//Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//Conexion segura a BD
mongoose.connect(`mongodb://${process.env.DB_URL}/?authMechanism=DEFAULT&authSource=admin`);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  // estamos conectados!
  console.log('Connected to MongoDB');
});