import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { safeStorage } from './utils/safeStorage';

// 1. Service Worker & Stale Cache Cleanup
// Unregister any legacy service workers and purge old caches to prevent stale asset hijacking
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch(() => {});
        }
      }).catch(() => {});
    } catch {}
  }

  if ('caches' in window) {
    try {
      caches.keys().then((cacheNames) => {
        for (const name of cacheNames) {
          caches.delete(name).catch(() => {});
        }
      }).catch(() => {});
    } catch {}
  }

  // 2. Automated Seamless Chunk Update Recovery
  // When a new production version is deployed, Vite chunk hashes change.
  // Intercept preload/chunk errors and seamlessly reload once so users get the latest version automatically.
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    const lastReload = safeStorage.getItem('kochee_auto_reload');
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      safeStorage.setItem('kochee_auto_reload', String(now));
      window.location.reload();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
      msg.includes('Loading chunk') ||
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('error loading dynamically imported module')
    ) {
      const lastReload = safeStorage.getItem('kochee_auto_reload');
      const now = Date.now();
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        safeStorage.setItem('kochee_auto_reload', String(now));
        window.location.reload();
      }
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
