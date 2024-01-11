// ENDPOINTS PARA REALIZAR EL CRUD(CreateReadUpdateDelete) SOBRE LOS FLUSH

// routes/flushRoutes.ts
import express from 'express';
import { getAllFlushItems, createFlushItem } from '../controllers/flushControler';

const flushRoutes = express.Router();

// Rutas relacionadas con Flush
flushRoutes.get('/', getAllFlushItems);
flushRoutes.post('/flush', createFlushItem);

export default flushRoutes;
