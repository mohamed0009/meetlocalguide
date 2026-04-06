import type { Metadata } from "next";
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
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}

function toOptionalNumber(value: string | undefined): number | undefined {
    if (!value) {
        return undefined;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export default async function ToursPage({ searchParams }: ToursPageProps) {
    const params = searchParams ? await searchParams : {};
    const query = readFirst(params.q);
    const city = readFirst(params.city);
    const maxPriceUsd = toOptionalNumber(readFirst(params.maxPriceUsd));
    const minDurationHours = toOptionalNumber(readFirst(params.minDurationHours));

    const tours = searchTours({
        query,
        city,
        maxPriceUsd,
        minDurationHours,
    });

    const cities = getCities();

    return (
        <div className="container-shell space-y-8 py-10 sm:py-14">
            <div className="space-y-3">
                <span className="section-kicker">Tour Listing</span>
                <h1 className="brand-heading text-4xl sm:text-5xl">Find your perfect Morocco route</h1>
                <p className="max-w-3xl text-[var(--ink-soft)]">
                    Filter by city, budget, and trip length to quickly match tours with your travel style.
                </p>
            </div>

            <form className="card-surface grid gap-4 rounded-3xl p-5 sm:grid-cols-2 lg:grid-cols-5">
                <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.09em] text-[var(--ink-soft)]">Search</span>
                    <input
                        type="text"
                        name="q"
                        defaultValue={query}
                        placeholder="Desert, medina, mountain..."
                        className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--ocean-600)]"
                    />
                </label>

                <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.09em] text-[var(--ink-soft)]">City</span>
                    <select
                        name="city"
                        defaultValue={city ?? ""}
                        className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--ocean-600)]"
                    >
                        <option value="">All cities</option>
                        {cities.map((cityOption) => (
                            <option key={cityOption} value={cityOption}>
                                {cityOption}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.09em] text-[var(--ink-soft)]">Max Price (USD)</span>
                    <input
                        type="number"
                        name="maxPriceUsd"
                        min={10}
                        step={5}
                        defaultValue={maxPriceUsd}
                        placeholder="120"
                        className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--ocean-600)]"
                    />
                </label>

                <label className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.09em] text-[var(--ink-soft)]">Min Duration (h)</span>
                    <input
                        type="number"
                        name="minDurationHours"
                        min={1}
                        defaultValue={minDurationHours}
                        placeholder="4"
                        className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--ocean-600)]"
                    />
                </label>

                <div className="flex items-end">
                    <button type="submit" className="gradient-button w-full rounded-xl px-4 py-2 text-sm font-semibold">
                        Apply Filters
                    </button>
                </div>
            </form>

            <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--ink-soft)]">
                    <span className="font-semibold text-[var(--foreground)]">{tours.length}</span> tour
                    {tours.length === 1 ? "" : "s"} found
                </p>
            </div>

            {tours.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {tours.map((tour, index) => (
                        <TourCard key={tour.slug} tour={tour} index={index} />
                    ))}
                </div>
            ) : (
                <div className="card-surface rounded-3xl p-8 text-center">
                    <h2 className="text-2xl font-semibold">No tours match your filters</h2>
                    <p className="mt-2 text-[var(--ink-soft)]">Try broadening your city, duration, or budget values.</p>
                </div>
            )}
        </div>
    );
}