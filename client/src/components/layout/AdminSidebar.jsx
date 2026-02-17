import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Layers, Users, LogOut, Store } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
    { name: "Categories", path: "/admin/categories", icon: Layers },
    { name: "Users", path: "/admin/users", icon: Users },
  ];

  return (
    <div className="w-64 bg-white border-r border-surface-200 min-h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="h-20 flex items-center px-8 border-b border-surface-100">
        <div className="flex items-center gap-2 text-primary-600">
             <div className="bg-primary-600 rounded-lg p-1.5 ">
                 <Store className="w-5 h-5 text-white" />
             </div>
             <span className="text-xl font-display font-bold text-slate-900 tracking-tight">Admin<span className="text-primary-600">Panel</span></span>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</p>
        
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
        <div className="mb-4 px-4">
            <Link to="/" className="text-sm font-medium text-slate-500 hover:text-primary-600 flex items-center gap-2 transition-colors">
                &larr; Back to Shop
            </Link>
        </div>
        <button 
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
        >
            <LogOut className="w-5 h-5" />
            Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
