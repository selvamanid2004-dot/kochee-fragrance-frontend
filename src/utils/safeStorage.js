/**
 * Safe LocalStorage & In-Memory Fallback Utility
 * 
 * Provides robust protection against:
 * - SecurityError / DOMException in private/incognito browsing (Safari, iOS WebViews, etc.)
 * - QuotaExceededError when device storage is constrained
 * - SyntaxError when JSON stored in browser is corrupted
 * - Environments where window or localStorage is undefined
 */

class MemoryStorageFallback {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

class SafeStorage {
  constructor() {
    this.memoryFallback = new MemoryStorageFallback();
    this.isLocalStorageAvailable = this.checkAvailability();
  }

  checkAvailability() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const testKey = '__kochee_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    if (this.isLocalStorageAvailable) {
      try {
        const val = window.localStorage.getItem(key);
        return val !== null ? val : defaultValue;
      } catch {
        // Fall back to in-memory on error
        return this.memoryFallback.getItem(key) ?? defaultValue;
      }
    }
    return this.memoryFallback.getItem(key) ?? defaultValue;
  }

  setItem(key, value) {
    const stringVal = String(value);
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.setItem(key, stringVal);
        return true;
      } catch {
        // Fall back to memory
        this.memoryFallback.setItem(key, stringVal);
        return true;
      }
    }
    this.memoryFallback.setItem(key, stringVal);
    return true;
  }

  removeItem(key) {
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    }
    this.memoryFallback.removeItem(key);
  }

  clear() {
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.clear();
      } catch {
        // Ignore
      }
    }
    this.memoryFallback.clear();
  }

  getJSON(key, defaultValue = null) {
    const raw = this.getItem(key);
    if (!raw) return defaultValue;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  }

  setJSON(key, value) {
    try {
      const stringified = JSON.stringify(value);
      return this.setItem(key, stringified);
    } catch {
      return false;
    }
  }
}

export const safeStorage = new SafeStorage();
