import { useEffect, type RefObject } from "react";

/**
 * Closes a menu/dropdown when the user clicks outside it or presses Escape.
 * Centralizes a pattern that used to be copy-pasted per-dropdown in Navbar.
 *
 * @param refs one or more refs whose contents should NOT count as "outside"
 * @param onClose called on outside click or Escape
 * @param active only listens while true, so idle dropdowns don't pay for it
 */
export function useOutsideClick(refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[], onClose: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    const list = Array.isArray(refs) ? refs : [refs];

    const handlePointer = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside = list.some((r) => r.current && r.current.contains(target));
      if (!inside) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [refs, onClose, active]);
}
