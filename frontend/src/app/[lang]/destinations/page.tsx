import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCities, getAllTours } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore top Moroccan destinations and find the best local tours.",
};

const destinationImages: Record<string, string> = {
  Marrakech: "/images/DSC09467-3.jpg",
  Fes: "/images/DSC09418-74.jpg",
  Chefchaouen: "/images/DSC09308-36.jpg",
  Merzouga: "/images/DSC08483-61.jpg",
  Essaouira: "/images/DSC08368-Pano-45.jpg",
};

export default function DestinationsPage() {
  const cities = getCities();
  const tours = getAllTours();

  return (
    <section className="shell py-10 sm:py-14">
      <header className="mb-10">
        <span className="kicker">Destinations</span>
        <h1 className="brand-font mt-3 text-3xl font-extrabold sm:text-4xl">Top Destinations in Morocco</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <article key={city} className="dark-card overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/10]">
              <Image
                src={destinationImages[city] ?? "/images/DSC09462-1.jpg"}
                alt={city}
                fill
                sizes="(min-width:1024px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 sm:p-5">
              <h2 className="text-xl font-bold">{city}</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                {tours.filter((tour) => tour.city === city).length} experiences available
              </p>
              <Link
                href={`/tours?city=${encodeURIComponent(city)}`}
                className="glow-btn mt-4 inline-block w-full rounded-lg px-4 py-2 text-center text-xs sm:w-auto"
              >
                Explore {city}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
