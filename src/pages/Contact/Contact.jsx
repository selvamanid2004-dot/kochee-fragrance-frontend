import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ArrowLeft, Sparkles } from 'lucide-react';
import { contactService } from '../../services/contactService';

export default function Contact({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Scent Inquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contactService.submitContact(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Scent Inquiry',
        message: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 bg-white text-black">
      {onNavigate && (
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-neutral-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </button>
      )}

      <div className="text-center space-y-2">
        <span className="text-neutral-500 text-xs font-bold uppercase tracking-[0.25em] inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-black" /> CUSTOMER CONCIERGE & SUPPORT
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black uppercase text-black">
          CONTACT KOCHEE FRAGRANCE
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto font-medium">
          Have an inquiry regarding olfactory notes, order tracking, corporate gifts, or bespoke perfume favors? Contact our concierge desk below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-black uppercase tracking-wider">
              HEAD OFFICE & ATELIER
            </h3>

            <div className="space-y-5 text-xs text-neutral-700">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-black block text-xs">Atelier Location</span>
                  Kochee Fragrance Luxe, Marine Chambers, Marine Lines, Mumbai - 400020
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-black block text-xs">Phone Support</span>
                  +91 (0) 98765 43210 (Mon–Sat, 10 AM – 7 PM IST)
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-black block text-xs">Email Support</span>
                  support@kocheefragrance.com
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-black uppercase tracking-wider">
            SEND US A MESSAGE
          </h3>

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Thank you! Your message has been received by our concierge team.
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-700 block mb-1 font-bold">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-700 block mb-1 font-bold">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. vikram@example.com"
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-neutral-700 block mb-1 font-bold">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98200 00000"
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-700 block mb-1 font-bold">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-black focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="General Scent Inquiry">General Perfume Consultation</option>
                  <option value="Wedding Gifts">Wedding Favors & Gift Sets</option>
                  <option value="Bulk Orders">Bulk / Corporate Inquiry</option>
                  <option value="Order Tracking">Delivery & Tracking Status</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-neutral-700 block mb-1 font-bold">Your Message *</label>
              <textarea
                name="message"
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we assist you today?"
                className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-neutral-800 text-white px-6 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4" />
              {loading ? 'SENDING...' : 'SUBMIT MESSAGE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
