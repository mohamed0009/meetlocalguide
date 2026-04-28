"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MapPin, Shield, Star, Users } from "lucide-react";
import { useLocalizedHref } from "@/i18n/provider";
import type { Guide, Tour } from "@/lib/mock-data";
import { TourCard } from "@/components/tour-card";
import { FadeInUp, StaggerGroup, StaggerItem } from "@/components/animations/motion";

type PremiumHomeClientProps = {
  tours: Tour[];
  guides: Guide[];
};

const FEATURES = [
  "Verified local experts",
  "Instant booking confirmation",
  "Flexible cancellation options",
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    quote: "Best trip of my life. Our guide made every moment authentic and smooth.",
  },
  {
    name: "James T.",
    quote: "The booking flow was easy and our Sahara experience was perfectly organized.",
  },
  {
    name: "Lea D.",
    quote: "Trusted guides, beautiful routes, and clear communication from start to finish.",
  },
];

const FAQS = [
  {
    q: "How are guides verified?",
    a: "Every guide profile is manually reviewed with identity and quality checks before going live.",
  },
  {
    q: "Can I cancel my booking?",
    a: "Yes, most experiences support free cancellation up to 48 hours before start time.",
  },
  {
    q: "Can I book private tours?",
    a: "Yes, private and custom routes are available for many destinations and activities.",
  },
];

export function PremiumHomeClient({ tours, guides }: PremiumHomeClientProps) {
  const localize = useLocalizedHref();
  const topCities = [...new Set(tours.map((tour) => tour.city))].slice(0, 6);

  return (
    <div className="page-wrapper">
      <section className="hero-bg border-b border-[var(--border)]">
        <div className="shell grid gap-8 py-16 sm:gap-10 sm:py-24 lg:grid-cols-2 lg:items-center">
          <FadeInUp>
            <span className="kicker">
              <Compass className="h-3 w-3" />
              Morocco Travel Marketplace
            </span>
            <h1 className="brand-font mt-5 text-3xl font-extrabold leading-tight sm:text-5xl">
              Book trusted local guides for unforgettable Morocco experiences.
            </h1>
            <p className="mt-5 max-w-xl text-base text-[var(--text-secondary)] sm:text-lg">
              Discover curated desert, medina, hiking, and culture tours with vetted
              experts in every major destination.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={localize("/tours")}
                className="glow-btn w-full rounded-xl px-6 py-3 text-center text-sm sm:w-auto"
              >
                Explore Tours
              </Link>
              <Link
                href={localize("/become-a-guide")}
                className="ghost-btn w-full rounded-xl px-6 py-3 text-center text-sm sm:w-auto"
              >
                Become a Guide
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Verified hosts</span>
              <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-400" /> 4.9 average rating</span>
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 12K+ travelers</span>
            </div>
          </FadeInUp>

          <FadeInUp className="glass-card relative overflow-hidden rounded-3xl p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/DSC09462-1.jpg"
                alt="Travelers with local guide in Morocco"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeInUp>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        <FadeInUp className="mb-8">
          <h2 className="brand-font text-3xl font-bold sm:text-4xl">Featured Experiences</h2>
        </FadeInUp>
        <StaggerGroup className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {tours.slice(0, 6).map((tour) => (
            <StaggerItem key={tour.slug}>
              <TourCard tour={tour} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-12 sm:py-16">
        <div className="shell">
          <FadeInUp className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div>
              <span className="kicker">Top Destinations in Morocco</span>
              <h2 className="brand-font mt-4 text-3xl font-bold sm:text-4xl">Discover your next destination</h2>
            </div>
            <Link href={localize("/destinations")} className="text-sm font-semibold text-[var(--accent)]">
              View all <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </FadeInUp>
          <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topCities.map((city) => (
              <StaggerItem key={city}>
                <Link
                  href={localize(`/tours?city=${encodeURIComponent(city)}`)}
                  className="glass-card group flex items-center justify-between rounded-2xl p-4 sm:p-5"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4 text-[var(--accent)]" />
                    {city}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition group-hover:translate-x-1" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-12 sm:py-16">
        <div className="shell">
          <FadeInUp className="mb-8">
            <h2 className="brand-font text-3xl font-bold sm:text-4xl">Featured Local Guides</h2>
          </FadeInUp>
          <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {guides.slice(0, 4).map((guide) => (
              <StaggerItem key={guide.slug}>
                <Link
                  href={localize(`/guides/${guide.slug}`)}
                  className="dark-card group block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={guide.heroImage}
                      alt={guide.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold">{guide.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{guide.city}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        <FadeInUp className="mb-8">
          <h2 className="brand-font text-3xl font-bold sm:text-4xl">What travelers say</h2>
        </FadeInUp>
        <StaggerGroup className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <StaggerItem key={item.name} className="testi-card">
              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-3 text-xs font-semibold">{item.name}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--bg-elevated)] py-12 sm:py-16">
        <div className="shell max-w-4xl">
          <FadeInUp className="mb-8">
            <h2 className="brand-font text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
          </FadeInUp>
          <StaggerGroup className="space-y-3">
            {FAQS.map((item) => (
              <StaggerItem key={item.q}>
                <details className="glass-card rounded-2xl p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">{item.a}</p>
                </details>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="shell py-12 sm:py-16">
        <FadeInUp className="glass-card rounded-3xl p-6 text-center sm:p-8">
          <h2 className="brand-font text-2xl font-bold sm:text-3xl">Why travelers choose MeetLocalGuide</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {FEATURES.map((item) => (
              <span key={item} className="tag text-xs">
                {item}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={localize("/destinations")}
              className="glow-btn w-full rounded-xl px-6 py-3 text-center text-sm sm:w-auto"
            >
              View Destinations <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
            <Link
              href={localize("/contact")}
              className="ghost-btn w-full rounded-xl px-6 py-3 text-center text-sm sm:w-auto"
            >
              Talk to our team
            </Link>
          </div>
        </FadeInUp>
      </section>
    </div>
  );
}
