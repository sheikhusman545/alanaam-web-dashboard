// Polyfill document and performance APIs for styled-jsx and React scheduler during SSR/static generation
// This file must be plain JavaScript (not TypeScript) to ensure it runs early
if (typeof document === 'undefined') {
  // Create a more complete mock element
  function createMockElement(tagName) {
    const element = {
      tagName: (tagName || 'div').toUpperCase(),
      nodeName: (tagName || 'div').toUpperCase(),
      nodeType: 1,
      parentNode: null,
      childNodes: [],
      firstChild: null,
      lastChild: null,
      nextSibling: null,
      previousSibling: null,
      ownerDocument: null,
      setAttribute: function() {},
      getAttribute: function() { return null; },
      removeAttribute: function() {},
      appendChild: function(child) {
        if (child) {
          child.parentNode = this;
          this.childNodes.push(child);
          this.lastChild = child;
          if (!this.firstChild) {
            this.firstChild = child;
          }
        }
        return child || this;
      },
      removeChild: function(child) {
        const index = this.childNodes.indexOf(child);
        if (index > -1) {
          this.childNodes.splice(index, 1);
          child.parentNode = null;
          if (this.firstChild === child) {
            this.firstChild = this.childNodes[0] || null;
          }
          if (this.lastChild === child) {
            this.lastChild = this.childNodes[this.childNodes.length - 1] || null;
          }
        }
        return child;
      },
      insertBefore: function(newNode, referenceNode) {
        if (newNode) {
          newNode.parentNode = this;
          if (referenceNode) {
            const index = this.childNodes.indexOf(referenceNode);
            if (index > -1) {
              this.childNodes.splice(index, 0, newNode);
            } else {
              this.childNodes.push(newNode);
            }
          } else {
            this.childNodes.push(newNode);
          }
          this.lastChild = this.childNodes[this.childNodes.length - 1] || null;
          if (!this.firstChild) {
            this.firstChild = newNode;
          }
        }
        return newNode || this;
      },
      replaceChild: function(newNode, oldNode) {
        const index = this.childNodes.indexOf(oldNode);
        if (index > -1) {
          this.childNodes[index] = newNode;
          oldNode.parentNode = null;
          newNode.parentNode = this;
          if (this.firstChild === oldNode) {
            this.firstChild = newNode;
          }
          if (this.lastChild === oldNode) {
            this.lastChild = newNode;
          }
        }
        return oldNode;
      },
      cloneNode: function(deep) {
        return this;
      },
      style: {},
      className: '',
      id: '',
      innerHTML: '',
      textContent: '',
      innerText: '',
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() { return true; },
      getElementsByTagName: function() { return []; },
      getElementsByClassName: function() { return []; },
      querySelector: function() { return null; },
      querySelectorAll: function() { return []; },
    };
    // Set ownerDocument after mockDocument is created
    return element;
  }

  // Create head and body elements with proper appendChild
  const mockHead = createMockElement('head');
  const mockBody = createMockElement('body');
  const mockDocumentElement = createMockElement('html');
  
  // Set ownerDocument on elements
  mockHead.ownerDocument = null; // Will be set after mockDocument is created
  mockBody.ownerDocument = null;
  mockDocumentElement.ownerDocument = null;

  const mockDocument = {
    nodeType: 9,
    documentElement: mockDocumentElement,
    body: mockBody,
    head: mockHead,
    defaultView: null,
    parentWindow: null,
    implementation: {
      createHTMLDocument: function(title) {
        // Return a new mock document for jQuery's use
        const newDoc = {
          nodeType: 9,
          documentElement: createMockElement('html'),
          body: createMockElement('body'),
          head: createMockElement('head'),
          title: title || '',
          createElement: function(tagName) {
            return createMockElement(tagName);
          },
          createTextNode: function(text) {
            return {
              nodeType: 3,
              nodeName: '#text',
              textContent: text || '',
              data: text || '',
              parentNode: null,
            };
          },
          querySelector: function() { return null; },
          querySelectorAll: function() { return []; },
          getElementById: function() { return null; },
          getElementsByTagName: function() { return []; },
        };
        newDoc.documentElement.ownerDocument = newDoc;
        newDoc.body.ownerDocument = newDoc;
        newDoc.head.ownerDocument = newDoc;
        return newDoc;
      },
      createDocument: function() {
        return mockDocument;
      },
    },
    querySelector: function() { return null; },
    querySelectorAll: function() { return []; },
    getElementById: function() { return null; },
    getElementsByClassName: function() { return []; },
    getElementsByTagName: function() { return []; },
    createElement: function(tagName) {
      return createMockElement(tagName);
    },
    createTextNode: function(text) {
      return {
        nodeType: 3,
        nodeName: '#text',
        textContent: text || '',
        data: text || '',
        parentNode: null,
      };
    },
    createDocumentFragment: function() {
      return {
        nodeType: 11,
        appendChild: function(child) {
          if (child) {
            child.parentNode = this;
          }
          return child || this;
        },
        querySelector: function() { return null; },
        querySelectorAll: function() { return []; },
      };
    },
    appendChild: function(child) {
      if (child) {
        child.parentNode = mockDocument;
        child.ownerDocument = mockDocument;
      }
      return child || mockDocument;
    },
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() { return true; },
  };

  // Set ownerDocument on head, body, and documentElement
  mockHead.ownerDocument = mockDocument;
  mockBody.ownerDocument = mockDocument;
  mockDocumentElement.ownerDocument = mockDocument;

  // Create mock HTML element constructors for file-saver and other libraries
  function createHTMLElementConstructor(name) {
    return function() {
      const element = createMockElement(name.toLowerCase());
      element.constructor = this;
      return element;
    };
  }

  // Mock HTML element constructors
  const HTMLElementConstructors = {
    HTMLElement: createHTMLElementConstructor('div'),
    HTMLAnchorElement: createHTMLElementConstructor('a'),
    HTMLButtonElement: createHTMLElementConstructor('button'),
    HTMLDivElement: createHTMLElementConstructor('div'),
    HTMLSpanElement: createHTMLElementConstructor('span'),
    HTMLScriptElement: createHTMLElementConstructor('script'),
    HTMLStyleElement: createHTMLElementConstructor('style'),
    HTMLImageElement: createHTMLElementConstructor('img'),
    HTMLInputElement: createHTMLElementConstructor('input'),
    HTMLFormElement: createHTMLElementConstructor('form'),
    HTMLSelectElement: createHTMLElementConstructor('select'),
    HTMLTextAreaElement: createHTMLElementConstructor('textarea'),
    HTMLCanvasElement: createHTMLElementConstructor('canvas'),
    HTMLVideoElement: createHTMLElementConstructor('video'),
    HTMLAudioElement: createHTMLElementConstructor('audio'),
  };

  // Set document on all possible global objects
  if (typeof global !== 'undefined') {
    global.document = mockDocument;
    if (!global.window) {
      global.window = global;
    }
    global.window.document = mockDocument;
    // Add HTML element constructors
    Object.keys(HTMLElementConstructors).forEach(name => {
      global[name] = HTMLElementConstructors[name];
      global.window[name] = HTMLElementConstructors[name];
    });
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.document = mockDocument;
    if (!globalThis.window) {
      globalThis.window = globalThis;
    }
    globalThis.window.document = mockDocument;
    // Add HTML element constructors
    Object.keys(HTMLElementConstructors).forEach(name => {
      globalThis[name] = HTMLElementConstructors[name];
      globalThis.window[name] = HTMLElementConstructors[name];
    });
  }
}

