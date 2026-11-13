import React, { useState } from 'react';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import ImageDropzone from './ImageDropzone';

export default function AdminCategoriesView({
  categories = [],
  products = [],
  onRefresh,
  setActionMessage
}) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image: ''
  });

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setForm({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'
    });
    setShowCategoryModal(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || ''
    });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setSavingCategory(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, form);
        setActionMessage(`Updated category "${form.name}".`);
      } else {
        await categoryService.createCategory(form);
        setActionMessage(`Created new category "${form.name}".`);
      }
      setShowCategoryModal(false);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Error saving category');
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    const productCount = products.filter(p => p.category_id === id).length;
    const confirmPrompt = productCount > 0
      ? `Category "${name}" currently has ${productCount} assigned fragrance products. Deleting it will leave those products unassigned. Are you sure?`
      : `Are you sure you want to delete category "${name}"?`;

    if (window.confirm(confirmPrompt)) {
      try {
        await categoryService.deleteCategory(id);
        setActionMessage(`Deleted category "${name}".`);
        onRefresh();
      } catch (err) {
        alert(err.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Bar */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Olfactory Scent Families & Taxonomies
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Categories organize the storefront navigation and landing page collections.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* 2. Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter(p => p.category_id === cat.id).length;
          const bannerImg = cat.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800';

          return (
            <div
              key={cat.id}
              className="bg-[#13171f] border border-[#1e2430] rounded-2xl overflow-hidden hover:border-amber-400/40 transition group shadow-xl flex flex-col"
            >
              {/* Category Image Banner */}
              <div className="relative h-44 w-full bg-black overflow-hidden">
                <img
                  src={bannerImg}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13171f] via-transparent to-black/30" />

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-amber-400 hover:text-black transition"
                    title="Edit Category & Banner"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-2 rounded-xl bg-black/60 backdrop-blur-md text-red-400 hover:bg-red-500 hover:text-black transition"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-amber-400 text-black font-extrabold px-2.5 py-0.5 rounded-full">
                    {productCount} Fragrances
                  </span>
                </div>
              </div>

              {/* Category Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="text-base font-bold text-white font-serif tracking-wide">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                    Slug: /{cat.slug}
                  </p>
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description || 'Artisanal olfactory fragrance collection.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1e2430] flex items-center justify-between text-xs text-gray-400">
                  <span className="text-[10px] text-gray-500 font-mono">ID #{cat.id}</span>
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold"
                  >
                    Change Image &rarr;
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Add/Edit Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12161e] border border-[#232936] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#232936] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Set scent family title, description, and cover image.
                </p>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c222c] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Gourmand & Vanilla"
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <ImageDropzone
                label="Category Cover & Hero Artwork"
                hint="Drag & drop category cover artwork or browse from device"
                aspectRatio="h-36"
                required
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the notes and characteristics of this olfactory category..."
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232936]">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#181d26] text-xs font-semibold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {savingCategory ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

