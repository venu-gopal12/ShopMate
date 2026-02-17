import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api"; // Assuming you have an API utility
import { AuthContext } from "../../context/AuthContext";
import { toast } from "sonner";
import { Store, ArrowRight, CheckCircle } from "lucide-react";

const SellerRegister = () => {
    const [shopName, setShopName] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, login } = useContext(AuthContext); // Assuming login refreshes user or we manually update
    const navigate = useNavigate();

    // If already a seller, redirect
    if (user && user.role === 'seller') {
        if (user.isSellerApproved) return <Navigate to="/seller/dashboard" />;
        // If pending, SellerRoute handles it, but here we can just show message or redirect to dashboard which will show pending
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post("/seller/register", { shopName });
            toast.success("Application Submitted Successfully!");
            
            // Ideally validation/refresh of user context is needed here.
            // Since we updated the user on backend, the JWT might be stale if role is in token.
            // If role is in DB and we fetch profile on load, a refresh should work.
            // Force a reload or profile fetch.
            
            // Temporary: Redirect to login or home
             navigate("/");
             window.location.reload(); // Simple way to refresh context
             
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200">
                        <Store className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">
                    Become a Seller
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 font-medium">
                    Start selling your products to millions of customers today.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-6 shadow-2xl shadow-gray-200/50 rounded-3xl sm:px-12 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="shopName" className="block text-sm font-bold text-gray-700 mb-2">
                                Shop Name
                            </label>
                            <div className="mt-1 relative rounded-xl shadow-sm">
                                <input
                                    id="shopName"
                                    name="shopName"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all font-medium"
                                    placeholder="e.g. Acme Innovations"
                                    value={shopName}
                                    onChange={(e) => setShopName(e.target.value)}
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500 font-medium flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Publicly visible to customers
                            </p>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Submit Application
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                    
                     <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Already have a customer account?</span>
                            </div>
                        </div>
                         <div className="mt-6 text-center">
                            <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-bold">
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRegister;
