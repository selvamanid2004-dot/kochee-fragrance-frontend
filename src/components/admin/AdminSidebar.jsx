import React from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Boxes,
  Percent,
  Palette,
  ShoppingCart,
  Users,
  Mail,
  ExternalLink,
  LogOut,
  ShieldCheck,
  AlertTriangle,
  X
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  onNavigate,
  logout,
  adminUser,
  stats = {},
  mobileOpen = false,
  setMobileOpen = () => {}
}) {
  const lowStockCount = stats?.lowStockCount || 0;
  const outOfStockCount = stats?.outOfStockCount || 0;
  const pendingOrdersCount = stats?.pendingOrders || 0;
  const totalCustomers = stats?.totalCustomers || 0;

  const menuItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'products',
      label: 'Products & Bulk Import',
      icon: Package,
      badge: null
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FolderTree,
      badge: null
    },
    {
      id: 'stock',
      label: 'Stock Management',
      icon: Boxes,
      badge: (lowStockCount + outOfStockCount) > 0 ? (
        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-500/30">
          <AlertTriangle className="w-2.5 h-2.5" />
          {lowStockCount + outOfStockCount}
        </span>
      ) : null
    },
    {
      id: 'cms',
      label: 'Banners & CMS Branding',
      icon: Palette,
      badge: null
    },
    {
      id: 'offers',
      label: 'Promotions & Coupons',
      icon: Percent,
      badge: null
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? (
        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
          {pendingOrdersCount}
        </span>
      ) : null
    },
    {
      id: 'customers',
      label: 'Customer Directory',
      icon: Users,
      badge: totalCustomers > 0 ? (
        <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
          {totalCustomers}
        </span>
      ) : null
    },
    {
      id: 'inquiries',
      label: 'Inquiries',
      icon: Mail,
      badge: null
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#0c0e12] border-r border-[#1e232d] flex flex-col flex-shrink-0 text-gray-300 select-none z-50 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand & Admin Panel Badge */}
        <div className="p-6 border-b border-[#1e232d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 flex items-center justify-center text-black font-black font-serif text-xl shadow-lg shadow-amber-500/20">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black tracking-[0.2em] text-white text-base uppercase leading-none">
                  KOCHEE
                </span>
                <span className="bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded">
                  PRO
                </span>
              </div>
              <span className="text-[10px] tracking-[0.25em] text-gray-500 uppercase font-sans font-semibold mt-1 block">
                ENTERPRISE ADMIN
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1a1f29] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-400 px-3 pb-2 font-mono">
            Core Operations
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-amber-400 text-black font-bold shadow-md shadow-amber-400/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#161a22]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-black' : 'text-gray-500 group-hover:text-amber-400'
                    }`}
                  />
                  <span className="tracking-wide">{item.label}</span>
                </div>
                {item.badge}
              </button>
            );
          })}
        </div>

        {/* Footer Actions: Live Store Link & Admin User */}
        <div className="p-4 border-t border-[#1e232d] space-y-3 bg-[#0a0c0f]">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#161a22] hover:bg-[#202632] border border-[#2a303e] rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition group"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            <span>View Customer Store</span>
          </button>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#1c222c] border border-gray-700 flex items-center justify-center text-amber-300 font-bold text-xs flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-white truncate">
                  {adminUser?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-gray-500 font-mono truncate">
                  {adminUser?.email || 'admin@kochee.com'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log Out of Admin Panel"
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
