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
/*           condition: req.body.condition, */
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
