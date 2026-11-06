import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  ArrowRight,
  MapPin,
  User,
  FileText,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import { useCart, STORE_PHONE_NUMBER } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { recordSale } from '../services/api';

export const CartDrawer = () => {
  const {
    cart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    generateWhatsAppUrl,
  } = useCart();

  const { token, user } = useAuth();

  const [customerData, setCustomerData] = useState({
    nombre: '',
    direccion: '',
    notas: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [isProcessingSale, setIsProcessingSale] = useState(false);
  const [saleSuccessMessage, setSaleSuccessMessage] = useState('');

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Registrar venta directa en tienda física (Cajero o Admin)
  const handleProcessLocalSale = async () => {
    if (cart.length === 0) return;
    setIsProcessingSale(true);

    try {
      await recordSale(
        {
          items: cart,
          metodoPago: paymentMethod,
          cliente: customerData.nombre.trim() || 'Cliente en tienda',
        },
        token
      );

      setSaleSuccessMessage(
        `¡Venta registrada con éxito por ${formatPrice(totalPrice)}!`
      );
      clearCart();

      setTimeout(() => {
        setSaleSuccessMessage('');
        setIsCartOpen(false);
      }, 2500);
    } catch (err) {
      alert(`Error al registrar la venta: ${err.message}`);
    } finally {
      setIsProcessingSale(false);
    }
  };

  const handleSendWhatsApp = async () => {
    // Si hay sesión activa, registramos la venta para que compute en el panel de ganancias
    if (token) {
      try {
        await recordSale(
          {
            items: cart,
            metodoPago: 'WhatsApp / Delivery',
            cliente: customerData.nombre.trim() || 'Cliente WhatsApp',
          },
          token
        );
      } catch (_) {}
    }

    const url = generateWhatsAppUrl(STORE_PHONE_NUMBER, customerData);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo oscuro con difuminado */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Cabecera del Drawer */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-800">
                Punto de Venta / Carrito ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notificación de Venta Exitosa */}
          {saleSuccessMessage && (
            <div className="p-4 bg-emerald-600 text-white text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saleSuccessMessage}</span>
            </div>
          )}

          {/* Cuerpo: Lista de productos o Estado vacío */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-slate-700">El carrito está vacío</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Agrega productos del catálogo para procesar una venta o generar un pedido.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  <span>Ver productos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center space-x-3">
                    <img
                      src={item.url_imagen}
                      alt={item.nombre}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">
                        {item.nombre}
                      </h4>
                      <p className="text-xs font-bold text-emerald-600 mt-0.5">
                        {formatPrice(item.precio)} c/u
                      </p>

                      {/* Controladores de Cantidad */}
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-l-lg transition-colors"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-700 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className={`p-1 rounded-r-lg transition-colors ${
                              item.quantity >= item.stock
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                            }`}
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-extrabold text-slate-900 ml-auto">
                          {formatPrice(item.precio * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Botón Eliminar Producto */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-rose-500 p-1.5 transition-colors"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Formulario de Venta y Pago */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Efectivo', 'Transferencia / QR', 'Tarjeta'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                            paymentMethod === method
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Nombre del Cliente (Opcional)
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        name="nombre"
                        value={customerData.nombre}
                        onChange={handleInputChange}
                        placeholder="ej. Juan Pérez"
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pie del Carrito: Totales y Botones de Acción */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                <span>Subtotal ({totalItems} artículos)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex items-center justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total a Cobrar</span>
                <span className="text-xl text-emerald-600">{formatPrice(totalPrice)}</span>
              </div>

              {/* Botón Principal: Registrar y Cobrar Venta en Local */}
              <button
                onClick={handleProcessLocalSale}
                disabled={isProcessingSale}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] shadow-lg shadow-slate-900/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>
                  {isProcessingSale ? 'Registrando Venta...' : 'Cobrar & Registrar Venta'}
                </span>
              </button>

              {/* Botón Secundario: Enviar por WhatsApp */}
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-green-600 hover:bg-green-700 active:scale-[0.99] shadow-sm flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Pedido a WhatsApp</span>
              </button>

              {/* Botón Vaciar Carrito */}
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-slate-400 hover:text-rose-600 font-medium py-1 transition-colors"
              >
                Vaciar artículos
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
