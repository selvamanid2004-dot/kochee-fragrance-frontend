import React from 'react';
import { RefreshCw, Plus, Menu } from 'lucide-react';

export default function AdminHeader({
  activeTab,
  onRefresh,
  loading,
  onQuickAction,
  onNavigate,
  onToggleMobileMenu
}) {
  const tabTitles = {
    overview: {
      title: 'Executive Dashboard',
      description: 'Real-time sales velocity, inventory health, and recent customer activity.'
    },
    products: {
      title: 'Product Catalog & Bulk Imports',
      description: 'Manage master fragrance SKUs, multi-image assets, olfactory pyramids, and Excel uploads.'
    },
    categories: {
      title: 'Category Taxonomy',
      description: 'Organize olfactory scent families, hero banners, and navigational hierarchy.'
    },
    stock: {
      title: 'Advanced Stock & Inventory Audit',
      description: 'Live inventory tracking, automatic checkout decrements, low-stock alerts, and ledger history.'
    },
    offers: {
      title: 'Promotions & Hero Banners',
      description: 'Configure active promotional campaigns, discounts, and real-time sliding hero banners.'
    },
    cms: {
      title: 'CMS & Storefront Branding',
      description: 'Control logo branding, announcement tickers, promo cards, and legal terms without code changes.'
    },
    orders: {
      title: 'Order Fulfillment & History',
      description: 'Review customer orders, dispatch packages, and update fulfillment tracking.'
    },
    customers: {
      title: 'Customer Directory & Accounts',
      description: 'Manage registered buyers, lifetime order volume, and account verification status.'
    },
    inquiries: {
      title: 'Customer Concierge Inquiries',
      description: 'Review scent consultations and messages received through the contact desk.'
    }
  };

  const currentMeta = tabTitles[activeTab] || {
    title: 'Management Suite',
    description: 'Control your luxury perfume operations.'
  };

  return (
    <header className="bg-[#10141a] border-b border-[#1e232d] px-4 sm:px-8 py-4 sm:py-5 sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger button */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl bg-[#171c24] border border-[#2a303e] text-gray-300 hover:text-white lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide">
              {currentMeta.title}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Production
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 font-medium line-clamp-1 sm:line-clamp-none">
            {currentMeta.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-[#171c24] hover:bg-[#202632] border border-[#2a303e] rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition"
          title="Reload latest database records"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Refresh Data</span>
        </button>

        {onQuickAction && (
          <button
            onClick={onQuickAction}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New</span>
          </button>
        )}
      </div>
    </header>
  );
}
