import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  ShoppingBag,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  X,
  Filter,
  ArrowUpDown,
  RefreshCw,
  Clock
} from 'lucide-react';
import { customerService } from '../../services/customerService';

export default function AdminCustomersView({ setActionMessage, onParentRefresh }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'suspended'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'orders', 'spent', 'name'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error('Failed to load customers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleInspectCustomer = async (cust) => {
    setLoadingDetail(true);
    setSelectedCustomer(cust);
    try {
      const full = await customerService.getCustomerById(cust.id);
      setSelectedCustomer(full);
    } catch (err) {
      console.error('Failed to load detailed customer profile', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleToggleStatus = async (cust) => {
    setTogglingId(cust.id);
    const newStatus = cust.status === 'suspended' ? 'active' : 'suspended';
    try {
      await customerService.updateCustomerStatus(cust.id, newStatus);
      setActionMessage(`Customer "${cust.name}" account marked as ${newStatus.toUpperCase()}`);
      loadCustomers();
      if (selectedCustomer && selectedCustomer.id === cust.id) {
        setSelectedCustomer((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update customer status');
    } finally {
      setTogglingId(null);
    }
  };

  // Filter and Sort Customers
  const filteredCustomers = customers
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? c.status !== 'suspended'
          : c.status === 'suspended';

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'orders') return (b.total_orders || 0) - (a.total_orders || 0);
      if (sortBy === 'spent') return (b.total_spent || 0) - (a.total_spent || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  // Aggregates
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status !== 'suspended').length;
  const totalCustomerSpend = customers.reduce((acc, c) => acc + (Number(c.total_spent) || 0), 0);
  const totalCustomerOrders = customers.reduce((acc, c) => acc + (Number(c.total_orders) || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Customers
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white font-mono">{totalCustomers}</h3>
            <p className="text-[11px] text-gray-400 mt-1">Registered buyer profiles</p>
          </div>
        </div>

        <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Active Accounts
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white font-mono">{activeCustomers}</h3>
            <p className="text-[11px] text-emerald-400 mt-1">Verified good standing</p>
          </div>
        </div>

        <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Customer Total Spend
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white font-mono">
              ₹{Number(totalCustomerSpend).toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">Across all registered users</p>
          </div>
        </div>

        <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Orders Placed
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-extrabold text-white font-mono">{totalCustomerOrders}</h3>
            <p className="text-[11px] text-gray-400 mt-1">Account-linked checkouts</p>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Action Bar */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181d26] border border-[#232936] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#181d26] border border-[#232936] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Account Statuses</option>
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#181d26] border border-[#232936] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="newest">Sort: Newest Registered</option>
              <option value="orders">Sort: Most Orders</option>
              <option value="spent">Sort: Highest Total Spend</option>
              <option value="name">Sort: Alphabetical (A-Z)</option>
            </select>
          </div>

          <button
            onClick={loadCustomers}
            disabled={loading}
            className="p-2 rounded-xl bg-[#181d26] hover:bg-[#202632] border border-[#232936] text-gray-400 hover:text-white transition"
            title="Refresh customer database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 3. Customer Directory Table */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1e2430] flex items-center justify-between text-xs text-gray-400">
          <span>
            Showing <strong className="text-white font-mono">{filteredCustomers.length}</strong> of{' '}
            <strong className="text-white font-mono">{totalCustomers}</strong> customer accounts
          </span>
          <span className="hidden sm:inline">Mandatory account credentials enforced</span>
        </div>

        <div className="overflow-x-auto">
          {filteredCustomers.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              No registered customers match the query.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171c24] text-gray-400 uppercase font-mono tracking-wider text-[11px] border-b border-[#1e2430]">
                <tr>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Contact Details</th>
                  <th className="py-3.5 px-6">Registered On</th>
                  <th className="py-3.5 px-6 text-center">Total Orders</th>
                  <th className="py-3.5 px-6 text-right">Total Spend</th>
                  <th className="py-3.5 px-6 text-center">Account Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2430] text-gray-300 font-sans">
                {filteredCustomers.map((c) => {
                  const isSuspended = c.status === 'suspended';

                  return (
                    <tr key={c.id} className="hover:bg-[#181d26] transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1e2430] to-[#2a3242] border border-gray-700 flex items-center justify-center font-bold text-amber-300 text-xs flex-shrink-0">
                            {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{c.name}</div>
                            <span className="text-[10px] text-gray-500 font-mono">
                              ID #{c.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <span className="font-mono text-[11px]">{c.email}</span>
                        </div>
                        {c.phone && (
                          <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span className="font-mono text-[11px]">{c.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="py-4 px-6 text-gray-400 font-mono text-[11px]">
                        {new Date(c.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Total Orders */}
                      <td className="py-4 px-6 text-center">
                        <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-[#1e2430] text-white">
                          {c.total_orders || 0}
                        </span>
                      </td>

                      {/* Total Spend */}
                      <td className="py-4 px-6 text-right font-mono font-bold text-white">
                        ₹{Number(c.total_spent || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        {isSuspended ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                            Suspended
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleInspectCustomer(c)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#181d26] hover:bg-amber-400 hover:text-black text-gray-300 text-xs font-semibold transition flex items-center gap-1"
                            title="View Purchases & Order History"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect</span>
                          </button>

                          <button
                            onClick={() => handleToggleStatus(c)}
                            disabled={togglingId === c.id}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                              isSuspended
                                ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black'
                                : 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-black'
                            }`}
                            title={isSuspended ? 'Activate Account' : 'Suspend Account'}
                          >
                            {isSuspended ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 4. Customer Details & Order History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12161e] border border-[#232936] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-[#232936] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-extrabold flex items-center justify-center text-base">
                  {selectedCustomer.name ? selectedCustomer.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">
                    {selectedCustomer.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {selectedCustomer.email} • ID #{selectedCustomer.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c222c] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Profile Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#171c24] border border-[#232936]">
                  <span className="text-[10px] text-gray-500 uppercase block font-mono">
                    Account Status
                  </span>
                  <span
                    className={`text-xs font-bold uppercase mt-1 inline-block ${
                      selectedCustomer.status === 'suspended' ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {selectedCustomer.status || 'Active'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#171c24] border border-[#232936]">
                  <span className="text-[10px] text-gray-500 uppercase block font-mono">
                    Registered On
                  </span>
                  <span className="text-xs font-bold text-white mt-1 inline-block font-mono">
                    {new Date(selectedCustomer.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#171c24] border border-[#232936]">
                  <span className="text-[10px] text-gray-500 uppercase block font-mono">
                    Total Purchases
                  </span>
                  <span className="text-xs font-bold text-amber-300 mt-1 inline-block font-mono">
                    {selectedCustomer.total_orders || 0} Orders
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#171c24] border border-[#232936]">
                  <span className="text-[10px] text-gray-500 uppercase block font-mono">
                    Lifetime Spend
                  </span>
                  <span className="text-xs font-bold text-white mt-1 inline-block font-mono">
                    ₹{Number(selectedCustomer.total_spent || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Order History Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Customer Purchase & Order History
                  </h4>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {selectedCustomer.orders ? selectedCustomer.orders.length : 0} Total Orders
                  </span>
                </div>

                {loadingDetail ? (
                  <div className="p-8 text-center text-xs text-gray-400">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400 mx-auto mb-2" />
                    Loading order history...
                  </div>
                ) : !selectedCustomer.orders || selectedCustomer.orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-500 bg-[#171c24] border border-[#232936] rounded-xl">
                    No orders have been placed by this customer yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#1e2430] border border-[#232936] rounded-xl overflow-hidden bg-[#151922]">
                    {selectedCustomer.orders.map((ord) => (
                      <div key={ord.id} className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-amber-300 text-xs">
                              #{ord.order_number || ord.id}
                            </span>
                            <span className="text-gray-400 text-[11px] font-mono">
                              {new Date(ord.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#1e2430] text-gray-300">
                              {ord.payment_method || 'COD'}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                ord.order_status === 'delivered'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : ord.order_status === 'shipped'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : ord.order_status === 'cancelled'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {ord.order_status || 'Processing'}
                            </span>
                            <span className="font-mono font-bold text-white text-xs ml-2">
                              ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Line items */}
                        <div className="space-y-1.5 pl-2 border-l-2 border-[#2a303e]">
                          {Array.isArray(ord.items) &&
                            ord.items.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-[11px] text-gray-300"
                              >
                                <span>
                                  {it.title || it.name} &times;{' '}
                                  <strong className="text-white font-mono">{it.quantity || 1}</strong>{' '}
                                  ({it.volume || '50ml'})
                                </span>
                                <span className="font-mono text-gray-400">
                                  ₹{Number((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Action */}
              <div className="pt-4 border-t border-[#232936] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedCustomer)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    selectedCustomer.status === 'suspended'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-black border border-red-500/30'
                  }`}
                >
                  {selectedCustomer.status === 'suspended' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Re-activate Account</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Suspend Customer Account</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2 rounded-xl bg-[#181d26] text-xs font-semibold text-gray-300 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

