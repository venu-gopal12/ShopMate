import { useState, useEffect } from "react";
import API from "../../api/api";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { Edit, Trash2, Plus, Search, Filter, X } from "lucide-react";
import { toast } from "sonner";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
      name: "",
      price: "",
      description: "",
      category: "",
      stock: "",
      image: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        API.get("/products"),
        API.get("/category")
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleEdit = (product) => {
      setEditingProduct(product);
      setFormData({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category?._id || product.category, // Handle populated or ID
          stock: product.stock,
          image: product.image
      });
      setShowModal(true);
  };

  const handleCreate = () => {
      setEditingProduct(null);
      setFormData({ name: "", price: "", description: "", category: "", stock: "", image: "" });
      setShowModal(true);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          if (editingProduct) {
              const res = await API.put(`/products/${editingProduct._id}`, formData);
              setProducts(products.map(p => p._id === editingProduct._id ? res.data.product : p));
              toast.success("Product updated successfully");
          } else {
              const res = await API.post("/products", formData);
              setProducts([...products, res.data.product]);
              toast.success("Product created successfully");
          }
          setShowModal(false);
      } catch (err) {
          console.error("Operation failed", err);
          toast.error("Failed to save product.");
      }
  };

  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
              <h1 className="text-3xl font-display font-bold text-slate-900">Manage Products</h1>
              <p className="text-slate-500 font-medium mt-1">Add, edit, or remove products from the catalog.</p>
          </div>
          <button 
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 font-bold"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Filters / Search Bar placeholder */}
        <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-12 pr-4 py-3 bg-white border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                />
            </div>
             <button className="flex items-center gap-2 px-4 py-3 bg-white border border-surface-200 rounded-xl font-bold text-slate-600 hover:bg-surface-50 transition-colors">
                <Filter className="w-5 h-5" />
                Filter
            </button>
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
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-8 py-5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-100">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl border border-surface-200 overflow-hidden bg-surface-100">
                          <img className="h-full w-full object-cover" src={product.image || "https://placehold.co/100"} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">{product.name}</div>
                          <div className="text-xs text-slate-500 font-medium line-clamp-1 max-w-[200px]">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">${product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-lg ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-red-50 text-red-700 ring-1 ring-red-100'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                     <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                        {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(product)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="px-8 py-6 border-b border-surface-100 bg-surface-50/50 flex justify-between items-center">
                    <h2 className="text-xl font-display font-bold text-slate-900">{editingProduct ? "Edit Product" : "New Product"}</h2>
                    <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-5">
                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Product Name</label>
                            <input 
                                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" 
                                placeholder="e.g. Wireless Headphones" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                         </div>

                        <div className="grid grid-cols-2 gap-5">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Price ($)</label>
                                <input 
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" 
                                    type="number"
                                    placeholder="0.00" 
                                    value={formData.price} 
                                    onChange={e => setFormData({...formData, price: e.target.value})} 
                                    required 
                                />
                             </div>

                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Stock Qty</label>
                                <input 
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" 
                                    type="number"
                                    placeholder="0" 
                                    value={formData.stock} 
                                    onChange={e => setFormData({...formData, stock: e.target.value})} 
                                    required 
                                />
                             </div>
                        </div>

                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                            <div className="relative">
                                <select 
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none cursor-pointer" 
                                    value={formData.category} 
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                         </div>

                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Image URL</label>
                            <input 
                                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all" 
                                placeholder="https://..." 
                                value={formData.image} 
                                onChange={e => setFormData({...formData, image: e.target.value})} 
                            />
                         </div>

                         <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Description</label>
                            <textarea 
                                className="w-full bg-surface-50 border border-surface-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all min-h-[100px]" 
                                placeholder="Describe your product..." 
                                value={formData.description} 
                                onChange={e => setFormData({...formData, description: e.target.value})} 
                            />
                         </div>
                        
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-surface-100 text-slate-700 font-bold rounded-xl hover:bg-surface-200 transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 px-4 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-colors">Save Product</button>
                        </div>
                    </form>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminProducts;
