import { apiClient } from '../api/apiClient';
import { ENDPOINTS, sanitizeMediaUrl } from '../api/endpoints';

const BOOTSTRAP_CACHE_KEY = 'kochee_home_bootstrap_v2';
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export function extractBannerImages(settings, offers = []) {
  if (settings && settings.hero_banners) {
    let parsed = settings.hero_banners;
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
        return validSlides;
      }
    }
  }

  // Active promotional offers fallback
  if (Array.isArray(offers) && offers.length > 0) {
    const offerImages = offers
      .filter(o => o.banner_image && o.is_active)
      .map((offer, idx) => ({
        id: `offer-img-${offer.id || idx}`,
        image: sanitizeMediaUrl(offer.banner_image),
        mobile_image: sanitizeMediaUrl(offer.banner_image),
        alt: offer.title || 'Special Promotion'
      }));

    if (offerImages.length > 0) {
      return offerImages;
    }
  }

  return null;
}

export const bootstrapService = {
  /**
   * Synchronously retrieve cached bootstrap data from localStorage for instant, zero-flicker 0ms render.
   */
  getCachedHomeData() {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(BOOTSTRAP_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.data) return null;

      // Check cache age
      if (Date.now() - parsed.timestamp > CACHE_MAX_AGE_MS) {
        localStorage.removeItem(BOOTSTRAP_CACHE_KEY);
        return null;
      }

      const { settings, categories, bestsellers, offers } = parsed.data;
      const bannerImages = extractBannerImages(settings, offers);

      return {
        settings: settings || null,
        categories: categories || [],
        bestsellers: bestsellers || [],
        offers: offers || [],
        bannerImages
      };
    } catch (e) {
      return null;
    }
  },

  /**
   * Fetch latest bootstrap data in a single network round-trip.
   */
  async getHomeData({ forceRefresh = false } = {}) {
    try {
      const res = await apiClient.get(ENDPOINTS.BOOTSTRAP, { skipDedupe: forceRefresh });
      if (res && res.data) {
        const data = res.data;
        const bannerImages = extractBannerImages(data.settings, data.offers);

        // Preload first banner image in background to ensure instant crisp render
        if (bannerImages && bannerImages.length > 0 && bannerImages[0].image) {
          try {
            const preloader = new Image();
            preloader.src = bannerImages[0].image;
          } catch (e) {}
        }

        // Cache latest validated data
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              BOOTSTRAP_CACHE_KEY,
              JSON.stringify({ timestamp: Date.now(), data })
            );
          } catch (e) {}
        }

        return {
          settings: data.settings || null,
          categories: data.categories || [],
          bestsellers: data.bestsellers || [],
          offers: data.offers || [],
          bannerImages
        };
      }
    } catch (err) {
      console.warn('[BootstrapService] Failed to load consolidated bootstrap data, falling back to cached or individual calls', err);
    }

    return null;
  },

  /**
   * Invalidate local cache when admin modifies products, banners, or settings
   */
  clearCache() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(BOOTSTRAP_CACHE_KEY);
      } catch (e) {}
    }
  }
};
