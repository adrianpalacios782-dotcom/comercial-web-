// Servicio centralizado de llamadas a la API
const API_BASE = '/api';

// Fallback de productos en caso de que el backend no esté encendido aún
const FALLBACK_PRODUCTS = [
  {
    id: "prod-001",
    nombre: "Coca Cola 500ml",
    descripcion: "Bebida gaseosa refrescante en botella de plástico retornable.",
    precio: 1.50,
    stock: 24,
    categoria: "Bebidas",
    url_imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
    disponible: true
  },
  {
    id: "prod-002",
    nombre: "Agua Mineral Sin Gas 600ml",
    descripcion: "Agua purificada de manantial baja en sodio.",
    precio: 1.00,
    stock: 18,
    categoria: "Bebidas",
    url_imagen: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80",
    disponible: true
  },
  {
    id: "prod-003",
    nombre: "Papas Fritas Clásicas 110g",
    descripcion: "Crujientes papas fritas onduladas con un toque de sal marina.",
    precio: 1.75,
    stock: 12,
    categoria: "Snacks",
    url_imagen: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80",
    disponible: true
  },
  {
    id: "prod-004",
    nombre: "Doritos Mega Queso 90g",
    descripcion: "Tortillas de maíz tostadas con intenso sabor a queso nacho.",
    precio: 1.80,
    stock: 8,
    categoria: "Snacks",
    url_imagen: "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=500&auto=format&fit=crop&q=80",
    disponible: true
  },
  {
    id: "prod-005",
    nombre: "Chocolate con Almendras 80g",
    descripcion: "Barra de chocolate con leche y trozos de almendras tostadas.",
    precio: 2.20,
    stock: 15,
    categoria: "Golosinas",
    url_imagen: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80",
    disponible: true
  },
  {
    id: "prod-006",
    nombre: "Gomitas de Frutas 100g",
    descripcion: "Surtido masticable de ositos de goma con sabores frutales naturales.",
    precio: 1.25,
    stock: 0,
    categoria: "Golosinas",
    url_imagen: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500&auto=format&fit=crop&q=80",
    disponible: false
  }
];

export const getProducts = async (category = '') => {
  try {
    const url = category && category !== 'Todas' 
      ? `${API_BASE}/products?categoria=${encodeURIComponent(category)}`
      : `${API_BASE}/products`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn('No se pudo conectar al Backend Express, usando catálogo local de respaldo:', error.message);
    if (category && category !== 'Todas') {
      return FALLBACK_PRODUCTS.filter((p) => p.categoria.toLowerCase() === category.toLowerCase());
    }
    return FALLBACK_PRODUCTS;
  }
};
