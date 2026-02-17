import { useState, useEffect } from "react";
import API from "../../api/api";
import SellerSidebar from "../../components/layout/SellerSidebar";
import { DollarSign, ShoppingBag, Package, TrendingUp, ArrowUpRight } from "lucide-react";

const SellerDashboard = () => {
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get("/seller/analytics");
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="flex min-h-screen bg-surface-50">
            <SellerSidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-slate-500 mt-1 font-medium">Welcome back, here's what's happening with your store.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                     /* Stats Grid */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-3xl border border-surface-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 p-3 bg-primary-50 rounded-bl-3xl">
                                <DollarSign className="w-6 h-6 text-primary-600" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Total Sales</p>
                            <h3 className="text-3xl font-display font-bold text-slate-900">${stats.totalSales.toFixed(2)}</h3>
                            <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-bold">
                                <div className="p-1 bg-emerald-100 rounded-lg">
                                    <ArrowUpRight className="w-3 h-3" />
                                </div>
                                <span>Revenue</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-surface-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 p-3 bg-blue-50 rounded-bl-3xl">
                                <ShoppingBag className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Total Orders</p>
                            <h3 className="text-3xl font-display font-bold text-slate-900">{stats.totalOrders}</h3>
                            <div className="mt-4 flex items-center gap-2 text-blue-600 text-sm font-bold opacity-80">
                                <span>Orders to fulfill</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-surface-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 right-0 p-3 bg-orange-50 rounded-bl-3xl">
                                <Package className="w-6 h-6 text-orange-600" />
                            </div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Active Products</p>
                            <h3 className="text-3xl font-display font-bold text-slate-900">{stats.totalProducts}</h3>
                            <div className="mt-4 flex items-center gap-2 text-orange-600 text-sm font-bold opacity-80">
                                <span>Listed items</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SellerDashboard;
