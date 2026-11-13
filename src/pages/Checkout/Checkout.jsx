import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import CustomerAuthModal from '../../components/auth/CustomerAuthModal';

export default function Checkout({ onNavigate }) {
  const { cart, subtotal, shippingFee, isFreeShipping, total, clearCart } = useCart();
  const { currentUser, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'COD',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        customer_name: prev.customer_name || currentUser.name || '',
        customer_email: currentUser.email || prev.customer_email || ''
      }));
      setShowAuthModal(false);
    } else {
      setShowAuthModal(true);
    }
  }, [currentUser, isAuthenticated]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Guest checkout is blocked
    if (!isAuthenticated) {
      setShowAuthModal(true);
      setError('You must log in or create an account before completing checkout.');
      return;
    }

    if (cart.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        ...formData,
        customer_name: (formData.customer_name || currentUser?.name || '').trim(),
        customer_email: (currentUser?.email || formData.customer_email || '').trim(),
        customer_phone: (formData.customer_phone || '').trim(),
        user_id: currentUser ? currentUser.id : null,
        total_amount: total,
        items: cart.map(item => ({
          ...item,
          product_id: item.product_id || item.id
        }))
      };

      const createdOrder = await orderService.createOrder(orderPayload);
      clearCart();
      onNavigate('success', { order: createdOrder });
    } catch (err) {
      setError(err.message || 'Failed to place order. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-4 bg-white text-black">
        <h2 className="text-2xl font-serif font-black uppercase text-black">Your Shopping Bag is Empty</h2>
        <p className="text-gray-500 text-xs">Add items to your bag before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('catalog')}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition"
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-black">
      <button
        onClick={() => onNavigate('catalog')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Catalog
      </button>

      {/* Mandatory Customer Auth Banner if not authenticated */}
      {!isAuthenticated && (
        <div className="bg-black text-white p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded">
              ACCOUNT REQUIRED
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-black uppercase">
              PLEASE LOG IN OR SIGN UP TO COMPLETE CHECKOUT
            </h2>
            <p className="text-xs text-gray-300 max-w-xl">
              Guest checkout is not permitted. Log in to your account or create one in 30 seconds to track your parcels and view complete purchase history.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex-1 md:flex-initial bg-white hover:bg-gray-100 text-black px-6 py-3 rounded text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow"
            >
              <LogIn className="w-4 h-4" /> Log In / Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Authenticated Customer Banner */}
      {isAuthenticated && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <span className="text-xs font-bold text-black block">
                Logged in as {currentUser.name} ({currentUser.email})
              </span>
              <span className="text-[11px] text-gray-500">Your order will be linked to your account history.</span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('account')}
            className="text-xs text-black font-bold uppercase underline hover:text-gray-600"
          >
            View Account & Orders
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <span className="text-gray-500 text-xs uppercase tracking-[0.25em] font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-black" /> SECURE SSL ENCRYPTED CHECKOUT
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black uppercase text-black mt-1">
              DELIVERY & PAYMENT DETAILS
            </h1>
          </div>

          {error && (
            <div className="p-4 rounded bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-700 block mb-1 font-bold">Full Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Faisal Rehman"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs text-gray-700 block mb-1 font-bold">Email Address *</label>
                <input
                  type="email"
                  name="customer_email"
                  required
                  disabled={isAuthenticated}
                  value={formData.customer_email}
                  onChange={handleChange}
                  placeholder="e.g. faisal@example.com"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-700 block mb-1 font-bold">Phone Number (For Tracking & COD Dispatch) *</label>
              <input
                type="tel"
                name="customer_phone"
                required
                value={formData.customer_phone}
                onChange={handleChange}
                placeholder="e.g. +91 98201 12345"
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-xs text-gray-700 block mb-1 font-bold">Delivery Address *</label>
              <input
                type="text"
                name="shipping_address"
                required
                value={formData.shipping_address}
                onChange={handleChange}
                placeholder="House / Flat No., Street, Landmark"
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-700 block mb-1 font-bold">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-xs text-gray-700 block mb-1 font-bold">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-xs text-gray-700 block mb-1 font-bold">PIN Code *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 400001"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Payment Modes */}
            <div className="pt-2">
              <label className="text-xs text-gray-700 block mb-2 font-bold">Payment Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                    formData.payment_method === 'COD'
                      ? 'border-black bg-neutral-100 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-black'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="COD"
                    checked={formData.payment_method === 'COD'}
                    onChange={handleChange}
                    className="mt-1 accent-black"
                  />
                  <div>
                    <span className="text-xs font-black block text-black">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-gray-500">Pay cash or UPI to courier agent at doorstep.</span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition ${
                    formData.payment_method === 'Prepaid'
                      ? 'border-black bg-neutral-100 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-black'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="Prepaid"
                    checked={formData.payment_method === 'Prepaid'}
                    onChange={handleChange}
                    className="mt-1 accent-black"
                  />
                  <div>
                    <span className="text-xs font-black block text-black">Prepaid / Instant UPI</span>
                    <span className="text-[11px] text-gray-500">Fastest courier air dispatch priority.</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-700 block mb-1 font-bold">Delivery Instructions (Optional)</label>
              <textarea
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Ring doorbell twice, deliver during business hours"
                className="w-full bg-white border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs text-black placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] bg-black hover:bg-neutral-800 text-white shadow-lg transition-all duration-300"
            >
              {loading ? 'PROCESSING ORDER...' : `PLACE ORDER (₹${total})`}
            </button>
          </form>
        </div>

        {/* Order Review Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="font-serif text-sm font-bold text-black uppercase tracking-wider">
              ORDER SUMMARY ({cart.reduce((a, b) => a + b.quantity, 0)} ITEMS)
            </h3>

            <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product_id} className="py-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-14 object-cover rounded bg-white border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-black truncate font-serif">{item.title}</h4>
                    <p className="text-[10px] text-gray-500">{item.volume} • Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-black">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-black">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Pan-India Shipping</span>
                <span className={isFreeShipping ? 'text-emerald-700 font-bold' : 'font-semibold text-black'}>
                  {isFreeShipping ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-black pt-2 border-t border-gray-200">
                <span>Total Due</span>
                <span className="text-black font-serif text-base font-black">₹{total}</span>
              </div>
            </div>

            <div className="p-3.5 rounded bg-white border border-gray-200 text-[11px] text-gray-600 space-y-0.5">
              <div className="font-bold text-black flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-black" /> Complimentary 2ml Tester
              </div>
              <p>Included with every 50ml order for risk-free wear testing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Auth Modal for Checkout */}
      <CustomerAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={() => {
          setShowAuthModal(false);
        }}
      />
    </div>
  );
}
