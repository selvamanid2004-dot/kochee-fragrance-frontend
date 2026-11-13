import React, { useState, useEffect } from 'react';
import { Package, Calendar, MapPin, ArrowRight, ArrowLeft, User, ShoppingBag, LogOut, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';

export default function AccountDashboard({ onNavigate }) {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      onNavigate('login');
      return;
    }

    async function fetchOrders() {
      setLoading(true);
      try {
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load customer orders', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 bg-white text-black">
      <button
        onClick={() => onNavigate('back')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Account Top Summary */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 shadow-sm">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black text-white flex items-center justify-center font-serif text-lg sm:text-xl font-black shadow-md flex-shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              CUSTOMER ACCOUNT
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-black uppercase text-black">
              {currentUser?.name}
            </h1>
            <p className="text-xs text-neutral-600 font-medium">{currentUser?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('catalog')}
            className="flex-1 sm:flex-none bg-black hover:bg-neutral-800 text-white px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md text-center"
          >
            Shop Perfumes
          </button>
          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="border border-neutral-300 hover:border-black text-neutral-700 hover:text-black px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition bg-white"
          >
            <LogOut className="w-3.5 h-3.5 text-neutral-500" /> Logout
          </button>
        </div>
      </div>

      {/* Purchase & Order History */}
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-3 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-black uppercase text-black">
              Order History & Purchases
            </h2>
            <p className="text-xs text-gray-500">View and track your previous perfume orders.</p>
          </div>
          <span className="text-xs font-bold text-black bg-gray-100 px-3 py-1 rounded">
            {orders.length} Total Orders
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
            <div className="w-14 h-14 rounded-full bg-white border border-gray-200 mx-auto flex items-center justify-center text-gray-400">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-black">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                You haven't ordered any luxury extraits yet. Explore our bestselling fragrances and discovery sets.
              </p>
            </div>
            <button
              onClick={() => onNavigate('catalog')}
              className="inline-block bg-black hover:bg-gray-800 text-white px-6 py-3 rounded text-xs font-bold uppercase tracking-widest transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const items = Array.isArray(order.items) ? order.items : [];
              return (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm hover:border-black transition"
                >
                  {/* Order Meta Header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-gray-100 gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        ORDER NUMBER
                      </span>
                      <div className="text-base font-serif font-black text-black">
                        {order.order_number}
                      </div>
                      <span className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" /> Placed on {order.created_at}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block text-right">
                          STATUS
                        </span>
                        <span className="text-xs font-extrabold text-black bg-gray-100 px-2.5 py-1 rounded inline-block mt-0.5">
                          {order.order_status}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
                          TOTAL PAID
                        </span>
                        <span className="text-base font-serif font-black text-black">
                          ₹{order.total_amount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block">
                      Ordered Fragrances ({items.reduce((acc, it) => acc + (it.quantity || 1), 0)} Bottles)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                        >
                          <img
                            src={it.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=400'}
                            alt={it.title}
                            className="w-14 h-16 object-cover rounded bg-white border border-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-black font-serif truncate">
                              {it.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {it.volume || '50ml'} • Qty: {it.quantity || 1}
                            </p>
                            <span className="text-xs font-black text-black mt-1 block">
                              ₹{(it.price || 0) * (it.quantity || 1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Actions */}
                  <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-600 gap-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-black flex-shrink-0" />
                      <span>
                        Delivering to: <strong className="text-black">{order.city}, {order.state} ({order.pincode})</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => onNavigate('track', { orderNumber: order.order_number })}
                      className="text-xs font-bold text-black hover:underline uppercase tracking-wider flex items-center gap-1"
                    >
                      Track Parcel Status <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

