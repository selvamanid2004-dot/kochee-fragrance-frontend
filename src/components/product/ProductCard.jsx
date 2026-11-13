import React from 'react';
import { Star, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { sanitizeMediaUrl } from '../../api/endpoints';

export default function ProductCard({ product, onNavigate }) {
  const { addToCart } = useCart();

  const fallbackProductImage = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=600';

  const rawImage = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : fallbackProductImage;

  const primaryImage = sanitizeMediaUrl(rawImage) || fallbackProductImage;

  const discountPercent = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <div className="group relative bg-white border border-neutral-200 hover:border-black rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1.5">
      {/* Product Image Stage */}
      <div
        className="relative aspect-[4/5] bg-neutral-50 overflow-hidden cursor-pointer"
        onClick={() => onNavigate('product', { slug: product.slug })}
      >
        <img
          src={primaryImage}
          alt={product.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = fallbackProductImage;
          }}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.is_best_seller === 1 && (
            <span className="bg-black text-white text-[9px] font-black tracking-wider px-2.5 py-0.5 rounded-full uppercase shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Bestseller
            </span>
          )}
          {discountPercent && (
            <span className="bg-rose-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs">
              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* Volume & Gender Pills */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-neutral-800 z-10 pointer-events-none">
          <span className="bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold border border-neutral-200 shadow-xs">
            {product.gender || 'Unisex'}
          </span>
          <span className="bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold border border-neutral-200 shadow-xs">
            {product.volume || '50ml'}
          </span>
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            </div>
            <span className="text-xs font-bold text-neutral-900">{product.rating || 4.9}</span>
            <span className="text-[11px] text-neutral-400">({product.reviews_count || 48})</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onNavigate('product', { slug: product.slug })}
            className="font-serif text-sm font-bold text-black group-hover:underline transition cursor-pointer line-clamp-1"
          >
            {product.title}
          </h3>

          {/* Inspired Note */}
          {product.inspired_by && (
            <p className="text-[11px] text-neutral-600 font-medium mt-0.5 line-clamp-1">
              Inspired by: <span className="font-semibold text-neutral-900">{product.inspired_by}</span>
            </p>
          )}

          {/* Scent Pyramid Notes */}
          {product.top_notes && (
            <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
              <span className="font-semibold text-neutral-800">Notes:</span> {product.top_notes}
            </p>
          )}
        </div>

        {/* Price & Add to Bag */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-black font-mono">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              {product.compare_price && (
                <span className="text-xs text-neutral-400 line-through font-mono">
                  ₹{Number(product.compare_price).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 block font-semibold">
              {product.stock > 0 ? (product.stock <= 5 ? `Only ${product.stock} Left` : 'In Stock') : 'Sold Out'}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 active:scale-95 shadow-sm ${
              product.stock > 0
                ? 'bg-black hover:bg-neutral-800 text-white shadow-md'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
