// Polyfill document for styled-jsx during SSR/static generation
const mockDocument = {
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  getElementsByClassName: () => [],
  getElementsByTagName: () => [],
  createElement: () => ({
    setAttribute: () => {},
    getAttribute: () => null,
    removeAttribute: () => {},
    appendChild: () => {},
    removeChild: () => {},
    style: {},
  }),
  head: {
    appendChild: () => {},
  },
  body: {
    appendChild: () => {},
  },
};

if (typeof document === 'undefined') {
  if (typeof global !== 'undefined') {
    (global as any).document = mockDocument;
  }
  if (typeof window !== 'undefined') {
    (window as any).document = mockDocument;
  }
}

// Export for webpack ProvidePlugin
export default typeof document !== 'undefined' ? document : mockDocument;

