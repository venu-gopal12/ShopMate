import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Cart = () => {
  const { cart, loading, removeFromCart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading && !cart) return <div className="text-center py-10">Loading cart...</div>;

  const cartItems = cart || [];
  const totalPrice = cartItems.reduce((acc, item) => {
    if (item.product && item.product.price) {
      return acc + (item.product.price * item.quantity);
    }
    return acc;
  }, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
            <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.product._id} className="p-6 flex items-center">
                  <img
                    src={item.product.image || "https://placehold.co/100"}
                    alt={item.product.name}
                    className="h-20 w-20 object-cover rounded-md border border-gray-200"
                  />
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                      </h3>
                      <p className="text-lg font-bold text-gray-900">${item.product.price}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Proceed to Checkout
              </button>
              <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                <p>
                  or{" "}
                  <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-500">
                    Continue Shopping
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;