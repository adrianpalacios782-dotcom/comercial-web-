import React from 'react';
import { Plus, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();

  // Verificamos si este producto ya está en el carrito y en qué cantidad
  const cartItem = cart.find((item) => item.id === product.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = !product.disponible || product.stock <= 0;
  const isMaxStockReached = currentQuantityInCart >= product.stock;

  const handleAdd = () => {
    if (isOutOfStock || isMaxStockReached) return;
    addToCart(product, 1);
  };

  // Formateador de moneda en USD / Moneda local
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.url_imagen}
          alt={product.nombre}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge de Categoría */}
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {product.categoria}
        </span>

        {/* Badge de Stock */}
        <div className="absolute top-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="inline-flex items-center space-x-1 bg-rose-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
              <AlertCircle className="w-3 h-3" />
              <span>Agotado</span>
            </span>
          ) : (
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
              Stock: {product.stock}
            </span>
          )}
        </div>
      </div>

      {/* Contenido del Producto */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-emerald-600 transition-colors">
            {product.nombre}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        </div>

        {/* Pie de tarjeta: Precio y Botón de acción */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Precio unitario</span>
            <span className="text-lg font-black text-slate-900 tracking-tight">
              {formatPrice(product.precio)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || isMaxStockReached}
            className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isMaxStockReached
                ? 'bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-200'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm hover:shadow shadow-emerald-600/20'
            }`}
          >
            {currentQuantityInCart > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{currentQuantityInCart} en carrito</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
