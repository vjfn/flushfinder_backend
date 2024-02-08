// controllers/flushController.ts
import { Flush, IFlush } from '../models/flush.model';
import { Request, Response } from 'express';

import { upload } from '..';

import * as path from 'path';
import * as fs from 'fs';


const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

// CRUD FLUSH
// CREATE

export const createFlush = async (req: Request, res: Response) => {
  try {
    const {
      name,
      score,
      condition,
      latitude,
      longitude,
      handicapped,
      changingstation,
      free
    } = req.body;

    // Verificar si hay una imagen en la solicitud
    const imageData = req.file;

    if (imageData) {
      console.log("ImageData Contiene una imagen")
    }

    if (!imageData) {
      console.log(imageData)
      console.log("ImageData vacío")
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    // Generar un nombre único para la imagen
    const randomNum = generateRandomNumber(1, 10000);
    const currentDate = new Date().toISOString().replace(/:/g, '-').substring(0, 19);
    const imageFileName = `flush_${randomNum}_${currentDate}.jpg`;

    // Ruta de destino para guardar la imagen
    const destinationPath = path.join(__dirname, '..', '..', 'uploads', imageFileName);

    // Mover la imagen al directorio de uploads con el nuevo nombre
    fs.renameSync(imageData.path, destinationPath);

    const newFlush = {
      name,
      image: path.relative(path.join(__dirname, '..', '..'), destinationPath),
      score,
      condition,
      latitude,
      longitude,
      handicapped,
      changingstation,
      free,
    };

    // Intenta crear un nuevo registro Flush en la base de datos
    const flush = await Flush.create(newFlush);

    // Envía la respuesta con el objeto Flush creado
    res.json(flush);
  } catch (error) {
    // Manejo de errores
    console.error('Error en createFlush:', error);

    // Verifica si el error es debido a la falta de imagen (código 400)
    if (error.message === 'No se proporcionó ninguna imagen') {
      res.status(400).json({ error: error.message });
    } else {
      // Si es otro tipo de error, responde con un código 500 y un mensaje genérico
      res.status(500).json({ error: 'Internal Server Error en createFlush' });
    }
  }
};


/* // controllers/flushController.ts
import { Flush, IFlush } from '../models/flush.model';
import { Request, Response } from 'express';

import multer, { Multer, StorageEngine } from 'multer';

import * as path from 'path';
import * as fs from 'fs';


const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads')); // Define la carpeta de destino
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Define el nombre del archivo
  },
});

export const upload: Multer = multer({ storage: storage });

const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

//CRUD FLUSH
//CREATE
export const createFlush = async (req: Request, res: Response) => {
  try {
    const {
      name,
      score,
      condition,
      latitude,
      longitude,
      handicapped,
      changingstation,
      free
    } = req.body;

    // Verificar si hay una imagen en la solicitud
    const imageData = req.file;

    if (imageData){
      console.log("ImageData Contiene una imagen")
    }
    
    if (!imageData) {
      console.log(imageData)
      console.log("ImageData vacío")
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    // Generar un nombre único para la imagen
    const randomNum = generateRandomNumber(1, 10000);
    const currentDate = new Date().toISOString().replace(/:/g, '-').substring(0, 19);
    const imageFileName = `flush_${randomNum}_${currentDate}.jpg`;

    // Ruta de destino para guardar la imagen
    const destinationPath = path.join(__dirname, '..', '..', 'uploads', imageFileName);

    // Mover la imagen al directorio de uploads con el nuevo nombre
    fs.renameSync(imageData.path, destinationPath);

    const newFlush = {
      name,
      image: path.relative(path.join(__dirname, '..', '..'), destinationPath),
      score,
      condition,
      latitude,
      longitude,
      handicapped,
      changingstation,
      free,
    };

    const flush = await Flush.create(newFlush);

    res.json(flush);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error en createFlush' });
  }
}; */

//////////////////

/* export const createFlush = async (req: Request, res: Response) => {
  try {
      const newFlush = {
          name: req.body.name,
          image: req.body.image,
          score: req.body.score,
          latitude: req.body.latitude,
          longitude: req.body.longitude,
          handicapped: req.body.handicapped,
          changingstation: req.body.changingstation,
          free: req.body.free,
      };
      console.log(newFlush);

      const flush = await Flush.create(newFlush);
      res.json(flush);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error en createFlush' });
  }
}; */

//READ
export const getFlushes = async (req: Request, res: Response) => {
  try {
    const handicapped = req.query.handicapped;
    const changingstation = req.query.changingstation;
    const free = req.query.free;

    const filter: { handicapped?: boolean; changingstation?: boolean; free?: boolean } = {};
    if (handicapped) filter.handicapped = handicapped === 'true';
    if (changingstation) filter.changingstation = changingstation === 'true';
    if (free) filter.free = free === 'true';
    

    const flushes = await Flush.find(filter);
      res.json(flushes);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error en getFlushes' });
  }
};


//UPDATE
export const updateFlush = async (req: Request, res: Response) => {
  try {
      const id = req.params.id;
      const updatedFlush = await Flush.findByIdAndUpdate(id, req.body, { new: true });
      if (updatedFlush) {
          res.json(updatedFlush);
      } else {
          res.status(404).json({ error: 'Document not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

//DELETE
export const deleteFlush = async (req: Request, res: Response) => {
  try {
      const id = req.params.id;
      const deletedFlush = await Flush.findByIdAndDelete(id);
      if (deletedFlush) {
          res.json({ message: 'Document deleted successfully' });
      } else {
          res.status(404).json({ error: 'Document not found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error en deleteFlush' });
  }
};
