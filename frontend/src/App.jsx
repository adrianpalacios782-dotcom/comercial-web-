import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { CartDrawer } from './components/CartDrawer';
import { LoginView } from './components/LoginView';
import { AdminEarningsPanel } from './components/AdminEarningsPanel';
import { ShieldCheck, Zap, RefreshCw } from 'lucide-react';

function MainApp() {
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState('catalogo'); // 'catalogo' | 'ganancias'

  // Pantalla de carga mientras se valida la sesión persistente
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-400">Verificando credenciales...</p>
      </div>
    );
  }

  // Si no está autenticado, la pantalla principal es el Login
  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Cabecera Principal con Selector de Vistas y Usuario */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          // Si no es admin y quiere ver ganancias, forzamos catálogo
          if (view === 'ganancias' && !isAdmin) {
            setCurrentView('catalogo');
          } else {
            setCurrentView(view);
          }
        }}
      />

      {/* Contenido Dinámico según la vista activa */}
      <main className="flex-1">
        {currentView === 'catalogo' ? (
          <>
            <ProductList />

            {/* Sección Informativa */}
            <section className="w-full px-4 sm:px-8 lg:px-12 py-8 mb-12">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Accesible & Rápido</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Atención inmediata en caja y pedidos listos para entrega.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Menú Actualizado</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Control de stock en tiempo real y nuevos productos cada semana.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Seguridad & Confianza</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Acceso restringido por roles con trazabilidad en cada venta.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <AdminEarningsPanel />
        )}
      </main>

      {/* Modal Desplegable del Carrito / POS */}
      <CartDrawer />

      {/* Pie de Página */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Tienda Local Doña Cristina, lo que necesitas al mejor precio.</p>
        <p className="mt-1 text-slate-400">Sistema Full-Stack con Roles y Control de Ganancias</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
