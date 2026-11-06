// Servicio centralizado de llamadas a la API
const API_BASE = '/api';

// Fallback de productos en caso de que el backend no esté encendido aún
const FALLBACK_PRODUCTS = [
  {
    id: "prod-001",
    nombre: "Coca Cola 500ml",
    descripcion: "Bebida gaseosa refrescante en botella de plástico retornable.",
    precio: 6,
    costo: 3.5,
    stock: 24,
    categoria: "Bebidas",
    url_imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
    disponible: true
  },
  {
    id: "prod-002",
    nombre: "Agua Mineral Sin Gas 600ml",
    descripcion: "Agua purificada de manantial baja en sodio.",
    precio: 6,
    costo: 3.0,
    stock: 18,
    categoria: "Bebidas",
    url_imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJwyqa1M3mud7AzbcnrjNQX8dawB926r83gi_FoIXBsA&s=10",
    disponible: true
  },
  {
    id: "prod-003",
    nombre: "Papas Fritas Clásicas 110g",
    descripcion: "Crujientes papas fritas onduladas con un toque de sal marina.",
    precio: 3,
    costo: 1.6,
    stock: 12,
    categoria: "Snacks",
    url_imagen: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80",
    disponible: true
  },
  {
    id: "prod-004",
    nombre: "Doritos Mega Queso 90g",
    descripcion: "Tortillas de maíz tostadas con intenso sabor a queso nacho.",
    precio: 3,
    costo: 1.7,
    stock: 8,
    categoria: "Snacks",
    url_imagen: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=500&auto=format&fit=crop&q=80",
    disponible: true
  },
  {
    id: "prod-005",
    nombre: "Chocolate con Almendras 80g",
    descripcion: "Barra de chocolate con leche y trozos de almendras tostadas.",
    precio: 2,
    costo: 1.0,
    stock: 15,
    categoria: "Golosinas",
    url_imagen: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80",
    disponible: true
  },
  {
    id: "prod-006",
    nombre: "Gomitas de Frutas 100g",
    descripcion: "Surtido masticable de ositos de goma con sabores frutales naturales.",
    precio: 2,
    costo: 1.0,
    stock: 15,
    categoria: "Golosinas",
    url_imagen: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500&auto=format&fit=crop&q=80",
    disponible: true
  }
];

// 1. AUTENTICACIÓN
export const loginUser = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Error en las credenciales');
  }
  return data;
};

export const verifySession = async (token) => {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Sesión expirada');
  return res.json();
};

// 2. PRODUCTOS
export const getProducts = async (category = '') => {
  try {
    const url =
      category && category !== 'Todas'
        ? `${API_BASE}/products?categoria=${encodeURIComponent(category)}`
        : `${API_BASE}/products`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('Backend no disponible, usando catálogo de respaldo:', error.message);
    if (category && category !== 'Todas') {
      return FALLBACK_PRODUCTS.filter((p) => p.categoria.toLowerCase() === category.toLowerCase());
    }
    return FALLBACK_PRODUCTS;
  }
};

export const createProduct = async (productData, token) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al crear producto');
  return data.data;
};

export const updateProduct = async (id, productData, token) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar producto');
  return data.data;
};

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al eliminar producto');
  return data;
};

// 3. VENTAS Y GANANCIAS
export const recordSale = async (saleData, token) => {
  const res = await fetch(`${API_BASE}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(saleData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al registrar la venta');
  return data.data;
};

export const getSalesList = async (token, cajero = '') => {
  const url = cajero ? `${API_BASE}/sales?cajero=${encodeURIComponent(cajero)}` : `${API_BASE}/sales`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al cargar ventas');
  return data.data || [];
};

export const getSalesStats = async (token) => {
  const res = await fetch(`${API_BASE}/sales/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al cargar estadísticas');
  return data.stats;
};
