"use client";

import { createContext, useContext } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries";

type I18nContextValue = {
  dict: Dictionary;
  locale: Locale;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  dict,
  locale,
  children,
}: I18nContextValue & { children: React.ReactNode }) {
  return (
    <I18nContext.Provider value={{ dict, locale }}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return ctx;
}

/** Convenience: build a locale-prefixed href ("/tours" → "/fr/tours"). */
export function useLocalizedHref() {
  const { locale } = useI18n();
  return (path: string) => {
    if (path.startsWith("http")) return path;
    if (path.startsWith(`/${locale}/`) || path === `/${locale}`) return path;
    if (path.startsWith("/")) return `/${locale}${path === "/" ? "" : path}`;
    return path;
  };
}
