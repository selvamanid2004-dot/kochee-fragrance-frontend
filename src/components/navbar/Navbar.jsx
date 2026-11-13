import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User, ArrowLeft, Home as HomeIcon, LogIn, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { settingService } from '../../services/settingService';

export default function Navbar({ onNavigate, currentPage }) {
  const { totalItemCount, setIsCartDrawerOpen } = useCart();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Dynamic Site Settings from CMS
  const [settings, setSettings] = useState({
    logo_text: 'KOCHEE',
    logo_subtitle: 'HAUTE PARFUMERIE',
    logo_image: '',
    announcement_text: '✨ 100% ORIGINAL LUXURY PERFUMES • AUTHENTICITY GUARANTEED | 🚚 FREE PAN-INDIA SHIPPING ON ORDERS ABOVE ₹999 | 💵 CASH ON DELIVERY AVAILABLE'
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingService.getSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        // Fallback gracefully
      }
    }
    loadSettings();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('catalog', { search: searchQuery.trim() });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 transition-all shadow-xs">
      {/* 1. Solid Luxury Black Announcement Bar (Dynamic from CMS) */}
      <div className="bg-black text-white py-2 px-3 sm:px-4 text-[10px] sm:text-xs font-semibold tracking-wider text-center overflow-x-hidden leading-snug">
        <span>{settings.announcement_text}</span>
      </div>

      {/* 2. Middle Main Bar: Brand, Search, Customer Login/Account, Bag */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4 flex items-center justify-between gap-2 sm:gap-6">
        {/* Mobile Hamburger */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 text-black hover:text-neutral-700 transition rounded-lg hover:bg-neutral-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        {/* Brand Logo: Clicking logo always returns Home (Dynamic from CMS) */}
        <div
          className="flex-shrink-0 cursor-pointer text-center lg:text-left group"
          onClick={() => onNavigate('home')}
        >
          {settings.logo_image ? (
            <img src={settings.logo_image} alt={settings.logo_text || 'KOCHEE'} className="h-6 sm:h-8 object-contain" />
          ) : (
            <>
              <div className="flex items-center justify-center lg:justify-start gap-1">
                <span className="font-serif tracking-[0.16em] sm:tracking-[0.2em] text-lg sm:text-2xl md:text-3xl font-extrabold text-black uppercase block leading-none group-hover:text-neutral-700 transition-colors">
                  {settings.logo_text || 'KOCHEE'}<span className="text-black">.</span>
                </span>
              </div>
              <span className="text-[7px] sm:text-[9px] tracking-[0.32em] sm:tracking-[0.38em] text-neutral-500 font-sans uppercase block mt-0.5 sm:mt-1 font-bold">
                {settings.logo_subtitle || 'HAUTE PARFUMERIE'}
              </span>
            </>
          )}
        </div>

        {/* Center Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xl mx-4 relative items-center"
        >
          <input
            type="text"
            placeholder="Search perfumes, notes, inspirations (e.g. Saffron Oud, Riviera, Vanilla)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-300 rounded-full py-2.5 pl-5 pr-12 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-3.5 text-neutral-600 hover:text-black transition"
            aria-label="Search button"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Actions: Customer Account / Login & Shopping Bag */}
        <div className="flex items-center space-x-1.5 sm:space-x-4">
          {/* Customer Account / Sign In */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-black border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:border-black transition"
              >
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline">{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-600" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200 rounded-2xl shadow-xl py-2 z-50 text-xs animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50">
                    <p className="font-bold text-black truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-neutral-500 font-mono truncate">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('account');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 font-semibold text-neutral-800 hover:text-black transition"
                  >
                    My Account & Orders
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('track');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-neutral-100 text-neutral-600 hover:text-black transition"
                  >
                    Track Shipment
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      onNavigate('home');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold border-t border-neutral-100 mt-1 transition"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-black bg-neutral-100 border border-neutral-300 p-2 sm:px-3.5 sm:py-1.5 rounded-xl hover:bg-black hover:text-white hover:border-black transition active:scale-95 shadow-xs"
              aria-label="Customer Login"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Log In</span>
            </button>
          )}

          {/* Cart Bag */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative flex items-center gap-1 text-black hover:text-neutral-700 transition p-1.5 sm:p-2 rounded-xl hover:bg-neutral-100 active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] sm:text-[10px] font-black w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalItemCount}
              </span>
            )}
            <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider ml-1">Bag</span>
          </button>
        </div>
      </div>

      {/* 3. Header Menu: HOME, ABOUT, CONTACT, ALL PERFUMES (Fluid horizontal touch strip on mobile, centered on desktop) */}
      <nav className="border-t border-neutral-200 bg-white overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start sm:justify-center gap-6 sm:gap-12 py-2.5 sm:py-3 min-w-max sm:min-w-0">
          <button
            onClick={() => onNavigate('home')}
            className={`text-[11px] sm:text-xs font-extrabold tracking-[0.2em] sm:tracking-[0.25em] uppercase transition py-1 relative group whitespace-nowrap ${
              currentPage === 'home' ? 'text-black font-black' : 'text-neutral-600 hover:text-black'
            }`}
          >
            HOME
            <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
              currentPage === 'home' ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </button>

          <button
            onClick={() => onNavigate('catalog')}
            className={`text-[11px] sm:text-xs font-extrabold tracking-[0.2em] sm:tracking-[0.25em] uppercase transition py-1 relative group whitespace-nowrap ${
              currentPage === 'catalog' ? 'text-black font-black' : 'text-neutral-600 hover:text-black'
            }`}
          >
            ALL PERFUMES
            <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
              currentPage === 'catalog' ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </button>

          <button
            onClick={() => onNavigate('about')}
            className={`text-[11px] sm:text-xs font-extrabold tracking-[0.2em] sm:tracking-[0.25em] uppercase transition py-1 relative group whitespace-nowrap ${
              currentPage === 'about' ? 'text-black font-black' : 'text-neutral-600 hover:text-black'
            }`}
          >
            ABOUT
            <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
              currentPage === 'about' ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className={`text-[11px] sm:text-xs font-extrabold tracking-[0.2em] sm:tracking-[0.25em] uppercase transition py-1 relative group whitespace-nowrap ${
              currentPage === 'contact' ? 'text-black font-black' : 'text-neutral-600 hover:text-black'
            }`}
          >
            CONTACT
            <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ${
              currentPage === 'contact' ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-5 space-y-4 shadow-xl animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative mb-4">
            <input
              type="text"
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl py-2.5 pl-4 pr-10 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black"
            />
            <button type="submit" className="absolute right-3 text-neutral-600 hover:text-black">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-2 text-xs tracking-wider uppercase font-bold text-black">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between transition"
            >
              <span>Home</span>
              <span className="font-mono">→</span>
            </button>
            <button
              onClick={() => {
                onNavigate('catalog');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between transition"
            >
              <span>All Perfumes</span>
              <span className="font-mono">→</span>
            </button>
            <button
              onClick={() => {
                onNavigate('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between transition"
            >
              <span>About Us</span>
              <span className="font-mono">→</span>
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2.5 px-3 rounded-lg hover:bg-neutral-100 flex items-center justify-between transition"
            >
              <span>Contact</span>
              <span className="font-mono">→</span>
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  onNavigate('account');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg bg-neutral-100 text-black font-black flex items-center justify-between transition mt-2"
              >
                <span>My Account & Orders ({currentUser.name})</span>
                <span className="font-mono">→</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onNavigate('login');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2.5 px-3 rounded-lg bg-black text-white font-black flex items-center justify-between transition mt-2"
              >
                <span>Customer Login / Register</span>
                <span className="font-mono">→</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
