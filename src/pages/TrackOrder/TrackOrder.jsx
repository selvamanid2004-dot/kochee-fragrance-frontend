import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, Truck, MapPin, ArrowLeft } from 'lucide-react';
import { orderService } from '../../services/orderService';

export default function TrackOrder({ initialOrderNumber = '', onNavigate }) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await orderService.trackOrder(orderNumber.trim());
      setOrder(data);
    } catch (err) {
      setError(err.message || 'No shipment found matching this Order ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      handleTrack();
    }
  }, [initialOrderNumber]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 bg-white text-black">
      {onNavigate && (
        <button
          onClick={() => onNavigate('back')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      )}

      <div className="text-center space-y-2">
        <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.25em]">
          LIVE ORDER TRACKING
        </span>
        <h1 className="text-3xl font-serif font-black uppercase text-black">
          TRACK YOUR PERFUME PARCEL
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Enter your unique Kochee Order ID (e.g. KF-2026-8801) below to view fulfillment and courier status.
        </p>
      </div>

      <form onSubmit={handleTrack} className="max-w-lg mx-auto flex gap-3">
        <input
          type="text"
          placeholder="Enter Order ID (e.g. KF-2026-8801)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="flex-1 bg-white border border-neutral-300 rounded-xl px-4 py-3 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-md"
        >
          <Search className="w-4 h-4" />
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="max-w-lg mx-auto p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs text-center font-semibold">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 border-b border-gray-200 gap-3">
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Order ID</span>
              <div className="text-xl font-serif font-bold text-black">{order.order_number}</div>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Courier Status</span>
              <div className="text-xs font-bold text-black bg-white px-3 py-1 rounded border border-gray-300 inline-block mt-0.5">
                {order.order_status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-1">
              <CheckCircle2 className="w-5 h-5 text-black" />
              <div className="font-bold text-black">Order Placed</div>
              <div className="text-[10px] text-gray-500">Warehouse acknowledged</div>
            </div>

            <div className={`p-4 rounded-xl bg-white border space-y-1 ${
              order.order_status !== 'Cancelled' ? 'border-black' : 'border-gray-200 opacity-40'
            }`}>
              <Clock className="w-5 h-5 text-black" />
              <div className="font-bold text-black">Packaging & Seal</div>
              <div className="text-[10px] text-gray-500">Security barcode attached</div>
            </div>

            <div className={`p-4 rounded-xl bg-white border space-y-1 ${
              order.order_status === 'Shipped' || order.order_status === 'Delivered'
                ? 'border-black bg-gray-50'
                : 'border-gray-200 opacity-40'
            }`}>
              <Truck className="w-5 h-5 text-black" />
              <div className="font-bold text-black">In Transit</div>
              <div className="text-[10px] text-gray-500">Air Express courier</div>
            </div>

            <div className={`p-4 rounded-xl bg-white border space-y-1 ${
              order.order_status === 'Delivered' ? 'border-black bg-black text-white' : 'border-gray-200 opacity-40'
            }`}>
              <MapPin className="w-5 h-5" />
              <div className="font-bold">Delivered</div>
              <div className="text-[10px]">At customer address</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-200 text-xs text-gray-600 space-y-1">
            <span className="text-black font-bold">Delivery Address:</span>
            <p>{order.customer_name} • {order.city}, {order.state} - {order.pincode}</p>
          </div>
        </div>
      )}
    </div>
  );
}
