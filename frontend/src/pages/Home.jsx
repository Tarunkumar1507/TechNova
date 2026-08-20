import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';
import { Cpu, Smartphone, Laptop, Headphones, Sparkles, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';

const Home = () => {
  const [search, setSearch] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        // Limit to first 4 products for featured section
        setFeaturedProducts(res.data.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleCategorySelect = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
  };

  const categories = [
    { name: 'Smartphones', icon: Smartphone, color: 'text-emerald-400' },
    { name: 'Laptops', icon: Laptop, color: 'text-sky-400' },
    { name: 'Audio', icon: Headphones, color: 'text-purple-400' },
    { name: 'Accessories', icon: Cpu, color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:py-24">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl -z-10"></div>

        <div className="max-w-4xl mx-auto text-center px-4 space-y-8">
          <div className="inline-flex items-center space-x-1.5 bg-slate-900 border border-slate-800 rounded-full px-3 py-1.5 text-xs font-semibold text-sky-400 tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE FUTURE OF SHOPPING IS HERE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
            Smart Shopping.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              Better Technology.
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
            Welcome to TechNova, your ultimate e-commerce destination for premium smartphones, laptops, audio systems, and high-performance accessories.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex justify-center">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Search smartphones, laptops, audio..."
            />
          </form>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight text-center mb-8">
          Browse Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 hover:border-sky-500/30 transition-all text-center group"
              >
                <div className={`p-4 bg-slate-900 rounded-xl group-hover:scale-110 transition-transform ${cat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-slate-200 uppercase tracking-wider">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              Featured Electronics
            </h2>
            <p className="text-sm text-slate-500 mt-1">Handpicked technology for modern lifestyles.</p>
          </div>
          <Link
            to="/products"
            className="flex items-center space-x-1 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
          >
            <span>See All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>
    </div>
  );
};

export default Home;
