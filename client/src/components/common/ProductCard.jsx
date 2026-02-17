import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const ProductCard = ({ product, onAddToCart }) => {
  const isNew = false; // You can add logic to determine if product is new
  const isOnSale = false; // You can add logic for sale products

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-surface-200">
      {/* Badges */}
      {(isNew || isOnSale) && (
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {isNew && (
            <span className="px-3 py-1 text-[10px] font-bold tracking-wider bg-slate-900 text-white rounded-full">
              NEW
            </span>
          )}
          {isOnSale && (
            <span className="px-3 py-1 text-[10px] font-bold tracking-wider bg-red-500 text-white rounded-full">
              SALE
            </span>
          )}
        </div>
      )}

      {/* Image with Zoom Effect */}
      <Link to={`/product/${product._id}`} className="block overflow-hidden relative aspect-[4/3]">
        <img
          src={product.image || "https://placehold.co/600x400"}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        {/* Quick Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-1 truncate hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-surface-100">
          <span className="text-xl font-display font-bold text-slate-900">
            ${product.price}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center w-10 h-10 bg-surface-100/50 text-slate-900 rounded-full hover:bg-primary-600 hover:text-white transition-all shadow-sm hover:shadow-primary-500/30"
            title="Add to Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
