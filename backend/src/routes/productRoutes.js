import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// ==========================================
// RUTAS PÚBLICAS (Accesibles por clientes)
// ==========================================
// Listar todos los productos (con filtros opcionales ?categoria=...)
router.get('/', getProducts);

// Ver el detalle de un producto específico
router.get('/:id', getProductById);

// ==========================================
// RUTAS PROTEGIDAS (Solo Administradores con JWT)
// ==========================================
// Crear un nuevo producto
router.post('/', requireAuth, createProduct);

// Actualizar un producto existente o modificar su stock
router.put('/:id', requireAuth, updateProduct);

// Eliminar un producto
router.delete('/:id', requireAuth, deleteProduct);

export default router;
