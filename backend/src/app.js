import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import salesRoutes from './routes/salesRoutes.js';

const app = express();

// ==========================================
// 1. MIDDLEWARES DE SEGURIDAD ESENCIALES
// ==========================================

// Helmet añade y ajusta cabeceras HTTP para mitigar ataques comunes
app.use(helmet());

// CORS: Permite únicamente peticiones desde el origen del Frontend configurado
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === ENV.FRONTEND_URL || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por política CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Limitar el tamaño del body
app.use(express.json({ limit: '100kb' }));

// Limitador de peticiones para toda la API
app.use('/api', apiLimiter);

// ==========================================
// 2. DEFINICIÓN DE RUTAS
// ==========================================

// Endpoint de verificación del estado del servidor (Health Check)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
});

// ==========================================
// 3. MANEJADOR GLOBAL DE ERRORES
// ==========================================
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor.',
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
