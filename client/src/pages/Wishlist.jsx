import { useState, useEffect, useContext } from "react";
import API from "../api/api";
import ProductCard from "../components/common/ProductCard";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { toast } from "sonner";
import { Heart } from "lucide-react";

const Wishlist = () => {
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const res = await API.get("/users/wishlist");
            setWishlist(res.data);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await API.delete(`/users/wishlist/${productId}`);
            setWishlist(wishlist.filter(item => item._id !== productId));
            toast.success("Removed from wishlist");
        } catch (err) {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = async (product) => {
        try {
            await addToCart(product._id, 1);
            toast.success("Added to cart");
        } catch (err) {
            toast.error("Failed to add to cart");
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {wishlist.map((product) => (
                            <div key={product._id} className="relative group">
                                <ProductCard 
                                    product={product} 
                                    onAddToCart={handleAddToCart} 
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemoveFromWishlist(product._id);
                                    }}
                                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-rose-500 hover:bg-rose-50 transition-colors z-10"
                                    title="Remove from wishlist"
                                >
                                    <Heart className="w-5 h-5 fill-rose-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;
