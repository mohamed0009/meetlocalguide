import type { MetadataRoute } from "next";
import { getAllTours, guides } from "@/lib/mock-data";
import { SUPPORTED_LOCALES } from "@/i18n/config";

const BASE_URL = "https://meetlocalguide.com";

const STATIC_PATHS = [
  "",
  "/explore",
  "/tours",
  "/guides",
  "/auth/login",
  "/auth/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    const alternates = Object.fromEntries(
      SUPPORTED_LOCALES.map((l) => [l, `${BASE_URL}/${l}`])
    );

    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.7,
        alternates: { languages: alternates },
      });
    }

    for (const tour of getAllTours()) {
      entries.push({
        url: `${BASE_URL}/${locale}/tours/${tour.slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const guide of guides) {
      entries.push({
        url: `${BASE_URL}/${locale}/guides/${guide.slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
