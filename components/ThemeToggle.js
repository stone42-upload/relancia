import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const t = saved || (prefersDark ? "dark" : "light");
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try { localStorage.setItem("theme", next); } catch {}
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      className="relative h-10 w-[88px] rounded-full bg-white/70 dark:bg-ink-800 border border-black/5 dark:border-white/10 shadow-soft flex items-center px-1 transition"
    >
      <span aria-hidden="true" className="absolute left-1 inline-flex items-center justify-center w-10 h-8 z-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#85A07D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: isDark ? 0.35 : 1 }}>
          <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
      </span>
      <span aria-hidden="true" className="absolute right-1 inline-flex items-center justify-center w-10 h-8 z-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#85A07D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: isDark ? 1 : 0.35 }}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>
      <span
        className="relative z-10 w-10 h-8 rounded-full bg-sage-400 transition-transform duration-300"
        style={{ transform: isDark ? "translateX(44px)" : "translateX(0)" }}
      />
      <span className="sr-only">{mounted ? (isDark ? "sombre" : "clair") : ""}</span>
    </button>
  );
}

export function Logo({ className = "" }) {
  return (
    <span className={"inline-flex items-center gap-2.5 " + className}>
      <svg width="34" height="34" viewBox="0 0 64 64" aria-label="RelanceIA" className="text-sage-400 dark:text-sage-300">
        <defs>
          <linearGradient id="r-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A4BB9C"/>
            <stop offset="100%" stopColor="#6E8B66"/>
          </linearGradient>
        </defs>
        <path d="M14 8 C14 8, 22 6, 32 8 C44 10, 52 18, 50 28 C49 35, 42 38, 34 38 L24 38 L46 56 L40 58 L18 38 L14 38 Z M22 14 L22 32 L34 32 C42 32, 44 26, 42 22 C40 18, 34 14, 28 14 Z M10 56 Q 14 54, 18 56" fill="url(#r-grad)" stroke="none"/>
      </svg>
      <span className="serif text-[22px] leading-none tracking-tighter">RelanceIA</span>
    </span>
  );
}
