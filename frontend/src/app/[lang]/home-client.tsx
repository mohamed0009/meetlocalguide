"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Compass,
  Search,
  Star,
  Shield,
  Clock,
  ChevronDown,
} from "lucide-react";
import { TourCard } from "@/components/tour-card";
import type { Tour, Guide } from "@/lib/mock-data";

// ── Static data ────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  "Marrakech",
  "Sahara Desert",
  "Fes Medina",
  "Chefchaouen",
  "Atlas Mountains",
  "Essaouira",
  "Merzouga",
  "Ouarzazate",
  "Casablanca",
  "Tangier",
  "Agadir",
  "Meknes",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Browse Experiences",
    desc: "Filter by city, style, duration, or price to find your ideal Moroccan adventure.",
  },
  {
    step: "02",
    title: "Meet Your Guide",
    desc: "Review verified guide profiles with real ratings and personal stories.",
  },
  {
    step: "03",
    title: "Book in Seconds",
    desc: "Instant confirmation. Secure payment. Free cancellation up to 48 hours before.",
  },
];

const CITIES = [
  { name: "Marrakech", image: "/images/DSC09467-3.jpg", large: true },
  { name: "Fes", image: "/images/DSC09418-74.jpg", large: false },
  { name: "Chefchaouen", image: "/images/DSC09308-36.jpg", large: false },
  { name: "Merzouga", image: "/images/DSC08483-61.jpg", large: false },
  { name: "Essaouira", image: "/images/DSC08368-Pano-45.jpg", large: false },
  {
    name: "Atlas",
    image: "/images/Atlas Mountains in spring Morocco.jpg",
    large: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    country: "United States",
    rating: 5,
    text: "The Fes medina walk was everything I hoped for. Salma knew every hidden corner and made us feel so welcome.",
    tour: "Fes Medina Storywalk",
  },
  {
    name: "James T.",
    country: "United Kingdom",
    rating: 5,
    text: "Sleeping under the Saharan stars was a life highlight. Nora organized everything perfectly — the camel ride at sunset was magical.",
    tour: "Sahara Camp Under Stars",
  },
  {
    name: "Léa D.",
    country: "France",
    rating: 5,
    text: "Hamza's photography eye is incredible. He took us to angles of Chefchaouen that most tourists never see.",
    tour: "Chefchaouen Blue Alleys",
  },
  {
    name: "Marco P.",
    country: "Italy",
    rating: 5,
    text: "The Atlas Mountain trek with Yassine was perfectly paced. Village lunch was one of the best meals of my life.",
    tour: "Atlas Mountain Daybreak",
  },
];

const FAQS = [
  {
    q: "How are guides verified?",
    a: "Every guide passes a multi-step identity check, quality audit, and onboarding review before going live on MeetLocalGuide.",
  },
  {
    q: "Is there a free cancellation policy?",
    a: "Yes — all bookings can be cancelled for free up to 48 hours before the start time for a full refund.",
  },
  {
    q: "What languages do guides speak?",
    a: "Most guides are fluent in English, French, and Arabic. Many also speak Spanish, German, or Italian.",
  },
  {
    q: "Can I book a private tour?",
    a: "Absolutely. Most experiences offer private group options at checkout. Simply select 'Private group' when booking.",
  },
  {
    q: "How does payment work?",
    a: "We use Stripe for secure payment processing. You'll be charged at booking and receive instant confirmation.",
  },
  {
    q: "Can I request a custom itinerary?",
    a: "Yes — after booking, you can message your guide directly to discuss custom stops or timing adjustments.",
  },
];

const TABS = ["All", "Desert", "Medina", "Hiking", "Photography"] as const;
type Tab = (typeof TABS)[number];

// ── Sub-components ─────────────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const tick = (time: number) => {
      const p = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, started]);
  return count;
}

