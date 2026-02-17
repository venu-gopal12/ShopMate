import { useState, useEffect } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { toast } from "sonner";
import { DollarSign, ShoppingBag, TrendingUp, Users, ArrowUpRight, Filter, ChevronDown, Clock, Store } from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
      try {
          await API.put(`/orders/${id}`, { orderStatus: status });
          setOrders(orders.map(o => o._id === id ? { ...o, orderStatus: status } : o));
          toast.success(`Order status updated to ${status}`);
      } catch (err) {
          toast.error("Failed to update status");
      }
  };

  const [statusFilter, setStatusFilter] = useState('all');

  // Filter Logic
  const filteredOrders = orders.filter(order => {
      if (statusFilter === 'all') return true;
      return order.orderStatus === statusFilter;
  });

  const totalSales = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const avgOrder = orders.length > 0 ? (totalSales / orders.length) : 0;
  const pendingOrders = orders.filter(o => o.orderStatus === 'processing').length;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Orders</h1>
              <p className="text-gray-500 mt-1 font-medium">Monitor and update customer orders in real-time.</p>
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
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <Filter className="w-4 h-4" />
              </div>
           </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 bg-indigo-50/50 rounded-bl-3xl">
                 <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Total Sales</p>
              <h3 className="text-3xl font-black text-gray-900">${totalSales.toFixed(2)}</h3>
              <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-bold">
                 <div className="p-1 bg-green-100 rounded-lg">
                    <ArrowUpRight className="w-3 h-3" />
                 </div>
                 <span>+12.5%</span>
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-indigo-50/50 rounded-bl-3xl">
                 <ShoppingBag className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Total Orders</p>
              <h3 className="text-3xl font-black text-gray-900">{orders.length}</h3>
              <div className="mt-4 flex items-center gap-2 text-indigo-600 text-sm font-bold font-medium opacity-60">
                 <span>Active platform orders</span>
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-indigo-50/50 rounded-bl-3xl">
                 <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Avg Order Value</p>
              <h3 className="text-3xl font-black text-gray-900">${avgOrder.toFixed(2)}</h3>
              <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm font-bold font-medium opacity-60 text-xs">
                 <span>Per customer session</span>
              </div>
           </div>

           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 bg-indigo-50/50 rounded-bl-3xl">
                 <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Pending Action</p>
              <h3 className="text-3xl font-black text-gray-900 text-orange-600">{pendingOrders}</h3>
              <div className="mt-4 flex items-center gap-2 text-orange-600 text-sm font-bold">
                 <span>Requires attention</span>
              </div>
           </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
             <p className="mt-4 text-gray-500 font-bold">Synchronizing orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
            <table className="min-w-full divide-y divide-gray-100">
              {/* Table Content... */}
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                   <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Shops</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                       <span className="font-mono text-xs font-bold text-gray-400">#</span>
                       <span className="font-mono text-xs font-bold text-gray-900 tracking-tighter">{order._id.slice(-8)}</span>
                       <div className="text-[10px] text-gray-400 mt-1 font-medium">
                           {new Date(order.createdAt).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs">
                             {order.user?.name ? order.user.name[0] : 'U'}
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-gray-700">{order.user?.name || "Unknown"}</span>
                            <span className="text-xs text-gray-400">{order.user?.email}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                            {Array.from(new Set(order.items.map(i => i.seller?.shopName || "Unknown"))).map((shop, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                    <Store className="w-3 h-3 mr-1" />
                                    {shop}
                                </span>
                            ))}
                        </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-gray-900">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                       <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                           order.orderStatus === 'completed' 
                           ? 'bg-green-100 text-green-700' 
                           : order.orderStatus === 'shipped'
                           ? 'bg-purple-100 text-purple-700'
                           : order.orderStatus === 'active' 
                           ? 'bg-blue-100 text-blue-700'
                           : 'bg-orange-100 text-orange-700'
                       }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                       <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg ${
                          order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600 ring-1 ring-green-200' : 'bg-orange-50 text-orange-600 ring-1 ring-orange-200'
                       }`}>
                         {order.paymentStatus.toUpperCase()}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-900">No Orders Found</h3>
             <p className="text-gray-500 mt-2">Any customer orders will appear here.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrders;