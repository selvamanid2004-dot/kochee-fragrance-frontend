import React, { useState, useEffect } from 'react';
import {
  Percent,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  Sliders,
  Clock,
  ArrowRight
} from 'lucide-react';
import { offerService } from '../../services/offerService';
import ImageDropzone from './ImageDropzone';

export default function AdminOffersView({
  categories = [],
  products = [],
  setActionMessage
}) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [savingOffer, setSavingOffer] = useState(false);

  const [form, setForm] = useState({
    title: '',
    code: '',
    discount_type: 'percentage', // 'percentage' or 'fixed'
    discount_value: 20,
    banner_image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1600',
    subtitle: '',
    cta_text: 'CLAIM OFFER NOW',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    category_id: '',
    product_id: '',
    is_active: 1
  });

  const loadOffers = async () => {
    setLoading(true);
    try {
      const data = await offerService.getAllOffers();
      setOffers(data || []);
    } catch (err) {
      console.error('Failed to load offers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleOpenAdd = () => {
    setEditingOffer(null);
    setForm({
      title: 'MIDNIGHT OUD FESTIVAL - 25% OFF',
      code: 'MIDNIGHT25',
      discount_type: 'percentage',
      discount_value: 25,
      banner_image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1600',
      subtitle: 'Artisanal 25% Extrait de Parfum formulas crafted with authentic Grasse absolutes.',
      cta_text: 'SHOP FESTIVAL COLLECTION',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category_id: '',
      product_id: '',
      is_active: 1
    });
    setShowOfferModal(true);
  };

  const handleOpenEdit = (off) => {
    setEditingOffer(off);
    setForm({
      title: off.title || '',
      code: off.code || '',
      discount_type: off.discount_type || 'percentage',
      discount_value: off.discount_value || 20,
      banner_image: off.banner_image || '',
      subtitle: off.subtitle || '',
      cta_text: off.cta_text || 'SHOP NOW',
      start_date: off.start_date ? off.start_date.split('T')[0] : '',
      end_date: off.end_date ? off.end_date.split('T')[0] : '',
      category_id: off.category_id || '',
      product_id: off.product_id || '',
      is_active: off.is_active ? 1 : 0
    });
    setShowOfferModal(true);
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    setSavingOffer(true);
    try {
      const payload = {
        ...form,
        discount_value: parseFloat(form.discount_value),
        category_id: form.category_id ? parseInt(form.category_id, 10) : null,
        product_id: form.product_id ? parseInt(form.product_id, 10) : null,
        is_active: parseInt(form.is_active, 10)
      };

      if (editingOffer) {
        await offerService.updateOffer(editingOffer.id, payload);
        setActionMessage(`Updated promotional offer "${form.title}".`);
      } else {
        await offerService.createOffer(payload);
        setActionMessage(`Created & activated new offer "${form.title}". It is now live on the hero slider!`);
      }

      setShowOfferModal(false);
      loadOffers();
    } catch (err) {
      alert(err.message || 'Error saving offer');
    } finally {
      setSavingOffer(false);
    }
  };

  const handleDeleteOffer = async (id, title) => {
    if (window.confirm(`Delete promotional campaign "${title}"?`)) {
      try {
        await offerService.deleteOffer(id);
        setActionMessage(`Deleted promotion "${title}".`);
        loadOffers();
      } catch (err) {
        alert(err.message || 'Error deleting offer');
      }
    }
  };

  const handleToggleActive = async (off) => {
    try {
      const newActive = off.is_active ? 0 : 1;
      await offerService.updateOffer(off.id, { is_active: newActive });
      setActionMessage(
        newActive
          ? `Offer "${off.title}" is now ACTIVE on customer hero slider.`
          : `Offer "${off.title}" is now DISABLED and removed from website.`
      );
      loadOffers();
    } catch (err) {
      alert(err.message || 'Failed to update offer state');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Feature Banner Alert */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Dynamic Customer Hero Slider Automation
            </h4>
            <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Every active promotional campaign created here <strong>automatically streams to the customer-facing homepage hero carousel</strong> in real time. When an offer reaches its expiration date or is switched off, it automatically disappears from the storefront.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-transform active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Promotion</span>
        </button>
      </div>

      {/* 2. Offers List / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {offers.map((off) => {
          const now = new Date();
          const start = off.start_date ? new Date(off.start_date) : null;
          const end = off.end_date ? new Date(off.end_date) : null;
          const isExpired = end && end < now;
          const isScheduled = start && start > now;
          const isLive = off.is_active === 1 && !isExpired && !isScheduled;

          return (
            <div
              key={off.id}
              className={`bg-[#13171f] border rounded-2xl overflow-hidden transition-all shadow-xl flex flex-col ${
                isLive
                  ? 'border-emerald-500/40 hover:border-emerald-500'
                  : 'border-[#1e2430] opacity-80'
              }`}
            >
              {/* Banner Preview */}
              <div className="relative h-44 w-full bg-black overflow-hidden">
                <img
                  src={off.banner_image}
                  alt={off.title}
                  className="w-full h-full object-cover filter brightness-[0.70]"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13171f] via-transparent to-black/30" />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-black shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                      Live On Storefront
                    </span>
                  ) : isExpired ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                      Expired
                    </span>
                  ) : isScheduled ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Scheduled
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-700 text-gray-300">
                      Disabled
                    </span>
                  )}

                  {off.code && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-black/70 text-amber-300 border border-amber-400/30">
                      CODE: {off.code}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(off)}
                    className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-amber-400 hover:text-black transition"
                    title="Edit Campaign"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteOffer(off.id, off.title)}
                    className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-red-400 hover:bg-red-500 hover:text-black transition"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Banner Overlay Headline */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block font-mono">
                    {off.discount_type === 'percentage'
                      ? `${off.discount_value}% OFF STOREWIDE`
                      : `₹${off.discount_value} OFF DISCOUNT`}
                  </span>
                  <h4 className="text-lg font-serif font-extrabold text-white uppercase tracking-tight leading-snug drop-shadow-md">
                    {off.title}
                  </h4>
                </div>
              </div>

              {/* Offer Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {off.subtitle || 'Exclusive olfactory promotional offer.'}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-[#171c24] border border-[#232936]">
                      <span className="text-gray-500 block text-[10px]">VALID PERIOD</span>
                      <span className="text-gray-300 font-semibold">
                        {off.start_date ? new Date(off.start_date).toLocaleDateString('en-IN') : 'Immediate'} &rarr;{' '}
                        {off.end_date ? new Date(off.end_date).toLocaleDateString('en-IN') : 'No Expiry'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[#171c24] border border-[#232936]">
                      <span className="text-gray-500 block text-[10px]">SCOPE</span>
                      <span className="text-amber-300 font-semibold">
                        {off.category_name
                          ? `Category: ${off.category_name}`
                          : off.product_title
                          ? `Fragrance: ${off.product_title}`
                          : 'Storewide (All Perfumes)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Toggle */}
                <div className="pt-3 border-t border-[#1e2430] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(off)}
                      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        off.is_active ? 'bg-emerald-500' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          off.is_active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <span className="text-xs font-semibold text-gray-300">
                      {off.is_active ? 'Active on Storefront' : 'Disabled'}
                    </span>
                  </div>

                  <span className="text-[10px] text-gray-500 font-mono">
                    Button: "{off.cta_text || 'SHOP NOW'}"
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Create / Edit Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12161e] border border-[#232936] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-[#232936] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  {editingOffer ? 'Edit Promotional Campaign' : 'Create Promotional Campaign & Hero Slider'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Active campaigns instantly appear on the customer website hero slider.
                </p>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c222c] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Campaign Title & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Campaign Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. DIWALI ROYAL LUXURY FESTIVAL"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Coupon Code / Badge
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. KOCHEE25"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Discount Structure
                  </label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Price Amount (₹ Off)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                    placeholder="e.g. 25"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Scope: Category or Product */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Apply to Specific Category (Optional)
                  </label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value, product_id: '' })}
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Storewide (All Categories)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Or Specific Fragrance (Optional)
                  </label>
                  <select
                    value={form.product_id}
                    onChange={(e) => setForm({ ...form, product_id: e.target.value, category_id: '' })}
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="">None (Storewide / Category)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hero Banner Background Upload */}
              <ImageDropzone
                label="Hero Banner Background Artwork"
                hint="Drag & drop wide banner artwork (16:9 ratio recommended) or browse from device"
                aspectRatio="h-36"
                required
                value={form.banner_image}
                onChange={(url) => setForm({ ...form, banner_image: url })}
              />

              {/* Subtitle & CTA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Subtitle Narrative
                  </label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="e.g. Crafted with rare Grasse floral absolutes."
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={form.cta_text}
                    onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                    placeholder="e.g. SHOP NOW"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active === 1}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
                    className="rounded bg-[#181d26] border-gray-700 text-amber-500 focus:ring-0"
                  />
                  <span className="text-xs text-gray-300 font-semibold">
                    Activate and display on Customer Hero Slider immediately
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232936]">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#181d26] text-xs font-semibold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingOffer}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {savingOffer ? 'Saving...' : editingOffer ? 'Update Promotion' : 'Publish to Slider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

