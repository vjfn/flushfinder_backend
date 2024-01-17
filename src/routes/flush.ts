// ENDPOINTS PARA REALIZAR EL CRUD(CreateReadUpdateDelete) SOBRE LOS FLUSH

// routes/flush.ts
import express from 'express';
import { /* getAllFlushItems, createFlushItem, */createFlush,getFlushes,updateFlush,deleteFlush } from '../controllers/flushControler';

const flushRoutes = express.Router();

// Rutas relacionadas con Flush
/* flushRoutes.get('/', getAllFlushItems);
flushRoutes.post('/flush', createFlushItem); */
flushRoutes.post('/', createFlush);
flushRoutes.get('/flushes', getFlushes);
flushRoutes.put('/flush/:id', updateFlush);
flushRoutes.delete('/flushDel/:id', deleteFlush);

export default flushRoutes;
