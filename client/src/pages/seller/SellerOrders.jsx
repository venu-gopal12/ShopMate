import { useContext, useState } from "react";
import SellerSidebar from "../../components/layout/SellerSidebar";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useSellerOrders } from "../../hooks/useSellerOrders";

const SellerOrders = () => {
    const { orders, loading, updateItemStatus, isUpdating } = useSellerOrders();
    const { user } = useContext(AuthContext);
    const [statusFilter, setStatusFilter] = useState('all');

    // Helper to get items belonging to this seller in an order
    const getMyItems = (order) => {
        if (!user?._id) return [];
        return order.items.filter(item => {
            const sellerId = item.seller?._id || item.seller;
            return sellerId?.toString() === user._id.toString();
        }); 
    };

    // Filter Logic
    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true;
        // Check if ANY of my items in this order match the status
        const myItems = getMyItems(order);
        return myItems.some(item => item.status === statusFilter);
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'completed':
            case 'delivered': return 'bg-green-100 text-green-700 ring-green-200';
            case 'shipped': return 'bg-purple-100 text-purple-700 ring-purple-200';
            case 'cancelled': return 'bg-red-100 text-red-700 ring-red-200';
            case 'returned': return 'bg-gray-100 text-gray-700 ring-gray-200';
            default: return 'bg-orange-100 text-orange-700 ring-orange-200'; // processing
        }
    };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
              <p className="text-gray-500 mt-1 font-medium">Manage and fulfill orders for your products</p>
           </div>
           
           <div className="relative">
              <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50 transition-all font-bold text-gray-700 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <ChevronDown className="w-4 h-4" />
              </div>
           </div>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-900">No Orders Found</h3>
             <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
          </div>
        ) : (
             <div className="space-y-6">
                 {filteredOrders.map(order => {
                     const myItems = getMyItems(order);
                     const orderTotalForMe = myItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

                     return (
                         <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                             {/* Order Header */}
                             <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                                 <div className="flex gap-6 items-center">
                                     <div>
                                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order #</p>
                                         <p className="font-mono text-sm font-bold text-gray-900">{order._id.slice(-8)}</p>
                                     </div>
                                     <div>
                                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</p>
                                         <div className="flex items-center gap-2">
                                             <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                                                 {order.user?.name?.[0] || 'U'}
                                             </div>
                                             <p className="text-sm font-bold text-gray-700">{order.user?.name || 'Unknown'}</p>
                                         </div>
                                     </div>
                                      <div>
                                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                                         <p className="text-sm font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                                     </div>
                                 </div>
                                 <div>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Your Earnings</p>
                                      <p className="text-xl font-black text-indigo-600">${orderTotalForMe.toFixed(2)}</p>
                                 </div>
                             </div>

                             {/* Order Items Table */}
                             <div className="p-0">
                                 <table className="w-full">
                                     <thead className="bg-gray-50/30">
                                         <tr>
                                             <th className="px-8 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Item</th>
                                             <th className="px-8 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                                             <th className="px-8 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                                             <th className="px-8 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                                             <th className="px-8 py-3 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-gray-50">
                                         {myItems.map(item => (
                                             <tr key={item.product._id}>
                                                 <td className="px-8 py-4">
                                                     <div className="flex items-center gap-4">
                                                         <div className="w-12 h-12 rounded-lg border border-gray-100 overflow-hidden bg-gray-50">
                                                             <img src={item.product.image || "https://placehold.co/100"} className="w-full h-full object-cover" alt="" />
                                                         </div>
                                                         <span className="text-sm font-bold text-gray-900">{item.product.name}</span>
                                                     </div>
                                                 </td>
                                                 <td className="px-8 py-4 text-sm font-medium text-gray-600">${item.product.price}</td>
                                                 <td className="px-8 py-4 text-sm font-bold text-gray-900">{item.quantity}</td>
                                                 <td className="px-8 py-4 text-sm font-bold text-indigo-600">${(item.product.price * item.quantity).toFixed(2)}</td>
                                                 <td className="px-8 py-4">
                                                     {item.status === 'cancellation_requested' ? (
                                                        <div className="flex flex-col gap-2">
                                                             <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-1 rounded-lg text-center">
                                                                 Cancellation Requested
                                                             </span>
                                                             <div className="flex gap-2">
                                                                 <button 
                                                                    onClick={() => updateItemStatus(order._id, item.product._id, 'cancelled')}
                                                                    disabled={isUpdating(order._id, item.product._id)}
                                                                    className="flex-1 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                                                    title="Approve Cancellation"
                                                                 >
                                                                     {isUpdating(order._id, item.product._id) ? "..." : "Approve"}
                                                                 </button>
                                                                 <button 
                                                                    onClick={() => updateItemStatus(order._id, item.product._id, 'processing')}
                                                                    disabled={isUpdating(order._id, item.product._id)}
                                                                    className="flex-1 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                                    title="Reject Request"
                                                                 >
                                                                     Reject
                                                                 </button>
                                                             </div>
                                                         </div>
                                                     ) : item.status === 'return_requested' ? (
                                                        <div className="flex flex-col gap-2">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-2 py-1 rounded-lg text-center">
                                                                Return Requested
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <button 
                                                                   onClick={() => updateItemStatus(order._id, item.product._id, 'returned')}
                                                                   disabled={isUpdating(order._id, item.product._id)}
                                                                   className="flex-1 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                                                   title="Approve Return"
                                                                >
                                                                    {isUpdating(order._id, item.product._id) ? "..." : "Approve"}
                                                                </button>
                                                                <button 
                                                                   onClick={() => updateItemStatus(order._id, item.product._id, 'delivered')}
                                                                   disabled={isUpdating(order._id, item.product._id)}
                                                                   className="flex-1 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                                                   title="Reject Return"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </div>
                                                     ) : (
                                                         <div className="relative inline-block">
                                                            <select 
                                                              value={item.status || 'processing'}
                                                              onChange={(e) => updateItemStatus(order._id, item.product._id, e.target.value)}
                                                              disabled={item.status === 'cancelled' || item.status === 'delivered' || isUpdating(order._id, item.product._id)}
                                                              className={`appearance-none block w-full pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 ring-1 ${getStatusColor(item.status || 'processing')} disabled:opacity-50`}
                                                            >
                                                                <option value="processing">Processing</option>
                                                                <option value="shipped">Shipped</option>
                                                                <option value="delivered">Delivered</option>
                                                                <option value="cancelled">Cancelled</option>
                                                                <option value="returned">Returned</option>
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                                                               {isUpdating(order._id, item.product._id) ? (
                                                                   <div className="animate-spin h-3 w-3 border-b-2 border-current rounded-full" />
                                                               ) : (
                                                                   <ChevronDown className="h-3 w-3" />
                                                               )}
                                                            </div>
                                                           </div>
                                                     )}
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                     );
                 })}
             </div>
        )}
      </main>
    </div>
  );
};

export default SellerOrders;
