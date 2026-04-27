import type { Metadata } from "next";
import Link from "next/link";
import { Search, Star, MapPin, Globe } from "lucide-react";
import { guides, getCities } from "@/lib/mock-data";

export const metadata: Metadata = {
    title: "Local Guides",
    description: "Meet the verified local experts leading unforgettable tours across Morocco.",
};

type ParamValue = string | string[] | undefined;
type SearchParams = Promise<Record<string, ParamValue>>;

function readFirst(v: ParamValue): string | undefined {
    return Array.isArray(v) ? v[0] : v;
}

export default async function GuidesPage({
    searchParams,
}: {
    searchParams?: SearchParams;
}) {
    const params = searchParams ? await searchParams : {};
    const query = readFirst(params.q)?.toLowerCase();
    const city = readFirst(params.city);

    const cities = getCities();

    const filtered = guides.filter((g) => {
        if (city && g.city !== city) return false;
        if (query && !g.name.toLowerCase().includes(query) && !g.headline.toLowerCase().includes(query)) {
            return false;
        }
        return true;
    });

    return (
        <div className="page-wrapper">
            {/* Hero */}
            <div
                className="relative overflow-hidden border-b"
                style={{
                    background: "linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-base) 100%)",
                    borderColor: "var(--border)",
                }}
            >
                <div className="absolute inset-0 hero-grid-lines opacity-30" />
                <div className="shell relative z-10 py-14">
                    <span className="kicker">Our Experts</span>
                    <h1
                        className="brand-font mt-3 text-3xl font-700 leading-tight sm:text-4xl lg:text-5xl"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Meet your{" "}
                        <span style={{ color: "var(--accent)", textShadow: "0 0 30px rgba(196,105,58,0.2)" }}>
                            local guides
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
                        Every guide on MeetLocalGuide is personally vetted. Browse by city, language, or specialty to find your perfect match.
                    </p>
                </div>
            </div>

            <div className="shell py-8 space-y-8">
                {/* Filter form */}
                <form
                    id="guides-filter-form"
                    className="rounded-2xl p-5 sm:p-6"
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        boxShadow: "var(--shadow-card)",
                    }}
                >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <label className="sm:col-span-2">
                            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                <Search className="h-3 w-3" /> Search
                            </span>
                            <input
                                type="text"
                                name="q"
                                id="guides-search-input"
                                defaultValue={query}
                                placeholder="Name or specialty…"
                                className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                            />
                        </label>

                        <label>
                            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                <MapPin className="h-3 w-3" /> City
                            </span>
                            <select
                                name="city"
                                id="guides-city-select"
                                defaultValue={city ?? ""}
                                className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                            >
                                <option value="">All cities</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </label>

                        <div className="flex items-end gap-3">
                            <button
                                type="submit"
                                id="guides-apply-filter-btn"
                                className="glow-btn flex-1 rounded-xl py-2.5 text-sm"
                            >
                                Apply
                            </button>
                            <Link
                                href="/guides"
                                id="guides-clear-btn"
                                className="ghost-btn flex-1 rounded-xl py-2.5 text-sm text-center"
                            >
                                Clear
                            </Link>
                        </div>
                    </div>
                </form>

                {/* Count */}
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="font-semibold" style={{ color: "var(--accent)" }}>{filtered.length}</span>{" "}
                    guide{filtered.length === 1 ? "" : "s"} available
                </p>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filtered.map((guide, i) => (
                            <Link
                                key={guide.slug}
                                href={`/guides/${guide.slug}`}
                                id={`guide-card-${i}`}
                                className="group block overflow-hidden rounded-2xl transition-all duration-300"
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border)",
                                    boxShadow: "var(--shadow-card)",
                                }}
                            >
                                {/* Top accent bar */}
                                <div
                                    className="h-1 w-full transition-all duration-300 group-hover:opacity-100 opacity-40"
                                    style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-secondary))" }}
                                />

                                <div className="p-6">
                                    {/* Avatar + name */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-xl font-bold"
                                            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                                        >
                                            {guide.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <h3
                                                className="font-semibold text-base truncate transition-colors duration-200 group-hover:text-[var(--accent)]"
                                                style={{ color: "var(--text-primary)" }}
                                            >
                                                {guide.name}
                                            </h3>
                                            <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                                                {guide.headline}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats row */}
                                    <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                                        <span className="flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                                            <span className="font-semibold">{guide.rating.toFixed(1)}</span>
                                            <span style={{ color: "var(--text-muted)" }}>({guide.totalReviews})</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {guide.city}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Globe className="h-3.5 w-3.5" />
                                            {guide.yearsExperience}y exp
                                        </span>
                                    </div>

                                    {/* Languages */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {guide.languages.map((lang) => (
                                            <span
                                                key={lang}
                                                className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                                                style={{
                                                    background: "var(--accent-secondary-dim)",
                                                    color: "var(--accent-secondary)",
                                                }}
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Specialties */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {guide.specialties.slice(0, 3).map((s) => (
                                            <span key={s} className="tag">{s}</span>
                                        ))}
                                    </div>

                                    {/* CTA row */}
                                    <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                            From{" "}
                                            <span className="font-semibold" style={{ color: "var(--accent)" }}>
                                                ${guide.hourlyRateUsd}/hr
                                            </span>
                                        </span>
                                        <span
                                            className="text-xs font-semibold transition-colors duration-200"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            View profile →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div
                        className="rounded-2xl p-12 text-center"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                        <div
                            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                        >
                            <Search className="h-7 w-7" />
                        </div>
                        <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                            No guides match your filters
                        </h2>
                        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                            Try a different city or search term.
                        </p>
                        <Link href="/guides" className="glow-btn mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm">
                            Clear filters
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
