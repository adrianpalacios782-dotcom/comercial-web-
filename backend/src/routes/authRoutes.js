import { Router } from 'express';
import { login, getProfile } from '../controllers/authController.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

// Endpoint de login con limitador estricto anti fuerza bruta
router.post('/login', authLimiter, login);

// Endpoint para verificar token y obtener perfil actual
router.get('/me', requireAuth, getProfile);

export default router;
