// Client-safe i18n config (no server-only imports).
// Anything that runs in the browser (language switcher, proxy, header) imports from here.

export const SUPPORTED_LOCALES = ["en", "fr", "ar"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar"]);

export const LOCALE_LABELS: Record<Locale, { native: string; english: string; flag: string }> = {
  en: { native: "English", english: "English", flag: "🇬🇧" },
  fr: { native: "Français", english: "French", flag: "🇫🇷" },
  ar: { native: "العربية", english: "Arabic", flag: "🇲🇦" },
};

export function hasLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}
