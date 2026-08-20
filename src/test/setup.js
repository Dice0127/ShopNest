import "@testing-library/jest-dom";

// Node 22+ ships an experimental built-in `localStorage` that persists to a
// real file on disk. jsdom may delegate window.localStorage to it, which
// means data written by one test file can leak into the next test file
// within the same CI run (surfaces as flaky "expected [] but received
// [stale data]" failures). To keep tests isolated and behave like a normal
// in-memory browser storage regardless of Node/jsdom version, we always
// install a fresh in-memory Storage polyfill rather than trusting whatever
// localStorage the environment already provides.
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

function installMemoryStorage(propertyName) {
  Object.defineProperty(window, propertyName, {
    value: createMemoryStorage(),
    writable: true,
    configurable: true,
  });
}

if (typeof window !== "undefined") {
  installMemoryStorage("localStorage");
  installMemoryStorage("sessionStorage");
}

// Belt-and-suspenders: also reset storage before every individual test, in
// case a test file imports modules that cache a reference to storage before
// this setup file runs, or a previous test left data behind.
beforeEach(() => {
  window.localStorage?.clear();
  window.sessionStorage?.clear();
});