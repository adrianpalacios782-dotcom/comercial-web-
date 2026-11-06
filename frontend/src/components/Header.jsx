import React from 'react';
import { ShoppingBag, Store, PhoneCall, TrendingUp, LogOut, Package, User } from 'lucide-react';
import { useCart, STORE_PHONE_NUMBER } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Header = ({ currentView, onViewChange }) => {
  const { totalItems, toggleCart } = useCart();
  const { user, logout, isAdmin } = useAuth();

  const getRoleBadge = () => {
    if (user?.rol === 'admin') {
      return {
        label: 'Administrador',
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: '👑',
      };
    }
    if (user?.rol === 'cajero_1') {
      return {
        label: 'Cajero Uno',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: '🛒',
      };
    }
    return {
      label: 'Cajero Dos',
      bg: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: '🛒',
    };
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="w-full px-4 sm:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Logo y Nombre de la tienda */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-slate-900 leading-none">
              Tienda <span className="text-emerald-600">Doña Cristina</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
              Bebidas, Golosinas & Snacks
            </p>
          </div>
        </div>

        {/* Pestañas de Navegación entre Vistas */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => onViewChange('catalogo')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentView === 'catalogo'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Catálogo</span>
          </button>

          {/* Panel de Ganancias (SOLO ADMINISTRADOR) */}
          {isAdmin && (
            <button
              onClick={() => onViewChange('ganancias')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'ganancias'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Ganancias</span>
            </button>
          )}
        </nav>

        {/* Acciones del Header: Usuario, Carrito y Logout */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Badge del Usuario Logueado */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">
            <span className="text-sm">{roleInfo.icon}</span>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 leading-none block">
                {user?.nombre || user?.username}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {roleInfo.label}
              </span>
            </div>
          </div>

          {/* Botón Carrito de Compras */}
          <button
            onClick={toggleCart}
            aria-label="Abrir carrito de compras"
            className="relative flex items-center space-x-1.5 sm:space-x-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3 py-2 rounded-xl font-medium shadow-md shadow-emerald-600/20 transition-all duration-150"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-xs sm:text-sm font-semibold">Carrito</span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold leading-none text-emerald-800 bg-white rounded-full animate-in zoom-in-50">
                {totalItems}
              </span>
            )}
          </button>

          {/* Botón Cerrar Sesión */}
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-transparent hover:border-rose-100 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
