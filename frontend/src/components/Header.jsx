import React from 'react';
import { ShoppingBag, Store, PhoneCall } from 'lucide-react';
import { useCart, STORE_PHONE_NUMBER } from '../context/CartContext';

export const Header = () => {
  const { totalItems, toggleCart } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo y Nombre de la tienda */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
              Tienda <span className="text-emerald-600">Local</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Bebidas, Snacks & Golosinas</p>
          </div>
        </div>

        {/* Acciones del Header */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Teléfono / WhatsApp Info */}
          <a
            href={`https://wa.me/${STORE_PHONE_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors py-1.5 px-3 rounded-lg border border-slate-200 hover:border-emerald-300 bg-slate-50"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pedidos: +{STORE_PHONE_NUMBER}</span>
          </a>

          {/* Botón Flotante/Abrir Carrito */}
          <button
            onClick={toggleCart}
            aria-label="Abrir carrito de compras"
            className="relative flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3.5 py-2 rounded-xl font-medium shadow-md shadow-emerald-600/20 transition-all duration-150"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-semibold">Mi Carrito</span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold leading-none text-emerald-700 bg-white rounded-full animate-in zoom-in-50">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
