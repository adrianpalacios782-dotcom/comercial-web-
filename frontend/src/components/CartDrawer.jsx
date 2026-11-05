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
  FileText
} from 'lucide-react';
import { useCart, STORE_PHONE_NUMBER } from '../context/CartContext';

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

  // Formulario con datos de entrega para personalizar el mensaje de WhatsApp
  const [customerData, setCustomerData] = useState({
    nombre: '',
    direccion: '',
    notas: '',
  });

  if (!isCartOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendWhatsApp = () => {
    const url = generateWhatsAppUrl(STORE_PHONE_NUMBER, customerData);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
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
              <h2 className="text-lg font-bold text-slate-800">Tu Carrito ({totalItems})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo: Lista de productos o Estado vacío */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-slate-700">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Agrega bebidas, snacks o golosinas para armar tu pedido express.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  <span>Explorar productos</span>
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
                      <h4 className="text-sm font-semibold text-slate-800 truncate">{item.nombre}</h4>
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

                {/* Formulario opcional de Entrega para WhatsApp */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Datos para el Envío (Opcional)
                  </h4>
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        name="nombre"
                        value={customerData.nombre}
                        onChange={handleInputChange}
                        placeholder="Tu Nombre completo"
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        name="direccion"
                        value={customerData.direccion}
                        onChange={handleInputChange}
                        placeholder="Calle, Número y Barrio"
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="relative">
                      <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        name="notas"
                        value={customerData.notas}
                        onChange={handleInputChange}
                        placeholder="Aclaraciones (ej: timbre 3B, pago con $10)"
                        className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pie del Carrito: Totales y Botón de WhatsApp */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                <span>Subtotal ({totalItems} artículos)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex items-center justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total estimado</span>
                <span className="text-xl text-emerald-600">{formatPrice(totalPrice)}</span>
              </div>

              {/* Botón WhatsApp */}
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 active:scale-[0.99] shadow-lg shadow-green-600/25 flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Pedido por WhatsApp</span>
              </button>

              {/* Botón Vaciar Carrito */}
              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-slate-400 hover:text-rose-600 font-medium py-1 transition-colors"
              >
                Vaciar todo el carrito
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
