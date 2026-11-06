import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS / LECTURA
// ==========================================
// Listar todos los productos (con filtros opcionales ?categoria=...)
router.get('/', getProducts);

// Ver el detalle de un producto específico
router.get('/:id', getProductById);

// ==========================================
// RUTAS DE GESTIÓN (Permitido para Administrador y Cajeros)
// ==========================================
// Crear un nuevo producto
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'cajero_1', 'cajero_2']),
  createProduct
);

// Actualizar un producto existente o modificar su stock
router.put(
  '/:id',
  requireAuth,
  requireRole(['admin', 'cajero_1', 'cajero_2']),
  updateProduct
);

// Eliminar / Quitar un producto del catálogo
router.delete(
  '/:id',
  requireAuth,
  requireRole(['admin', 'cajero_1', 'cajero_2']),
  deleteProduct
);

export default router;
