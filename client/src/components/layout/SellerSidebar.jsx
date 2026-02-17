import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Store } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const SellerSidebar = () => {
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const links = [
      { name: "Dashboard", path: "/seller/dashboard", icon: LayoutDashboard },
      { name: "My Products", path: "/seller/products", icon: Package },
      { name: "Orders", path: "/seller/orders", icon: ShoppingCart },
  ];

  return (
    <aside className="w-64 bg-white border-r border-surface-200 min-h-screen fixed left-0 top-0 z-30 flex flex-col">
      <div className="p-8 pb-4 h-24 flex items-center">
        <Link to="/" className="flex items-center gap-3 group translate-y-[-4px]">
             <div className="bg-primary-600 rounded-xl p-2.5 shadow-lg shadow-primary-600/20 group-hover:scale-105 transition-all">
                 <Store className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-display font-bold text-slate-900 tracking-tight leading-none">Seller Hub</h1>
                <p className="text-xs font-semibold text-slate-400 mt-1 truncate max-w-[120px]">{user?.shopName || "My Shop"}</p>
             </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Manage Store</p>
        
        {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    active 
                    ? "bg-primary-50 text-primary-700 font-bold shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-colors ${active ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                  {link.name}
                </Link>
            );
        })}
      </nav>

      <div className="p-4 border-t border-surface-100">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SellerSidebar;
