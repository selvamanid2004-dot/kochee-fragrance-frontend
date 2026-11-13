import React from 'react';
import { Award, Truck, RotateCcw, ShieldCheck, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-black text-neutral-300 pt-16 pb-12 border-t border-neutral-900">
      {/* 4 Trust Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider">100% Genuine Perfumes</h4>
              <p className="text-xs text-neutral-400 mt-1">Directly sourced French oils with high 20-25% Extrait concentrations.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider">Pan-India Express</h4>
              <p className="text-xs text-neutral-400 mt-1">Fast air shipping. Complimentary express delivery on orders over ₹999.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider">Free 2ml Wear Tester</h4>
              <p className="text-xs text-neutral-400 mt-1">Experience on skin before opening the 50ml flacon for risk-free wear.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white text-xs font-black uppercase tracking-wider">Cash on Delivery (COD)</h4>
              <p className="text-xs text-neutral-400 mt-1">Safe and secure doorstep payments available across 19,000+ pin codes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2 space-y-4">
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-serif tracking-[0.25em] text-xl font-bold text-white uppercase group-hover:text-neutral-400 transition">
              KOCHEE FRAGRANCE
            </span>
            <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
          </div>
          <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
            Luxury artisanal perfume atelier crafting authentic designer tribute formulas, pure 25% extraits, and Middle Eastern ouds without retail middleman markups.
          </p>
          <div className="pt-2 text-xs text-neutral-300 space-y-2">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-white flex-shrink-0" />
              <span>Marine Lines & Whitefield Fulfillment Hubs, India</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-white flex-shrink-0" />
              <span>+91 (0) 98765 43210 (Mon–Sat 10am – 7pm)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-white flex-shrink-0" />
              <span>support@kocheefragrance.com</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white" /> CUSTOMER CARE
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><button onClick={() => onNavigate('home')} className="hover:text-white transition">Home</button></li>
            <li><button onClick={() => onNavigate('catalog')} className="hover:text-white transition">All Perfumes</button></li>
            <li><button onClick={() => onNavigate('about')} className="hover:text-white transition">About Us</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition">Contact Us</button></li>
            <li><button onClick={() => onNavigate('track')} className="hover:text-white transition">Track Your Order</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-xs font-black tracking-widest uppercase mb-4 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-white" /> POLICIES & CARE
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><button onClick={() => onNavigate('cms', { slug: 'shipping-policy' })} className="hover:text-white transition">Shipping Policy</button></li>
            <li><button onClick={() => onNavigate('cms', { slug: 'refund-policy' })} className="hover:text-white transition">Returns & Tester Policy</button></li>
            <li><button onClick={() => onNavigate('cms', { slug: 'fragrance-guide' })} className="hover:text-white transition">Perfume Application Guide</button></li>
            <li><button onClick={() => onNavigate('admin')} className="text-neutral-500 hover:text-neutral-300 transition text-[11px]">Staff / Admin Console</button></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 text-center sm:text-left">
        <div>© {new Date().getFullYear()} KOCHEE FRAGRANCE. ALL RIGHTS RESERVED.</div>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-neutral-400">
          <button onClick={() => onNavigate('home')} className="hover:text-white transition">Home</button>
          <button onClick={() => onNavigate('catalog')} className="hover:text-white transition">All Perfumes</button>
          <button onClick={() => onNavigate('about')} className="hover:text-white transition">About</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-white transition">Contact</button>
          <button onClick={() => onNavigate('admin')} className="text-neutral-500 hover:text-white transition">Admin Portal</button>
          <span className="text-white font-semibold">• 100% Secure Checkout</span>
          <span className="text-white font-semibold">• COD Available</span>
        </div>
      </div>
    </footer>
  );
}
