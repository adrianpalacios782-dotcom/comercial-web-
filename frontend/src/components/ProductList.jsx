import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, Plus, X, AlertCircle } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductFormModal } from './ProductFormModal';
import { getProducts, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Todas', 'Bebidas', 'Snacks', 'Golosinas'];

// Función auxiliar para normalizar texto (elimina acentos, diacríticos y pasa a minúsculas)
const normalizeText = (text = '') => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export const ProductList = () => {
  const { token, canManageProducts, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados para modal de agregar/editar productos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getProducts(selectedCategory);
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  // Manejador del formulario de búsqueda (evita recarga nativa de la página)
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Filtrado reactivo en tiempo real por búsqueda y categoría
  const normalizedQuery = normalizeText(searchQuery);

  const filteredProducts = products.filter((prod) => {
    if (!normalizedQuery) return true;

    const nameMatch = normalizeText(prod.nombre).includes(normalizedQuery);
    const descMatch = normalizeText(prod.descripcion).includes(normalizedQuery);
    const catMatch = normalizeText(prod.categoria).includes(normalizedQuery);

    return nameMatch || descMatch || catMatch;
  });

  // Acciones de Gestión de Productos (Admin y Cajeros)
  const handleOpenCreateModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id, nombre) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar "${nombre}" del catálogo?\nEsta acción no se puede deshacer.`
    );
    if (!confirmDelete) return;

    try {
      await deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFeedbackMessage({
        type: 'success',
        text: `Producto "${nombre}" eliminado del catálogo con éxito.`,
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || 'Error al eliminar el producto.',
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  return (
    <section className="w-full px-4 sm:px-8 lg:px-12 py-8">
      
      {/* Banner / Hero de bienvenida */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl shadow-emerald-700/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Punto de Venta & Catálogo en Tiempo Real</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Catálogo de Productos
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Control de stock físico, búsqueda inteligente y registro de ventas.
            {canManageProducts && ' Tienes permisos activos para agregar, editar y quitar productos.'}
          </p>
        </div>

        {/* Botón para Agregar Producto (Cajeros y Admin) */}
        {canManageProducts && (
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center space-x-2 bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-black/10 transition-all self-start md:self-center shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>+ Agregar Producto</span>
          </button>
        )}
      </div>

      {/* Alerta de Notificación Temporal */}
      {feedbackMessage && (
        <div
          className={`mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span>{feedbackMessage.text}</span>
          <button onClick={() => setFeedbackMessage(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barra de Filtros y Buscador Reparado */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Filtros por Categoría */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Buscador Reparado (con Formulario preventDefault, botón de búsqueda y limpiar) */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full lg:w-96"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, descripción o categoría..."
              className="w-full text-xs pl-9 pr-20 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />
            
            {/* Botón para limpiar búsqueda */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-12 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Botón de Búsqueda explícito */}
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-sm transition-colors flex items-center space-x-1"
              title="Buscar"
            >
              <span>Buscar</span>
            </button>
          </div>
        </form>

      </div>

      {/* Contador de Resultados */}
      {searchQuery && (
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Mostrando <strong>{filteredProducts.length}</strong> de {products.length} productos para "
            <em>{searchQuery}</em>"
          </span>
          <button
            onClick={handleClearSearch}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Quitar filtro de búsqueda
          </button>
        </div>
      )}

      {/* Rejilla de Productos */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-5">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse">
              <div className="aspect-square bg-slate-200 rounded-xl mb-3" />
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-8 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-slate-700">No encontramos productos coincidentes</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No hay resultados para "${searchQuery}" en la categoría ${selectedCategory}.`
              : 'No hay productos disponibles en esta categoría.'}
          </p>
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Ver todos los productos
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}

      {/* Modal para Agregar / Editar Producto */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        onProductSaved={() => {
          loadData();
          setFeedbackMessage({
            type: 'success',
            text: productToEdit
              ? 'Producto actualizado correctamente.'
              : 'Nuevo producto agregado al catálogo con éxito.',
          });
          setTimeout(() => setFeedbackMessage(null), 4000);
        }}
      />

    </section>
  );
};
