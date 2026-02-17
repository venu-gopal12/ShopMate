import { useState, useEffect } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { toast } from "sonner";
import { Users, Trash2, CheckCircle, XCircle, Store, Shield, Clock } from "lucide-react";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, sellers, pending

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await API.get("/users"); // Admin route
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await API.delete(`/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
                toast.success("User deleted");
            } catch (err) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleApproveSeller = async (id) => {
        try {
            const res = await API.put(`/users/${id}/approve-seller`);
            setUsers(users.map(u => u._id === id ? res.data.user : u));
            toast.success("Seller approved successfully");
        } catch (err) {
            toast.error("Failed to approve seller");
        }
    };

    const handleRejectSeller = async (id) => {
        if (window.confirm("Reject this seller application? User will revert to standard customer role.")) {
            try {
                const res = await API.put(`/users/${id}/reject-seller`);
                setUsers(users.map(u => u._id === id ? res.data.user : u));
                toast.success("Seller application rejected");
            } catch (err) {
                toast.error("Failed to reject seller");
            }
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === "all") return true;
        if (filter === "customers") return user.role === "user";
        if (filter === "sellers") return user.role === "seller";
        if (filter === "pending") return user.role === "seller" && !user.isSellerApproved;
        return true;
    });

    return (
        <div className="flex min-h-screen bg-surface-50">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">User Management</h1>
                        <p className="text-slate-500 mt-1 font-medium">Manage customers, sellers, and system access.</p>
                    </div>
                    
                    <div className="relative">
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none flex items-center gap-2 px-6 py-3 bg-white border border-surface-200 rounded-xl shadow-sm hover:bg-surface-50 transition-all font-bold text-slate-700 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                        >
                            <option value="all">All Users</option>
                            <option value="customers">Customers Only</option>
                            <option value="sellers">All Sellers</option>
                            <option value="pending">Pending Approvals</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                             <CheckCircle className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-surface-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-surface-100">
                            <thead className="bg-surface-50">
                                <tr>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                    <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-surface-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-surface-50/50 transition-colors">
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                 <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                                     {user.name?.[0] || 'U'}
                                                 </div>
                                                 <div>
                                                     <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                                     <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                                 </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {user.role === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-700">
                                                        <Shield className="w-3 h-3" /> Admin
                                                    </span>
                                                ) : user.role === 'seller' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700">
                                                        <Store className="w-3 h-3" /> Seller
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">
                                                        <Users className="w-3 h-3" /> Customer
                                                    </span>
                                                )}
                                                
                                                {user.role === 'seller' && (
                                                    <span className="text-xs text-slate-400 font-bold">
                                                        ({user.shopName || "No Shop Name"})
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap">
                                            {user.role === 'seller' ? (
                                                user.isSellerApproved ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                                        <CheckCircle className="w-3 h-3" /> Verified Shop
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg animate-pulse">
                                                        <Clock className="w-3 h-3" /> Pending Approval
                                                    </span>
                                                )
                                            ) : (
                                                <span className="text-xs font-bold text-slate-300">-</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.role === 'seller' && !user.isSellerApproved && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleApproveSeller(user._id)}
                                                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Approve Seller"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRejectSeller(user._id)}
                                                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Reject Application"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {user.role !== 'admin' && (
                                                     <button 
                                                        onClick={() => handleDelete(user._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete User"
                                                     >
                                                        <Trash2 className="w-4 h-4" />
                                                     </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminUsers;
