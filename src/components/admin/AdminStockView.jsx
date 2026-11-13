import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  PackageX,
  History,
  TrendingDown,
  TrendingUp,
  Search,
  CheckCircle2,
  X,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';
import { productService } from '../../services/productService';

export default function AdminStockView({
  products = [],
  onRefresh,
  setActionMessage
}) {
  const [stockLogs, setStockLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'low', 'out'
  const [search, setSearch] = useState('');

  // Adjustment Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustMode, setAdjustMode] = useState('add'); // 'add', 'subtract', 'set'
  const [adjustValue, setAdjustValue] = useState(10);
  const [adjustReason, setAdjustReason] = useState('Restock from laboratory batch');
  const [updatingStock, setUpdatingStock] = useState(false);

  const loadStockLogs = async () => {
    setLoadingLogs(true);
    try {
      const logs = await productService.getStockLogs(100);
      setStockLogs(logs || []);
    } catch (err) {
      console.error('Failed to load stock audit history', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadStockLogs();
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const stockNum = Number(p.stock);
    if (filterMode === 'out') return matchSearch && stockNum === 0;
    if (filterMode === 'low') return matchSearch && stockNum > 0 && stockNum <= 5;
    return matchSearch;
  });

  const outOfStockCount = products.filter(p => Number(p.stock) === 0).length;
  const lowStockCount = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 5).length;
  const healthyStockCount = products.filter(p => Number(p.stock) > 5).length;

  const handleOpenAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustMode('add');
    setAdjustValue(10);
    setAdjustReason('Laboratory batch restock');
  };

  const handleApplyStockAdjustment = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setUpdatingStock(true);

    try {
      const current = Number(selectedProduct.stock);
      const val = parseInt(adjustValue, 10) || 0;
      let newStock = current;

      if (adjustMode === 'add') {
        newStock = current + val;
      } else if (adjustMode === 'subtract') {
        newStock = Math.max(0, current - val);
      } else {
        newStock = Math.max(0, val);
      }

      await productService.updateStock(selectedProduct.id, newStock, adjustReason);
      setActionMessage(`Updated stock for "${selectedProduct.title}" to ${newStock} units.`);
      setSelectedProduct(null);
      onRefresh();
      loadStockLogs();
    } catch (err) {
      alert(err.message || 'Failed to update stock');
    } finally {
      setUpdatingStock(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Inventory Summary Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          onClick={() => setFilterMode('all')}
          className={`bg-[#13171f] border rounded-2xl p-5 cursor-pointer transition ${
            filterMode === 'all'
              ? 'border-emerald-500 bg-emerald-950/10'
              : 'border-[#1e2430] hover:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Healthy Stock (&gt; 5)
            </span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Boxes className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white font-mono">
              {healthyStockCount} SKUs
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">Normal fulfillment capacity</p>
          </div>
        </div>

        <div
          onClick={() => setFilterMode('low')}
          className={`bg-[#13171f] border rounded-2xl p-5 cursor-pointer transition ${
            filterMode === 'low'
              ? 'border-amber-500 bg-amber-950/10'
              : 'border-[#1e2430] hover:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Low Stock Alerts (&le; 5)
            </span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white font-mono">
              {lowStockCount} SKUs
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">Nearing out-of-stock threshold</p>
          </div>
        </div>

        <div
          onClick={() => setFilterMode('out')}
          className={`bg-[#13171f] border rounded-2xl p-5 cursor-pointer transition ${
            filterMode === 'out'
              ? 'border-red-500 bg-red-950/10'
              : 'border-[#1e2430] hover:border-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
              Out of Stock (0)
            </span>
            <span className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <PackageX className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white font-mono">
              {outOfStockCount} SKUs
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">Requires immediate restocking</p>
          </div>
        </div>
      </div>

      {/* 2. Stock Table with Quick Adjust */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1e2430] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterMode === 'all'
                  ? 'bg-amber-400 text-black'
                  : 'bg-[#181d26] text-gray-400 hover:text-white'
              }`}
            >
              All Products ({products.length})
            </button>
            <button
              onClick={() => setFilterMode('low')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterMode === 'low'
                  ? 'bg-amber-400 text-black'
                  : 'bg-[#181d26] text-gray-400 hover:text-white'
              }`}
            >
              Low Stock ({lowStockCount})
            </button>
            <button
              onClick={() => setFilterMode('out')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterMode === 'out'
                  ? 'bg-red-500 text-black font-bold'
                  : 'bg-[#181d26] text-gray-400 hover:text-white'
              }`}
            >
              Out of Stock ({outOfStockCount})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#181d26] border border-[#232936] rounded-xl py-1.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171c24] text-gray-400 uppercase font-mono tracking-wider text-[11px] border-b border-[#1e2430]">
              <tr>
                <th className="py-3.5 px-6">Fragrance SKU</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6 text-center">Current Quantity</th>
                <th className="py-3.5 px-6">Inventory Status</th>
                <th className="py-3.5 px-6 text-right">Quick Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2430] text-gray-300 font-sans">
              {filteredProducts.map((p) => {
                const stockNum = Number(p.stock);
                const isOut = stockNum === 0;
                const isLow = stockNum > 0 && stockNum <= 5;

                return (
                  <tr key={p.id} className="hover:bg-[#181d26] transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-white text-xs">{p.title}</div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        SKU #{p.id} • {p.volume}
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="text-gray-400">{p.category_name || 'Oriental'}</span>
                    </td>

                    <td className="py-3.5 px-6 text-center">
                      <span
                        className={`font-mono text-sm font-extrabold ${
                          isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {stockNum} units
                      </span>
                    </td>

                    <td className="py-3.5 px-6">
                      {isOut ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                          Critical: Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Alert: Low Stock Buffer
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Optimal Stock Level
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <button
                        onClick={() => handleOpenAdjustModal(p)}
                        className="px-3 py-1.5 bg-[#181d26] hover:bg-amber-400 hover:text-black border border-[#2a303e] rounded-lg text-xs font-bold text-gray-300 transition"
                      >
                        Adjust / Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Stock Audit History Log (Ledger) */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-[#1e2430] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated Inventory Audit Trail (`stock_logs`)
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Every customer order deduction and admin adjustment is recorded with timestamp & reason.
              </p>
            </div>
          </div>
          <button
            onClick={loadStockLogs}
            disabled={loadingLogs}
            className="p-2 rounded-lg bg-[#181d26] text-gray-400 hover:text-white transition"
            title="Reload latest logs"
          >
            <RefreshCw className={`w-4 h-4 ${loadingLogs ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          {stockLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              No stock movements recorded yet. Changes will appear here automatically.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171c24] text-gray-400 uppercase font-mono tracking-wider text-[11px] border-b border-[#1e2430] sticky top-0">
                <tr>
                  <th className="py-3 px-6">Timestamp</th>
                  <th className="py-3 px-6">Fragrance</th>
                  <th className="py-3 px-6 text-center">Old &rarr; New</th>
                  <th className="py-3 px-6 text-center">Movement</th>
                  <th className="py-3 px-6">Audit Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2430] text-gray-300 font-sans">
                {stockLogs.map((log) => {
                  const isPositive = Number(log.change_amount) > 0;
                  return (
                    <tr key={log.id} className="hover:bg-[#181d26] transition-colors">
                      <td className="py-3 px-6 font-mono text-gray-400 text-[11px]">
                        {new Date(log.created_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-6 font-semibold text-white">
                        {log.product_title || `SKU #${log.product_id}`}
                      </td>
                      <td className="py-3 px-6 text-center font-mono">
                        <span className="text-gray-400">{log.old_stock}</span>
                        <span className="text-gray-500 mx-1.5">&rarr;</span>
                        <span className="text-white font-bold">{log.new_stock}</span>
                      </td>
                      <td className="py-3 px-6 text-center font-mono">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            isPositive ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isPositive ? `+${log.change_amount}` : log.change_amount}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-400 text-[11px] italic">
                        {log.reason || 'Inventory balance adjustment'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. Quick Adjust Stock Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12161e] border border-[#232936] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#232936] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  Adjust Inventory Stock
                </h3>
                <p className="text-xs text-amber-400 font-medium mt-0.5">
                  {selectedProduct.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c222c] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyStockAdjustment} className="p-6 space-y-5">
              <div className="p-4 rounded-xl bg-[#171c24] border border-[#232936] flex items-center justify-between">
                <span className="text-xs text-gray-400">Current Warehouse Stock:</span>
                <span className="text-base font-mono font-bold text-white">
                  {selectedProduct.stock} units
                </span>
              </div>

              {/* Adjustment Mode */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Adjustment Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustMode('add')}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      adjustMode === 'add'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                        : 'bg-[#181d26] text-gray-400 border-[#2a303e]'
                    }`}
                  >
                    + Add Units
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustMode('subtract')}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      adjustMode === 'subtract'
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-[#181d26] text-gray-400 border-[#2a303e]'
                    }`}
                  >
                    - Deduct
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustMode('set')}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      adjustMode === 'set'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                        : 'bg-[#181d26] text-gray-400 border-[#2a303e]'
                    }`}
                  >
                    = Set Exact
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  {adjustMode === 'set' ? 'New Total Stock Units' : 'Units to Adjust'}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={adjustValue}
                  onChange={(e) => setAdjustValue(e.target.value)}
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Audit Reason (Logged to Ledger) *
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Received new shipment from Grasse lab"
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232936]">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 rounded-xl bg-[#181d26] text-xs font-semibold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStock}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {updatingStock ? 'Saving...' : 'Apply Stock Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

