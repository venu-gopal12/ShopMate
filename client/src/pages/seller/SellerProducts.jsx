import { useState, useEffect } from "react";
import API from "../../api/api";
import SellerSidebar from "../../components/layout/SellerSidebar";
import { Edit, Trash2, Plus, Package } from "lucide-react";
import { toast } from "sonner";

const SellerProducts = () => {
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
        API.get("/seller/products"),
        API.get("/category")
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to fetch seller data", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
        toast.success("Product deleted");
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
          category: product.category?._id || product.category, 
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
              toast.success("Product updated");
          } else {
              const res = await API.post("/products", formData);
              setProducts([res.data.product, ...products]); // Add to top
              toast.success("Product created");
          }
          setShowModal(false);
      } catch (err) {
          console.error("Operation failed", err);
          toast.error(err.response?.data?.message || "Failed to save product.");
      }
  };

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const filteredProducts = products.filter(product => {
      const matchCategory = categoryFilter === 'all' || (product.category?._id || product.category) === categoryFilter;
      const matchStock = stockFilter === 'all' || 
          (stockFilter === 'in_stock' ? product.stock > 0 : product.stock === 0);
      return matchCategory && matchStock;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Products</h1>
                <p className="text-gray-500 mt-1 font-medium">Manage your product catalog</p>
            </div>
            <button 
                onClick={handleCreate}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-lg shadow-indigo-200"
            >
                <Plus className="w-5 h-5" />
                Add New Product
            </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
            <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
            <select 
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="all">All Stock Status</option>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
            </select>
        </div>

        {loading ? (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-2 mb-6">Try adjusting your filters or add a new product.</p>
                <button 
                    onClick={handleCreate}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl hover:bg-indigo-200 transition-colors font-bold"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden ring-1 ring-black/5">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center group">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 group-hover:shadow-sm transition-all">
                          <img className="h-full w-full object-cover" src={product.image || "https://placehold.co/100"} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-gray-900">${product.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-bold rounded-lg ${product.stock > 0 ? 'bg-green-50 text-green-700 ring-1 ring-green-100' : 'bg-red-50 text-red-700 ring-1 ring-red-100'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
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

      {/* Modal - Could be a separate component */}
      {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-black text-gray-900">{editingProduct ? "Edit Product" : "New Product"}</h2>
                  </div>
                  
                  <div className="p-8 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Product Name</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                    placeholder="e.g. Wireless Headphones" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    required 
                                />
                             </div>

                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Price ($)</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                    type="number"
                                    placeholder="0.00" 
                                    value={formData.price} 
                                    onChange={e => setFormData({...formData, price: e.target.value})} 
                                    required 
                                />
                             </div>

                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Stock Qty</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                    type="number"
                                    placeholder="0" 
                                    value={formData.stock} 
                                    onChange={e => setFormData({...formData, stock: e.target.value})} 
                                    required 
                                />
                             </div>

                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                                <div className="relative">
                                    <select 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none cursor-pointer" 
                                        value={formData.category} 
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                             </div>

                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Image URL</label>
                                <input 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" 
                                    placeholder="https://..." 
                                    value={formData.image} 
                                    onChange={e => setFormData({...formData, image: e.target.value})} 
                                />
                             </div>

                             <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
                                <textarea 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[100px]" 
                                    placeholder="Describe your product..." 
                                    value={formData.description} 
                                    onChange={e => setFormData({...formData, description: e.target.value})} 
                                />
                             </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                            <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">Save Product</button>
                        </div>
                    </form>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SellerProducts;
