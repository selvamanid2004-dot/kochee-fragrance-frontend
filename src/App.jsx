import React, { useState, useEffect } from 'react';
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

// URL Hash Routing & History Parser
function parseHash(hashString) {
  let raw = hashString || (typeof window !== 'undefined' ? window.location.hash : '') || '';
  if (raw.startsWith('#')) raw = raw.slice(1);
  if (raw.startsWith('/')) raw = raw.slice(1);

  const pathname = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
  if (pathname === '/admin' || pathname.startsWith('/admin')) {
    return { page: 'admin', params: {} };
  }

  if (!raw || raw === '' || raw === '/') return { page: 'home', params: {} };

  const [routePart, queryPart] = raw.split('?');
  const params = {};
  if (queryPart) {
    const sp = new URLSearchParams(queryPart);
    sp.forEach((val, key) => {
      params[key] = val;
    });
  }

  const parts = routePart.split('/').filter(Boolean);
  const main = parts[0]?.toLowerCase() || 'home';

  switch (main) {
    case 'admin':
      return { page: 'admin', params };
    case 'catalog':
      return { page: 'catalog', params };
    case 'product':
      return { page: 'product', params: { slug: parts[1] || params.slug || '', ...params } };
    case 'checkout':
      return { page: 'checkout', params };
    case 'success':
      return { page: 'success', params };
    case 'track':
      return { page: 'track', params: { orderNumber: parts[1] || params.orderNumber || '', ...params } };
    case 'cms':
      return { page: 'cms', params: { slug: parts[1] || params.slug || '', ...params } };
    case 'about':
      return { page: 'about', params };
    case 'contact':
      return { page: 'contact', params };
    case 'login':
      return { page: 'login', params };
    case 'account':
      return { page: 'account', params };
    default:
      return { page: 'home', params };
  }
}

function buildHash(page, params = {}) {
  switch (page) {
    case 'home':
      return '#/';
    case 'admin':
      return '#/admin';
    case 'about':
      return '#/about';
    case 'contact':
      return '#/contact';
    case 'login':
      return '#/login';
    case 'account':
      return '#/account';
    case 'checkout':
      return '#/checkout';
    case 'success':
      return '#/success';
    case 'track':
      return params.orderNumber ? `#/track/${params.orderNumber}` : '#/track';
    case 'cms':
      return params.slug ? `#/cms/${params.slug}` : '#/cms';
    case 'product':
      return params.slug ? `#/product/${params.slug}` : '#/catalog';
    case 'catalog': {
      const q = new URLSearchParams();
      if (params.category) q.set('category', params.category);
      if (params.gender) q.set('gender', params.gender);
      if (params.search) q.set('search', params.search);
      const str = q.toString();
      return str ? `#/catalog?${str}` : '#/catalog';
    }
    default:
      return '#/';
  }
}

export default function App() {
  const initialRoute = parseHash();
  const [currentPage, setCurrentPage] = useState(initialRoute.page);
  const [pageParams, setPageParams] = useState(initialRoute.params);

  useEffect(() => {
    const initial = parseHash(window.location.hash);

    // If user arrived on a subpage (e.g. direct link to product/checkout),
    // anchor Home at the base of browser history so pressing Mobile Back
    // gracefully returns to Home instead of exiting the website!
    if (initial.page !== 'home') {
      window.history.replaceState({ page: 'home', params: {}, rootAnchor: true }, '', '#/');
      window.history.pushState(
        { page: initial.page, params: initial.params },
        '',
        buildHash(initial.page, initial.params)
      );
      setCurrentPage(initial.page);
      setPageParams(initial.params);
    } else {
      window.history.replaceState({ page: 'home', params: {}, rootAnchor: true }, '', '#/');
    }

    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        setPageParams(event.state.params || {});
      } else {
        const parsed = parseHash(window.location.hash);
        setCurrentPage(parsed.page);
        setPageParams(parsed.params);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page, params = {}, replace = false) => {
    // Handle programmatic "back"
    if (page === 'back') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        handleNavigate('home', {}, true);
      }
      return;
    }

    const targetHash = buildHash(page, params);
    const nextState = { page, params, timestamp: Date.now() };

    if (replace) {
      window.history.replaceState(nextState, '', targetHash);
    } else {
      window.history.pushState(nextState, '', targetHash);
    }

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
