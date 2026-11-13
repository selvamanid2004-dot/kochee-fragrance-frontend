import React from 'react';
import { Award, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function About({ onNavigate }) {
  return (
    <div className="bg-white text-black py-12 space-y-16">
      {/* 1. Hero Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-black" /> OUR STORY & PHILOSOPHY
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black uppercase tracking-tight text-black">
          HAUTE PARFUMERIE WITHOUT THE 1000% LOGO TAX
        </h1>
        <div className="w-16 h-1 bg-black mx-auto mt-2 rounded-full" />
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 leading-relaxed font-medium pt-2">
          Founded on an uncompromising obsession with French olfactory artistry, Kochee Fragrance creates 
          pure <strong>20% to 25% Extrait de Parfum</strong> formulations that last 12+ hours without middleman markups.
        </p>
      </section>

      {/* 2. Visual Story Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1000"
              alt="Artisanal French Perfumery"
              className="w-full h-full object-cover hover:scale-105 transition duration-700"
            />
          </div>
          <div className="space-y-5">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
              DIRECT FROM GRASSE & ASSAM
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black uppercase text-black">
              Pure Ingredients, Maximum Oil Concentration
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Traditional designer brands sold in luxury shopping malls dilute their formulas down to 8%–12% 
              fragrance oil, forcing customers to re-spray multiple times a day while charging ₹12,000+ per bottle.
            </p>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              At Kochee, every bottle is blended with <strong>20% to 25% pure perfume oil</strong>. We import genuine 
              absolutes directly from Grasse, France, and distill natural Assamese agarwood ouds calibrated 
              specifically to project in hot and humid tropical climates.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('catalog')}
                className="bg-black hover:bg-neutral-800 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition shadow-lg flex items-center gap-2 hover:scale-105"
              >
                EXPLORE OUR PERFUMES <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Core Brand Pillars */}
      <section className="bg-neutral-50 py-16 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">WHY CHOOSE US</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-black uppercase text-black mt-1">
              THE KOCHEE COMMITTMENT
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3 shadow-sm hover:border-black transition">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-serif font-black text-sm uppercase text-black">20-25% Extrait Strength</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Beast-mode performance that lasts 10 to 14+ hours on skin and fabrics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3 shadow-sm hover:border-black transition">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-serif font-black text-sm uppercase text-black">Free 2ml Tester Vial</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Test the complimentary sample vial first. If you don't love it, return the sealed 50ml bottle for a 100% refund.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3 shadow-sm hover:border-black transition">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-serif font-black text-sm uppercase text-black">IFRA Compliant & Safe</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                100% skin safe, phthalate-free, non-carcinogenic, and never tested on animals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-3 shadow-sm hover:border-black transition">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-serif font-black text-sm uppercase text-black">Honest Pricing</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                No celebrity multi-million dollar contracts. You pay for the pure fragrance juice inside.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
