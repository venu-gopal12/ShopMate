import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cart?.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) || 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`absolute inset-y-0 right-0 max-w-full flex w-full sm:w-[400px] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col bg-white shadow-2xl overflow-y-scroll">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-indigo-600" />
              Shopping Cart
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-grow py-6 px-6">
            {cart?.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-6 rounded-full bg-gray-50">
                  <ShoppingBag className="w-12 h-12 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 mt-1 max-w-[200px]">Looks like you haven't added anything yet.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex gap-4 group">
                    <div className="w-20 h-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm relative group-hover:shadow-md transition-shadow">
                      <img
                        src={item.product.image || "https://placehold.co/200x300"}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-bold text-gray-900 leading-snug">
                          <h3>{item.product.name}</h3>
                          <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.product.description}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                        <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-lg ring-1 ring-gray-100">
                           <span className="text-gray-600 font-medium">Qty:</span>
                           <span className="font-bold text-gray-900">{item.quantity}</span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Checkout */}
          {cart?.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-8 space-y-4 bg-gray-50/50">
              <div className="flex justify-between text-base text-gray-900 font-bold mb-2">
                <p>Subtotal</p>
                <p className="text-2xl font-black text-indigo-600">${totalPrice.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => {
                    onClose();
                    navigate("/checkout");
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-lg font-extrabold text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 group"
                >
                  Checkout
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/cart");
                  }}
                  className="w-full flex items-center justify-center rounded-2xl bg-white ring-2 ring-gray-200 px-6 py-4 text-lg font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
                >
                  View Full Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
