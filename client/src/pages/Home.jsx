import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import ProductCard from "../components/common/ProductCard";
import ProductCardSkeleton from "../components/common/ProductCardSkeleton";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { toast } from "sonner";
import { ShoppingBag, TrendingUp, ChevronDown, Filter, Search } from "lucide-react";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured"); // featured, price-low, price-high, name-az

  const [search, setSearch] = useState("");

  // Removed debouncedSearch state and effect

  const [searchLoading, setSearchLoading] = useState(false);

  // Initial Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          API.get("/products"),
          API.get("/category"), 
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Search Fetch
  // Search Handler
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission reload if wrapped in form
    setSearchLoading(true);
    try {
        const res = await API.get(`/products?search=${search}`);
        setProducts(res.data);
    } catch (err) {
        console.error("Error searching:", err);
    } finally {
        setSearchLoading(false);
    }
  };

  const filteredProducts = products
    .filter(p => selectedCategory === "All" || p.category?.name === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name-az") return a.name.localeCompare(b.name);
      return 0; // featured
    });

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="bg-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="h-12 bg-white/20 rounded animate-pulse mx-auto w-96"></div>
            <div className="mt-4 h-6 bg-white/20 rounded animate-pulse mx-auto w-64"></div>
          </div>
        </div>
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to ShopMate
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-indigo-100">
            Discover the best products at unbeatable prices.
          </p>
          {!user && (
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 transition-colors border-2 border-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Search Section */}
        <div className="relative max-w-xl mx-auto mb-12 -mt-24 z-10">
            <div className="flex bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-1">
                <input
                    type="text"
                    className="flex-grow pl-4 pr-4 py-3 bg-transparent border-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                    placeholder="Search for products, categories..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                />
                <button 
                    onClick={handleSearch}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                    <Search className="h-5 w-5" />
                    Search
                </button>
            </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
          <div>
             <h2 className="text-2xl font-black text-gray-900 tracking-tight">Featured Products</h2>
             <p className="text-sm text-gray-500 font-medium">Showing {filteredProducts.length} premium items</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ring-1 ${
                  selectedCategory === "All" 
                  ? "bg-indigo-600 text-white ring-indigo-600 shadow-lg shadow-indigo-100" 
                  : "bg-white text-gray-600 ring-gray-200 hover:ring-indigo-300 hover:text-indigo-600"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ring-1 ${
                    selectedCategory === cat.name 
                    ? "bg-indigo-600 text-white ring-indigo-600 shadow-lg shadow-indigo-100" 
                    : "bg-white text-gray-600 ring-gray-200 hover:ring-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="h-8 w-px bg-gray-200 hidden md:block" />

            {/* Sort Select */}
            <div className="relative group">
               <select
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
                 className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none cursor-pointer"
               >
                 <option value="featured">Featured</option>
                 <option value="price-low">Price: Low to High</option>
                 <option value="price-high">Price: High to Low</option>
                 <option value="name-az">Name: A to Z</option>
               </select>
               <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <TrendingUp className="w-4 h-4" />
               </span>
               <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
               </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {searchLoading ? (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-gray-900">No products found</h3>
             <p className="text-gray-500 mt-2">Try adjusting your filters or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
