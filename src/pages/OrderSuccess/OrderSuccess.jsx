import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function OrderSuccess({ order, onNavigate }) {
  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center bg-white text-black">
        <p className="text-gray-500 text-sm">No order found.</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 text-xs font-bold text-black underline uppercase"
        >
          Return Home
        </button>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 bg-white text-black">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-gray-500 text-xs font-bold uppercase tracking-[0.25em]">
          ORDER CONFIRMATION
        </span>
        <h1 className="text-3xl font-serif font-black uppercase text-black">
          THANK YOU, {order.customer_name}!
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Your order has been placed successfully and is being prepped for dispatch.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-3">
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Order Tracking ID</span>
            <div className="text-xl font-serif font-bold text-black">{order.order_number}</div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Payment Method</span>
            <div className="text-xs font-bold text-black">{order.payment_method} ({order.payment_status})</div>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Status</span>
            <div className="text-xs font-bold text-black bg-white px-3 py-1 rounded border border-gray-300 inline-block">
              {order.order_status}
            </div>
          </div>
        </div>

        <div className="text-xs space-y-1 text-gray-600">
          <span className="text-black font-bold uppercase tracking-wider text-[11px] block">
            Shipping Destination:
          </span>
          <p>{order.shipping_address}, {order.city}, {order.state} - {order.pincode}</p>
          <p>Contact: {order.customer_phone} • {order.customer_email}</p>
        </div>

        <div className="space-y-3 pt-4 border-t border-gray-200">
          <span className="text-black font-serif font-bold text-xs uppercase tracking-wider block">
            Items in this order:
          </span>
          <div className="divide-y divide-gray-200">
            {items.map((it, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-black font-bold">{it.title}</span>
                  <span className="text-gray-500 block text-[10px]">{it.volume} • Qty: {it.quantity}</span>
                </div>
                <span className="text-black font-bold">₹{it.price * it.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-sm">
          <span className="font-bold text-black">Total Paid / Due:</span>
          <span className="text-lg font-serif font-black text-black">₹{order.total_amount}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => onNavigate('track', { orderNumber: order.order_number })}
          className="w-full sm:w-auto bg-white hover:bg-gray-50 text-black border border-black px-6 py-3 rounded text-xs uppercase tracking-widest font-bold transition"
        >
          Track Shipment
        </button>
        <button
          onClick={() => onNavigate('catalog')}
          className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-6 py-3 rounded text-xs uppercase tracking-widest font-bold transition flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
