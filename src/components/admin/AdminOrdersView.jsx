import React, { useState } from 'react';
import {
  ShoppingCart,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  XCircle,
  Search,
  X,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { orderService } from '../../services/orderService';

export default function AdminOrdersView({
  orders = [],
  onRefresh,
  setActionMessage
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      String(o.order_number || o.id).toLowerCase().includes(search.toLowerCase()) ||
      String(o.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
      String(o.customer_email || '').toLowerCase().includes(search.toLowerCase()) ||
      String(o.customer_phone || '').toLowerCase().includes(search.toLowerCase());
    const currentStatus = String(o.order_status || o.status || '').toLowerCase();
    const matchStatus = statusFilter ? currentStatus === statusFilter.toLowerCase() : true;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await orderService.updateOrderStatus(orderId, { order_status: newStatus });
      setActionMessage(`Order #${orderId} marked as ${newStatus.toUpperCase()}`);
      if (onRefresh) onRefresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, ...updated, order_status: newStatus, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await orderService.updateOrderStatus(orderId, { payment_status: newPaymentStatus });
      setActionMessage(`Order #${orderId} payment status marked as ${newPaymentStatus.toUpperCase()}`);
      if (onRefresh) onRefresh();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, ...updated, payment_status: newPaymentStatus }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update payment status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Filter Bar */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order #, customer name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#181d26] border border-[#232936] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="relative w-full sm:w-60">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#181d26] border border-[#232936] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="">All Fulfillment Statuses</option>
              <option value="pending">Pending Dispatch</option>
              <option value="processing">Processing & Packaged</option>
              <option value="shipped">Shipped In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          Total orders: <strong className="text-white font-mono">{filteredOrders.length}</strong>
        </div>
      </div>

      {/* 2. Orders Table */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs">
              No orders found matching the filter criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171c24] text-gray-400 uppercase font-mono tracking-wider text-[11px] border-b border-[#1e2430]">
                <tr>
                  <th className="py-3.5 px-6">Order #</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Payment</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Fulfillment Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2430] text-gray-300 font-sans">
                {filteredOrders.map((ord) => {
                  const currentStatus = (ord.order_status || ord.status || 'Processing').toLowerCase();
                  const currentPayment = (ord.payment_status || 'Pending').toLowerCase();

                  return (
                    <tr key={ord.id} className="hover:bg-[#181d26] transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-amber-300">
                        #{ord.order_number || ord.id}
                      </td>

                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{ord.customer_name}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{ord.customer_email}</div>
                        {ord.customer_phone && (
                          <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-gray-500" />
                            <span>{ord.customer_phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 text-gray-400 font-mono text-[11px]">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-[#1e2430] text-gray-300 font-mono text-[10px] font-bold uppercase inline-block">
                            {ord.payment_method || 'COD'}
                          </span>
                          <div>
                            <select
                              value={currentPayment}
                              disabled={updatingId === ord.id}
                              onChange={(e) => handleUpdatePaymentStatus(ord.id, e.target.value)}
                              className={`text-[10px] font-bold uppercase rounded px-2 py-0.5 font-mono focus:outline-none cursor-pointer border ${
                                currentPayment === 'paid'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : currentPayment === 'failed'
                                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}
                            >
                              <option value="pending" className="bg-[#181d26] text-white">Pending</option>
                              <option value="paid" className="bg-[#181d26] text-white">Paid</option>
                              <option value="failed" className="bg-[#181d26] text-white">Failed</option>
                              <option value="refunded" className="bg-[#181d26] text-white">Refunded</option>
                            </select>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono font-bold text-white">
                        ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                      </td>

                      <td className="py-4 px-6">
                        <select
                          value={currentStatus}
                          disabled={updatingId === ord.id}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase rounded-lg px-2.5 py-1 font-mono focus:outline-none cursor-pointer border ${
                            currentStatus === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                              : currentStatus === 'shipped'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                              : currentStatus === 'cancelled'
                              ? 'bg-red-500/20 text-red-400 border-red-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          <option value="pending" className="bg-[#181d26] text-white">Pending</option>
                          <option value="processing" className="bg-[#181d26] text-white">Processing</option>
                          <option value="shipped" className="bg-[#181d26] text-white">Shipped</option>
                          <option value="delivered" className="bg-[#181d26] text-white">Delivered</option>
                          <option value="cancelled" className="bg-[#181d26] text-white">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 rounded-lg bg-[#181d26] hover:bg-amber-400 hover:text-black text-gray-300 text-xs font-semibold transition"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 3. Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12161e] border border-[#232936] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-[#232936] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  Order Details #{selectedOrder.order_number || selectedOrder.id}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c222c] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Status Badges & Quick Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#171c24] border border-[#232936]">
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1.5">
                    Fulfillment Status
                  </span>
                  <select
                    value={(selectedOrder.order_status || selectedOrder.status || 'Processing').toLowerCase()}
                    disabled={updatingId === selectedOrder.id}
                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    className="w-full bg-[#12161e] border border-[#232936] rounded-lg py-1.5 px-3 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  >
                    <option value="pending">Pending Dispatch</option>
                    <option value="processing">Processing & Packaged</option>
                    <option value="shipped">Shipped In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-[#171c24] border border-[#232936]">
                  <span className="text-[10px] uppercase font-mono font-bold text-gray-400 block mb-1.5">
                    Payment Status
                  </span>
                  <select
                    value={(selectedOrder.payment_status || 'Pending').toLowerCase()}
                    disabled={updatingId === selectedOrder.id}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrder.id, e.target.value)}
                    className="w-full bg-[#12161e] border border-[#232936] rounded-lg py-1.5 px-3 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  >
                    <option value="pending">Pending Payment</option>
                    <option value="paid">Paid Confirmed</option>
                    <option value="failed">Failed / Declined</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {/* Customer & Shipping Details */}
              <div className="p-4 rounded-xl bg-[#171c24] border border-[#232936] space-y-2 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block">
                  Delivery Destination & Customer Info
                </span>
                <p className="font-bold text-white text-sm">{selectedOrder.customer_name}</p>
                <div className="text-gray-300 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span>{selectedOrder.customer_email}</span>
                </div>
                {selectedOrder.customer_phone && (
                  <div className="text-gray-300 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span>{selectedOrder.customer_phone}</span>
                  </div>
                )}
                <div className="text-gray-300 flex items-start gap-2 pt-2 border-t border-[#232936]">
                  <MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white block font-semibold">{selectedOrder.shipping_address}</span>
                    <span className="text-gray-400 text-[11px]">
                      {[selectedOrder.city, selectedOrder.state, selectedOrder.pincode].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Purchased Items
                </span>
                <div className="divide-y divide-[#1e2430] border border-[#232936] rounded-xl overflow-hidden bg-[#151922]">
                  {(() => {
                    let items = [];
                    try {
                      items = typeof selectedOrder.items === 'string'
                        ? JSON.parse(selectedOrder.items)
                        : selectedOrder.items || [];
                    } catch {
                      items = [];
                    }

                    if (items.length === 0) {
                      return (
                        <div className="p-4 text-center text-xs text-gray-500">
                          Item details not available. Total amount: ₹{selectedOrder.total_amount}
                        </div>
                      );
                    }

                    return items.map((it, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{it.title || it.name}</div>
                          <div className="text-[11px] text-gray-400 font-mono">
                            Qty: {it.quantity || 1} • {it.volume || '50ml'}
                          </div>
                        </div>
                        <div className="font-mono font-bold text-amber-300">
                          ₹{Number((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Total Summary */}
              <div className="p-4 rounded-xl bg-[#171c24] border border-[#232936] flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Payment Method</span>
                  <span className="text-xs font-bold font-mono uppercase text-white">
                    {selectedOrder.payment_method || 'COD'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Total Paid</span>
                  <span className="text-lg font-mono font-bold text-white">
                    ₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
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

