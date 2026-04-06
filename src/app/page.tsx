import type { Metadata } from "next";
import Link from "next/link";
import { TourCard } from "@/components/tour-card";
import { getCities, getFeaturedTours } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover handcrafted Moroccan tours led by trusted local guides in Marrakech, Fes, Sahara, and beyond.",
};

export default function HomePage() {
  const featuredTours = getFeaturedTours();
  const cities = getCities();

  return (
    <div className="container-shell space-y-20 py-10 sm:py-14">
      <section className="hero-grid card-surface relative overflow-hidden rounded-[2.1rem] px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-[var(--sand-200)]/70 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-[var(--ocean-100)] blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="section-kicker">Morocco, Curated</span>
            <h1 className="brand-heading max-w-xl text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Travel Morocco with the people who know every hidden turn.
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
              MeetLocalGuide connects international travelers with trusted Moroccan guides for
              tours, medina deep dives, mountain routes, and desert expeditions.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/tours" className="gradient-button rounded-full px-6 py-3 text-sm font-semibold">
                Browse Experiences
              </Link>
              <Link href="/auth/register" className="ghost-button rounded-full px-6 py-3 text-sm font-semibold">
                Join as Local Guide
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="card-surface rounded-2xl bg-white/85 p-5">
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--ink-soft)]">Average Rating</p>
              <p className="mt-2 text-3xl font-bold text-[var(--ocean-800)]">4.8 / 5</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">Across verified guide experiences</p>
            </div>
            <div className="card-surface rounded-2xl bg-white/85 p-5">
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--ink-soft)]">Top Markets</p>
              <p className="mt-2 text-2xl font-bold text-[var(--terracotta-700)]">USA, France, UK</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">Localized descriptions and prices</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="section-kicker">Featured Tours</span>
            <h2 className="brand-heading text-3xl sm:text-4xl">Handpicked experiences this week</h2>
          </div>
          <Link href="/tours" className="text-sm font-semibold text-[var(--ocean-800)] hover:text-[var(--terracotta-700)]">
            See all tours
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredTours.map((tour, index) => (
            <TourCard key={tour.slug} tour={tour} index={index} />
          ))}
        </div>
      </section>

      <section className="space-y-7">
        <div className="space-y-2">
          <span className="section-kicker">Cities</span>
          <h2 className="brand-heading text-3xl sm:text-4xl">Start from your favorite destination</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city, index) => (
            <Link
              key={city}
              href={`/tours?city=${encodeURIComponent(city)}`}
              className="card-surface fade-up group rounded-2xl px-5 py-6"
              style={{ animationDelay: `${index * 65}ms` }}
            >
              <p className="text-xs uppercase tracking-[0.1em] text-[var(--ink-soft)]">City Focus</p>
              <p className="mt-2 text-2xl font-semibold group-hover:text-[var(--terracotta-700)]">{city}</p>
              <p className="mt-1 text-sm text-[var(--ink-soft)]">Discover routes crafted by local guides.</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
