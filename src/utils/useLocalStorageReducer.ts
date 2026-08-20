import { useEffect, useReducer, type Dispatch, type Reducer } from "react";

// Same API as useReducer, but state is persisted to localStorage under `key`
// and rehydrated on load.
export function useLocalStorageReducer<S, A>(
  key: string,
  reducer: Reducer<S, A>,
  initialState: S
): [S, Dispatch<A>] {
  const [state, dispatch] = useReducer(reducer, initialState, (init: S) => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as S) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage full or unavailable — fail silently, app still works in-memory
    }
  }, [key, state]);

  return [state, dispatch];
}
