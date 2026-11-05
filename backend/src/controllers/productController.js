import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, '../data/products.json');

// Función auxiliar para leer los productos del archivo JSON
const readProductsFromFile = () => {
  try {
    const rawData = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error al leer products.json:', error);
    return [];
  }
};

// Función auxiliar para escribir productos en el archivo JSON
const writeProductsToFile = (products) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error al guardar en products.json:', error);
    return false;
  }
};

/**
 * GET /api/products
 * Obtiene la lista completa de productos.
 * Soporta filtro opcional por query param: ?categoria=Bebidas
 */
export const getProducts = (req, res) => {
  try {
    const { categoria, disponible } = req.query;
    let products = readProductsFromFile();

    if (categoria) {
      products = products.filter(
        (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
      );
    }

    if (disponible !== undefined) {
      const isAvailable = disponible === 'true';
      products = products.filter((p) => p.disponible === isAvailable);
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los productos.',
      error: error.message
    });
  }
};

/**
 * GET /api/products/:id
 * Obtiene un producto específico por su ID.
 */
export const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const products = readProductsFromFile();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Producto con ID '${id}' no encontrado.`
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al buscar el producto.',
      error: error.message
    });
  }
};

/**
 * POST /api/products (Ruta protegida por JWT)
 * Crea un nuevo producto en el catálogo.
 */
export const createProduct = (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria, url_imagen, disponible } = req.body;

    // Validaciones básicas de campos
    if (!nombre || precio === undefined || stock === undefined || !categoria) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: nombre, precio, stock o categoría.'
      });
    }

    const products = readProductsFromFile();
    const newProduct = {
      id: `prod-${Date.now()}`,
      nombre: String(nombre).trim(),
      descripcion: descripcion ? String(descripcion).trim() : '',
      precio: Number(precio),
      stock: Number(stock),
      categoria: String(categoria).trim(),
      url_imagen: url_imagen || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      disponible: disponible !== undefined ? Boolean(disponible) : Number(stock) > 0
    };

    products.push(newProduct);
    writeProductsToFile(products);

    return res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente.',
      data: newProduct
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al crear el producto.',
      error: error.message
    });
  }
};

/**
 * PUT /api/products/:id (Ruta protegida por JWT)
 * Actualiza la información o stock de un producto.
 */
export const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const products = readProductsFromFile();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Producto con ID '${id}' no encontrado para actualizar.`
      });
    }

    const current = products[index];
    const updated = {
      ...current,
      ...req.body,
      id: current.id // El id nunca se debe alterar
    };

    // Actualiza disponibilidad automáticamente si el stock es 0
    if (updated.stock !== undefined && updated.stock <= 0) {
      updated.disponible = false;
    }

    products[index] = updated;
    writeProductsToFile(products);

    return res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente.',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el producto.',
      error: error.message
    });
  }
};

/**
 * DELETE /api/products/:id (Ruta protegida por JWT)
 * Elimina un producto del catálogo.
 */
export const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const products = readProductsFromFile();
    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return res.status(404).json({
        success: false,
        message: `Producto con ID '${id}' no encontrado.`
      });
    }

    writeProductsToFile(filtered);

    return res.status(200).json({
      success: true,
      message: `Producto '${id}' eliminado con éxito.`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el producto.',
      error: error.message
    });
  }
};
