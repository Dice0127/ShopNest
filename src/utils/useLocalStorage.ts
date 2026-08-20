import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

// Same API as useState, but the value is persisted to localStorage under `key`
// and rehydrated on load. Falls back to `initialValue` if nothing stored yet,
// or if storage is unavailable (e.g. private browsing, SSR).
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — fail silently, app still works in-memory
    }
  }, [key, value]);

  return [value, setValue];
}
