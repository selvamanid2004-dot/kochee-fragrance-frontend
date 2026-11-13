import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Filter, RotateCcw, Sparkles } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

export default function Catalog({ onNavigate, initialParams = {} }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(initialParams.category || '');
  const [selectedGender, setSelectedGender] = useState(initialParams.gender || '');
  const [search, setSearch] = useState(initialParams.search || '');
  const [sortBy, setSortBy] = useState('featured');

  // Price Range Filter State
  const [priceRange, setPriceRange] = useState(3000); // Max ₹3000

  useEffect(() => {
    async function fetchCatalog() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts({
            category: selectedCategory,
            gender: selectedGender,
            search: search
          }),
          categoryService.getCategories()
        ]);
        setProducts(prodRes || []);
        setCategories(catRes || []);
      } catch (err) {
        console.error('Failed to load catalog', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCatalog();
  }, [selectedCategory, selectedGender, search]);

  // Filter products by price range
  const filteredProducts = products.filter(p => p.price <= priceRange);

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.is_featured - a.is_featured;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-black">
      {/* Page Title */}
      <div className="border-b border-neutral-200 pb-6 text-center sm:text-left">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-black" /> ALL PERFUMES & EXTRAITS
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black uppercase text-black mt-1">
          THE COMPLETE LUXURY CATALOGUE
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-medium">
          Browse all categories, gender profiles, and price points crafted with authentic French Grasse oils.
        </p>
      </div>

      {/* Categories Grid Selector Inside All Perfume Page */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-black" /> ALL PERFUME CATEGORIES
          </span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory('')}
              className="text-[11px] text-neutral-600 hover:text-black font-bold uppercase underline"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? '' : cat.slug)}
                className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between ${
                  isSelected
                    ? 'border-black bg-black text-white shadow-lg scale-[1.02]'
                    : 'border-neutral-200 bg-neutral-50 hover:border-black text-black'
                }`}
              >
                <div>
                  <h4 className="font-serif font-black text-xs uppercase tracking-wider">
                    {cat.name}
                  </h4>
                  <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {cat.product_count || 0} Fragrances
                  </span>
                </div>
                <div className={`w-3 h-3 rounded-full border ${isSelected ? 'bg-white border-white' : 'bg-neutral-300 border-neutral-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Price Range Control Bar */}
      <div className="bg-neutral-50 p-4 sm:p-5 rounded-2xl border border-neutral-200 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="w-full lg:w-72 relative">
            <input
              type="text"
              placeholder="Search notes, tributes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-xl py-2.5 pl-3.5 pr-9 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          </div>

          {/* Price Range Slider Filter */}
          <div className="flex-1 max-w-md bg-white border border-neutral-200 px-4 py-2.5 rounded-xl space-y-1.5 shadow-sm">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-neutral-700 uppercase tracking-wider text-[11px]">
                Price Range Filter:
              </span>
              <span className="font-black text-black">
                Up to ₹{priceRange.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="900"
              max="3000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-black cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-semibold">
              <span>₹999</span>
              <span>₹1,500</span>
              <span>₹2,000</span>
              <span>₹3,000</span>
            </div>
          </div>

          {/* Gender & Sorting */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              aria-label="Filter by gender"
              className="flex-1 sm:flex-none bg-white border border-neutral-300 text-xs font-bold text-black rounded-xl px-3 py-2.5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm"
            >
              <option value="">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort options"
              className="flex-1 sm:flex-none bg-white border border-neutral-300 text-xs font-bold text-black rounded-xl px-3 py-2.5 focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results summary & Reset */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-500 pt-2 border-t border-neutral-200">
          <span>
            Showing <strong className="text-black font-black">{sortedProducts.length}</strong> perfumes matching your selection
          </span>
          {(selectedCategory || selectedGender || search || priceRange < 3000) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedGender('');
                setSearch('');
                setPriceRange(3000);
              }}
              className="text-black hover:text-neutral-700 font-bold underline flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="aspect-[4/5] bg-neutral-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
          <p className="text-base text-neutral-600 font-semibold">No perfumes match your current price or filter criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('');
              setSelectedGender('');
              setSearch('');
              setPriceRange(3000);
            }}
            className="bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-lg shadow-md transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
