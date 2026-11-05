import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

/**
 * Controlador de Autenticación de Administrador
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación básica de campos requeridos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona usuario y contraseña.'
      });
    }

    // Para el MVP, comparamos con las credenciales de entorno configuradas
    const isValidUser = username === ENV.ADMIN_USERNAME && password === ENV.ADMIN_PASSWORD;

    if (!isValidUser) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas. Verifica tu usuario o contraseña.'
      });
    }

    // Payload que irá dentro del JWT (evitar datos sensibles como contraseñas)
    const payload = {
      username: ENV.ADMIN_USERNAME,
      role: 'admin'
    };

    // Firmar token con tiempo de expiración
    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN
    });

    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      token,
      user: {
        username: payload.username,
        role: payload.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al procesar el inicio de sesión.',
      error: error.message
    });
  }
};
