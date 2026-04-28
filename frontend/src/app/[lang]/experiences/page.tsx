import type { Metadata } from "next";
import { TourCard } from "@/components/tour-card";
import { getAllTours } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Browse curated experiences from desert adventures to cultural medina walks.",
};

export default function ExperiencesPage() {
  const tours = getAllTours();

  return (
    <section className="shell py-10 sm:py-14">
      <header className="mb-10">
        <span className="kicker">Experiences</span>
        <h1 className="brand-font mt-3 text-3xl font-extrabold sm:text-4xl">Handpicked Experiences</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
          Discover premium local experiences: desert escapes, culture routes, mountain treks, and photography adventures.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tours.map((tour, index) => (
          <TourCard key={tour.slug} tour={tour} index={index} />
        ))}
      </div>
    </section>
  );
}
