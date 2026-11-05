import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { getProducts } from '../services/api';

const CATEGORIES = ['Todas', 'Bebidas', 'Snacks', 'Golosinas'];

export const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getProducts(selectedCategory);
      setProducts(data);
      setLoading(false);
    };

    loadData();
  }, [selectedCategory]);

  // Filtrado local en base al término de búsqueda
  const filteredProducts = products.filter((prod) => {
    const matchSearch =
      prod.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner / Hero de bienvenida */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl shadow-emerald-700/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Delivery Local & Retiro en Local</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Tus antojos favoritos en minutos
          </h2>
          <p className="text-emerald-100 text-sm mt-1 max-w-lg">
            Arma tu carrito, revisa el stock en tiempo real y envíanos tu orden directamente por WhatsApp.
          </p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Filtros por Categoría */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Buscador de productos */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar bebida, snack..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Rejilla de Productos */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
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
          <p className="text-base font-bold text-slate-700">No encontramos productos coincidentes</p>
          <p className="text-xs text-slate-400 mt-1">Prueba seleccionando otra categoría o borrando tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
