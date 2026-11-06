import React, { useState, useEffect } from 'react';
import { X, Plus, Save, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { createProduct, updateProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DEFAULT_CATEGORIES = ['Bebidas', 'Snacks', 'Golosinas', 'Abarrotes', 'Lácteos'];

export const ProductFormModal = ({ isOpen, onClose, productToEdit, onProductSaved }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Bebidas',
    precio: '',
    costo: '',
    stock: '',
    descripcion: '',
    url_imagen: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre || '',
        categoria: productToEdit.categoria || 'Bebidas',
        precio: productToEdit.precio ?? '',
        costo: productToEdit.costo ?? (productToEdit.precio ? (productToEdit.precio * 0.6).toFixed(2) : ''),
        stock: productToEdit.stock ?? '',
        descripcion: productToEdit.descripcion || '',
        url_imagen: productToEdit.url_imagen || '',
      });
    } else {
      setFormData({
        nombre: '',
        categoria: 'Bebidas',
        precio: '',
        costo: '',
        stock: '',
        descripcion: '',
        url_imagen: '',
      });
    }
    setError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || formData.precio === '' || formData.stock === '') {
      setError('Por favor completa al menos nombre, precio y stock.');
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      nombre: formData.nombre.trim(),
      categoria: formData.categoria.trim() || 'General',
      precio: Number(formData.precio),
      costo: formData.costo !== '' ? Number(formData.costo) : Number((Number(formData.precio) * 0.6).toFixed(2)),
      stock: Number(formData.stock),
      descripcion: formData.descripcion.trim(),
      url_imagen:
        formData.url_imagen.trim() ||
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
      disponible: Number(formData.stock) > 0,
    };

    try {
      if (productToEdit && productToEdit.id) {
        await updateProduct(productToEdit.id, payload, token);
      } else {
        await createProduct(payload, token);
      }
      onProductSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el producto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              {productToEdit ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {productToEdit ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <p className="text-xs text-slate-400">
                {productToEdit ? 'Modifica datos o ajusta el stock' : 'Incorpora un nuevo artículo al catálogo'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre del Producto *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="ej. Galletas Oreo 110g"
              required
              className="w-full text-xs pl-3 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Stock Disponible *</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="ej. 20"
                required
                className="w-full text-xs pl-3 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Precio de Venta ($) *</label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="ej. 5.00"
                required
                className="w-full text-xs pl-3 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Costo de Compra ($)
                <span className="text-[10px] text-slate-400 font-normal ml-1">(para ganancias)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="costo"
                value={formData.costo}
                onChange={handleChange}
                placeholder="ej. 3.00 (opcional)"
                className="w-full text-xs pl-3 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">URL de Imagen</label>
            <div className="relative">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="url"
                name="url_imagen"
                value={formData.url_imagen}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            {formData.url_imagen && (
              <div className="mt-2 flex items-center space-x-2">
                <img
                  src={formData.url_imagen}
                  alt="Vista previa"
                  className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-[10px] text-slate-400">Previsualización de imagen</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              rows="2"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalle del producto, tamaño, sabor..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : productToEdit ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
