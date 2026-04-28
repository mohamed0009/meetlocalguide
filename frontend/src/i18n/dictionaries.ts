import "server-only";
import type { Locale } from "./config";

type DictionaryData = typeof import("./dictionaries/en.json");

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
  ar: () => import("./dictionaries/ar.json").then((m) => m.default),
} satisfies Record<Locale, () => Promise<DictionaryData>>;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
