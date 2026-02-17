import { useEffect, useState } from "react";
import API from "../api/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import OrderTimeline from "../components/orders/OrderTimeline";
import { Truck, Package, MapPin, XCircle, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTimeline, setActiveTimeline] = useState(null);
  
  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewType, setReviewType] = useState('product'); // 'product' or 'seller'
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const mapStatus = (status) => {
    const s = status?.toLowerCase();
    if (s === 'processing') return 'processing';
    if (s === 'shipped') return 'shipped';
    if (s === 'completed' || s === 'delivered') return 'delivered';
    return 'processing'; // Default for cancelled orders too
  };

  const handleRequestCancellation = async (orderId, itemId) => {
    if (!window.confirm("Request cancellation/return for this item?")) return;
    try {
        const res = await API.put(`/orders/${orderId}/items/${itemId}/cancel-request`);
        setOrders(orders.map(o => o._id === orderId ? res.data.order : o));
        toast.success("Cancellation requested");
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to request cancellation");
    }
  };

  const openReviewModal = (item) => {
      setReviewItem(item);
      setReviewModalOpen(true);
      setRating(5);
      setComment("");
      setReviewType('product');
  };

  const handleSubmitReview = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
          if (reviewType === 'product') {
              await API.post(`/products/${reviewItem.product._id}/review`, { rating, comment });
              toast.success("Product review submitted!");
          } else {
             if (!reviewItem.seller || !reviewItem.seller._id) {
                 toast.error("Seller info missing");
                 return;
             }
             await API.post(`/seller/${reviewItem.seller._id}/review`, { rating, comment });
             toast.success("Seller review submitted!");
          }
          setReviewModalOpen(false);
      } catch (err) {
          toast.error(err.response?.data?.message || "Failed to submit review");
      } finally {
          setSubmitting(false);
      }
  };

  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'active') { // Custom filter for non-completed
          return order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled';
      }
      return order.orderStatus === statusFilter;
  });

  if (loading) return <div className="text-center py-10">Loading orders...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            
            <div className="relative">
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-bold text-gray-700 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="all">All Orders</option>
                    <option value="active">Active Orders</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
             <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
             <p className="text-gray-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Order ID</p>
                    <p className="font-mono text-sm text-gray-900">{order._id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                      <ul className="divide-y divide-gray-200">
                        {order.items.map((item) => (
                          <div key={item._id} className="py-4">
                              <div className="flex justify-between items-start group">
                                <div className="flex items-center gap-4">
                                   <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 shrink-0">
                                      <img 
                                        src={item.product?.image || "https://placehold.co/100"} 
                                        alt={item.product?.name}
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    </div>
                                   <div>
                                      <p className="font-bold text-gray-900 text-lg">{item.product?.name || "Product"}</p>
                                      <p className="text-sm text-gray-500 mb-1">Unit Price: ${item.product?.price || '0.00'}</p>
                                      {item.seller && <p className="text-xs text-indigo-600 font-medium bg-indigo-50 inline-block px-2 py-0.5 rounded-md">Sold by: {item.seller.shopName || "Seller"}</p>}
                                   </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-gray-900 mb-2">x{item.quantity}</span>
                                    
                                        <div className="flex flex-col gap-2 items-end">
                                            {/* Status Badge */}
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                                                item.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                item.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                                item.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                item.status === 'returned' ? 'bg-gray-100 text-gray-700' :
                                                item.status === 'return_requested' ? 'bg-orange-100 text-orange-700' :
                                                item.status === 'cancellation_requested' ? 'bg-orange-100 text-orange-700' :
                                                'bg-blue-100 text-blue-700' // processing
                                            }`}>
                                                {item.status?.replace('_', ' ') || 'Processing'}
                                            </span>

                                            <button 
                                              onClick={() => setActiveTimeline(activeTimeline === item._id ? null : item._id)}
                                              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                                                  activeTimeline === item._id 
                                                  ? 'bg-gray-100 text-gray-600 border-gray-200' 
                                                  : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'
                                              }`}
                                            >
                                              <Truck className="w-3 h-3" />
                                              {activeTimeline === item._id ? 'Close Tracking' : 'Track Package'}
                                            </button>

                                            {item.status === 'processing' && (
                                                <button 
                                                    onClick={() => handleRequestCancellation(order._id, item._id)}
                                                    className="px-3 py-1 text-xs font-bold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                                                >
                                                    <XCircle className="w-3 h-3" />
                                                    Request Cancel
                                                </button>
                                            )}

                                            {item.status === 'delivered' && (
                                                <button 
                                                    onClick={() => handleRequestCancellation(order._id, item._id)}
                                                    className="px-3 py-1 text-xs font-bold rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-1"
                                                >
                                                    <XCircle className="w-3 h-3" />
                                                    Return Item
                                                </button>
                                            )}
                                            
                                            {item.status === 'delivered' && (
                                                <button 
                                                    onClick={() => openReviewModal(item)}
                                                    className="px-3 py-1 text-xs font-bold rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1"
                                                >
                                                    <Star className="w-3 h-3" />
                                                    Leave Review
                                                </button>
                                            )}
                                        </div>
                                </div>
                              </div>
                              
                              {/* Item Timeline */}
                              {activeTimeline === item._id && (
                                <div className="mt-6 pl-4 border-l-2 border-indigo-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <OrderTimeline status={mapStatus(item.status)} />
                                </div>
                              )}
                          </div>
                        ))}
                      </ul>
                      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <strong>Shipping to:</strong> {order.address}
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Amount</p>
                          <p className="text-3xl font-black text-indigo-600">${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {reviewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-gray-900">Write a Review</h3>
                        <button onClick={() => setReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setReviewType('product')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                                    reviewType === 'product' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Product Review
                            </button>
                            <button 
                                onClick={() => setReviewType('seller')}
                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                                    reviewType === 'seller' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Seller Review
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-6 flex justify-center">
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`focus:outline-none transition-transform hover:scale-110 ${
                                                rating >= star ? "text-yellow-400" : "text-gray-200"
                                            }`}
                                        >
                                            <Star className={`w-10 h-10 ${rating >= star ? "fill-current" : ""}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {reviewType === 'product' ? `Attributes for ${reviewItem?.product?.name}` : `Experience with ${reviewItem?.seller?.shopName || 'Seller'}`}
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                                    rows="4"
                                    placeholder={reviewType === 'product' ? "How was the quality? Did it match the description?" : "How was the packaging? Was it shipped on time?"}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <MessageSquare className="w-5 h-5" />
                                        Submit {reviewType === 'product' ? 'Product' : 'Seller'} Review
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;