import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const salesFilePath = path.join(__dirname, '../data/sales.json');
const productsFilePath = path.join(__dirname, '../data/products.json');

const readSalesFromFile = () => {
  try {
    if (fs.existsSync(salesFilePath)) {
      const data = fs.readFileSync(salesFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error al leer sales.json:', error.message);
  }
  return [];
};

const writeSalesToFile = (sales) => {
  try {
    fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error al guardar en sales.json:', error.message);
    return false;
  }
};

const readProducts = () => {
  try {
    if (fs.existsSync(productsFilePath)) {
      return JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    }
  } catch (_) {}
  return [];
};

const writeProducts = (products) => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (_) {}
};

/**
 * POST /api/sales
 * Registra una nueva venta, calcula las ganancias y descuenta el stock
 * (Permitido para: admin, cajero_1, cajero_2)
 */
export const createSale = (req, res) => {
  try {
    const { items, metodoPago = 'Efectivo', cliente = 'Cliente en tienda' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La venta debe contener al menos un producto.'
      });
    }

    const products = readProducts();
    const sales = readSalesFromFile();

    let totalVenta = 0;
    let totalCosto = 0;
    let totalGanancia = 0;

    const processedItems = items.map((cartItem) => {
      const prodInDb = products.find((p) => p.id === cartItem.id);
      const precioUnitario = Number(cartItem.precio || (prodInDb ? prodInDb.precio : 0));
      // Si el producto tiene costo definido lo usamos, de lo contrario asumimos un costo estimado del 60%
      const costoUnitario = Number(
        (prodInDb && prodInDb.costo) !== undefined
          ? prodInDb.costo
          : (precioUnitario * 0.6).toFixed(2)
      );
      const cantidad = Number(cartItem.quantity || cartItem.cantidad || 1);

      const subtotal = Number((precioUnitario * cantidad).toFixed(2));
      const costoTotalItem = Number((costoUnitario * cantidad).toFixed(2));
      const gananciaItem = Number((subtotal - costoTotalItem).toFixed(2));

      totalVenta += subtotal;
      totalCosto += costoTotalItem;
      totalGanancia += gananciaItem;

      // Descontar stock del producto en la base de datos
      if (prodInDb) {
        prodInDb.stock = Math.max(0, (prodInDb.stock || 0) - cantidad);
        if (prodInDb.stock === 0) {
          prodInDb.disponible = false;
        }
      }

      return {
        id: cartItem.id,
        nombre: cartItem.nombre,
        precio: precioUnitario,
        costo: costoUnitario,
        cantidad,
        subtotal,
        ganancia: gananciaItem
      };
    });

    // Guardar productos con stock actualizado
    writeProducts(products);

    const newSale = {
      id: `sale-${Date.now()}`,
      fecha: new Date().toISOString(),
      cajeroId: req.user.id,
      cajeroNombre: req.user.nombre,
      cajeroRol: req.user.rol,
      items: processedItems,
      totalVenta: Number(totalVenta.toFixed(2)),
      totalCosto: Number(totalCosto.toFixed(2)),
      totalGanancia: Number(totalGanancia.toFixed(2)),
      metodoPago,
      cliente
    };

    sales.unshift(newSale);
    writeSalesToFile(sales);

    return res.status(201).json({
      success: true,
      message: 'Venta registrada con éxito.',
      data: newSale
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al registrar la venta.',
      error: error.message
    });
  }
};

/**
 * GET /api/sales
 * Historial completo de ventas (SOLO ADMINISTRADOR)
 */
export const getSales = (req, res) => {
  try {
    const { cajero, limite } = req.query;
    let sales = readSalesFromFile();

    if (cajero) {
      sales = sales.filter((s) => s.cajeroRol === cajero || s.cajeroNombre.toLowerCase().includes(cajero.toLowerCase()));
    }

    if (limite) {
      sales = sales.slice(0, Number(limite));
    }

    return res.status(200).json({
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de ventas.',
      error: error.message
    });
  }
};

/**
 * GET /api/sales/stats
 * Resumen financiero y métricas de ganancias totales (SOLO ADMINISTRADOR)
 */
export const getSalesStats = (req, res) => {
  try {
    const sales = readSalesFromFile();

    const totalVentas = sales.reduce((acc, s) => acc + (s.totalVenta || 0), 0);
    const totalCostos = sales.reduce((acc, s) => acc + (s.totalCosto || 0), 0);
    const totalGanancias = sales.reduce((acc, s) => acc + (s.totalGanancia || 0), 0);
    const cantidadVentas = sales.length;

    // Métricas por cajero
    const ventasPorCajero = {};
    sales.forEach((s) => {
      const cajeroKey = s.cajeroNombre || s.cajeroRol || 'Desconocido';
      if (!ventasPorCajero[cajeroKey]) {
        ventasPorCajero[cajeroKey] = {
          nombre: cajeroKey,
          rol: s.cajeroRol,
          totalVendido: 0,
          totalGanancia: 0,
          cantidadVentas: 0
        };
      }
      ventasPorCajero[cajeroKey].totalVendido += s.totalVenta || 0;
      ventasPorCajero[cajeroKey].totalGanancia += s.totalGanancia || 0;
      ventasPorCajero[cajeroKey].cantidadVentas += 1;
    });

    // Productos más vendidos y más rentables
    const productosStats = {};
    sales.forEach((s) => {
      s.items?.forEach((item) => {
        if (!productosStats[item.nombre]) {
          productosStats[item.nombre] = {
            id: item.id,
            nombre: item.nombre,
            cantidadVendida: 0,
            recaudacionTotal: 0,
            gananciaTotal: 0
          };
        }
        productosStats[item.nombre].cantidadVendida += item.cantidad || 0;
        productosStats[item.nombre].recaudacionTotal += item.subtotal || 0;
        productosStats[item.nombre].gananciaTotal += item.ganancia || 0;
      });
    });

    const topProductos = Object.values(productosStats)
      .sort((a, b) => b.gananciaTotal - a.gananciaTotal)
      .slice(0, 5);

    const totalArticulosVendidos = Object.values(productosStats).reduce(
      (acc, p) => acc + p.cantidadVendida,
      0
    );

    const margenPromedio = totalVentas > 0 ? (totalGanancias / totalVentas) * 100 : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalVentas: Number(totalVentas.toFixed(2)),
        totalCostos: Number(totalCostos.toFixed(2)),
        totalGanancias: Number(totalGanancias.toFixed(2)),
        margenPromedio: Number(margenPromedio.toFixed(1)),
        cantidadVentas,
        totalArticulosVendidos,
        ventasPorCajero: Object.values(ventasPorCajero),
        topProductos
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al calcular las estadísticas de ganancias.',
      error: error.message
    });
  }
};
