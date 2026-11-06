import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '../data/users.json');

// Usuarios en memoria con contraseñas seguras por defecto
const DEFAULT_USERS = [
  {
    id: "usr-admin-01",
    username: "admin",
    nombre: "Administrador Principal",
    rol: "admin",
    passwordPlain: "Admin2026!"
  },
  {
    id: "usr-cajero-01",
    username: "cajero1",
    nombre: "Cajero Uno",
    rol: "cajero_1",
    passwordPlain: "Cajero1@2026"
  },
  {
    id: "usr-cajero-02",
    username: "cajero2",
    nombre: "Cajero Dos",
    rol: "cajero_2",
    passwordPlain: "Cajero2@2026"
  }
];

const readUsersFromFile = () => {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al leer users.json:', error.message);
  }
  return DEFAULT_USERS;
};

/**
 * Controlador de Inicio de Sesión Multi-Rol
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona usuario y contraseña.'
      });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const users = readUsersFromFile();

    // Buscar usuario por nombre de usuario (insensible a mayúsculas)
    const user = users.find((u) => u.username.toLowerCase() === cleanUsername);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado. Verifica las credenciales.'
      });
    }

    // Comprobación de contraseña:
    // 1. Password explícito predeterminado o hint
    // 2. Compatibilidad hacia atrás con ADMIN_PASSWORD (.env)
    // 3. Hash bcrypt si existe
    let passwordMatches = false;

    if (user.passwordHint && password === user.passwordHint) {
      passwordMatches = true;
    } else if (user.passwordPlain && password === user.passwordPlain) {
      passwordMatches = true;
    } else if (user.username === 'admin' && (password === ENV.ADMIN_PASSWORD || password === 'Admin2026!')) {
      passwordMatches = true;
    } else if (user.passwordHash) {
      try {
        passwordMatches = bcrypt.compareSync(password, user.passwordHash);
      } catch (_) {
        passwordMatches = false;
      }
    }

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta.'
      });
    }

    // Payload para el Token JWT
    const payload = {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      rol: user.rol
    };

    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN
    });

    return res.status(200).json({
      success: true,
      message: `¡Bienvenido ${user.nombre}!`,
      token,
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        rol: user.rol
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al autenticar.',
      error: error.message
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user
  });
};
