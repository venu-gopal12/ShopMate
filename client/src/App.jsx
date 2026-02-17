import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { CartContext } from "./context/CartContext";
import CartDrawer from "./components/cart/CartDrawer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Admin pages (we will create later)
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";

// Route protectors
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import SellerRoute from "./components/auth/SellerRoute";

// Seller Pages
import SellerRegister from "./pages/seller/SellerRegister";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";

const App = () => {
  const { user, logout } = useContext(AuthContext);
  const { isCartOpen, setIsCartOpen } = useContext(CartContext);
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* Admin Protected */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

        {/* Seller Protected */}
        <Route path="/seller/register" element={<ProtectedRoute><SellerRegister /></ProtectedRoute>} />
        <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
        <Route path="/seller/products" element={<SellerRoute><SellerProducts /></SellerRoute>} />
        <Route path="/seller/orders" element={<SellerRoute><SellerOrders /></SellerRoute>} />

      </Routes>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </BrowserRouter>
  );
};

export default App;
