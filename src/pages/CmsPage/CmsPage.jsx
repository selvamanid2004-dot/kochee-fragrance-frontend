import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';
import { ArrowLeft } from 'lucide-react';

export default function CmsPage({ slug, onNavigate }) {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCms() {
      setLoading(true);
      try {
        const data = await cmsService.getPageBySlug(slug);
        setPage(data);
      } catch (err) {
        console.error('Failed to load CMS content', err);
      } finally {
        setLoading(false);
      }
    }
    loadCms();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-6 bg-white">
        <div className="h-10 bg-gray-100 rounded w-1/3" />
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center space-y-4 bg-white text-black">
        <h2 className="text-2xl font-serif text-black">Page Not Found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-black uppercase tracking-widest underline"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-white text-black">
      <button
        onClick={() => onNavigate('back')}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="border-b border-gray-200 pb-6">
        <span className="text-gray-500 text-xs uppercase tracking-[0.25em] font-bold">
          KOCHEE FRAGRANCE POLICIES & STORY
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black uppercase text-black mt-1">
          {page.title}
        </h1>
      </div>

      <article
        className="prose prose-neutral max-w-none text-gray-700 text-sm leading-relaxed space-y-4 [&>h2]:text-xl [&>h2]:font-serif [&>h2]:font-black [&>h2]:text-black [&>h2]:mt-6 [&>h3]:text-base [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-black [&>h3]:mt-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mt-1"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
