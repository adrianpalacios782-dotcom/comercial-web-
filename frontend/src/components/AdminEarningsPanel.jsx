import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Package,
  Award,
  Users,
  Calendar,
  Filter,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { getSalesStats, getSalesList } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminEarningsPanel = () => {
  const { token, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [selectedCashier, setSelectedCashier] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!token || !isAdmin) return;
    setLoading(true);
    setError('');

    try {
      const [statsData, salesData] = await Promise.all([
        getSalesStats(token),
        getSalesList(token, selectedCashier),
      ]);
      setStats(statsData);
      setSales(salesData);
    } catch (err) {
      setError(err.message || 'Error al cargar datos financieros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCashier]);

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-white rounded-3xl border border-slate-200 mt-8 shadow-sm">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Acceso Restringido</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
          Esta sección contiene información financiera sensible y ganancias netas. Solo los usuarios con rol de <strong>Administrador</strong> tienen autorización para ver este panel.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Cabecera del Panel de Ganancias */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Métricas Financieras Exclusivas • Solo Administrador</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Panel de Ganancias & Ventas
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Supervisión en tiempo real de ingresos brutos, costos y rentabilidad neta de la tienda.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-white/10 self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Tarjetas de Métricas Clave */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Ganancias Totales */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 mb-3">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Ganancia Neta Total
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {formatCurrency(stats.totalGanancias)}
                </span>
              </div>
              <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Margen estimado: {stats.margenPromedio}%
              </span>
            </div>
          </div>

          {/* Ventas Brutas */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Ingresos Brutos
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                {formatCurrency(stats.totalVentas)}
              </span>
              <span className="inline-block mt-2 text-[10px] font-medium text-slate-400">
                Costo base: {formatCurrency(stats.totalCostos)}
              </span>
            </div>
          </div>

          {/* Transacciones / Tickets */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 mb-3">
                <Receipt className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Ventas Realizadas
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                {stats.cantidadVentas}
              </span>
              <span className="inline-block mt-2 text-[10px] font-medium text-slate-400">
                Ticket promedio: {formatCurrency(stats.cantidadVentas > 0 ? stats.totalVentas / stats.cantidadVentas : 0)}
              </span>
            </div>
          </div>

          {/* Unidades Vendidas */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-0" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 mb-3">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Unidades Despachadas
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                {stats.totalArticulosVendidos}
              </span>
              <span className="inline-block mt-2 text-[10px] font-medium text-slate-400">
                Productos físicos entregados
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Sección Doble: Ventas por Cajero y Top Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rendimiento por Cajero */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Desempeño y Ganancias por Cajero
            </h3>
          </div>

          <div className="space-y-3">
            {stats?.ventasPorCajero?.map((cajero) => (
              <div
                key={cajero.nombre}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{cajero.nombre}</h4>
                  <span className="text-[10px] text-slate-500">
                    Rol: <span className="font-mono">{cajero.rol}</span> • {cajero.cantidadVentas} ventas
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block">
                    {formatCurrency(cajero.totalVendido)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600">
                    Ganancia: {formatCurrency(cajero.totalGanancia)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Productos más Rentables */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Top Productos con Mayor Ganancia
            </h3>
          </div>

          <div className="space-y-3">
            {stats?.topProductos?.map((prod, idx) => (
              <div
                key={prod.nombre}
                className="p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{prod.nombre}</h4>
                    <span className="text-[10px] text-slate-400">
                      {prod.cantidadVendida} unid. vendidas
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 block">
                    +{formatCurrency(prod.gananciaTotal)}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ventas: {formatCurrency(prod.recaudacionTotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Historial Detallado de Ventas */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Historial Detallado de Transacciones</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro auditable de cada venta procesada en caja
            </p>
          </div>

          {/* Filtro por Cajero */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCashier}
              onChange={(e) => setSelectedCashier(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Todos los Cajeros</option>
              <option value="cajero_1">Cajero Uno</option>
              <option value="cajero_2">Cajero Dos</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        {/* Tabla Responsiva */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3">Código</th>
                <th className="pb-3">Fecha y Hora</th>
                <th className="pb-3">Cajero</th>
                <th className="pb-3">Artículos</th>
                <th className="pb-3">Método</th>
                <th className="pb-3 text-right">Venta Total</th>
                <th className="pb-3 text-right">Ganancia Neta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 text-xs">
                    No hay ventas registradas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-mono text-[11px] font-bold text-slate-700">
                      {sale.id}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(sale.fecha).toLocaleString('es-BO', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-slate-800">{sale.cajeroNombre}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">({sale.cajeroRol})</span>
                    </td>
                    <td className="py-3 max-w-xs">
                      <div className="space-y-0.5">
                        {sale.items?.map((item, idx) => (
                          <div key={idx} className="text-[11px] text-slate-600 truncate">
                            • {item.cantidad}x {item.nombre}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                        {sale.metodoPago || 'Efectivo'}
                      </span>
                    </td>
                    <td className="py-3 text-right font-black text-slate-900">
                      {formatCurrency(sale.totalVenta)}
                    </td>
                    <td className="py-3 text-right font-black text-emerald-600">
                      +{formatCurrency(sale.totalGanancia)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
