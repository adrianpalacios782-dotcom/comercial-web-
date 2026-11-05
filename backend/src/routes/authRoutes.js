import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Endpoint de login con limitador estricto anti fuerza bruta
router.post('/login', authLimiter, login);

export default router;
