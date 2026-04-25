'use client';

import { useState, useEffect } from 'react';

export function useBrowserCapabilities() {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkCapabilities = () => {
      try {
        // 1. Check Local Storage
        const testKey = '__test__';
        window.localStorage.setItem(testKey, testKey);
        window.localStorage.removeItem(testKey);

        // 2. Check basic Web APIs (Fetch, Promise, etc)
        if (!window.fetch || !window.Promise || !window.crypto) {
          return false;
        }

        // 3. Check Intl API for date formatting
        if (typeof Intl === 'undefined') {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    };

    setIsSupported(checkCapabilities());
    setHasChecked(true);
  }, []);

  return { isSupported, hasChecked };
}
