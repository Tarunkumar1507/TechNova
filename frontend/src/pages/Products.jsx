import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get search and category from URL params
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        let url = `${API_URL}/api/products`;
        const params = [];
        if (categoryQuery) params.push(`category=${encodeURIComponent(categoryQuery)}`);
        if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);

        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const res = await axios.get(url);
        setProducts(res.data.data);
      } catch (err) {
        setError('Failed to load products. Please check connection or try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleSearchClear = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[calc(100vh-10rem)]">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            Explore Electronics
          </h1>
          <p className="text-sm text-slate-500 mt-1">Smart technology solutions tailored for you.</p>
        </div>
        
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          placeholder="Search products by name or brand..."
        />
      </div>

      {/* Category filters */}
      <div className="border-b border-slate-900 pb-6">
        <CategoryFilter
          activeCategory={categoryQuery}
          onSelectCategory={handleCategorySelect}
        />
      </div>

      {/* Error Message */}
      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-semibold">
          {error}
        </div>
      ) : (
        /* Products List */
        <ProductGrid products={products} loading={loading} />
      )}
    </div>
  );
};

export default Products;
