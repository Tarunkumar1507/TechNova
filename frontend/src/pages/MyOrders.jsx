import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders`);
        setOrders(res.data.data);
      } catch (err) {
        setError('Failed to fetch orders. Make sure you are logged in.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'Processing':
        return 'bg-sky-500/10 border-sky-500/20 text-sky-400';
      case 'Shipped':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'Delivered':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'Cancelled':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-slate-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-10rem)] space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">My Purchases</h1>
        <p className="text-sm text-slate-500 mt-1">Track the status of your current and historical orders.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {!error && orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/10 rounded-3xl border border-slate-900 border-dashed space-y-4">
          <div className="inline-block p-4 bg-slate-900 rounded-full text-slate-600">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-400">No orders found</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            You haven't placed any electronic orders yet. Browse our selection and start shopping!
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="glass-panel p-6 rounded-3xl border border-slate-850 hover:border-slate-800 transition-all space-y-6">
              {/* Order Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order ID</span>
                  <div className="text-xs font-semibold text-slate-300 font-mono select-all">
                    {order._id}
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="space-y-1 text-left sm:text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Date Placed</span>
                    <div className="flex items-center text-slate-300 text-xs font-semibold space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-500" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status</span>
                    <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-950/40">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center p-1.5 border border-slate-900">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm truncate max-w-[200px] sm:max-w-md">
                          {item.name}
                        </h4>
                        <span className="text-xs text-slate-500">
                          Qty: {item.quantity} &times; ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-200">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center bg-slate-900/20 p-4 rounded-2xl border border-slate-900/50">
                <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-wider space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                  <span>Secure Transaction Verified</span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-slate-400 text-xs">Total Amount Paid:</span>
                  <span className="text-lg font-extrabold text-sky-400">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
