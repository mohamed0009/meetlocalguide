import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, MapPin, Clock, DollarSign, SlidersHorizontal } from "lucide-react";
import { TourCard } from "@/components/tour-card";
import { getCities, searchTours } from "@/lib/mock-data";

export const metadata: Metadata = {
    title: "Tours",
    description:
        "Explore Moroccan tours by city, budget, and duration with trusted local guides.",
};

type ParamValue = string | string[] | undefined;
type SearchParams = Promise<Record<string, ParamValue>>;

type ToursPageProps = {
    searchParams?: SearchParams;
};

function readFirst(value: ParamValue): string | undefined {
    if (Array.isArray(value)) return value[0];
    return value;
}

function toOptionalNumber(value: string | undefined): number | undefined {
    if (!value) return undefined;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
    const params = searchParams ? await searchParams : {};
    const query = readFirst(params.q);
    const city = readFirst(params.city);
    const maxPriceUsd = toOptionalNumber(readFirst(params.maxPriceUsd));
    const minDurationHours = toOptionalNumber(readFirst(params.minDurationHours));

    const tours = searchTours({ query, city, maxPriceUsd, minDurationHours });
    const cities = getCities();

    return (
        <div className="page-wrapper">
            {/* Header */}
            <div
                className="relative overflow-hidden border-b bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.85) 0%, var(--bg-elevated) 100%), url("/images/DSC08672-38.jpg")`,
                    borderColor: "var(--border)",
                }}
            >
                <div
                    className="absolute inset-0 hero-grid-lines opacity-40"
                />
                <div
                    className="absolute left-1/2 top-0 h-36 w-72 -translate-x-1/2"
                    style={{
                        background: "radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)",
                        filter: "blur(20px)",
                    }}
                />
                <div className="shell relative z-10 py-14">
                    <span className="kicker">Tour Listing</span>
                    <h1
                        className="brand-font mt-3 text-3xl font-700 leading-tight sm:text-4xl lg:text-5xl"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Find your perfect{" "}
                        <span style={{ color: "var(--accent)", textShadow: "0 0 30px rgba(0,0,0,0.35)" }}>
                            Morocco route
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
                        Filter by city, budget, and trip length to quickly match tours with your travel style.
                    </p>
                </div>
            </div>

            <div className="shell py-8 space-y-8">
                {/* Filter form */}
                <form
                    id="tours-filter-form"
                    className="rounded-2xl p-5 sm:p-6"
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        boxShadow: "var(--shadow-card)",
                    }}
                >
                    {/* Form header */}
                    <div className="mb-5 flex items-center gap-3">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl"
                            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                            Filter Tours
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {/* Search */}
                        <label className="sm:col-span-2">
                            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                <Search className="h-3 w-3" /> Search
                            </span>
                            <input
                                type="text"
                                name="q"
                                id="tours-search-input"
                                defaultValue={query}
                                placeholder="Desert, medina, mountain..."
                                className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                            />
                        </label>

                        {/* City */}
                        <label>
                            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                <MapPin className="h-3 w-3" /> City
                            </span>
                            <select
                                name="city"
                                id="tours-city-select"
                                defaultValue={city ?? ""}
                                className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                            >
                                <option value="">All cities</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </label>

                        {/* Max price */}
                        <label>
                            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                <DollarSign className="h-3 w-3" /> Max price (USD)
                            </span>
                            <input
                                type="number"
                                name="maxPriceUsd"
                                id="tours-max-price"
                                min={10}
                                step={5}
                                defaultValue={maxPriceUsd}
                                placeholder="120"
                                className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                            />
                        </label>

                        {/* Min duration */}
                        <label>
                            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                <Clock className="h-3 w-3" /> Min duration (h)
                            </span>
                            <input
                                type="number"
                                name="minDurationHours"
                                id="tours-min-duration"
                                min={1}
                                defaultValue={minDurationHours}
                                placeholder="4"
                                className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                            />
                        </label>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <button
                            type="submit"
                            id="tours-apply-filter-btn"
                            className="glow-btn flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm"
                        >
                            Apply Filters
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <Link
                            href="/tours"
                            id="tours-clear-filters-btn"
                            className="ghost-btn rounded-xl px-6 py-2.5 text-sm"
                        >
                            Clear Filters
                        </Link>
                    </div>
                </form>

                {/* Result count */}
                <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        <span className="font-semibold" style={{ color: "var(--accent)" }}>
                            {tours.length}
                        </span>{" "}
                        tour{tours.length === 1 ? "" : "s"} found
                    </p>
                </div>

                {/* Grid or empty */}
                {tours.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {tours.map((tour, index) => (
                            <TourCard key={tour.slug} tour={tour} index={index} />
                        ))}
                    </div>
                ) : (
                    <div
                        className="rounded-2xl p-12 text-center"
                        style={{
                            background: "var(--bg-card)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        <div
                            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                        >
                            <Search className="h-7 w-7" />
                        </div>
                        <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                            No tours match your filters
                        </h2>
                        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                            Try broadening your city, duration, or budget values.
                        </p>
                        <Link
                            href="/tours"
                            className="glow-btn mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm"
                        >
                            Clear all filters
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}