// Polyfill navigator for file-saver and other libraries during SSR
if (typeof navigator === 'undefined') {
  const navigatorMock = {
    userAgent: 'Mozilla/5.0 (compatible; SSR)',
    platform: 'SSR',
    language: 'en-US',
    languages: ['en-US', 'en'],
    cookieEnabled: false,
    onLine: true,
    hardwareConcurrency: 4,
    maxTouchPoints: 0,
    vendor: 'SSR',
    vendorSub: '',
    product: 'SSR',
    productSub: '',
  };

  if (typeof global !== 'undefined') {
    global.navigator = navigatorMock;
    if (global.window) {
      global.window.navigator = navigatorMock;
    }
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.navigator = navigatorMock;
    if (globalThis.window) {
      globalThis.window.navigator = navigatorMock;
    }
  }
}

// Polyfill performance.now() for React scheduler during SSR
// This MUST run before React/scheduler loads
if (typeof performance === 'undefined' || typeof performance.now !== 'function') {
  const startTime = Date.now();
  const performanceMock = {
    now: function() {
      return Date.now() - startTime;
    },
    mark: function() {},
    measure: function() {},
    getEntriesByType: function() { return []; },
    getEntriesByName: function() { return []; },
    clearMarks: function() {},
    clearMeasures: function() {},
    timing: {},
    navigation: {},
  };

  if (typeof global !== 'undefined') {
    global.performance = performanceMock;
    if (global.window) {
      global.window.performance = performanceMock;
    }
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.performance = performanceMock;
    if (globalThis.window) {
      globalThis.window.performance = performanceMock;
    }
  }
}

// Polyfill requestAnimationFrame and cancelAnimationFrame for React during SSR
if (typeof requestAnimationFrame === 'undefined') {
  const rafMock = function(callback) {
    return setTimeout(callback, 16);
  };
  const cafMock = function(id) {
    clearTimeout(id);
  };

  if (typeof global !== 'undefined') {
    global.requestAnimationFrame = rafMock;
    global.cancelAnimationFrame = cafMock;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.requestAnimationFrame = rafMock;
    globalThis.cancelAnimationFrame = cafMock;
  }
}

// Polyfill location for axios/apisauce during SSR
// This must run BEFORE any axios/apisauce imports
if (typeof location === 'undefined') {
  const locationMock = {
    href: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost:3000',
    assign: function() {},
    replace: function() {},
    reload: function() {},
  };

  // Set on all possible global objects
  if (typeof global !== 'undefined') {
    global.location = locationMock;
    if (!global.window) {
      global.window = global;
    }
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.location = locationMock;
    if (!globalThis.window) {
      globalThis.window = globalThis;
    }
  }
  // Also set on process if it exists (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    try {
      process.location = locationMock;
    } catch (e) {
      // Ignore
    }
  }
}

