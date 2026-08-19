import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut, LayoutDashboard, User, Package, Cpu } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-sky-400 font-extrabold text-xl tracking-wider hover:text-sky-300 transition-colors">
              <Cpu className="w-6 h-6 animate-pulse" />
              <span>Tech<span className="text-white">Nova</span></span>
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/products"
              className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Products
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-sky-400 hover:bg-slate-900 rounded-full transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Authenticated Controls */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/orders"
                  className="text-slate-300 hover:text-white p-2 hover:bg-slate-900 rounded-full transition-colors"
                  title="My Orders"
                >
                  <Package className="w-5 h-5" />
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 p-2 hover:bg-slate-900 rounded-full transition-colors"
                    title="Admin Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}

                {/* Profile indicator */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-xs">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-slate-300 font-medium truncate max-w-[80px]">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-grad text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
