import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Truck, RotateCcw, Award, Check, ArrowLeft, Clock, Wind, Sparkles } from 'lucide-react';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';

export default function ProductDetail({ slug, onNavigate }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const data = await productService.getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-8 bg-white">
        <div className="h-8 bg-neutral-100 rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[4/5] bg-neutral-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-10 bg-neutral-100 rounded-xl w-3/4" />
            <div className="h-6 bg-neutral-100 rounded-xl w-1/4" />
            <div className="h-32 bg-neutral-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center space-y-4 bg-white text-black">
        <h2 className="text-2xl font-serif text-black">Fragrance Not Found</h2>
        <button
          onClick={() => onNavigate('catalog')}
          className="text-xs uppercase font-bold text-black underline tracking-widest hover:text-neutral-700"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'];

  const discountPercent = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-white text-black">
      <button
        onClick={() => onNavigate('catalog')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-neutral-500 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Fragrances
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
            <img
              src={images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Save {discountPercent}%
              </span>
            )}
            <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-black border border-neutral-200 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
              Extrait de Parfum
            </span>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === idx
                      ? 'border-black shadow-md scale-105'
                      : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-black bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full">
                {product.category_name || 'Haute Parfumerie'}
              </span>
              <span className="text-xs text-neutral-500 font-semibold">{product.gender} • {product.volume}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-black uppercase text-black mt-3">
              {product.title}
            </h1>

            {product.inspired_by && (
              <p className="text-xs text-neutral-600 font-semibold mt-1">
                Tribute Character: <span className="text-black font-bold">{product.inspired_by}</span>
              </p>
            )}

            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-xs font-bold text-black">{product.rating || 4.9}</span>
              <span className="text-xs text-neutral-500 font-medium">({product.reviews_count || 48} verified client ratings)</span>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-baseline gap-4 shadow-sm">
            <span className="text-3xl font-black text-black">₹{product.price}</span>
            {product.compare_price && (
              <span className="text-base text-neutral-400 line-through font-medium">₹{product.compare_price}</span>
            )}
            <span className="text-xs text-emerald-800 font-black ml-auto bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              In Stock • Taxes Included
            </span>
          </div>

          {/* Fragrance Olfactory Pyramid */}
          <div className="space-y-3 p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <h3 className="text-xs font-serif font-black text-black uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-black" /> OLFACTORY NOTES PYRAMID
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-black block text-[11px] uppercase tracking-wide">Top Notes (Opening):</span>
                <span className="text-neutral-700 font-medium mt-0.5 block">{product.top_notes || 'Calabrian Bergamot, Pink Peppercorn'}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-black block text-[11px] uppercase tracking-wide">Heart Notes (Dry Down):</span>
                <span className="text-neutral-700 font-medium mt-0.5 block">{product.heart_notes || 'Turkish Rose Petals, Amberwood'}</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-black block text-[11px] uppercase tracking-wide">Base Notes (Base Longevity):</span>
                <span className="text-neutral-700 font-medium mt-0.5 block">{product.base_notes || 'Assam Oud, Madagascar Vanilla, Ambergris'}</span>
              </div>
            </div>
          </div>

          {/* Performance Longevity & Sillage */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center gap-3">
              <Clock className="w-5 h-5 text-black flex-shrink-0" />
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Longevity</span>
                <span className="text-black font-bold">{product.longevity || '10-12 Hours'}</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center gap-3">
              <Wind className="w-5 h-5 text-black flex-shrink-0" />
              <div>
                <span className="text-neutral-500 block text-[10px] uppercase font-bold">Sillage</span>
                <span className="text-black font-bold">{product.projection || 'Strong'}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-neutral-600 leading-relaxed space-y-2">
            <p>{product.description}</p>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center justify-between sm:justify-start border border-neutral-300 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-neutral-600 hover:text-black font-bold text-sm transition"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-neutral-600 hover:text-black font-bold text-sm transition"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  product.stock > 0
                    ? addedAnimation
                      ? 'bg-emerald-700 text-white shadow-md scale-[1.02]'
                      : 'bg-black hover:bg-neutral-800 text-white shadow-md hover:scale-[1.01]'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {product.stock > 0
                  ? (addedAnimation ? '✓ ADDED TO SHOPPING BAG' : 'ADD TO SHOPPING BAG')
                  : 'OUT OF STOCK'}
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 text-xs text-neutral-700">
              <ShieldCheck className="w-5 h-5 text-black flex-shrink-0" />
              <span>
                <strong className="text-black">100% Authenticity Guarantee:</strong> Complimentary 2ml tester included inside every order for zero-risk wear testing.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
