import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import axios from 'axios';
import { ShoppingBag, CreditCard, ArrowLeft, LogIn } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || '';

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setError('');
    setCheckingOut(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));

      const res = await axios.post(`${API_URL}/api/orders`, {
        items: orderItems,
        totalAmount: cartTotal,
      });

      setSuccess('Order placed successfully! Redirecting...');
      clearCart();
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Try again later.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
        <div className="p-6 bg-slate-900 rounded-full text-slate-500 animate-bounce">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100">Your Cart is Empty</h2>
        <p className="text-slate-400 text-sm max-w-sm">
          Before you proceed to checkout, you must add some electronic products to your shopping cart.
        </p>
        <Link
          to="/products"
          className="btn-grad text-white px-6 py-3 rounded-full text-sm font-semibold hover:shadow-lg transition-all"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-10rem)] space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Shopping Cart</h1>
        <p className="text-sm text-slate-500 mt-1">Review your selections and proceed to checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item.product}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
          
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-xs font-bold text-sky-400 hover:text-sky-300 uppercase tracking-widest pt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-base font-bold text-slate-100 tracking-tight border-b border-slate-900 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-slate-200">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Shipping</span>
                <span className="font-bold text-emerald-400">FREE</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Taxes (Calculated)</span>
                <span className="font-bold text-slate-200">$0.00</span>
              </div>
              
              <div className="border-t border-slate-900 pt-3.5 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-200">Total Amount</span>
                <span className="text-2xl font-extrabold text-sky-400">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3.5 rounded-xl text-xs font-semibold animate-pulse">
                {success}
              </div>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full py-4 btn-grad rounded-xl text-xs font-extrabold uppercase tracking-widest text-white hover:shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{checkingOut ? 'Placing Order...' : 'Place Order'}</span>
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login to Checkout</span>
                </Link>
                <p className="text-[10px] text-slate-500 text-center">
                  You must be registered and authenticated to complete your order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
