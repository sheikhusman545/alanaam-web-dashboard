import { useEffect, useState } from 'react';

/**
 * ClientOnly component - Only renders children on the client side
 * This prevents SSR errors for components that require browser APIs
 */
export default function ClientOnly({ children, fallback = null }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return fallback;
  }

  return <>{children}</>;
}

