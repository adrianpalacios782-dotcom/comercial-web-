import { Router } from 'express';
import { createSale, getSales, getSalesStats } from '../controllers/salesController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

// ==========================================
// REGISTRAR VENTA (Permitido para Cajeros y Admin)
// ==========================================
router.post('/', requireAuth, requireRole(['admin', 'cajero_1', 'cajero_2']), createSale);

// ==========================================
// REPORTES Y GANANCIAS (Exclusivo para ADMINISTRADOR)
// ==========================================
router.get('/', requireAuth, requireRole(['admin']), getSales);
router.get('/stats', requireAuth, requireRole(['admin']), getSalesStats);

export default router;
