import React from 'react';
import { safeStorage } from '../../utils/safeStorage';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Global Error Boundary Caught]:', error, errorInfo);

    // Auto-Recovery mechanism:
    // If an initial render error occurs (e.g. stale cache, chunk mismatch, or first-time storage initialization),
    // automatically clear potentially conflicting local caches and reload seamlessly once without
    // displaying a manual blocking screen to the user.
    if (typeof window !== 'undefined') {
      const AUTO_RECOVER_KEY = 'kochee_eb_auto_recover';
      const lastRecover = safeStorage.getItem(AUTO_RECOVER_KEY);
      const now = Date.now();

      if (!lastRecover || now - parseInt(lastRecover, 10) > 15000) {
        safeStorage.setItem(AUTO_RECOVER_KEY, String(now));
        safeStorage.removeItem('kochee_home_bootstrap_v2');
        safeStorage.removeItem('kochee_cart');
        try {
          window.location.replace('/');
          return;
        } catch {
          // If replace fails, fall through to render
        }
      }
    }
  }

  handleReload = () => {
    safeStorage.clear();
    window.location.replace('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 shadow-xl">
            <span className="font-serif text-2xl font-bold tracking-widest text-amber-400">K</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest uppercase mb-3">
            KOCHEE FRAGRANCE
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
            Welcome to Haute Parfumerie. Tap below to launch your luxury fragrance experience.
          </p>
          <button
            onClick={this.handleReload}
            className="px-8 py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            Enter Storefront
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
