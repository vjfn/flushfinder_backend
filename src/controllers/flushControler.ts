// controllers/flushController.ts
import { Request, Response } from 'express';
import { Flush, IFlush } from '../models/flush.model';



//CRUD FLUSH
//CREATE

export const createFlush = async (req: Request, res: Response) => {
  try {
      const newFlush = {
          name: req.body.name,
          image: req.body.image,
          score: req.body.score,
          condition: req.body.condition,
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
};

//READ
interface Coordinates {
  latitude: number;
  longitude: number;
}

export const getFlushes = async (req: Request, res: Response) => {
  try {
    const handicapped = req.query.handicapped;
    const changingstation = req.query.changingstation;
    const free = req.query.free;
    
    const userCoordinates: Coordinates = {
      latitude: parseFloat(req.query.latitude as string),
      longitude: parseFloat(req.query.longitude as string),
    };

    // http://localhost:3000/flush?latitude=36.719585112950064&longitude=-4.363419

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


/* export const getFlushes = async (req: Request, res: Response) => {
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
}; */


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
