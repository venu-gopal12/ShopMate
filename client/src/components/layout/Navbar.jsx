import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { ShoppingCart, User, Menu, X, Store, LogOut, Heart, Package, Settings, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart, setIsCartOpen } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [profileOpen, setProfileOpen] = useState(false);
  
  // Profile dropdown timer
  let profileTimer;

  const handleProfileEnter = () => {
    if (profileTimer) clearTimeout(profileTimer);
    setProfileOpen(true);
  };

  const handleProfileLeave = () => {
    profileTimer = setTimeout(() => {
      setProfileOpen(false);
    }, 150); // 150ms delay for smoother UX
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cartItemsCount = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`text-sm font-medium transition-all duration-200 ${
          isActive 
            ? "text-primary-600 font-semibold" 
            : "text-slate-600 hover:text-primary-600"
        }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100" 
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg group-hover:bg-primary-700 transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-2xl font-display font-bold text-slate-900 tracking-tight group-hover:text-primary-600 transition-colors">
              ShopMate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            
            {user && user.role === 'admin' && (
              <NavLink to="/admin/products">Admin Dashboard</NavLink>
            )}
            
            {user && user.role === 'seller' && (
              <NavLink to="/seller/dashboard">Seller Dashboard</NavLink>
            )}
            
            {user && user.role === 'user' && (
               <Link 
                 to="/seller/register" 
                 className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
               >
                  <Store className="w-4 h-4" />
                  Become a Seller
               </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-colors group"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover:text-slate-900 transition-colors" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {user ? (
              <div 
                className="relative"
                onMouseEnter={handleProfileEnter}
                onMouseLeave={handleProfileLeave}
              >
                <button className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full border transition-all ${
                    profileOpen ? 'bg-white border-primary-200 shadow-sm ring-2 ring-primary-50' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}>
                   <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                      {user.name?.[0] || 'U'}
                   </div>
                   <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">{user.name}</span>
                   <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown */}
                <div 
                  className={`absolute right-0 top-full pt-2 w-64 transition-all duration-200 origin-top-right z-50 ${
                    profileOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-1 ring-1 ring-black/5">
                    <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    
                    <div className="py-2 space-y-0.5">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-lg mx-1 transition-colors">
                        <Settings className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-lg mx-1 transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-pink-600 rounded-lg mx-1 transition-colors">
                        <Heart className="w-4 h-4" /> Wishlist
                      </Link>
                    </div>

                    <div className="pt-2 pb-1 mt-1 border-t border-slate-50">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg mx-1 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                  Log in
                </Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-lg shadow-slate-900/20">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
             <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl">
          <div className="px-4 py-6 space-y-3">
            <Link to="/" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-xl">
              Home
            </Link>
            
            {user ? (
              <>
                 <div className="px-4 py-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
                 </div>
                 <Link to="/profile" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-xl">
                    Profile Settings
                 </Link>
                 <Link to="/orders" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-xl">
                    My Orders
                 </Link>
                 <Link to="/wishlist" className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary-600 rounded-xl">
                    My Wishlist
                 </Link>
                 
                 {user.role === 'admin' && (
                    <Link to="/admin/products" className="block px-4 py-3 text-base font-medium text-primary-600 bg-primary-50 rounded-xl">
                      Admin Dashboard
                    </Link>
                 )}
                 
                 {user.role === 'seller' && (
                    <Link to="/seller/dashboard" className="block px-4 py-3 text-base font-medium text-primary-600 bg-primary-50 rounded-xl">
                      Seller Dashboard
                    </Link>
                 )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <Link to="/login" className="block w-full text-center py-3 text-slate-700 font-bold border border-slate-200 rounded-xl hover:bg-slate-50">
                  Log in
                </Link>
                <Link to="/register" className="block w-full text-center py-3 text-white font-bold bg-primary-600 rounded-xl hover:bg-primary-700">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
