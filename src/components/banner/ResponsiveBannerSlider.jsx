import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sanitizeMediaUrl } from '../../api/endpoints';

const LUXURY_FALLBACK_BANNER = 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=85&w=2000';

export default function ResponsiveBannerSlider({
  banners = [],
  onNavigate,
  autoPlayInterval = 4500
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  // If no banners provided, return null
  if (!banners || banners.length === 0) return null;

  // Auto-play timer
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [banners.length, isPaused, autoPlayInterval]);

  // Touch Swipe Handlers for Mobile Devices
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      // Next slide
      setCurrentSlide(prev => (prev + 1) % banners.length);
    } else if (isRightSwipe) {
      // Prev slide
      setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length);
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handleSlideClick = (banner) => {
    if (!banner.link || !onNavigate) return;

    if (typeof banner.link === 'string') {
      if (banner.link.startsWith('http://') || banner.link.startsWith('https://')) {
        window.open(banner.link, '_blank');
      } else {
        // e.g. "catalog" or "catalog?category=oriental-ouds"
        const [page, query] = banner.link.split('?');
        const params = {};
        if (query) {
          const searchParams = new URLSearchParams(query);
          searchParams.forEach((val, key) => {
            params[key] = val;
          });
        }
        onNavigate(page || 'catalog', params);
      }
    } else if (typeof banner.link === 'object' && banner.link.page) {
      onNavigate(banner.link.page, banner.link.params || {});
    }
  };

  const activeBanner = banners[currentSlide] || banners[0];
  const hasDedicatedMobileImage = !!activeBanner?.mobile_image;

  return (
    <section
      className="relative w-full overflow-hidden bg-black select-none group shadow-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Hero Banners"
    >
      {/* 
        SMART RESPONSIVE BANNER STAGE:
        1. When dedicated mobile image exists: 
           - Mobile (< 768px): aspect-[4/5] (or aspect-square) -> perfectly scaled for phone screens!
           - Desktop (>= 768px): aspect-[21/9] (or aspect-[2.7/1]) -> ultra-wide landscape!
        2. When single desktop image is used:
           - Scales fluidly with proportional aspect ratio so 100% of the image (including all text & bottles)
             is fully visible without horizontal or vertical cropping!
      */}
      <div
        className={`relative w-full transition-all duration-500 overflow-hidden ${
          hasDedicatedMobileImage
            ? 'aspect-[4/5] sm:aspect-[16/7] md:aspect-[2.4/1] lg:aspect-[2.74/1]'
            : 'aspect-[16/9] sm:aspect-[16/7] md:aspect-[2.4/1] lg:aspect-[2.74/1]'
        }`}
      >
        {banners.map((banner, idx) => {
          const isActive = idx === currentSlide;
          const isClickable = !!banner.link;
          const bannerDesktopImg = sanitizeMediaUrl(banner.image || '');
          const bannerMobileImg = banner.mobile_image ? sanitizeMediaUrl(banner.mobile_image) : '';
          const hasMobileImg = !!bannerMobileImg;

          return (
            <div
              key={banner.id || idx}
              onClick={() => isClickable && handleSlideClick(banner)}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              } ${isClickable ? 'cursor-pointer' : ''}`}
            >
              {/* HTML5 <picture> Art Direction: Automatically serves Mobile Banner on mobile, Desktop Banner on laptops */}
              <picture className="w-full h-full block">
                {hasMobileImg && (
                  <source
                    media="(max-width: 767px)"
                    srcSet={bannerMobileImg}
                  />
                )}
                <source
                  media="(min-width: 768px)"
                  srcSet={bannerDesktopImg}
                />
                <img
                  src={bannerDesktopImg || LUXURY_FALLBACK_BANNER}
                  alt={banner.alt || `Kochee Perfume Banner Slide ${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = LUXURY_FALLBACK_BANNER;
                  }}
                  className={`w-full h-full transform transition-transform duration-[6000ms] ease-out ${
                    hasMobileImg
                      ? 'object-cover object-center'
                      : 'object-contain sm:object-cover object-center'
                  } ${isActive ? 'scale-102 sm:scale-104' : 'scale-100'}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </picture>

              {/* Soft ambient gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 pointer-events-none" />
            </div>
          );
        })}

        {/* Carousel Arrow Controls (Desktop & Tablet) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length)}
              className="absolute left-2.5 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-white hover:text-black text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Previous banner slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => (prev + 1) % banners.length)}
              className="absolute right-2.5 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-white hover:text-black text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Next banner slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Bottom Progress Indicator Dots / Pills */}
            <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2.5 px-3 py-1 sm:py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 shadow-lg">
              {banners.map((_, i) => {
                const isActive = i === currentSlide;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
                      isActive
                        ? 'bg-white w-6 sm:w-9 shadow-sm'
                        : 'bg-white/40 hover:bg-white/80 w-1.5 sm:w-2'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

