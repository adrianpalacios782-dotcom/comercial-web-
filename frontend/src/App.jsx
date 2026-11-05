import React from 'react';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { CartDrawer } from './components/CartDrawer';
import { ShieldCheck, Zap, RefreshCw } from 'lucide-react';

export default function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {/* Cabecera Principal */}
        <Header />

        {/* Catálogo de Productos y Filtros */}
        <main className="flex-1">
          <ProductList />

          {/* Sección Informativa para el usuario / Desarrollador Junior */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">React + Vite + Tailwind</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Frontend ultra veloz, modular y responsivo, preparado para móviles y computadoras.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Persistencia Automática</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    El carrito se sincroniza con <code className="bg-slate-100 px-1 rounded text-slate-700">localStorage</code> para que no pierdas tu pedido al recargar.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Seguridad en Express</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Backend con Helmet, CORS, Rate Limit y JWT para la gestión segura del catálogo.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Modal Desplegable del Carrito */}
        <CartDrawer />

        {/* Pie de Página */}
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          <p>© 2026 Tienda Local de Conveniencia. Todos los derechos reservados.</p>
          <p className="mt-1 text-slate-400">Arquitectura limpia y modular para React + Node.js Express</p>
        </footer>
      </div>
    </CartProvider>
  );
}
