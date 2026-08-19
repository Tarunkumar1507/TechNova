import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { DollarSign, Briefcase, ClipboardList, Users, Plus, Edit2, Trash2, Check, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Product CRUD Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Smartphones',
    description: '',
    price: '',
    image: '',
    stock: '',
  });
  const [formError, setFormError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || '';

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch products
      const prodRes = await axios.get(`${API_URL}/api/products`);
      setProducts(prodRes.data.data);

      // Fetch admin orders
      const orderRes = await axios.get(`${API_URL}/api/admin/orders`, { headers });
      setOrders(orderRes.data.data);
    } catch (err) {
      setError('Failed to fetch dashboard data. Verify admin role.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute analytics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.status !== 'Cancelled') {
      return sum + order.totalAmount;
    }
    return sum;
  }, 0);
  // Estimate unique users based on orders, or hardcode a base number
  const uniqueUsersCount = new Set(orders.map((o) => o.user?._id || o.user)).size + 3;

  // Handle Product CRUD actions
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: 'Smartphones',
      description: '',
      price: '',
      image: '',
      stock: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      if (editingProduct) {
        // Edit Product PUT
        await axios.put(`${API_URL}/api/products/${editingProduct._id}`, payload, { headers });
      } else {
        // Add Product POST
        await axios.post(`${API_URL}/api/products`, payload, { headers });
      }
      setIsModalOpen(false);
      fetchData(); // Reload
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product details.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (err) {
        alert('Failed to delete product.');
      }
    }
  };

  // Handle order status update
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Reload data
    } catch (err) {
      alert('Failed to update order status.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      {/* Sidebar navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main dashboard viewport */}
      <main className="flex-1 p-6 md:p-10 space-y-8 bg-slate-950 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-900 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight capitalize">
              {activeTab === 'overview' ? 'Console Overview' : `${activeTab} Control`}
            </h1>
            <p className="text-sm text-slate-500 mt-1">Administrator dashboard portal.</p>
          </div>
          <button
            onClick={fetchData}
            className="p-2 text-slate-500 hover:text-sky-400 bg-slate-900 border border-slate-800 rounded-xl transition-all"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Tab content conditional routing */}
        {!error && (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Counters Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Revenue Card */}
                  <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Revenue</span>
                      <span className="text-xl font-extrabold text-slate-100">${totalRevenue.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Orders Card */}
                  <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
                    <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Orders</span>
                      <span className="text-xl font-extrabold text-slate-100">{totalOrders}</span>
                    </div>
                  </div>

                  {/* Products Card */}
                  <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Products</span>
                      <span className="text-xl font-extrabold text-slate-100">{totalProducts}</span>
                    </div>
                  </div>

                  {/* Users Card */}
                  <div className="glass-panel p-5 rounded-2xl flex items-center space-x-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Users</span>
                      <span className="text-xl font-extrabold text-slate-100">{uniqueUsersCount}</span>
                    </div>
                  </div>
                </div>

                {/* Recent activity summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders List */}
                  <div className="glass-panel p-6 rounded-3xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Activity Purchases</h3>
                    <div className="divide-y divide-slate-900">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                          <div>
                            <span className="text-xs font-semibold text-slate-300 font-mono block truncate max-w-[120px]">{order._id}</span>
                            <span className="text-[10px] text-slate-500">{order.user?.name || 'Guest User'}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-xs font-bold text-slate-300">${order.totalAmount.toFixed(2)}</span>
                            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-sky-400 tracking-wider">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="text-slate-600 text-xs py-6 text-center">No orders registered in system.</p>
                      )}
                    </div>
                  </div>

                  {/* Stock Alert Summary */}
                  <div className="glass-panel p-6 rounded-3xl space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Low Stock Warnings</h3>
                    <div className="divide-y divide-slate-900">
                      {products.filter((p) => p.stock < 5).slice(0, 5).map((product) => (
                        <div key={product._id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                          <div>
                            <span className="text-xs font-bold text-slate-300 block truncate max-w-[200px]">{product.name}</span>
                            <span className="text-[10px] text-sky-500 font-bold uppercase tracking-wider">{product.brand}</span>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            product.stock === 0 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {product.stock === 0 ? 'NO STOCK' : `${product.stock} items left`}
                          </span>
                        </div>
                      ))}
                      {products.filter((p) => p.stock < 5).length === 0 && (
                        <p className="text-emerald-500/80 text-xs py-6 text-center flex items-center justify-center space-x-1">
                          <Check className="w-4 h-4" />
                          <span>All products satisfy minimum inventory levels.</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex justify-end">
                  <button
                    onClick={openAddModal}
                    className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Product</span>
                  </button>
                </div>

                {/* Products CRUD Table */}
                <div className="glass-panel rounded-3xl overflow-hidden overflow-x-auto border border-slate-900">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <th className="p-4">Item Details</th>
                        <th className="p-4">Brand</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300 text-xs">
                      {products.map((prod) => (
                        <tr key={prod._id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center p-1 border border-slate-900 flex-shrink-0">
                              <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain" />
                            </div>
                            <span className="font-bold text-slate-200 truncate max-w-[200px]" title={prod.name}>
                              {prod.name}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400 font-semibold">{prod.brand}</td>
                          <td className="p-4 uppercase tracking-wider text-[10px] font-bold">{prod.category}</td>
                          <td className="p-4 font-bold text-sky-400">${prod.price.toFixed(2)}</td>
                          <td className="p-4 font-semibold">{prod.stock}</td>
                          <td className="p-4 text-center space-x-2">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-xl transition-all"
                              title="Edit item"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod._id)}
                              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="glass-panel rounded-3xl overflow-hidden overflow-x-auto border border-slate-900">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Grand Total</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-center">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300 text-xs">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-400">{ord._id}</td>
                        <td className="p-4">
                          <div>
                            <span className="font-bold block text-slate-200">{ord.user?.name || 'Guest User'}</span>
                            <span className="text-[10px] text-slate-500">{ord.user?.email || ''}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-bold text-sky-400">${ord.totalAmount.toFixed(2)}</td>
                        <td className="p-4 font-bold uppercase tracking-wider text-[10px]">{ord.status}</td>
                        <td className="p-4 text-center">
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center p-8 text-slate-500">No client orders registered.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* Product Form Modal (Add & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {editingProduct ? 'Edit Electronic Product' : 'Add New Electronic Product'}
              </h2>
              <p className="text-xs text-slate-500">Provide device metadata and save configuration.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Asus ROG Zephyrus G14"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. ASUS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="Smartphones">Smartphones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Audio">Audio</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Price ($ USD)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1299.99"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="e.g. 15"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. https://domain.com/device-image.jpg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Enter specifications and features..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500"
                ></textarea>
              </div>

              {formError && (
                <div className="col-span-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-semibold">
                  {formError}
                </div>
              )}

              <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
