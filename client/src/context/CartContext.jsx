import { createContext, useState, useContext, useEffect } from "react";
import API from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get("/cart");
      // res.data is expected to be { items: [...] }
      const items = res.data?.items || [];
      console.log("🛒 Fetched Items:", items);
      setCart(items);
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      console.log("🛒 Adding to Cart:", { productId, quantity });
      const res = await API.post("/cart/add", { productId, quantity });
      // res.data is expected to be { items: [...] }
      const items = res.data?.items || [];
      console.log("✅ Updated Items:", items);
      setCart(items);
      setIsCartOpen(true);
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await API.post("/cart/remove", { productId });
      const items = res.data?.items || [];
      setCart(items);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart: cart || [], loading, addToCart, removeFromCart, fetchCart, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};
