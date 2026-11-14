import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Award, Sparkles } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ResponsiveBannerSlider from '../../components/banner/ResponsiveBannerSlider';
import { bootstrapService, extractBannerImages } from '../../services/bootstrapService';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { offerService } from '../../services/offerService';
import { settingService } from '../../services/settingService';
import { sanitizeMediaUrl } from '../../api/endpoints';

// Luxury Fallback visuals only if server has zero banners configured in CMS
const DEFAULT_FALLBACK_BANNERS = [
  {
    id: 'banner-1',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=85&w=900',
    alt: 'Luxury Extrait de Parfum flacon with golden amber aura'
  },
  {
    id: 'banner-2',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=85&w=900',
    alt: 'Regal golden perfume flacon on dark obsidian pedestal'
  }
];

export default function Home({ onNavigate }) {
  // Synchronous initial cache retrieval for instant 0ms first paint on repeat/refreshed visits
  const cached = bootstrapService.getCachedHomeData();

  const [bestsellers, setBestsellers] = useState(cached?.bestsellers || []);
  const [categories, setCategories] = useState(cached?.categories || []);
  const [bannerImages, setBannerImages] = useState(cached?.bannerImages || null);
  const [settings, setSettings] = useState(cached?.settings || null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        // Fast single-roundtrip bootstrap call
        const bootstrapData = await bootstrapService.getHomeData();

        if (!isMounted) return;

        if (bootstrapData) {
          if (bootstrapData.bestsellers && bootstrapData.bestsellers.length > 0) {
            setBestsellers(bootstrapData.bestsellers);
          }
          if (bootstrapData.categories && bootstrapData.categories.length > 0) {
            setCategories(bootstrapData.categories);
          }
          if (bootstrapData.settings) {
            setSettings(bootstrapData.settings);
          }
          if (bootstrapData.bannerImages && bootstrapData.bannerImages.length > 0) {
            setBannerImages(bootstrapData.bannerImages);
          } else if (!bannerImages) {
            setBannerImages(DEFAULT_FALLBACK_BANNERS);
          }
        } else {
          // Fallback to individual service calls if bootstrap endpoint is unavailable
          const [prodRes, catRes, offersRes, settingsRes] = await Promise.allSettled([
            productService.getProducts({ featured: true }),
            categoryService.getCategories(),
            offerService.getActiveOffers(),
            settingService.getSettings()
          ]);

          if (!isMounted) return;

          if (prodRes.status === 'fulfilled' && prodRes.value) {
            setBestsellers(prodRes.value);
          }
          if (catRes.status === 'fulfilled' && catRes.value) {
            setCategories(catRes.value);
          }

          const s = settingsRes.status === 'fulfilled' ? settingsRes.value : null;
          const o = offersRes.status === 'fulfilled' ? offersRes.value : [];

          if (s) {
            setSettings(s);
          }

          const banners = extractBannerImages(s, o);
          if (banners && banners.length > 0) {
            setBannerImages(banners);
          } else if (!bannerImages) {
            setBannerImages(DEFAULT_FALLBACK_BANNERS);
          }
        }
      } catch (err) {
        console.error('Failed to load home page collections', err);
        if (!bannerImages) {
          setBannerImages(DEFAULT_FALLBACK_BANNERS);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-14 sm:space-y-20 pb-20 bg-white">
      {/* =========================================================================
          1. SMART REUSABLE RESPONSIVE BANNER SLIDER
          - Automatically fits every device: Desktop, Laptop, Tablet & Mobile
          - When loading, renders matching luxury shimmer skeleton (NO outdated banners)
          - Proportional aspect ratio ensures ZERO text or content is ever cropped
         ========================================================================= */}
      <ResponsiveBannerSlider
        banners={bannerImages}
        loading={loading && !bannerImages}
        onNavigate={onNavigate}
        autoPlayInterval={4500}
      />

      {/* =========================================================================
          2. TRUST BADGES BAR — LUXURY MONOCHROME BLACK & WHITE
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 p-3.5 sm:p-6 bg-neutral-50 border border-neutral-200 rounded-xl sm:rounded-2xl shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Award className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-black">100% Original</h4>
              <p className="text-[9px] sm:text-[11px] text-neutral-500 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">Direct French Oil Extrait</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Truck className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-black">Express Dispatch</h4>
              <p className="text-[9px] sm:text-[11px] text-neutral-500 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">Free over ₹999 in India</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <RotateCcw className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-black">Free 2ml Tester</h4>
              <p className="text-[9px] sm:text-[11px] text-neutral-500 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">Risk-free skin test</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-black">Cash On Delivery</h4>
              <p className="text-[9px] sm:text-[11px] text-neutral-500 font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">Safe doorstep payment</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. POPULAR CATEGORIES ROW — SOLID BLACK HOVERS & SKELETON LOADERS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-black" /> ARTISANAL SCENT PROFILES
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black uppercase tracking-wider text-black mt-1">
            SHOP BY POPULAR CATEGORIES
          </h2>
          <div className="w-16 h-1 bg-black mx-auto mt-2.5 rounded-full" />
        </div>

        {loading && categories.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-neutral-50 rounded-xl sm:rounded-2xl border border-neutral-200 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-neutral-200" />
                <div className="p-2.5 sm:p-4 text-center space-y-2">
                  <div className="h-3.5 bg-neutral-200 rounded w-2/3 mx-auto" />
                  <div className="h-2.5 bg-neutral-200 rounded w-1/3 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => onNavigate('catalog', { category: cat.slug })}
                className="group cursor-pointer bg-white rounded-xl sm:rounded-2xl border border-neutral-200 overflow-hidden hover:border-black hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-2.5 sm:p-4 text-center bg-white border-t border-neutral-100">
                  <h3 className="text-[11px] sm:text-sm font-black uppercase tracking-wider text-black group-hover:underline transition line-clamp-1">
                    {cat.name}
                  </h3>
                  <span className="text-[9px] sm:text-[11px] text-neutral-500 font-semibold mt-0.5 inline-block group-hover:text-black">
                    Explore →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          4. TWO-COLUMN DYNAMIC PROMOTIONAL CMS FEATURE BANNERS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && !settings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="h-72 sm:h-96 rounded-2xl bg-neutral-900 border border-neutral-800 animate-pulse p-6 sm:p-8 flex flex-col justify-end">
              <div className="w-20 h-5 bg-neutral-800 rounded-full mb-3" />
              <div className="w-3/4 h-7 bg-neutral-800 rounded mb-2" />
              <div className="w-1/2 h-4 bg-neutral-800/70 rounded mb-4" />
              <div className="w-32 h-9 bg-neutral-800 rounded-lg" />
            </div>
            <div className="h-72 sm:h-96 rounded-2xl bg-neutral-900 border border-neutral-800 animate-pulse p-6 sm:p-8 flex flex-col justify-end">
              <div className="w-20 h-5 bg-neutral-800 rounded-full mb-3" />
              <div className="w-3/4 h-7 bg-neutral-800 rounded mb-2" />
              <div className="w-1/2 h-4 bg-neutral-800/70 rounded mb-4" />
              <div className="w-32 h-9 bg-neutral-800 rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Banner 1: Men (Configurable via Admin CMS) */}
            <div
              onClick={() => onNavigate('catalog', { gender: 'Men' })}
              className="group relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer bg-black shadow-md hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
            >
              <img
                src={sanitizeMediaUrl(settings?.promo_banner_him_image) || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200"}
                alt="Men's Fragrances"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                <span className="inline-block self-start text-[10px] font-black text-black bg-white px-3 py-1 rounded-full uppercase tracking-widest shadow">
                  FOR HIM
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-white mt-2.5">
                  {settings?.promo_banner_him_title || 'BOLD & COMMANDING EXTRAITS'}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 max-w-sm line-clamp-2">
                  {settings?.promo_banner_him_subtitle || 'Smoked Tuscan leather, aquatic citrus, and regal Arabian ouds.'}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-300">
                    SHOP MEN'S <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Banner 2: Women (Configurable via Admin CMS) */}
            <div
              onClick={() => onNavigate('catalog', { gender: 'Women' })}
              className="group relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer bg-black shadow-md hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
            >
              <img
                src={sanitizeMediaUrl(settings?.promo_banner_her_image) || "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1200"}
                alt="Women's Fragrances"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
                <span className="inline-block self-start text-[10px] font-black text-black bg-white px-3 py-1 rounded-full uppercase tracking-widest shadow">
                  FOR HER
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-white mt-2.5">
                  {settings?.promo_banner_her_title || 'SENSUAL & GOURMAND FLORALS'}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 max-w-sm line-clamp-2">
                  {settings?.promo_banner_her_subtitle || 'Bourbon vanilla, white gardenia petals, and roasted espresso bean notes.'}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-300">
                    SHOP WOMEN'S <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          5. BEST SELLERS / TRENDING NOW PRODUCT GRID
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-neutral-200 gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500">
              MOST WANTED FLIGHTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black uppercase text-black mt-0.5">
              BEST SELLERS & NEW RELEASES
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-black uppercase tracking-wider text-black hover:underline flex items-center gap-1.5 transition group"
          >
            <span>View All ({bestsellers.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading && bestsellers.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-neutral-100" />
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-3 bg-neutral-200 rounded w-1/3" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3.5 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
            {bestsellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
