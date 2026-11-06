import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Nombre de la clave utilizada en localStorage
const CART_STORAGE_KEY = 'tiendita_cart_v1';

// Teléfono de WhatsApp por defecto de la tienda (código de país + número, sin signos + ni espacios)
export const STORE_PHONE_NUMBER = '59172958516';

// 1. Estado inicial: intentamos cargar del localStorage si existe información previa
const getInitialState = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error al leer el carrito de localStorage:', error);
    return [];
  }
};

// 2. Tipos de acciones para el Reducer
const ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
};

// 3. Función reductora: maneja las transiciones de estado de forma inmutable
function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART: {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Si el producto ya está en el carrito, sumamos la cantidad sin sobrepasar el stock
        return state.map((item, index) => {
          if (index === existingIndex) {
            const nextQuantity = item.quantity + quantity;
            const finalQuantity = product.stock ? Math.min(nextQuantity, product.stock) : nextQuantity;
            return { ...item, quantity: finalQuantity };
          }
          return item;
        });
      }

      // Si es un producto nuevo en el carrito, lo agregamos con quantity inicial
      return [
        ...state,
        {
          ...product,
          quantity: Math.min(quantity, product.stock || 1),
        },
      ];
    }

    case ACTIONS.REMOVE_FROM_CART: {
      const productId = action.payload;
      return state.filter((item) => item.id !== productId);
    }

    case ACTIONS.UPDATE_QUANTITY: {
      const { productId, newQuantity } = action.payload;
      if (newQuantity <= 0) {
        return state.filter((item) => item.id !== productId);
      }
      return state.map((item) => {
        if (item.id === productId) {
          const finalQuantity = item.stock ? Math.min(newQuantity, item.stock) : newQuantity;
          return { ...item, quantity: finalQuantity };
        }
        return item;
      });
    }

    case ACTIONS.CLEAR_CART: {
      return [];
    }

    default:
      return state;
  }
}

// 4. Crear el Contexto
const CartContext = createContext(null);

// 5. Componente Proveedor (Provider)
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], getInitialState);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Sincronizar automáticamente en localStorage cada vez que el carrito cambia
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error al persistir el carrito en localStorage:', error);
    }
  }, [cart]);

  // Funciones de acción expuestas a los componentes
  const addToCart = (product, quantity = 1) => {
    if (!product || !product.disponible || product.stock <= 0) return;
    dispatch({ type: ACTIONS.ADD_TO_CART, payload: { product, quantity } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_CART, payload: productId });
  };

  const updateQuantity = (productId, newQuantity) => {
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { productId, newQuantity } });
  };

  const clearCart = () => {
    dispatch({ type: ACTIONS.CLEAR_CART });
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Valores calculados (Totales)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  /**
   * Genera el enlace directo a WhatsApp con el mensaje estructurado del pedido
   */
  const generateWhatsAppUrl = (phone = STORE_PHONE_NUMBER, customerData = {}) => {
    if (cart.length === 0) return '';

    const lines = [
      '👋 *¡Hola! Quiero hacer el siguiente pedido:*',
      '',
      '🛒 *Detalle de Productos:*',
    ];

    cart.forEach((item) => {
      const subtotal = (item.precio * item.quantity).toFixed(2);
      lines.push(`• ${item.quantity}x ${item.nombre} - $${subtotal}`);
    });

    lines.push('');
    lines.push(`💰 *Total a pagar: $${totalPrice.toFixed(2)}*`);
    lines.push('');

    if (customerData.nombre || customerData.direccion) {
      lines.push('📍 *Datos de Entrega:*');
      if (customerData.nombre) lines.push(`• Nombre: ${customerData.nombre}`);
      if (customerData.direccion) lines.push(`• Dirección: ${customerData.direccion}`);
      if (customerData.notas) lines.push(`• Notas: ${customerData.notas}`);
    } else {
      lines.push('📍 *Mi Dirección de entrega:* [Escribe tu dirección aquí]');
    }

    const message = lines.join('\n');
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const value = {
    cart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    toggleCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    generateWhatsAppUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// 6. Custom Hook para consumir el contexto de forma segura y sencilla
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un <CartProvider>');
  }
  return context;
};
