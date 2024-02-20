// Importaciones necesarias
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

//packete que permite hacer una api
const app = express(); 

app.use(cors());

//Necesario para lectura de archivos JSON
app.use(express.json()); 
// Middleware para el manejo de solicitudes JSON
app.use(bodyParser.json()); 

//Nuestro primer hito en typescript
app.get('/', (req, res) => {
    res.send('Hello World with TypeScript!');
});

//Configuración de multer (Receptor de files)
//Almacenamiento de archivos temporal hasta que son procesados
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define la carpeta de destino
    cb(null, path.join(__dirname,  /* '..', */ '..',  'uploads')); 
  },
  filename: (req, file, cb) => {
    // Define el nombre del archivo
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
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
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

//Iniciar el servidor
const PORT = process.env.PORT || 3000;
//Cuando el servidor está operativo escribe en consola
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