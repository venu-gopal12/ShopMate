import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import Footer from "../components/layout/Footer";
import { ShieldCheck, MapPin, CreditCard, ChevronRight, Lock, CheckCircle2 } from "lucide-react";

const Checkout = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Checkout States
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "", name: "" });

  useEffect(() => {
    fetchCart();
  }, []);

  const cartItems = cart || [];
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = totalPrice > 500 ? 0 : 40;
  const tax = totalPrice * 0.18;
  const grandTotal = totalPrice + shipping + tax;

  const demoAddresses = [
    {
      id: 0,
      name: user?.name || "User",
      street: "123 Tech Park, Phase II",
      city: "Bangalore",
      state: "Karnataka",
      zip: "560100",
      phone: "+91 9876543210"
    },
    {
      id: 1,
      name: user?.name || "User",
      street: "45 Silicon Street, IT Colony",
      city: "Hyderabad",
      state: "Telangana",
      zip: "500081",
      phone: "+91 9876543210"
    }
  ];

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");

    try {
      await API.post("/orders", {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        totalAmount: grandTotal,
        address: `${demoAddresses[selectedAddress].street}, ${demoAddresses[selectedAddress].city}, ${demoAddresses[selectedAddress].state} - ${demoAddresses[selectedAddress].zip}`,
        paymentMethod
      });
      await fetchCart();
      navigate("/orders");
    } catch (err) {
      console.error("Order failed:", err);
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <ShieldCheck className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
        <Link to="/" className="mt-6 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Premium Compact Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ShopMate
          </Link>
          <h1 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            Checkout <Lock className="w-4 h-4 text-gray-400" />
          </h1>
          <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            100% Secure Transaction
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200 py-4 hidden md:block">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>1</span>
            Address
          </div>
          <div className={`flex-1 h-1 mx-4 rounded-full ${step > 1 ? 'bg-indigo-600' : 'bg-gray-100'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>2</span>
            Payment
          </div>
          <div className={`flex-1 h-1 mx-4 rounded-full ${step > 2 ? 'bg-indigo-600' : 'bg-gray-100'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>3</span>
            Review
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Sections */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. SHIPPING ADDRESS */}
            <section className={`bg-white rounded-2xl ring-1 ring-gray-200 transition-all ${step === 1 ? 'shadow-lg ring-indigo-100' : 'shadow-sm opacity-90'}`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>1</span>
                    Shipping Address
                  </h2>
                  {step > 1 && (
                    <button onClick={() => setStep(1)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
                      Change
                    </button>
                  )}
                </div>

                {step === 1 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {demoAddresses.map((addr, idx) => (
                      <div 
                        key={addr.id}
                        onClick={() => setSelectedAddress(idx)}
                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                          selectedAddress === idx 
                          ? 'border-yellow-400 bg-yellow-50/20 ring-4 ring-yellow-400/10' 
                          : 'border-gray-100 hover:border-gray-300'
                        }`}
                      >
                        {selectedAddress === idx && (
                          <div className="absolute top-4 right-4 bg-yellow-400 text-black rounded-full p-1 border-2 border-white shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        <p className="font-bold text-gray-900 text-lg">{addr.name}</p>
                        <p className="text-gray-600 mt-2 leading-relaxed">{addr.street}</p>
                        <p className="text-gray-600">{addr.city}, {addr.state} {addr.zip}</p>
                        <p className="text-gray-600 mt-4 font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                          Phone: {addr.phone}
                        </p>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setStep(2);
                          }}
                          className={`mt-6 w-full py-3 rounded-xl font-bold shadow-sm transition-all transform active:scale-95 ${
                            selectedAddress === idx
                            ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          Deliver to this address
                        </button>
                      </div>
                    ))}
                    <button className="p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-500 transition-all group">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition-colors">
                        <span className="text-3xl font-light text-gray-300 group-hover:text-indigo-400">+</span>
                      </div>
                      <span className="font-semibold text-sm">Add New Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">{demoAddresses[selectedAddress].name}</p>
                      <p className="text-gray-600 text-sm mt-1">
                        {demoAddresses[selectedAddress].street}, {demoAddresses[selectedAddress].city}, {demoAddresses[selectedAddress].state} {demoAddresses[selectedAddress].zip}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 2. PAYMENT METHOD */}
            <section className={`bg-white rounded-2xl ring-1 ring-gray-200 transition-all ${step === 2 ? 'shadow-lg ring-indigo-100' : 'shadow-sm opacity-90'}`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>2</span>
                    Payment Method
                  </h2>
                  {step > 2 && (
                    <button onClick={() => setStep(2)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
                      Change
                    </button>
                  )}
                </div>

                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`relative block p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-yellow-400 bg-yellow-50/20' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input 
                        type="radio" 
                        className="hidden" 
                        name="payment" 
                        value="cod" 
                        checked={paymentMethod === 'cod'} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${paymentMethod === 'cod' ? 'border-yellow-600 bg-yellow-600' : 'border-gray-300'}`}>
                          {paymentMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">Cash on Delivery</p>
                          <p className="text-sm text-gray-500 mt-1">Pay with cash when your package arrives</p>
                        </div>
                      </div>
                    </label>

                    <label className={`relative block p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-yellow-400 bg-yellow-50/20' : 'border-gray-100 hover:border-gray-300'}`}>
                      <input 
                        type="radio" 
                        className="hidden" 
                        name="payment" 
                        value="card" 
                        checked={paymentMethod === 'card'} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${paymentMethod === 'card' ? 'border-yellow-600 bg-yellow-600' : 'border-gray-300'}`}>
                          {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg flex items-center gap-2">
                             Credit / Debit Card <CreditCard className="w-5 h-5 text-gray-400" />
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Stripe-powered secure payment</p>
                        </div>
                      </div>
                    </label>

                    {paymentMethod === 'card' && (
                      <div className="md:col-span-2 bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Card Number</label>
                            <input 
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition-all font-mono"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Expiry Date</label>
                            <input 
                              type="text"
                              placeholder="MM / YY"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition-all font-mono"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">CVC</label>
                            <input 
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 outline-none transition-all font-mono"
                              value={cardDetails.cvc}
                              onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => setStep(3)}
                      className="md:col-span-2 mt-4 px-10 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl shadow-md transition-all active:scale-95"
                    >
                      Use this payment method
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-start gap-4">
                    <CreditCard className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">
                        {paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Credit Card'}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">Ready to complete order</p>
                    </div>
                  </div>
                )}
                
                {step < 2 && <p className="text-gray-400 italic font-medium">Please complete step 1 first</p>}
              </div>
            </section>

            {/* 3. REVIEW ITEMS */}
            <section className={`bg-white rounded-2xl ring-1 ring-gray-200 transition-all ${step === 3 ? 'shadow-lg ring-indigo-100' : 'shadow-sm opacity-90'}`}>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>3</span>
                  Review items and delivery
                </h2>

                {step === 3 ? (
                  <div className="space-y-6">
                    <div className="divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <div key={item.product._id} className="py-6 flex gap-6 group">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-24 h-24 object-cover rounded-2xl ring-1 ring-gray-200 group-hover:shadow-md transition-all" 
                          />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg leading-snug">{item.product.name}</h4>
                            <p className="text-green-600 font-bold text-sm mt-1">In Stock</p>
                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                              Qty: <span className="font-bold text-gray-900">{item.quantity}</span>
                            </p>
                            <p className="mt-3 font-extrabold text-xl text-gray-900">${item.product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                          <p className="text-indigo-900 font-medium">Ready to place your order?</p>
                        </div>
                        <button 
                          onClick={handlePlaceOrder}
                          disabled={loading}
                          className="px-12 py-4 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-extrabold rounded-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                          ) : (
                            "Place Your Order"
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-indigo-700/60 mt-4 leading-relaxed">
                        By placing your order, you agree to ShopMate's privacy notice and conditions of use. 
                        Your personal data will be used to process your order, support your experience throughout this website.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-medium">Follow steps 1 & 2 to review your items</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="relative">
            <div className="lg:sticky lg:top-28 space-y-6">
              <div className="bg-white rounded-2xl ring-1 ring-gray-200 shadow-sm p-8">
                <button 
                  onClick={step === 3 ? handlePlaceOrder : () => {}}
                  disabled={loading || step < 3}
                  className={`w-full py-4 mb-6 rounded-xl font-extrabold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                    step === 3 
                    ? 'bg-yellow-400 hover:bg-yellow-500 text-black' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                   {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  ) : (
                    "Place Your Order"
                  )}
                </button>
                
                <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                  Order Summary
                </h3>
                
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between text-gray-600">
                    <span>Items:</span>
                    <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total before tax:</span>
                    <span className="text-gray-900 font-bold">${(totalPrice + shipping).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-b pb-4">
                    <span>Estimated Tax (18%):</span>
                    <span className="text-gray-900 font-bold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-extrabold text-red-700">Order Total:</span>
                    <span className="text-2xl font-black text-red-700">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-3">
                <div className="bg-green-50 rounded-2xl p-4 flex gap-4 border border-green-100">
                  <ShieldCheck className="w-6 h-6 text-green-600 shrink-0" />
                  <p className="text-xs text-green-800 leading-relaxed font-bold">
                    100% Secure Checkout
                    <span className="block font-normal mt-1 opacity-70">SSL Encrypted Payment & Secure Processing</span>
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-2xl p-4 flex gap-4 border border-indigo-100">
                  <CheckCircle2 className="w-6 h-6 text-indigo-600 shrink-0" />
                  <p className="text-xs text-indigo-800 leading-relaxed font-bold">
                    Easy Tracking
                    <span className="block font-normal mt-1 opacity-70">Real-time order tracking available right after checkout</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;