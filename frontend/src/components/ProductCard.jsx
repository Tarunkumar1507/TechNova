import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Star, ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const outOfStock = product.stock === 0;

  return (
    <div className="glass-panel glass-panel-hover flex flex-col justify-between h-full rounded-2xl overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image || 'https://via.placeholder.com/300?text=Electronics'}
          alt={product.name}
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
        />
        {outOfStock && (
          <div className="absolute top-2 right-2 bg-red-600/90 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-sky-400 uppercase tracking-wider">{product.brand}</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded-full">{product.category}</span>
          </div>

          <h3 className="font-bold text-slate-100 text-base leading-tight mb-2 group-hover:text-sky-400 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold ml-1 text-slate-200">{product.averageRating || '0'}</span>
            </div>
            <span className="text-slate-500 text-xs">({product.reviewCount || 0})</span>
          </div>
        </div>

        {/* Footer info & Buttons */}
        <div className="mt-4">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-2xl font-extrabold text-sky-400">${product.price.toFixed(2)}</span>
            <span className={`text-[11px] font-semibold ${outOfStock ? 'text-red-500' : product.stock < 5 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {outOfStock ? 'No Stock' : product.stock < 5 ? `${product.stock} Left` : 'In Stock'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/products/${product._id}`}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Details</span>
            </Link>

            <button
              onClick={() => addToCart(product)}
              disabled={outOfStock}
              className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold text-white transition-all ${
                outOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'btn-grad hover:shadow-lg'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
