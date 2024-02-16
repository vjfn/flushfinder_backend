// controllers/flushController.ts
import { Flush, IFlush } from '../models/flush.model';
import { Request, Response } from 'express';
import { upload } from '..';

import * as path from 'path';
import * as fs from 'fs';

import sharp from 'sharp';


const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};

interface Coordinates {
  latitude: number;
  longitude: number;
}
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
      console.log(" El Formulario contiene una imagen")
    }

    if (!imageData) {
      console.log("No se ha detectado una imagen en el formulario")
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen en el formulario' });
    }

    // Generar un nombre único para la imagen
    const randomNum = generateRandomNumber(1000, 10000);
    const currentDate = new Date().toISOString().replace(/:/g, '-').substring(0, 19);
    const imageFileName = `flush_${randomNum}_${currentDate}.jpg`;

    // Ruta de destino para guardar la imagen
    const destinationPath = path.join(__dirname, '..', '..', 'uploads', imageFileName);

    // Usar sharp para redimensionar la imagen antes de moverla
    sharp.cache(false)
    const sharpInstance = sharp(imageData.path);
    try {
      await sharpInstance.resize(200, 200).toFormat('jpeg').toFile(destinationPath);
      console.log('Archivo convertido con éxito:');
    } catch (error) {
      console.error('Error al intentar convertir el archivo:', error.message);
    }
    

    // Borrar el archivo temporal original después de redimensionar
    try {
      fs.unlinkSync(imageData.path);
      console.log('Archivo eliminado con éxito:', imageData.path);
    } catch (error) {
      console.error('Error al intentar eliminar el archivo:', error.message);
    }

    const newFlush = {
      name,
      image: imageFileName,
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

export const getFlushes = async (req: Request, res: Response) => {
  try {
    const handicapped = req.query.handicapped;
    const changingstation = req.query.changingstation;
    const free = req.query.free;

    const userCoordinates: Coordinates = {
      latitude: parseFloat(req.query.latitude as string),
      longitude: parseFloat(req.query.longitude as string),
    };

    const filter: { handicapped?: boolean; changingstation?: boolean; free?: boolean } = {};
    if (handicapped) filter.handicapped = handicapped === 'true';
    if (changingstation) filter.changingstation = changingstation === 'true';
    if (free) filter.free = free === 'true';

    // Obtener todos los flushes y calcular la distancia
    const flushes = await Flush.find(filter);

    const flushesWithDistance = flushes.map((flush) => {
      const flushCoordinates: Coordinates = {
        latitude: Number(flush.latitude),
        longitude: Number(flush.longitude),
      };
      return {
        flush,
        distance: haversineDistance(userCoordinates, flushCoordinates),
      };
    });

    // Ordenar por distancia de menor a mayor y tomar los primeros 20
    const sortedFlushes = flushesWithDistance.sort((a, b) => a.distance - b.distance).slice(0, 20);

    // Extraer solo los flushes, sin la información de distancia
    const resultFlushes = sortedFlushes.map((item) => item.flush);

    // Mapear la respuesta para incluir la URL completa de la imagen
/*     const flushListWithImageUrls = flushes.map((flush) => {
/*       const imageUrl = `${process.env.VUE_APP_API_URL}/uploads/${flush.image}`; */ //URL en .env
      /* const imageUrl = `http://localhost:3000/uploads/${flush.image}`; 
      return { ...flush.toJSON(), imageUrl };
    }); */
    res.json(resultFlushes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error en getFlushes' });
  }
};

function haversineDistance(pointA: Coordinates, pointB: Coordinates): number {
  var radius = 6371;

  const deltaLatitude = (pointB.latitude - pointA.latitude) * Math.PI / 180;
  const deltaLongitude = (pointB.longitude - pointA.longitude) * Math.PI / 180;

  const halfChordLength = Math.cos(
      pointA.latitude * Math.PI / 180) * Math.cos(pointB.latitude * Math.PI / 180) 
      * Math.sin(deltaLongitude/2) * Math.sin(deltaLongitude/2)
      + Math.sin(deltaLatitude/2) * Math.sin(deltaLatitude/2);

  const angularDistance = 2 * Math.atan2(Math.sqrt(halfChordLength), Math.sqrt(1 - halfChordLength));

  return radius * angularDistance;
}


// UPDATE
export const updateFlush = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const shouldIncrement = req.body.increment;
    const updatedFlush = await Flush.findById(id);

    if (!updatedFlush) {
      return res.status(404).json({ error: 'Flush no encontrado' });
      }else{
        const eightHoursInMilliseconds = 1 * 60 * 60 * 1000;
        const currentTime = new Date();
        const lastUpdate = updatedFlush.lastUpdate || updatedFlush.created;

        const timeDifference = currentTime.getTime() - lastUpdate.getTime();

        if (timeDifference < eightHoursInMilliseconds) {
          console.log('Menos de 1 hora desde la última actualización. No se realiza ninguna acción.');
          return res.json(updatedFlush);
      } else {
        updatedFlush.rating += 1;
        if (shouldIncrement) {
          updatedFlush.count += 1;
          if(updatedFlush.score < 5){
            updatedFlush.score += 0.1
          }
        } else {
          updatedFlush.count -= 1;
          if(updatedFlush.score > 0){
            updatedFlush.score -= 0.1
          }
        }
        updatedFlush.lastUpdate = new Date();
        await updatedFlush.save();

        if (updatedFlush.count <= 0) {
          await Flush.findByIdAndDelete(id);
          console.log('Objeto eliminado debido a que count es menor o igual a 0.');
          /* return res.status(204).send(); // No Content */
          return res.status(410).json({ message: 'Objeto eliminado' });
        }
     } 
      res.json(updatedFlush);
      console.log("Respuesta del api: "+ updatedFlush)
    }   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error en updateFlush' });
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
