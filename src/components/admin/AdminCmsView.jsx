import React, { useState, useEffect } from 'react';
import {
  Palette,
  FileText,
  Save,
  CheckCircle2,
  Edit,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Globe,
  Sliders,
  Sparkles,
  Image as ImageIcon,
  Layers,
  HelpCircle,
  Eye,
  Info,
  Smartphone,
  Monitor,
  Maximize2,
  Crop,
  ShieldCheck
} from 'lucide-react';
import { settingService } from '../../services/settingService';
import { cmsService } from '../../services/cmsService';
import ImageDropzone from './ImageDropzone';

// Default 6 Curated High-Definition Luxury Perfume Banner Slides
const DEFAULT_HERO_BANNERS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=85&w=900',
    fit_mode: 'responsive',
    alt: 'Luxury Extrait de Parfum flacon with golden amber aura',
    link: 'catalog'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=85&w=900',
    fit_mode: 'responsive',
    alt: 'Regal golden perfume flacon on dark obsidian pedestal',
    link: 'catalog'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=85&w=900',
    fit_mode: 'responsive',
    alt: 'Oceanic azure Mediterranean luxury perfume with water ripple reflections',
    link: 'catalog'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=85&w=900',
    fit_mode: 'responsive',
    alt: 'Parisian crystal flacon surrounded by pure white jasmine petals',
    link: 'catalog'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=85&w=900',
    fit_mode: 'responsive',
    alt: 'Minimalist blush rose and vanilla perfume on Italian marble',
    link: 'catalog'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=85&w=2000',
    mobile_image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=85&w=900',
    fit_mode: 'responsive',
    alt: 'Smoky midnight noir leather and saffron extrait flacon',
    link: 'catalog'
  }
];

