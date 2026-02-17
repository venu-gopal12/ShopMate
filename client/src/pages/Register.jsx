import { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Store, ArrowRight, Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { user, register } = useContext(AuthContext);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);
      register(res.data);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (user) return <Navigate to="/" />;

  return (
    <div className="flex min-h-screen bg-surface-50">
      {/* Right Side - Visual (Swapped for variety or keep same side? Keeping consistent structure allows reuse, but swapping is fun. Let's keep Left generic visual for consistency) */}
       <div className="hidden lg:flex w-1/2 bg-primary-900 relative overflow-hidden items-center justify-center">
         <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 to-primary-900/90 z-10" />
         <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Fashion"
            className="absolute inset-0 w-full h-full object-cover"
         />
         <div className="relative z-20 p-12 text-white max-w-xl">
             <div className="flex items-center gap-3 mb-8">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <Store className="w-8 h-8 text-primary-300" />
                </div>
                <h1 className="text-3xl font-display font-bold">ShopMate</h1>
             </div>
             <p className="text-5xl font-display font-bold leading-tight mb-6">
                 Join the community.
             </p>
             <p className="text-xl text-primary-100 font-light leading-relaxed">
                 Create your account today and get access to exclusive deals, personalized recommendations, and faster checkout.
             </p>
         </div>
      </div>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-display font-bold text-slate-900">Create Account</h2>
                <p className="mt-2 text-slate-600">Start your journey with us today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Full Name</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                            <User className="w-5 h-5" />
                        </div>
                        <input
                            name="name"
                            type="text"
                            required
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                            placeholder="John Doe"
                            onChange={handleChange}
                            value={form.name}
                        />
                    </div>
                </div>

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
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">Password</label>
                    <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-600 transition-colors">
                            <Lock className="w-5 h-5" />
                        </div>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                            placeholder="Create a strong password"
                            onChange={handleChange}
                            value={form.password}
                        />
                    </div>
                    <p className="mt-2 text-xs text-slate-500 ml-1">Must be at least 8 characters.</p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center py-4 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                     {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Create Account
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-sm font-medium text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 hover:underline">
                    Sign in here
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
