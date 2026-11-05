import rateLimit from 'express-rate-limit';

// Limitador general para todas las peticiones a la API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Máximo 200 peticiones por IP en esa ventana
  standardHeaders: true, // Devuelve info de rate limit en los headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita los headers obsoletos `X-RateLimit-*`
  message: {
    status: 429,
    error: 'Demasiadas peticiones desde esta IP. Por favor intenta de nuevo en 15 minutos.'
  }
});

// Limitador estricto para rutas de autenticación (evita ataques de fuerza bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 intentos de login por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Demasiados intentos de inicio de sesión. Por seguridad, espera 15 minutos.'
  }
});
