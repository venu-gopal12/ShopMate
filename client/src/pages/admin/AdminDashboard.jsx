import { useState, useEffect } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/admin/stats");
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: "Total Revenue", value: `$${stats.totalSales.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12.5%" },
        { title: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50", trend: "+5.2%" },
        { title: "Active Users", value: stats.totalUsers, icon: Users, color: "text-purple-600", bg: "bg-purple-50", trend: "+8.1%" },
        { title: "Products", value: stats.totalProducts, icon: Package, color: "text-orange-600", bg: "bg-orange-50", trend: "+2.4%" },
    ];

    return (
        <div className="flex min-h-screen bg-surface-50">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-slate-900">Dashboard Overview</h1>
                    <p className="text-slate-500 font-medium">Welcome back, here's what's happening today.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            {cards.map((card, index) => (
                                <div key={index} className="bg-white p-6 rounded-3xl border border-surface-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-2xl ${card.bg}`}>
                                            <card.icon className={`h-6 w-6 ${card.color}`} />
                                        </div>
                                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                            <TrendingUp className="w-3 h-3" />
                                            {card.trend}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                                        <h3 className="text-3xl font-display font-bold text-slate-900 mt-1">{card.value}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
                            <div className="px-8 py-6 border-b border-surface-100 flex justify-between items-center">
                                <h3 className="text-xl font-display font-bold text-slate-900">Recent Orders</h3>
                                <button className="text-sm font-bold text-primary-600 hover:text-primary-700">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-surface-100">
                                    <thead className="bg-surface-50">
                                        <tr>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                            <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-surface-100">
                                        {stats.recentOrders.map(order => (
                                            <tr key={order._id} className="hover:bg-surface-50/50 transition-colors">
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <span className="font-mono text-sm font-bold text-primary-600">#{order._id.slice(-6)}</span>
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                                                          {order.user?.name?.[0] || 'U'}
                                                       </div>
                                                       <span className="text-sm font-bold text-slate-700">{order.user?.name || "Unknown"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-slate-900">${order.totalAmount.toFixed(2)}</td>
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full 
                                                        ${order.orderStatus === 'completed' ? 'bg-green-100 text-green-700' : 
                                                          order.orderStatus === 'active' ? 'bg-blue-100 text-blue-700' : 
                                                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-primary-600 hover:text-primary-800 font-bold">Details</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
