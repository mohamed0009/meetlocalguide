import type { MetadataRoute } from "next";
import { getAllTours, guides } from "@/lib/mock-data";

const BASE_URL = "https://meetlocalguide.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/tours",
    "/auth/login",
    "/auth/register",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const tourPages: MetadataRoute.Sitemap = getAllTours().map((tour) => ({
    url: `${BASE_URL}/tours/${tour.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...tourPages, ...guidePages];
}