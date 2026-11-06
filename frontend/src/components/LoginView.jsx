import React, { useState } from 'react';
import { Store, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PRESET_ACCOUNTS = [
  {
    role: 'admin',
    title: 'Administrador',
    username: 'admin',
    pass: 'Admin2026!',
    badge: 'Acceso Total + Ganancias',
    color: 'from-amber-500 to-orange-600',
    borderColor: 'hover:border-amber-400',
    icon: '👑',
  },
  {
    role: 'cajero_1',
    title: 'Cajero Uno',
    username: 'cajero1',
    pass: 'Cajero1@2026',
    badge: 'Ventas + Gestión Productos',
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'hover:border-emerald-400',
    icon: '🛒',
  },
  {
    role: 'cajero_2',
    title: 'Cajero Dos',
    username: 'cajero2',
    pass: 'Cajero2@2026',
    badge: 'Ventas + Gestión Productos',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'hover:border-blue-400',
    icon: '🛒',
  },
];

export const LoginView = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa usuario y contraseña.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(username.trim(), password.trim());
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (preset) => {
    setUsername(preset.username);
    setPassword(preset.pass);
    setLoading(true);
    setError('');

    try {
      await login(preset.username, preset.pass);
    } catch (err) {
      setError(err.message || 'Error con el acceso rápido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Columna Izquierda: Presentación */}
        <div className="lg:col-span-5 text-white space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema POS & Control de Inventario</span>
          </div>

          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 mb-4">
              <Store className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Tienda Local <span className="text-emerald-400">Doña Cristina</span>
            </h1>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              Plataforma de ventas, control de inventario y panel de ganancias por roles para Administrador y Cajeros.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Autenticación segura con JWT y encriptación</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Control de permisos por roles (Admin, Cajero 1, Cajero 2)</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Métricas de ganancias exclusivas para el Administrador</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Login */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-800">Iniciar Sesión</h2>
            <p className="text-xs text-slate-500 mt-1">
              Ingresa con tu usuario asignado o utiliza un acceso rápido.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2 animate-in fade-in">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulario de Login */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Usuario
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej. admin, cajero1 o cajero2"
                  autoComplete="username"
                  className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Ver u ocultar contraseña"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Verificando...' : 'Entrar al Sistema'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Accesos Rápidos de Prueba */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              ⚡ Acceso rápido con 1 clic (Usuarios predeterminados)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {PRESET_ACCOUNTS.map((preset) => (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => handleQuickLogin(preset)}
                  disabled={loading}
                  className={`text-left p-3 rounded-2xl border border-slate-200 hover:shadow-md transition-all group bg-slate-50/50 ${preset.borderColor}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{preset.icon}</span>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-700">
                      Entrar →
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 mt-1.5">{preset.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate font-mono mt-0.5">
                    {preset.username}
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {preset.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
