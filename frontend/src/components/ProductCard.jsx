import React from 'react';
import { Plus, Check, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product, onEdit, onDelete }) => {
  const { addToCart, cart } = useCart();
  const { canManageProducts } = useAuth();

  const cartItem = cart.find((item) => item.id === product.id);
  const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = !product.disponible || product.stock <= 0;
  const isMaxStockReached = currentQuantityInCart >= product.stock;

  const handleAdd = () => {
    if (isOutOfStock || isMaxStockReached) return;
    addToCart(product, 1);
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden h-full relative">
      
      {/* Contenedor de la Imagen */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.url_imagen}
          alt={product.nombre}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges de Categoría */}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-slate-700 text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm">
          {product.categoria}
        </span>

        {/* Badge de Stock */}
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          {isOutOfStock ? (
            <span className="inline-flex items-center space-x-1 bg-rose-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
              <AlertCircle className="w-3 h-3" />
              <span>Agotado</span>
            </span>
          ) : (
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-sm">
              Stock: {product.stock}
            </span>
          )}
        </div>

        {/* Botones de Gestión (Admin y Cajeros: Editar y Quitar) */}
        {canManageProducts && (
          <div className="absolute bottom-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm p-1 rounded-xl shadow-md border border-slate-200">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Editar producto o stock"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(product.id, product.nombre)}
                className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Quitar / Eliminar producto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Contenido del Producto */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm md:text-base leading-snug group-hover:text-emerald-600 transition-colors">
            {product.nombre}
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        </div>

        {/* Pie de tarjeta: Precio y Botón de compra */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
          <div>
            <span className="text-[10px] sm:text-xs text-slate-400 block font-medium">Precio</span>
            <span className="text-sm sm:text-base md:text-lg font-black text-slate-900 tracking-tight">
              {formatPrice(product.precio)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || isMaxStockReached}
            className={`inline-flex items-center space-x-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-150 ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isMaxStockReached
                ? 'bg-amber-100 text-amber-700 cursor-not-allowed border border-amber-200'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm hover:shadow shadow-emerald-600/20'
            }`}
          >
            {currentQuantityInCart > 0 ? (
              <>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{currentQuantityInCart} en carrito</span>
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