function StatCard({
  value,
  label,
  sub,
  started,
  delay = 0,
  isRating = false,
}: {
  value: number;
  label: string;
  sub: string;
  started: boolean;
  delay?: number;
  isRating?: boolean;
}) {
  const count = useCountUp(isRating ? 49 : value, 1600, started);
  let display: string;
  if (isRating) {
    display = "4.9";
  } else if (value >= 1000) {
    display = (count / 1000).toFixed(count >= 1000 ? 0 : 1) + "K+";
  } else {
    display = count + "+";
  }

  return (
    <div
      className="glass-card rounded-2xl p-6 text-center rv"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p
        className="brand-font text-4xl font-bold"
        style={{
          color: "var(--accent)",
          textShadow: "0 0 20px var(--accent-glow)",
        }}
      >
        {display}
      </p>
      <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
        {label}
      </p>
      <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
        {sub}
      </p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={() => setOpen((v) => !v)}>
        <span>{q}</span>
        <ChevronDown className={`faq-chevron ${open ? "open" : ""}`} />
      </button>
      <div className={`faq-body ${open ? "open" : ""}`}>
        <p>{a}</p>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

type HomeClientProps = {
  tours: Tour[];
  guides: Guide[];
};

export function HomeClient({ tours, guides }: HomeClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);

  // Parallax scroll
  useEffect(() => {
    const handle = () => {
      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    };
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  // Stats count-up trigger
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll(".rv, .rv-scale, .rv-left, .rv-right");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("vis");
        }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/tours?query=${encodeURIComponent(q)}` : "/tours");
  };

  const filteredTours =
    activeTab === "All"
      ? tours
      : tours.filter((t) => t.tags?.includes(activeTab));

  return (
    <div style={{ background: "var(--bg-base)" }}>
      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "96vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Parallax background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={heroImgRef}
          src="/images/DSC09462-1.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "110%",
            objectFit: "cover",
            objectPosition: "center top",
            willChange: "transform",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(250,249,247,.90) 0%, rgba(250,249,247,.75) 50%, rgba(250,249,247,.55) 100%)",
          }}
        />
        <div
          className="grid-bg"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />

        <div className="shell relative z-10 py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 flex justify-center">
              <span className="kicker">
                <Compass className="h-3 w-3" />
                Morocco, Curated
              </span>
            </div>

            <h1
              className="brand-font"
              style={{
                fontSize: "clamp(2.4rem, 5.8vw, 4.4rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              Travel Morocco
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--accent), #e0854a, var(--accent))",
                  backgroundSize: "200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradientShift 4s ease infinite",
                }}
              >
                with people who live it.
              </span>
            </h1>

            <p
              className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Book trusted local guides for desert expeditions, medina walks,
              mountain treks, and cultural deep dives across Morocco.
            </p>

            {/* Glass search bar */}
            <form
              onSubmit={handleSearch}
              className="mx-auto mt-8 flex max-w-xl items-center gap-2 glass rounded-2xl p-2"
            >
              <Search
                className="ml-2 h-4 w-4 shrink-0"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search destinations, experiences…"
                className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none"
                style={{ color: "var(--text-primary)" }}
              />
              <button
                type="submit"
                className="glow-btn flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold"
              >
                Search <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Trust row */}
            <div
              className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="flex items-center gap-1.5">
                <Star
                  className="h-3.5 w-3.5 fill-current"
                  style={{ color: "#fbbf24" }}
                />
                4.9/5 average rating
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                200+ verified guides
              </span>
              <span className="flex items-center gap-1.5">
                <Clock
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--accent-secondary)" }}
                />
                Free cancellation 48h
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MARQUEE ───────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-elevated)",
          overflow: "hidden",
          padding: "14px 0",
        }}
      >
        <div className="marquee">
          <div className="marquee-inner">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  margin: "0 22px",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. STATS ─────────────────────────────────────────────────────────── */}
      <section className="shell py-20" ref={statsRef}>
        <div className="mb-12 text-center rv">
          <span className="kicker">By the numbers</span>
          <h2
            className="brand-font mt-3 text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Morocco&apos;s most trusted guide platform
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            value={49}
            label="Experiences"
            sub="Handcrafted by locals"
            started={statsStarted}
            delay={0}
          />
          <StatCard
            value={200}
            label="Verified Guides"
            sub="Background-checked"
            started={statsStarted}
            delay={80}
          />
          <StatCard
            value={12000}
            label="Travelers Served"
            sub="From 40+ countries"
            started={statsStarted}
            delay={160}
          />
          <StatCard
            value={49}
            label="Average Rating"
            sub="Across all reviews"
            started={statsStarted}
            delay={240}
            isRating
          />
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elevated)" }}
      >
        <div className="shell">
          <div className="mb-12 text-center rv">
            <span className="kicker">Simple process</span>
            <h2
              className="brand-font mt-3 text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Book your guide in 3 steps
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative text-center rv" style={{ transitionDelay: `${i * 100}ms` }}>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="step-line hidden md:block" />
                )}
                <div
                  className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: "var(--accent-dim)",
                    color: "var(--accent)",
                    border: "2px solid var(--border-accent)",
                  }}
                >
                  {step.step}
                </div>
                <h3
                  className="text-base font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="mx-auto mt-2 max-w-xs text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. BENTO DESTINATIONS ────────────────────────────────────────────── */}
      <section className="shell py-20">
        <div className="mb-10 rv">
          <span className="kicker">Destinations</span>
          <h2
            className="brand-font mt-3 text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            Start from your favorite destination
          </h2>
        </div>
        <div
          className="rv-scale"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto auto auto",
            gap: 12,
          }}
        >
          {/* Large: Marrakech */}
          <Link
            href={`/tours?city=Marrakech`}
            style={{
              gridColumn: "1 / 3",
              gridRow: "1 / 3",
              height: 340,
              borderRadius: 16,
              overflow: "hidden",
              position: "relative",
              display: "block",
            }}
          >
            <BentoCity city={CITIES[0]} />
          </Link>
          {/* Right col */}
          {CITIES.slice(1, 3).map((city) => (
            <Link
              key={city.name}
              href={`/tours?city=${encodeURIComponent(city.name)}`}
              style={{
                height: 164,
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                display: "block",
              }}
            >
              <BentoCity city={city} />
            </Link>
          ))}
          {/* Bottom row */}
          {CITIES.slice(3).map((city) => (
            <Link
              key={city.name}
              href={`/tours?city=${encodeURIComponent(city.name)}`}
              style={{
                height: 130,
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
                display: "block",
              }}
            >
              <BentoCity city={city} />
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. EXPERIENCES (tab filter) ──────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elevated)" }}
      >
        <div className="shell">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 rv">
            <div>
              <span className="kicker">Experiences</span>
              <h2
                className="brand-font mt-3 text-3xl font-bold sm:text-4xl"
                style={{ color: "var(--text-primary)" }}
              >
                Handpicked this week
              </h2>
            </div>
            <Link
              href="/tours"
              className="flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--accent)" }}
            >
              See all tours <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200"
                style={
                  activeTab === tab
                    ? {
                        background: "var(--accent)",
                        color: "#fff",
                        border: "1px solid var(--accent)",
                      }
                    : {
                        background: "var(--bg-card)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {filteredTours.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredTours.map((tour, i) => (
                <TourCard key={tour.slug} tour={tour} index={i} />
              ))}
            </div>
          ) : (
            <p
              className="py-12 text-center text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No experiences found for this filter.
            </p>
          )}
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="shell py-20">
        <div className="mb-10 text-center rv">
          <span className="kicker">Traveler stories</span>
          <h2
            className="brand-font mt-3 text-3xl font-bold sm:text-4xl"
            style={{ color: "var(--text-primary)" }}
          >
            What our travelers say
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="testi-card rv"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-3.5 w-3.5 fill-current"
                    style={{ color: "#fbbf24" }}
                  />
                ))}
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--accent)" }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {t.country} · {t.tour}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. GUIDES SHOWCASE ───────────────────────────────────────────────── */}
      <section
        className="py-20"
        style={{ borderTop: "1px solid var(--border)", background: "var(--bg-elevated)" }}
      >
        <div className="shell">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 rv">
            <div>
              <span className="kicker">Our guides</span>
              <h2
                className="brand-font mt-3 text-3xl font-bold sm:text-4xl"
                style={{ color: "var(--text-primary)" }}
              >
                Meet the locals behind every tour
              </h2>
            </div>
            <Link
              href="/guides"
              className="flex items-center gap-1.5 text-sm font-semibold"
              style={{ color: "var(--accent)" }}
            >
              View all guides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {guides.slice(0, 4).map((guide, i) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group dark-card overflow-hidden rounded-2xl rv"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={guide.heroImage}
                    alt={guide.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(8,8,14,.85) 0%, transparent 60%)",
                    }}
                  />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p
                      className="text-sm font-semibold text-white"
                      style={{ textShadow: "0 1px 4px rgba(0,0,0,.5)" }}
                    >
                      {guide.name}
                    </p>
                    <p
                      className="mt-0.5 text-[11px]"
                      style={{ color: "rgba(255,255,255,.7)" }}
                    >
                      {guide.city}
                    </p>
                  </div>
                  <div
                    className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold"
                    style={{
                      background: "rgba(8,8,14,.7)",
                      backdropFilter: "blur(8px)",
                      color: "#fbbf24",
                    }}
                  >
                    <Star className="h-3 w-3 fill-current" />
                    {guide.rating}
                  </div>
                </div>
                <div className="p-4">
                  <p
                    className="text-xs leading-snug line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {guide.headline}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {guide.specialties.slice(0, 2).map((s) => (
                      <span key={s} className="tag text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ───────────────────────────────────────────────────────────── */}
      <section className="shell py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center rv">
            <span className="kicker">FAQ</span>
            <h2
              className="brand-font mt-3 text-3xl font-bold sm:text-4xl"
              style={{ color: "var(--text-primary)" }}
            >
              Common questions answered
            </h2>
          </div>
          <div className="rv" style={{ transitionDelay: "100ms" }}>
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. DARK CTA ─────────────────────────────────────────────────────── */}
      <section className="shell pb-24 pt-4">
        <div
          className="cta-gradient relative overflow-hidden rounded-3xl px-8 py-16 text-center rv"
          style={{ borderRadius: 28 }}
        >
          {/* Decorative orbs */}
          <div
            style={{
              position: "absolute",
              top: -80,
              left: "20%",
              width: 240,
              height: 240,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(196,105,58,.35) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              right: "15%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(61,79,160,.25) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <span className="kicker relative z-10" style={{ color: "rgba(255,255,255,.7)", background: "rgba(255,255,255,.08)", borderColor: "rgba(255,255,255,.15)" }}>
            Ready to explore?
          </span>
          <h2
            className="brand-font relative z-10 mt-4 text-3xl font-bold sm:text-4xl text-white"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,.3)" }}
          >
            Your Moroccan adventure starts here.
          </h2>
          <p
            className="relative z-10 mx-auto mt-4 max-w-md text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,.65)" }}
          >
            Join thousands of travelers who discovered Morocco&apos;s soul through
            the eyes of a local guide.
          </p>

          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/tours"
              className="glow-btn pulse-ring flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold"
            >
              <Compass className="h-4 w-4" />
              Browse Experiences
            </Link>
            <Link
              href="/auth/register"
              className="ghost-btn rounded-full px-8 py-3.5 text-sm font-semibold"
              style={{ color: "#fff", borderColor: "rgba(255,255,255,.25)" }}
            >
              Become a Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Bento city card ────────────────────────────────────────────────────────────

function BentoCity({ city }: { city: (typeof CITIES)[number] }) {
  return (
    <>
      <Image
        src={city.image}
        alt={city.name}
        fill
        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(8,8,14,.7) 0%, transparent 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 16,
          right: 16,
        }}
      >
        <p
          className="brand-font font-bold text-white"
          style={{
            fontSize: city.large ? 22 : 16,
            textShadow: "0 1px 8px rgba(0,0,0,.5)",
          }}
        >
          {city.name}
        </p>
      </div>
    </>
  );
}
