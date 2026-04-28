"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import {
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

const LOCALE_COOKIE = "mlg_locale";

function setLocaleCookie(locale: Locale) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${oneYear}; SameSite=Lax`;
}

function swapLocaleInPath(pathname: string, next: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as Locale)) {
    segments[0] = next;
  } else {
    segments.unshift(next);
  }
  return "/" + segments.join("/");
}

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function pick(next: Locale) {
    setLocaleCookie(next);
    setOpen(false);
    router.push(swapLocaleInPath(pathname, next));
  }

  return (
    <div ref={ref} className="relative">
      <button
        id="locale-switcher-toggle"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
        style={{
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
          background: open ? "var(--accent-subtle)" : "transparent",
        }}
      >
        <Globe className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
        {compact ? (
          <span className="uppercase">{locale}</span>
        ) : (
          <span>{LOCALE_LABELS[locale].native}</span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 mt-2 w-44 overflow-hidden rounded-xl shadow-lg z-50"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {SUPPORTED_LOCALES.map((l) => {
            const active = l === locale;
            const label = LOCALE_LABELS[l];
            return (
              <button
                key={l}
                role="menuitem"
                id={`locale-option-${l}`}
                onClick={() => pick(l)}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors"
                style={{
                  background: active ? "var(--accent-dim)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-primary)",
                }}
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{label.flag}</span>
                  <span className="font-medium">{label.native}</span>
                </span>
                {active && <Check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
