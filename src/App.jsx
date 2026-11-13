import React, { useState } from 'react';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import CartDrawer from './components/cart/CartDrawer';

// Pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Catalog from './pages/Catalog/Catalog';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Checkout from './pages/Checkout/Checkout';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import TrackOrder from './pages/TrackOrder/TrackOrder';
import CmsPage from './pages/CmsPage/CmsPage';
import Contact from './pages/Contact/Contact';
import LoginPage from './pages/Auth/LoginPage';
import AccountDashboard from './pages/Account/AccountDashboard';
import AdminPage from './pages/Admin/AdminPage';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  // Listen to hash for direct /#admin route
  const getInitialPage = () => {
    if (window.location.hash === '#admin') return 'admin';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [pageParams, setPageParams] = useState({});

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      case 'catalog':
        return <Catalog onNavigate={handleNavigate} initialParams={pageParams} />;
      case 'product':
        return <ProductDetail slug={pageParams.slug} onNavigate={handleNavigate} />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'success':
        return <OrderSuccess order={pageParams.order} onNavigate={handleNavigate} />;
      case 'track':
        return <TrackOrder initialOrderNumber={pageParams.orderNumber || ''} onNavigate={handleNavigate} />;
      case 'cms':
        return <CmsPage slug={pageParams.slug} onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'account':
        return <AccountDashboard onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white text-black flex flex-col font-sans selection:bg-black selection:text-white">
          {/* Public customer navbar - Completely hides admin links */}
          {currentPage !== 'admin' && (
            <Navbar onNavigate={handleNavigate} currentPage={currentPage} />
          )}

          <div className="flex-1">
            {renderCurrentPage()}
          </div>

          {currentPage !== 'admin' && (
            <Footer onNavigate={handleNavigate} />
          )}

          <CartDrawer onNavigate={handleNavigate} />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
