// controllers/flushController.ts
import { Request, Response } from 'express';
import { Flush, IFlush } from '../models/flush.model';

/* // Obtener todos los objetos Flush OBSOLETO
export const getAllFlushItems = async (req: Request, res: Response) => {
  try {
    const flushItems = await Flush.find();
    res.json(flushItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los objetos Flush' });
  }
};

// Crear un nuevo objeto Flush OBSOLETO
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
}; */

//CRUD FLUSH
//CREATE
/* app.post('/flush', async (req, res) => {
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
  res.json(flush);
}); */
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
/* app.get('/flushes', async (req, res) => {
  const flushes = await Flush.find();
  res.json(flushes);
}); */
export const getFlushes = async (req: Request, res: Response) => {
  try {
      const flushes = await Flush.find();
      res.json(flushes);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error en getFlushes' });
  }
};


//UPDATE
/* app.put('/flush/:id', async (req, res) => {
  const id = req.params.id;
  const flush = await Flush.findByIdAndUpdate(id, req.body);
  if (flush) {
    res.json(flush);
  } else {
    res.json({ error: 'No se encontró el documento' });
  }
}); */
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
/* app.delete('/flush/:id', async (req, res) => {
  const id = req.params.id;
  await Flush.findByIdAndDelete(id);
  res.json({ message: 'El documento se eliminó correctamente' });
}); */
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
