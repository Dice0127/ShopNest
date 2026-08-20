import { useRef, useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useOutsideClick } from "../../utils/useOutsideClick";
import { useToast } from "../../ToastContext";

interface Language {
  code: string;
  label: string;
}

const LANGUAGES: Language[] = [
  { code: "en", label: "English" },
  { code: "fil", label: "Filipino" },
];

export default function LanguageSwitcher() {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(LANGUAGES[0]!);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => setOpen(false), open);

  return (
    <div className="navbar-dropdown" ref={ref}>
      <button
        className="navbar-topbar-link"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Globe size={13} /> {language.label} <ChevronDown size={12} className={open ? "is-open" : ""} />
      </button>
      {open && (
        <div className="navbar-dropdown-menu" role="menu" aria-label="Choose language">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              role="menuitem"
              onClick={() => {
                setLanguage(l);
                setOpen(false);
                showToast(`Language set to ${l.label}`);
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
