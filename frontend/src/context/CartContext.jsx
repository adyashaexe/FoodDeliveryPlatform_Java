import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      setCart({ items: [], subtotal: 0, deliveryFee: 0, total: 0 });
      return;
    }
    refreshCart();
  }, [isAuthenticated, token]);

  async function refreshCart() {
    const { data } = await api.get("/api/cart");
    setCart(data);
    return data;
  }

  async function addToCart(menuItemId, quantity = 1) {
    const { data } = await api.post("/api/cart/add", { menuItemId, quantity });
    setCart(data);
    return data;
  }

  async function updateItem(cartItemId, quantity) {
    const { data } = await api.put(`/api/cart/items/${cartItemId}`, { quantity });
    setCart(data);
    return data;
  }

  async function removeItem(cartItemId) {
    const { data } = await api.delete(`/api/cart/items/${cartItemId}`);
    setCart(data);
    return data;
  }

  async function clearCart() {
    const { data } = await api.delete("/api/cart");
    setCart(data);
    return data;
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
