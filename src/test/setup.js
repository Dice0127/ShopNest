import "@testing-library/jest-dom";

// Node 22+ ships an experimental built-in `localStorage`, and newer jsdom
// versions try to delegate window.localStorage to it. Without the
// --localstorage-file flag that delegation silently fails, leaving
// window.localStorage undefined in tests (surfaces as errors like
// "Cannot read properties of undefined (reading 'clear')"). This installs
// a small in-memory Storage polyfill only when the real one isn't usable,
// so tests behave like a normal browser regardless of Node/jsdom version.
function createMemoryStorage() {
  let store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
}

function ensureWorkingStorage(propertyName) {
  const current = typeof window !== "undefined" ? window[propertyName] : undefined;
  let isWorking = false;
  if (current && typeof current.clear === "function") {
    try {
      current.setItem("__storage_test__", "1");
      current.removeItem("__storage_test__");
      isWorking = true;
    } catch {
      isWorking = false;
    }
  }
  if (!isWorking) {
    Object.defineProperty(window, propertyName, {
      value: createMemoryStorage(),
      writable: true,
      configurable: true,
    });
  }
}

if (typeof window !== "undefined") {
  ensureWorkingStorage("localStorage");
  ensureWorkingStorage("sessionStorage");
}

