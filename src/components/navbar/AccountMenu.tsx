import { useRef, useState } from "react";
import { ChevronDown, User, Package, LogOut } from "lucide-react";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { useToast } from "../../ToastContext";

export default function AccountMenu() {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => setOpen(false), open);

  const runAndClose = (message: string) => {
    setOpen(false);
    showToast(message);
  };

  return (
    <div className="navbar-dropdown" ref={ref}>
      <button
        className="navbar-avatar-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="navbar-avatar">SW</div>
        <ChevronDown size={13} className={open ? "is-open" : ""} />
      </button>
      {open && (
        <div className="navbar-dropdown-menu navbar-dropdown-menu-right" role="menu" aria-label="Account">
          <button role="menuitem" onClick={() => runAndClose("Profile page coming soon")}>
            <User size={14} /> Profile
          </button>
          <button role="menuitem" onClick={() => runAndClose("No past orders yet")}>
            <Package size={14} /> Orders
          </button>
          <button role="menuitem" onClick={() => runAndClose("Signed out")}>
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
