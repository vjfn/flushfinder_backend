// ENDPOINTS PARA REALIZAR EL CRUD(CreateReadUpdateDelete) SOBRE LOS FLUSH

// routes/flushRoutes.ts
import express from 'express';
import { getAllFlushItems, createFlushItem } from '../controllers/flushControler';

const router = express.Router();

// Rutas relacionadas con Flush
router.get('/flush', getAllFlushItems);
router.post('/flush', createFlushItem);

export default router;
