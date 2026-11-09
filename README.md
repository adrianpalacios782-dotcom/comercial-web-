# 🏪 Tienda Local de Conveniencia - E-Commerce MVP

Solución completa para tienda local (bebidas, snacks, golosinas) construida con arquitectura moderna y desacoplada:
- **Frontend**: React 18, Vite, Tailwind CSS y Context API.
- **Backend**: Node.js, Express, Helmet, CORS, Rate Limit y JWT.
- **Checkout**: Integración directa con **WhatsApp API** para recepción de pedidos en tiempo real.

---

## 📁 1. Arquitectura y Estructura del Proyecto

```text
comercial-web/
├── backend/                      # Servidor API REST con Express
│   ├── src/
│   │   ├── config/               # Variables de entorno y configuración general
│   │   │   └── env.js
│   │   ├── controllers/          # Lógica de negocio (procesamiento de peticiones)
│   │   │   ├── authController.js    # Login de administradores y generación de tokens JWT
│   │   │   └── productController.js # CRUD de productos y control de stock
│   │   ├── data/                 # Capa de datos (almacén JSON para el MVP)
│   │   │   └── products.json
│   │   ├── middlewares/          # Interceptores de peticiones (seguridad y auth)
│   │   │   ├── authMiddleware.js    # Validación de token Bearer JWT
│   │   │   └── rateLimiter.js       # Limitador contra ataques DoS y fuerza bruta
│   │   ├── routes/               # Definición de endpoints y asociación con controladores
│   │   │   ├── authRoutes.js        # Rutas /api/auth/*
│   │   │   └── productRoutes.js     # Rutas /api/products/*
│   │   ├── app.js                # Configuración de Express, middlewares y CORS
│   │   └── server.js             # Punto de entrada que levanta el puerto HTTP
│   ├── .env                      # Variables de entorno locales
│   └── package.json
│
├── frontend/                     # Aplicación SPA cliente con React + Vite
│   ├── src/
│   │   ├── assets/               # Imágenes, íconos y recursos estáticos
│   │   ├── components/           # Componentes visuales y reutilizables
│   │   │   ├── Header.jsx           # Barra de navegación superior con botón de carrito
│   │   │   ├── ProductCard.jsx      # Tarjeta individual con precio, stock e imagen
│   │   │   ├── ProductList.jsx      # Catálogo, buscador y filtros por categoría
│   │   │   └── CartDrawer.jsx       # Modal lateral del carrito y formulario WhatsApp
│   │   ├── context/              # Manejo del estado global de la aplicación
│   │   │   └── CartContext.jsx      # Lógica del carrito, persistencia y WhatsApp
│   │   ├── services/             # Clientes de red y llamadas a la API
│   │   │   └── api.js               # Conexión a /api/products con fallback
│   │   ├── App.jsx               # Componente raíz integrador
│   │   ├── main.jsx              # Punto de montaje en el DOM de React
│   │   └── index.css             # Directivas de Tailwind CSS
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── package.json                  # Scripts del proyecto raíz
```

---

## 📋 2. Modelo de Datos de Productos (`products.json`)

Cada producto cuenta con la siguiente estructura JSON validada:

```json
{
  "id": "prod-001",
  "nombre": "Coca Cola 500ml",
  "descripcion": "Bebida gaseosa refrescante en botella de plástico retornable.",
  "precio": 1.50,
  "stock": 24,
  "categoria": "Bebidas",
  "url_imagen": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
  "disponible": true
}
```

---

## 🛒 3. Carrito de Compras y Envío a WhatsApp

1. **Gestión de Estado**: Se implementa a través de `useReducer` en `src/context/CartContext.jsx` para garantizar inmutabilidad y control preciso de cantidades sin sobrepasar el stock físico.
2. **Persistencia en `localStorage`**: Se sincroniza automáticamente con la clave `tiendita_cart_v1` en cada renderizado donde el estado cambie.
3. **Flujo de WhatsApp**:
   - Construye un mensaje estructurado con el desglose de productos, subtotales, monto total y datos de envío.
   - Aplica `encodeURIComponent` para codificar saltos de línea y emojis.
   - Abre directamente `https://wa.me/<telefono>?text=<mensaje>`.

---

## 🔒 4. Seguridad Implementada en el Backend Express

- **`helmet`**: Cabeceras HTTP de protección (previene clickjacking, XSS, sniffing).
- **`cors`**: Restringe los accesos únicamente al frontend autorizado.
- **`express-rate-limit`**:
  - General: 200 peticiones / 15 min por IP.
  - Login: 10 intentos / 15 min por IP (anti fuerza bruta).
- **Body Limiter**: Limita payloads JSON a `10kb` para evitar sobrecarga de memoria.
- **JWT (JSON Web Tokens)**:
  - Rutas públicas: `GET /api/products`, `GET /api/products/:id`.
  - Rutas privadas: `POST`, `PUT`, `DELETE /api/products` requieren `Authorization: Bearer <token>`.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

### 1. Iniciar el Backend (Puerto 5000)
```bash
cd d:\comercial-web\backend
npm.cmd run dev
```

### 2. Iniciar el Frontend (Puerto 5173)
```bash
cd d:\comercial-web\frontend
npm.cmd run dev
```
Rol	Nombre	Usuario	Contraseña	Permisos Principales
admin	Administrador Principal	admin	Admin2026! (o admin123)	Acceso total, gestión de productos y Panel Exclusivo de Ganancias
cajero_1	Cajero Uno	cajero1	Cajero1@2026	Vender, agregar y quitar productos del inventario
cajero_2	Cajero Dos	cajero2	Cajero2@2026	Vender, agregar y quitar productos del inventario
Abre en tu navegador: [http://localhost:5173](http://localhost:5173)
