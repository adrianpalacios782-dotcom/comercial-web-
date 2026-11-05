import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

/**
 * Middleware para proteger rutas que requieren permisos de administrador.
 * Verifica la existencia y validez del token JWT en la cabecera 'Authorization'.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Validar que la cabecera exista y comience con 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acceso no autorizado: No se proporcionó un token Bearer válido.'
    });
  }

  // 2. Extraer el token separándolo del prefijo 'Bearer '
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verificar y decodificar el token con la clave secreta
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    
    // Inyectar los datos del usuario autenticado en la petición (req.user)
    req.user = decoded;
    
    // Continuar con el siguiente controlador
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado. Inicia sesión nuevamente.',
      error: error.message
    });
  }
};
