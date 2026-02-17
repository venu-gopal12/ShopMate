import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Store, ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      if (res.data.user.role === "admin") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" />;

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-slate-900/90 z-10" />
         <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Shopping Experience"
            className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="relative z-20 p-12 text-white max-w-xl">
             <div className="flex items-center gap-3 mb-8">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <Store className="w-8 h-8 text-primary-400" />
                </div>
                <h1 className="text-3xl font-display font-bold">ShopMate</h1>
             </div>
             <p className="text-5xl font-display font-bold leading-tight mb-6">
                 Discover the future of shopping.
             </p>
             <p className="text-xl text-slate-300 font-light leading-relaxed">
                 Join thousands of users experiencing the most seamless and premium e-commerce platform.
             </p>
         </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-display font-bold text-slate-900">Welcome back</h2>
                <p className="mt-2 text-slate-600">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                placeholder="name@company.com"
                                onChange={handleChange}
                                value={form.email}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5 ml-1">
                             <label className="block text-sm font-medium text-slate-700">Password</label>
                             <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot password?</a>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                placeholder="••••••••"
                                onChange={handleChange}
                                value={form.password}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-4 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Signing in...
                        </>
                    ) : (
                        <>
                            Sign in
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-sm font-medium text-slate-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 hover:underline">
                    Create free account
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
