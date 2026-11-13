import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  Boxes,
  Users,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  PackageX,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboardView({
  stats,
  orders = [],
  products = [],
  setActiveTab
}) {
  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const totalStockUnits = stats?.totalStockUnits || 0;
  const totalCustomers = stats?.totalCustomers || 0;
  const lowStockCount = stats?.lowStockCount || 0;
  const outOfStockCount = stats?.outOfStockCount || 0;
  const recentOrders = stats?.recentOrders || orders.slice(0, 6);

  // Identify low stock and out of stock items
  const outOfStockItems = products.filter(p => Number(p.stock) === 0);
  const lowStockItems = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5);

  return (
    <div className="space-y-8">
      {/* 1. Critical Inventory Alert Banners (if any) */}
      {(outOfStockCount > 0 || lowStockCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outOfStockCount > 0 && (
            <div className="bg-gradient-to-r from-red-950/40 via-red-900/20 to-transparent border border-red-500/30 rounded-2xl p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                  <PackageX className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-300">
                    {outOfStockCount} Product{outOfStockCount > 1 ? 's' : ''} Completely Out of Stock!
                  </h4>
                  <p className="text-xs text-red-200/70 mt-1">
                    Customers cannot purchase items with 0 inventory. Please restock immediately.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {outOfStockItems.slice(0, 3).map(p => (
                      <span key={p.id} className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-md font-mono">
                        {p.title}
                      </span>
                    ))}
                    {outOfStockItems.length > 3 && (
                      <span className="text-[10px] text-red-300">+{outOfStockItems.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('stock')}
                className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-black font-bold text-xs transition self-start flex-shrink-0"
              >
                Restock Now
              </button>
            </div>
          )}

          {lowStockCount > 0 && (
            <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent border border-amber-500/30 rounded-2xl p-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    {lowStockCount} Product{lowStockCount > 1 ? 's' : ''} Running Critically Low (&le; 5 units)
                  </h4>
                  <p className="text-xs text-amber-200/70 mt-1">
                    Stock levels have dipped below minimum safe buffer thresholds.
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {lowStockItems.slice(0, 3).map(p => (
                      <span key={p.id} className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md font-mono">
                        {p.title} ({p.stock} left)
                      </span>
                    ))}
                    {lowStockItems.length > 3 && (
                      <span className="text-[10px] text-amber-300">+{lowStockItems.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('stock')}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition self-start flex-shrink-0"
              >
                Manage Stock
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-[#13171f] border border-[#1e2430] hover:border-amber-500/40 rounded-2xl p-5 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-colors">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
              ₹{Number(totalRevenue).toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-time Gross Sales</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#13171f] border border-[#1e2430] hover:border-blue-500/40 rounded-2xl p-5 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-black transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
              {totalOrders}
            </h3>
            <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{stats?.pendingOrders || 0} Pending Dispatch</span>
            </p>
          </div>
        </div>

        {/* Total Stock Units */}
        <div className="bg-[#13171f] border border-[#1e2430] hover:border-purple-500/40 rounded-2xl p-5 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Stock Units
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-black transition-colors">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
              {Number(totalStockUnits).toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1 font-medium">
              <span>Across {products.length} Fragrance SKUs</span>
            </p>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-[#13171f] border border-[#1e2430] hover:border-emerald-500/40 rounded-2xl p-5 transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Customer Accounts
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-white font-mono tracking-tight">
              {totalCustomers}
            </h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <span>Mandatory Customer Auth</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. Sales & Inventory Velocity Report */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Status Breakdown */}
        <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#1e2430]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Inventory Health
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Real-time SKU availability</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">
              {products.length} SKUs
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-emerald-400">In Stock (Healthy)</span>
                <span className="text-white font-mono">
                  {products.filter(p => Number(p.stock) > 5).length} SKUs
                </span>
              </div>
              <div className="w-full bg-[#1e2430] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${products.length ? (products.filter(p => Number(p.stock) > 5).length / products.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-amber-400">Low Stock Alert (&le; 5 units)</span>
                <span className="text-white font-mono">{lowStockCount} SKUs</span>
              </div>
              <div className="w-full bg-[#1e2430] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${products.length ? (lowStockCount / products.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-red-400">Out of Stock (= 0 units)</span>
                <span className="text-white font-mono">{outOfStockCount} SKUs</span>
              </div>
              <div className="w-full bg-[#1e2430] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${products.length ? (outOfStockCount / products.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#1e2430] flex items-center justify-between">
            <span className="text-xs text-gray-400">Manage all warehouse stock</span>
            <button
              onClick={() => setActiveTab('stock')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Inventory Table</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Operations Guide */}
        <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-[#1e2430]">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Storefront Control Center
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Autonomous e-commerce administration</p>
            </div>
            <span className="text-[10px] bg-amber-400/10 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded font-mono">
              v2.4 Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div
              onClick={() => setActiveTab('products')}
              className="p-4 rounded-xl bg-[#171c24] border border-[#232936] hover:border-amber-400/50 cursor-pointer transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Boxes className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                Bulk Excel Upload
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                Add 20+ products at once via XLSX template with error validation.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('offers')}
              className="p-4 rounded-xl bg-[#171c24] border border-[#232936] hover:border-amber-400/50 cursor-pointer transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                Dynamic Hero Sliders
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                Activated offers automatically appear on the customer website hero carousel.
              </p>
            </div>

            <div
              onClick={() => setActiveTab('cms')}
              className="p-4 rounded-xl bg-[#171c24] border border-[#232936] hover:border-amber-400/50 cursor-pointer transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                Live CMS & Logo
              </h4>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                Update logo, announcement ticker, and promotional banners without editing code.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Orders Table */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[#1e2430] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Live transactions and fulfillment status
            </p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-xs">
            No customer orders placed yet. Orders will appear here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171c24] text-gray-400 uppercase font-mono tracking-wider text-[11px] border-b border-[#1e2430]">
                <tr>
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2430] text-gray-300 font-sans">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#181d26] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-amber-300">
                      #{ord.order_number || ord.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{ord.customer_name}</div>
                      <div className="text-[11px] text-gray-400 font-mono">{ord.customer_email}</div>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {new Date(ord.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6 uppercase text-[10px] font-mono font-bold">
                      <span className="px-2 py-0.5 rounded bg-[#1e2430] text-gray-300">
                        {ord.payment_method || 'COD'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {(() => {
                        const st = (ord.order_status || ord.status || 'Processing');
                        const lower = st.toLowerCase();
                        return (
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              lower === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : lower === 'shipped'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : lower === 'cancelled'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {st}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-white">
                      ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

