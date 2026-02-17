import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, ArrowLeft, CheckCircle2, Heart, Star } from "lucide-react";
import { toast } from "sonner";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [adding, setAdding] = useState(false);
  
  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Wishlist State (Ideally checked against user's wishlist)
  const [isInWishlist, setIsInWishlist] = useState(false); // Simplified for now

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    setAdding(true);
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      toast.error("Failed to add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) return toast.error("Login to use wishlist");
    try {
        await API.post("/users/wishlist", { productId: product._id });
        setIsInWishlist(true);
        toast.success("Added to wishlist");
    } catch (err) {
        toast.error("Failed to add to wishlist");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login to review");
    setSubmittingReview(true);
    try {
        await API.post(`/products/${product._id}/review`, { rating, comment });
        toast.success("Review submitted!");
        // Refresh product to show new review
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
        setComment("");
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
        setSubmittingReview(false);
    }
  };

  if (loading) return (
      <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow flex items-center justify-center">Loading...</div>
          <Footer />
      </div>
  );

  if (error || !product) return (
      <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow flex items-center justify-center text-red-500">{error || "Product not found"}</div>
          <Footer />
      </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <img
                src={product.image || "https://placehold.co/600x400"}
                alt={product.name}
                className="w-full h-96 object-cover object-center"
              />
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
                {product.category?.name || "Product"}
              </div>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-gray-500 text-lg">
                {product.description}
              </p>

                <div className="mt-8 flex items-center justify-between">
                 <div>
                    <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                    {product.stock > 0 ? (
                        <span className="ml-4 text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">In Stock: {product.stock}</span>
                    ) : (
                        <span className="ml-4 text-sm text-red-600 font-medium bg-red-100 px-2 py-1 rounded">Out of Stock</span>
                    )}
                 </div>
               </div>

               {product.seller && (
                   <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                           {product.seller.shopName?.[0] || 'S'}
                       </div>
                       <div>
                           <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sold by</p>
                           <div className="flex items-center gap-2">
                               <p className="font-bold text-gray-900">{product.seller.shopName || "Seller"}</p>
                               <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                                   <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                   <span className="text-xs font-bold text-yellow-700">
                                       {product.seller.sellerRating ? product.seller.sellerRating.toFixed(1) : "New"}
                                   </span>
                               </div>
                           </div>
                       </div>
                   </div>
               )}

              <div className="mt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 md:w-auto ${
                      product.stock === 0 ? "opacity-50 cursor-not-allowed bg-gray-400 hover:bg-gray-400" : ""
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                
                <button
                    onClick={handleAddToWishlist}
                    className="flex items-center justify-center w-full px-8 py-3 mt-4 md:mt-0 md:ml-4 text-base font-medium text-pink-600 bg-pink-50 border border-transparent rounded-md hover:bg-pink-100 transition-colors"
                >
                    <Heart className={`w-5 h-5 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                    Wishlist
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-gray-50 border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            
            {/* Reviews List */}
            <div className="space-y-6 mb-8">
                {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-gray-900">{review.name}</span>
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                )}
            </div>

            {/* Add Review Form */}
            {user ? (
                <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`focus:outline-none transition-colors ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                    <Star className={`w-6 h-6 ${rating >= star ? "fill-current" : ""}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            rows="3"
                            placeholder="Share your thoughts..."
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            ) : (
                <div className="bg-indigo-50 p-4 rounded-lg text-indigo-700">
                    Please <a href="/login" className="font-bold underline">login</a> to write a review.
                </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;