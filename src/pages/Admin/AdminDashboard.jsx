import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { orderService } from '../../services/orderService';
import { cmsService } from '../../services/cmsService';
import { contactService } from '../../services/contactService';

import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminDashboardView from '../../components/admin/AdminDashboardView';
import AdminProductsView from '../../components/admin/AdminProductsView';
import AdminCategoriesView from '../../components/admin/AdminCategoriesView';
import AdminStockView from '../../components/admin/AdminStockView';
import AdminOffersView from '../../components/admin/AdminOffersView';
import AdminCmsView from '../../components/admin/AdminCmsView';
import AdminOrdersView from '../../components/admin/AdminOrdersView';
import AdminInquiriesView from '../../components/admin/AdminInquiriesView';
import AdminCustomersView from '../../components/admin/AdminCustomersView';

import { CheckCircle2, X } from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const { adminUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Datasets
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cmsPages, setCmsPages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [stRes, prRes, ordRes, catRes, cmsRes, contRes] = await Promise.allSettled([
        orderService.getStatistics(),
        productService.getProducts({ all: true }),
        orderService.getAllOrders(),
        categoryService.getCategories(),
        cmsService.getPages(true),
        contactService.getAllContacts()
      ]);
      if (stRes.status === 'fulfilled') setStats(stRes.value);
      if (prRes.status === 'fulfilled') setProducts(prRes.value || []);
      if (ordRes.status === 'fulfilled') setOrders(ordRes.value || []);
      if (catRes.status === 'fulfilled') setCategories(catRes.value || []);
      if (cmsRes.status === 'fulfilled') setCmsPages(cmsRes.value || []);
      if (contRes.status === 'fulfilled') setContacts(contRes.value || []);
    } catch (err) {
      console.error('Failed to load admin datasets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Auto clear action message after 4.5 seconds
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(''), 4500);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-gray-200 flex flex-row font-sans selection:bg-amber-400 selection:text-black">
      {/* 1. Left Fixed Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNavigate={onNavigate}
        logout={logout}
        adminUser={adminUser}
        stats={stats}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <AdminHeader
          activeTab={activeTab}
          onRefresh={loadAllAdminData}
          loading={loading}
          onNavigate={onNavigate}
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Action Message Notification Bar */}
        {actionMessage && (
          <div className="mx-8 mt-4 p-3.5 bg-gradient-to-r from-emerald-950/80 to-emerald-900/60 border border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-200 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{actionMessage}</span>
            </div>
            <button
              onClick={() => setActionMessage('')}
              className="p-1 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View Routing */}
        <main className="p-8 flex-1">
          {activeTab === 'overview' && (
            <AdminDashboardView
              stats={stats}
              orders={orders}
              products={products}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'products' && (
            <AdminProductsView
              products={products}
              categories={categories}
              onRefresh={loadAllAdminData}
              setActionMessage={setActionMessage}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategoriesView
              categories={categories}
              products={products}
              onRefresh={loadAllAdminData}
              setActionMessage={setActionMessage}
            />
          )}

          {activeTab === 'stock' && (
            <AdminStockView
              products={products}
              onRefresh={loadAllAdminData}
              setActionMessage={setActionMessage}
            />
          )}

          {activeTab === 'offers' && (
            <AdminOffersView
              categories={categories}
              products={products}
              setActionMessage={setActionMessage}
            />
          )}

          {activeTab === 'cms' && (
            <AdminCmsView
              cmsPages={cmsPages}
              onRefresh={loadAllAdminData}
              setActionMessage={setActionMessage}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersView
              orders={orders}
              onRefresh={loadAllAdminData}
              setActionMessage={setActionMessage}
            />
          )}

          {activeTab === 'customers' && (
            <AdminCustomersView
              setActionMessage={setActionMessage}
              onParentRefresh={loadAllAdminData}
            />
          )}

          {activeTab === 'inquiries' && (
            <AdminInquiriesView
              contacts={contacts}
              onRefresh={loadAllAdminData}
              setActionMessage={setActionMessage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
