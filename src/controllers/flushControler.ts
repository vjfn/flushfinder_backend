// controllers/flushController.ts
import { Request, Response } from 'express';
import { Flush, IFlush } from '../models/flush.model';

// Obtener todos los objetos Flush
export const getAllFlushItems = async (req: Request, res: Response) => {
  try {
    const flushItems = await Flush.find();
    res.json(flushItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los objetos Flush' });
  }
};

// Crear un nuevo objeto Flush
export const createFlushItem = async (req: Request, res: Response) => {
  try {
    const newFlushItem: IFlush = req.body; // Asume que los datos están en el cuerpo de la solicitud
    const flushItem = new Flush(newFlushItem);
    await flushItem.save();
    res.json(flushItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear un objeto Flush' });
  }
};