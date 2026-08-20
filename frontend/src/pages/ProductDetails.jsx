import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, ShoppingCart, Plus, Minus, Calendar, MessageSquarePlus } from 'lucide-react';
import { API_URL } from '../config';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Cart quantity selector state
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductAndReviews = async () => {
    try {
      setError('');
      const productRes = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(productRes.data.data);

      const reviewsRes = await axios.get(`${API_URL}/api/products/${id}/reviews`);
      setReviews(reviewsRes.data.data);
    } catch (err) {
      setError('Product not found or database offline.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const handleQuantityChange = (val) => {
    if (!product) return;
    setQuantity(Math.max(1, Math.min(val, product.stock)));
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setSubmittingReview(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/products/${id}/reviews`,
        { rating, comment }
      );
      setReviewSuccess('Thank you! Review submitted successfully.');
      setComment('');
      setRating(5);
      // Reload product data to update the rating and list
      fetchProductAndReviews();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review. Verify you have purchased this product.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-slate-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
          <h2 className="font-bold text-lg mb-2">Error Loading Product</h2>
          <p className="text-sm">{error || 'The requested product could not be found.'}</p>
        </div>
        <Link to="/products" className="inline-block mt-6 text-sm font-semibold text-sky-400 hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 min-h-[calc(100vh-10rem)]">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 font-semibold uppercase tracking-wider space-x-2">
        <Link to="/products" className="hover:text-slate-300 transition-colors">Products</Link>
        <span>/</span>
        <span className="text-slate-400">{product.category}</span>
      </nav>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product image */}
        <div className="glass-panel rounded-3xl overflow-hidden flex items-center justify-center p-8 bg-slate-900/40 aspect-square max-h-[500px]">
          <img
            src={product.image || 'https://via.placeholder.com/400?text=Product'}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">{product.brand}</span>
              <span className="text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars Summary */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.averageRating)
                        ? 'fill-current'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-200">{product.averageRating || '0.0'}</span>
              <span className="text-xs text-slate-500">({product.reviewCount || 0} reviews)</span>
            </div>

            <div className="text-3xl font-extrabold text-sky-400 pt-2">
              ${product.price.toFixed(2)}
            </div>

            <div className="border-t border-slate-900 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* Checkout Box */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Availability</span>
              <span className={`text-xs font-extrabold uppercase tracking-wider ${
                outOfStock ? 'text-red-500' : product.stock < 5 ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {outOfStock ? 'Out of Stock' : product.stock < 5 ? `Only ${product.stock} items left!` : 'In Stock'}
              </span>
            </div>

            {!outOfStock && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center border border-slate-800 bg-slate-950 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 disabled:text-slate-700 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-slate-200 min-w-[32px] text-center text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 disabled:text-slate-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`w-full py-4.5 rounded-xl font-bold flex items-center justify-center space-x-2 text-white transition-all ${
                outOfStock
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'btn-grad hover:shadow-lg'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 border-t border-slate-900 pt-12">
        {/* Write a Review */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center space-x-2">
            <MessageSquarePlus className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Customer Reviews</h2>
          </div>

          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Share Your Experience</h3>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                  <option value={2}>2 Stars (Poor)</option>
                  <option value={1}>1 Star (Awful)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Review comments..."
                  rows={4}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-sky-500"
                ></textarea>
              </div>

              {reviewError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs">
                  {reviewError}
                </div>
              )}

              {reviewSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs">
                  {reviewSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="glass-panel p-6 rounded-2xl text-center space-y-3">
              <p className="text-slate-400 text-sm">Have you purchased this item?</p>
              <Link
                to="/login"
                className="inline-block px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                Login to Review
              </Link>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Review List</h3>
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/10 rounded-2xl border border-slate-900 border-dashed">
              <p className="text-slate-500 text-sm">No reviews yet for this product.</p>
              <p className="text-xs text-slate-600 mt-1">Verified customers will write comments after purchasing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="glass-panel p-5 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-200 text-sm">{rev.user.name}</span>
                      <div className="flex items-center text-amber-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-current' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-slate-500 text-xs font-medium space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/20 p-3 rounded-xl border border-slate-900">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
