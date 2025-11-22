import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import React from 'react';

// Create a cache for Emotion that works with SSR
// This is needed because react-select uses Emotion internally
let emotionCache: ReturnType<typeof createCache> | null = null;

export const getEmotionCache = () => {
  // Always create a cache - it works for both SSR and client
  // For SSR, we create a new cache each time
  if (typeof window === 'undefined') {
    return createCache({ key: 'css', prepend: true });
  }
  
  // On client side, create and reuse the same cache
  if (!emotionCache) {
    emotionCache = createCache({ 
      key: 'css', 
      prepend: true
    });
  }
  return emotionCache;
};

export const EmotionCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cache = React.useMemo(() => getEmotionCache(), []);
  return <CacheProvider value={cache}>{children}</CacheProvider>;
};