export default function AdminCmsView({
  cmsPages = [],
  onRefresh,
  setActionMessage
}) {
  const [activeSubTab, setActiveSubTab] = useState('hero_banners'); // 'hero_banners', 'branding', 'pages'
  const [savingSettings, setSavingSettings] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' or 'mobile'
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  // Global Settings State
  const [settings, setSettings] = useState({
    logo_text: 'KOCHEE',
    logo_subtitle: 'HAUTE PARFUMERIE',
    logo_image: '',
    announcement_text: '✨ 100% ORIGINAL LUXURY PERFUMES • AUTHENTICITY GUARANTEED | 🚚 FREE PAN-INDIA SHIPPING ON ORDERS ABOVE ₹999 | 💵 CASH ON DELIVERY AVAILABLE',
    promo_banner_him_title: 'POUR HOMME COLLECTION',
    promo_banner_him_subtitle: 'Artisanal smoky ouds and fresh aquatics tailored for charismatic men.',
    promo_banner_him_image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=1200',
    promo_banner_her_title: 'POUR FEMME COLLECTION',
    promo_banner_her_subtitle: 'Sensual Bulgarian roses, rich gourmands, and luminous florals.',
    promo_banner_her_image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1200',
    support_phone: '+91 98765 43210',
    support_email: 'concierge@kocheefragrance.com'
  });

  // Hero Banners Slider State (Array of slide objects)
  const [heroBanners, setHeroBanners] = useState(DEFAULT_HERO_BANNERS);

  // CMS Page Modal State
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [savingPage, setSavingPage] = useState(false);
  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    is_published: 1
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingService.getSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings(prev => ({ ...prev, ...data }));

          // Load custom hero banners if saved
          if (data.hero_banners) {
            let parsed = data.hero_banners;
            if (typeof parsed === 'string') {
              try { parsed = JSON.parse(parsed); } catch (e) {}
            }
            if (Array.isArray(parsed) && parsed.length > 0) {
              setHeroBanners(parsed);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load site settings', err);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        ...settings,
        hero_banners: heroBanners
      };
      await settingService.updateSettings(payload);
      setActionMessage('Storefront responsive banners & CMS settings saved and published to live store!');
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Hero Banners Slide Operations
  const handleBannerChange = (index, field, value) => {
    setHeroBanners(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddBannerSlide = () => {
    const newSlide = {
      id: Date.now(),
      image: '',
      mobile_image: '',
      fit_mode: 'responsive',
      alt: `Kochee Luxury Perfume Banner ${heroBanners.length + 1}`,
      link: 'catalog'
    };
    setHeroBanners(prev => [...prev, newSlide]);
  };

  const handleDeleteBannerSlide = (index) => {
    if (heroBanners.length <= 1) {
      alert('You must have at least one banner slide for the homepage carousel.');
      return;
    }
    if (window.confirm(`Delete banner slide #${index + 1}?`)) {
      setHeroBanners(prev => prev.filter((_, idx) => idx !== index));
      if (previewSlideIdx >= heroBanners.length - 1) {
        setPreviewSlideIdx(0);
      }
    }
  };

  const handleResetDefaultBanners = () => {
    if (window.confirm('Reset banner slider to the 6 default curated high-definition perfume images?')) {
      setHeroBanners(DEFAULT_HERO_BANNERS);
    }
  };

  // CMS Page Operations
  const handleOpenAddPage = () => {
    setEditingPage(null);
    setPageForm({
      title: '',
      slug: '',
      content: '',
      meta_title: '',
      meta_description: '',
      is_published: 1
    });
    setShowPageModal(true);
  };

  const handleOpenEditPage = (page) => {
    setEditingPage(page);
    setPageForm({
      title: page.title || '',
      slug: page.slug || '',
      content: page.content || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      is_published: page.is_published ? 1 : 0
    });
    setShowPageModal(true);
  };

  const handleSavePage = async (e) => {
    e.preventDefault();
    setSavingPage(true);
    try {
      if (editingPage) {
        await cmsService.updatePage(editingPage.id, pageForm);
        setActionMessage(`Updated CMS page "${pageForm.title}".`);
      } else {
        await cmsService.createPage(pageForm);
        setActionMessage(`Created new CMS page "${pageForm.title}".`);
      }
      setShowPageModal(false);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Error saving CMS page');
    } finally {
      setSavingPage(false);
    }
  };

  const handleDeletePage = async (id, title) => {
    if (window.confirm(`Delete page "${title}"?`)) {
      try {
        await cmsService.deletePage(id);
        setActionMessage(`Deleted CMS page "${title}".`);
        onRefresh();
      } catch (err) {
        alert(err.message || 'Failed to delete page');
      }
    }
  };

  const currentPreviewBanner = heroBanners[previewSlideIdx] || heroBanners[0];

  return (
    <div className="space-y-6">
      {/* 1. Sub-Tab Switcher */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('hero_banners')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'hero_banners'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#181d26] text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Responsive Banner Slider ({heroBanners.length} Slides)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('branding')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'branding'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#181d26] text-gray-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Logo, Announcement & Category Banners</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pages')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'pages'
                ? 'bg-amber-400 text-black shadow-md'
                : 'bg-[#181d26] text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>CMS Informational Pages ({cmsPages.length})</span>
          </button>
        </div>

        {activeSubTab === 'pages' && (
          <button
            onClick={handleOpenAddPage}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-black font-bold rounded-xl text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add CMS Page</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          2. RESPONSIVE HERO BANNER SLIDER MODULE (DESKTOP + MOBILE ARCHITECTURE)
         ========================================================================= */}
      {activeSubTab === 'hero_banners' && (
        <div className="space-y-6">
          {/* BANNER SPECIFICATIONS & RESPONSIVE ARCHITECTURE GUIDE */}
          <div className="bg-gradient-to-r from-[#171e2b] via-[#13171f] to-[#171e2b] border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  SMART RESPONSIVE BANNER ARCHITECTURE (ZERO-CROP GUARANTEE)
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  This system guarantees that <strong>no text, sentences, or important images ever get cut off on mobile devices</strong>. It combines automatic proportional aspect scaling with dedicated mobile upload slots:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-4 rounded-xl bg-[#181d26] border border-[#262e3d] space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Monitor className="w-4 h-4 text-amber-400" />
                  <span>Desktop & Laptop Banner (Horizontal / Landscape)</span>
                </div>
                <div className="space-y-1 text-gray-300 text-[11px]">
                  <p>• <strong>Recommended Dimensions:</strong> <span className="font-mono text-amber-300 font-bold">1920 × 700 px</span> (16:6 or 21:9 ratio)</p>
                  <p>• <strong>Display Target:</strong> Desktops, Laptops, and large tablets (&ge; 768px)</p>
                  <p>• <strong>Format & Size:</strong> WebP or JPG (Under 2 MB for instant loading)</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#181d26] border border-[#262e3d] space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Dedicated Mobile Banner (Portrait / Square - Optional)</span>
                </div>
                <div className="space-y-1 text-gray-300 text-[11px]">
                  <p>• <strong>Recommended Dimensions:</strong> <span className="font-mono text-emerald-300 font-bold">750 × 900 px</span> (4:5) or <span className="font-mono text-emerald-300 font-bold">1080 × 1080 px</span> (1:1)</p>
                  <p>• <strong>Display Target:</strong> Smartphones & small screens (&lt; 768px)</p>
                  <p>• <strong>Auto-Fallback:</strong> If omitted, desktop banner automatically scales with <strong>0% cropping</strong>.</p>
                </div>
              </div>
            </div>
          </div>

          {/* LIVE DEVICE PREVIEW SIMULATOR */}
          <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1e2430] gap-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Live Responsive Banner Preview Simulator
                </h3>
              </div>

              {/* Device Toggle Pills */}
              <div className="flex items-center gap-2 bg-[#181d26] p-1 rounded-xl border border-[#262e3d]">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    previewDevice === 'desktop'
                      ? 'bg-amber-400 text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop View (1920px)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    previewDevice === 'mobile'
                      ? 'bg-amber-400 text-black shadow'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile View (375px Phone)</span>
                </button>
              </div>
            </div>

            {/* Slide Selector Pills for Simulator */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mr-1">Preview Slide:</span>
              {heroBanners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPreviewSlideIdx(i)}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    previewSlideIdx === i
                      ? 'bg-white text-black'
                      : 'bg-[#181d26] text-gray-400 hover:text-white'
                  }`}
                >
                  Slide #{i + 1}
                </button>
              ))}
            </div>

            {/* Preview Frame */}
            <div className="p-4 rounded-2xl bg-black border border-[#262e3d] flex items-center justify-center min-h-[220px]">
              {previewDevice === 'desktop' ? (
                /* Desktop Landscape View */
                <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-white/10 aspect-[21/9] bg-neutral-900 relative">
                  <img
                    src={currentPreviewBanner?.image || 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=85&w=2000'}
                    alt="Desktop preview"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-mono px-2 py-0.5 rounded border border-white/20">
                    Desktop Landscape 21:9
                  </div>
                </div>
              ) : (
                /* Mobile Phone Screen Simulator (375px wide frame) */
                <div className="w-[300px] sm:w-[340px] rounded-3xl overflow-hidden shadow-2xl border-4 border-neutral-700 bg-neutral-900 relative my-2">
                  {/* Phone Speaker Notch */}
                  <div className="w-20 h-3.5 bg-neutral-800 mx-auto rounded-b-xl mb-1 flex items-center justify-center">
                    <div className="w-8 h-1 bg-neutral-600 rounded-full" />
                  </div>

                  <div className={`w-full overflow-hidden relative ${
                    currentPreviewBanner?.mobile_image ? 'aspect-[4/5]' : 'aspect-[16/9]'
                  }`}>
                    <img
                      src={currentPreviewBanner?.mobile_image || currentPreviewBanner?.image || 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=85&w=900'}
                      alt="Mobile preview"
                      className={`w-full h-full ${
                        currentPreviewBanner?.mobile_image
                          ? 'object-cover object-center'
                          : 'object-contain object-center bg-black'
                      }`}
                    />
                  </div>

                  <div className="p-2 text-center bg-neutral-950 text-[10px] text-gray-400 border-t border-neutral-800">
                    {currentPreviewBanner?.mobile_image ? (
                      <span className="text-emerald-400 font-bold">✓ Serving Dedicated Mobile Image (0% Crop)</span>
                    ) : (
                      <span className="text-amber-300 font-bold">✓ Auto-Scaling Desktop Banner (0% Crop)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SLIDES EDITING LIST */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Configured Banner Slides ({heroBanners.length} Active Slides)
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Every slide automatically adapts to all screen sizes without cropping text or flacons.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDefaultBanners}
                  className="px-3.5 py-2 rounded-xl bg-[#181d26] hover:bg-[#202734] border border-[#2a303e] text-xs font-semibold text-gray-300 hover:text-white transition"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={handleAddBannerSlide}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-black font-bold text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add Banner Slide</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {heroBanners.map((banner, index) => (
                <div
                  key={banner.id || index}
                  className="bg-[#13171f] border border-[#1e2430] hover:border-[#2f394d] rounded-2xl p-6 space-y-5 shadow-xl transition-all"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#1e2430]">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-amber-400 text-black text-xs font-black flex items-center justify-center">
                        #{index + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Banner Slide #{index + 1}
                        </h4>
                        <span className="text-[10px] text-gray-400">
                          {banner.mobile_image ? 'Dual Desktop + Mobile Enabled' : 'Auto-Adaptive Responsive Single Image'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteBannerSlide(index)}
                        className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition flex items-center gap-1"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* DUAL IMAGE UPLOADS: DESKTOP & MOBILE */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 1. Desktop Banner Upload */}
                    <div className="space-y-2 p-4 rounded-xl bg-[#181d26] border border-[#242b38]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-amber-400" />
                          <span>Desktop / Laptop Banner *</span>
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono">1920 × 700 px (Landscape)</span>
                      </div>
                      <ImageDropzone
                        label=""
                        hint="Drag & drop desktop banner here or browse from device (1920x700 recommended)"
                        aspectRatio="h-32 sm:h-36"
                        value={banner.image || ''}
                        onChange={(url) => handleBannerChange(index, 'image', url)}
                        required
                      />
                      <p className="text-[10px] text-gray-400">
                        Displays on screens &ge; 768px (Laptops, Monitors, Tablets).
                      </p>
                    </div>

                    {/* 2. Mobile Banner Upload (Dedicated / Optional) */}
                    <div className="space-y-2 p-4 rounded-xl bg-[#181d26] border border-[#242b38]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Mobile Banner (Dedicated / Optional)</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">750 × 900 px (Portrait/Square)</span>
                      </div>
                      <ImageDropzone
                        label=""
                        hint="Drag & drop mobile banner here (750x900 or 1080x1080 recommended)"
                        aspectRatio="h-32 sm:h-36"
                        value={banner.mobile_image || ''}
                        onChange={(url) => handleBannerChange(index, 'mobile_image', url)}
                      />
                      <p className="text-[10px] text-gray-400">
                        Displays specifically on smartphones (&lt; 768px). If omitted, the desktop banner auto-adapts with zero cropping.
                      </p>
                    </div>
                  </div>

                  {/* Settings Row: Fit Mode, Link, Alt Tag */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                        Image Fit Strategy
                      </label>
                      <select
                        value={banner.fit_mode || 'responsive'}
                        onChange={(e) => handleBannerChange(index, 'fit_mode', e.target.value)}
                        className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="responsive">Smart Responsive (0% Crop - 100% Visible)</option>
                        <option value="cover">Full Bleed Fill (Edge-to-Edge)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                        Click Action / Link URL (Optional)
                      </label>
                      <input
                        type="text"
                        value={banner.link || ''}
                        onChange={(e) => handleBannerChange(index, 'link', e.target.value)}
                        placeholder="e.g. catalog or catalog?category=oriental-ouds"
                        className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                        Alt / Accessibility Description
                      </label>
                      <input
                        type="text"
                        value={banner.alt || ''}
                        onChange={(e) => handleBannerChange(index, 'alt', e.target.value)}
                        placeholder="e.g. Royal Saffron Oud Luxury Flacon"
                        className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add & Save Bar */}
            <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <button
                type="button"
                onClick={handleAddBannerSlide}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#181d26] hover:bg-[#202734] border border-[#2a303e] text-xs font-bold text-white transition flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add Another Slide (Currently {heroBanners.length})</span>
              </button>

              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4 stroke-[2.5]" />
                <span>{savingSettings ? 'Publishing Changes...' : 'Save & Publish Hero Banners'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. BRANDING, LOGO & ANNOUNCEMENT BAR VIEW
         ========================================================================= */}
      {activeSubTab === 'branding' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Logo & Brand Identity */}
          <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-[#1e2430]">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Brand Logo & Identity
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update site logo, tagline, and customer contact information without altering code.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Brand Primary Logo Text *
                </label>
                <input
                  type="text"
                  required
                  value={settings.logo_text || ''}
                  onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
                  placeholder="KOCHEE"
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-bold tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Brand Subtitle / Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={settings.logo_subtitle || ''}
                  onChange={(e) => setSettings({ ...settings, logo_subtitle: e.target.value })}
                  placeholder="HAUTE PARFUMERIE"
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Custom Logo Image Dropzone */}
            <div className="pt-2">
              <ImageDropzone
                label="Custom Graphic Logo Image (Optional)"
                hint="Drag & drop custom logo image (transparent PNG or SVG recommended) or browse from device"
                aspectRatio="h-24"
                value={settings.logo_image || ''}
                onChange={(url) => setSettings({ ...settings, logo_image: url })}
              />
            </div>

            {/* Live Header Logo Preview */}
            <div className="p-4 rounded-xl bg-black border border-[#2a303e] flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-gray-500">Live Header Logo Preview:</span>
              <div className="text-center">
                {settings.logo_image ? (
                  <img src={settings.logo_image} alt="Logo" className="h-8 object-contain mx-auto" />
                ) : (
                  <>
                    <span className="font-serif tracking-[0.22em] text-xl font-extrabold text-white uppercase block leading-none">
                      {settings.logo_text || 'KOCHEE'}
                    </span>
                    <span className="text-[8px] tracking-[0.38em] text-gray-400 font-sans uppercase block mt-1 font-semibold">
                      {settings.logo_subtitle || 'HAUTE PARFUMERIE'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Support Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Customer Support Phone
                </label>
                <input
                  type="text"
                  value={settings.support_phone || ''}
                  onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Support Email Address
                </label>
                <input
                  type="email"
                  value={settings.support_email || ''}
                  onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Announcement Bar Ticker */}
          <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Storefront Announcement Bar (Top Ticker)
            </h3>
            <p className="text-xs text-gray-400">
              The announcement strip displayed at the very top of every storefront page.
            </p>

            <textarea
              rows="2"
              value={settings.announcement_text || ''}
              onChange={(e) => setSettings({ ...settings, announcement_text: e.target.value })}
              className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
            />

            <div className="bg-black text-white py-2 px-4 rounded-lg text-xs font-semibold tracking-wider text-center border border-gray-800">
              {settings.announcement_text}
            </div>
          </div>

          {/* Promotional Banners: Him & Her */}
          <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Homepage Promotional Category Banners
            </h3>

            {/* Pour Homme Banner */}
            <div className="p-4 rounded-xl bg-[#171c24] border border-[#232936] space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Promo Section 1: For Him / Pour Homme
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={settings.promo_banner_him_title || ''}
                    onChange={(e) => setSettings({ ...settings, promo_banner_him_title: e.target.value })}
                    className="w-full bg-[#12161e] border border-[#2a303e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={settings.promo_banner_him_subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, promo_banner_him_subtitle: e.target.value })}
                    className="w-full bg-[#12161e] border border-[#2a303e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <ImageDropzone
                label="For Him Promotional Cover Image"
                hint="Drag & drop men's collection banner image or browse from device"
                aspectRatio="h-32"
                value={settings.promo_banner_him_image || ''}
                onChange={(url) => setSettings({ ...settings, promo_banner_him_image: url })}
              />
            </div>

            {/* Pour Femme Banner */}
            <div className="p-4 rounded-xl bg-[#171c24] border border-[#232936] space-y-4">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                Promo Section 2: For Her / Pour Femme
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={settings.promo_banner_her_title || ''}
                    onChange={(e) => setSettings({ ...settings, promo_banner_her_title: e.target.value })}
                    className="w-full bg-[#12161e] border border-[#2a303e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={settings.promo_banner_her_subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, promo_banner_her_subtitle: e.target.value })}
                    className="w-full bg-[#12161e] border border-[#2a303e] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <ImageDropzone
                label="For Her Promotional Cover Image"
                hint="Drag & drop women's collection banner image or browse from device"
                aspectRatio="h-32"
                value={settings.promo_banner_her_image || ''}
                onChange={(url) => setSettings({ ...settings, promo_banner_her_image: url })}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{savingSettings ? 'Publishing Changes...' : 'Save & Publish CMS Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          4. CMS INFORMATIONAL PAGES VIEW
         ========================================================================= */}
      {activeSubTab === 'pages' && (
        <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#1e2430] text-xs text-gray-400">
            Edit statutory policies and informative content (About Us, Shipping, Return & Refund, Terms).
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171c24] text-gray-400 uppercase font-mono tracking-wider text-[11px] border-b border-[#1e2430]">
                <tr>
                  <th className="py-3.5 px-6">Page Title</th>
                  <th className="py-3.5 px-6">Slug Path</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Last Updated</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2430] text-gray-300 font-sans">
                {cmsPages.map((page) => (
                  <tr key={page.id} className="hover:bg-[#181d26] transition-colors">
                    <td className="py-3.5 px-6 font-bold text-white">
                      {page.title}
                    </td>
                    <td className="py-3.5 px-6 font-mono text-amber-300">
                      /{page.slug}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Published
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-gray-400 font-mono">
                      {new Date(page.updated_at || page.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditPage(page)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#202632] transition"
                          title="Edit Page"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(page.id, page.title)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Edit CMS Page Modal */}
      {showPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12161e] border border-[#232936] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-[#232936] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  {editingPage ? 'Edit CMS Page' : 'Create New CMS Page'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Update markdown or HTML content for customer pages.
                </p>
              </div>
              <button
                onClick={() => setShowPageModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c222c] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={pageForm.title}
                    onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                    placeholder="e.g. Return & Refund Policy"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={pageForm.slug}
                    onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="e.g. refund-policy"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Page Content *
                </label>
                <textarea
                  rows="10"
                  required
                  value={pageForm.content}
                  onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                  placeholder="Enter policy terms or page information..."
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232936]">
                <button
                  type="button"
                  onClick={() => setShowPageModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#181d26] text-xs font-semibold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPage}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {savingPage ? 'Saving...' : editingPage ? 'Update Page' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
