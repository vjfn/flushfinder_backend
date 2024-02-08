// ENDPOINTS PARA REALIZAR EL CRUD(CreateReadUpdateDelete) SOBRE LOS FLUSH

// routes/flush.ts
import express from 'express';
import { createFlush,getFlushes,updateFlush,deleteFlush } from '../controllers/flushControler';

import { upload } from '..';

const flushRoutes = express.Router();

// Rutas relacionadas con Flush
flushRoutes.post('/', createFlush);
flushRoutes.get('/', getFlushes);
flushRoutes.put('/:id', updateFlush);
flushRoutes.delete('/:id', deleteFlush);

export default flushRoutes;
