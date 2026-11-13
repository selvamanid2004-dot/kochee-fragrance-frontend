import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Award, Sparkles } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import ResponsiveBannerSlider from '../../components/banner/ResponsiveBannerSlider';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { offerService } from '../../services/offerService';
import { settingService } from '../../services/settingService';
import { sanitizeMediaUrl } from '../../api/endpoints';

// Default 6 Curated High-Definition Luxury Perfume Visuals
const DEFAULT_BANNER_IMAGES = [
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
  },
  {
    id: 'banner-3',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=85&w=900',
    alt: 'Oceanic azure Mediterranean luxury perfume with water ripple reflections'
  },
  {
    id: 'banner-4',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=85&w=900',
    alt: 'Parisian crystal flacon surrounded by pure white jasmine petals'
  },
  {
    id: 'banner-5',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=85&w=900',
    alt: 'Minimalist blush rose and vanilla perfume on Italian marble'
  },
  {
    id: 'banner-6',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=85&w=900',
    alt: 'Smoky midnight noir leather and saffron extrait flacon'
  }
];

export default function Home({ onNavigate }) {
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bannerImages, setBannerImages] = useState(DEFAULT_BANNER_IMAGES);

  const [settings, setSettings] = useState({
    promo_banner_him_title: 'POUR HOMME COLLECTION',
    promo_banner_him_subtitle: 'Artisanal smoky ouds and fresh aquatics tailored for charismatic men.',
    promo_banner_him_image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200',
    promo_banner_her_title: 'POUR FEMME COLLECTION',
    promo_banner_her_subtitle: 'Sensual Bulgarian roses, rich gourmands, and luminous florals.',
    promo_banner_her_image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1200'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, offersRes, settingsRes] = await Promise.allSettled([
          productService.getProducts({ featured: true }),
          categoryService.getCategories(),
          offerService.getActiveOffers(),
          settingService.getSettings()
        ]);

        if (prodRes.status === 'fulfilled') {
          setBestsellers(prodRes.value || []);
        }
        if (catRes.status === 'fulfilled') {
          setCategories(catRes.value || []);
        }

        let activeBanners = null;

        if (settingsRes.status === 'fulfilled' && settingsRes.value) {
          const s = settingsRes.value;
          setSettings(prev => ({
            ...prev,
            ...s,
            promo_banner_him_image: sanitizeMediaUrl(s.promo_banner_him_image || prev.promo_banner_him_image),
            promo_banner_her_image: sanitizeMediaUrl(s.promo_banner_her_image || prev.promo_banner_her_image)
          }));

          // 1. Check if Admin configured custom hero banners in Admin CMS
          if (s.hero_banners) {
            let parsed = s.hero_banners;
            if (typeof parsed === 'string') {
              try { parsed = JSON.parse(parsed); } catch (e) {}
            }
            if (Array.isArray(parsed) && parsed.length > 0) {
              const validSlides = parsed
                .filter(b => b && (b.image || typeof b === 'string'))
                .map((b, i) => {
                  const img = typeof b === 'string' ? b : b.image;
                  const mobImg = typeof b === 'object' ? (b.mobile_image || '') : '';
                  return {
                    id: b.id || `admin-slide-${i + 1}`,
                    image: sanitizeMediaUrl(img),
                    mobile_image: mobImg ? sanitizeMediaUrl(mobImg) : '',
                    fit_mode: (typeof b === 'object' && b.fit_mode) ? b.fit_mode : 'responsive',
                    link: (typeof b === 'object' && b.link) ? b.link : '',
                    alt: (typeof b === 'object' && b.alt) ? b.alt : `Kochee Luxury Perfume Banner ${i + 1}`
                  };
                });

              if (validSlides.length > 0) {
                activeBanners = validSlides;
              }
            }
          }
        }

        // Apply custom admin hero banners if present
        if (activeBanners && activeBanners.length > 0) {
          setBannerImages(activeBanners);
        } else if (offersRes.status === 'fulfilled' && Array.isArray(offersRes.value) && offersRes.value.length > 0) {
          // Otherwise, incorporate active promotional offer banners
          const offerImages = offersRes.value
            .filter(o => o.banner_image && o.is_active)
            .map((offer, idx) => ({
              id: `offer-img-${offer.id || idx}`,
              image: sanitizeMediaUrl(offer.banner_image),
              mobile_image: sanitizeMediaUrl(offer.banner_image),
              alt: offer.title || 'Special Promotion'
            }));

          if (offerImages.length > 0) {
            const combined = [...offerImages, ...DEFAULT_BANNER_IMAGES].slice(0, 6);
            setBannerImages(combined);
          }
        }
      } catch (err) {
        console.error('Failed to load home page collections', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-14 sm:space-y-20 pb-20 bg-white">
      {/* =========================================================================
          1. SMART REUSABLE RESPONSIVE BANNER SLIDER
          - Automatically fits every device: Desktop, Laptop, Tablet & Mobile
          - HTML5 <picture> Art Direction: Serves Mobile Banner on smartphones & Desktop Banner on laptops
          - Proportional aspect ratio ensures ZERO text or content is ever cropped or cut off
          - Native mobile touch swipe support & automatic carousel rotation
         ========================================================================= */}
      <ResponsiveBannerSlider
        banners={bannerImages}
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
          3. POPULAR CATEGORIES ROW — SOLID BLACK HOVERS & BORDERS
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
      </section>

      {/* =========================================================================
          4. TWO-COLUMN DYNAMIC PROMOTIONAL CMS FEATURE BANNERS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Banner 1: Men (Configurable via Admin CMS) */}
          <div
            onClick={() => onNavigate('catalog', { gender: 'Men' })}
            className="group relative h-72 sm:h-96 rounded-2xl overflow-hidden cursor-pointer bg-black shadow-md hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
          >
            <img
              src={settings.promo_banner_him_image || "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200"}
              alt="Men's Fragrances"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
              <span className="inline-block self-start text-[10px] font-black text-black bg-white px-3 py-1 rounded-full uppercase tracking-widest shadow">
                FOR HIM
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-white mt-2.5">
                {settings.promo_banner_him_title || 'BOLD & COMMANDING EXTRAITS'}
              </h3>
              <p className="text-xs text-neutral-300 mt-1 max-w-sm line-clamp-2">
                {settings.promo_banner_him_subtitle || 'Smoked Tuscan leather, aquatic citrus, and regal Arabian ouds.'}
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
              src={settings.promo_banner_her_image || "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1200"}
              alt="Women's Fragrances"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
              <span className="inline-block self-start text-[10px] font-black text-black bg-white px-3 py-1 rounded-full uppercase tracking-widest shadow">
                FOR HER
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black uppercase text-white mt-2.5">
                {settings.promo_banner_her_title || 'SENSUAL & GOURMAND FLORALS'}
              </h3>
              <p className="text-xs text-neutral-300 mt-1 max-w-sm line-clamp-2">
                {settings.promo_banner_her_subtitle || 'Bourbon vanilla, white gardenia petals, and roasted espresso bean notes.'}
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-lg group-hover:scale-105 transition-all duration-300">
                  SHOP WOMEN'S <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
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

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="aspect-[4/5] bg-neutral-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6">
            {bestsellers.map(product => (
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
