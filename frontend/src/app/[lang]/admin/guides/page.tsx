"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, Globe, RefreshCw, AlertCircle } from "lucide-react";
import { api, type GuideSummary, type PagedResponse } from "@/lib/api-client";

const VERIFICATION_CONFIG: Record<string, { color: string; bg: string }> = {
    VERIFIED: { color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
    PENDING: { color: "#d97706", bg: "rgba(217,119,6,0.1)" },
    REJECTED: { color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
    UNVERIFIED: { color: "var(--text-muted)", bg: "var(--bg-surface)" },
};

export default function AdminGuidesPage() {
    const [guides, setGuides] = useState<GuideSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cityFilter, setCityFilter] = useState("");

    function load(p = 0) {
        setLoading(true);
        const cityParam = cityFilter ? `&city=${encodeURIComponent(cityFilter)}` : "";
        api.get<PagedResponse<GuideSummary>>(`/guides?size=20&page=${p}${cityParam}`)
            .then(data => {
                setGuides(data.content);
                setTotal(data.totalElements);
                setPage(p);
            })
            .catch(err => setError(err instanceof Error ? err.message : "Failed to load guides."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        const timer = setTimeout(() => load(), 0);
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <span className="kicker">Admin</span>
                    <h1 className="brand-font mt-1 text-2xl font-700" style={{ color: "var(--text-primary)" }}>
                        Guides
                        <span className="ml-2 text-sm font-normal" style={{ color: "var(--text-muted)" }}>
                            ({total})
                        </span>
                    </h1>
                </div>
                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Filter by city…"
                        value={cityFilter}
                        onChange={e => setCityFilter(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && load(0)}
                        className="dark-input rounded-xl px-3.5 py-2 text-sm"
                        style={{ width: 160 }}
                    />
                    <button
                        id="admin-guides-search"
                        onClick={() => load(0)}
                        className="glow-btn rounded-xl px-4 py-2 text-xs"
                    >
                        Search
                    </button>
                    <button
                        id="admin-guides-refresh"
                        onClick={() => load(page)}
                        className="ghost-btn flex items-center gap-2 rounded-xl px-4 py-2 text-xs"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626" }}>
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto text-xs">Dismiss</button>
                </div>
            )}

            {loading ? (
                <div className="py-12 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                </div>
            ) : guides.length === 0 ? (
                <div className="rounded-2xl p-12 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No guides found.</p>
                </div>
            ) : (
                <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    {/* Table header */}
                    <div
                        className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 text-[10px] font-semibold uppercase tracking-widest border-b"
                        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                        <span>Guide</span>
                        <span>Location</span>
                        <span>Rating</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {guides.map(g => {
                            const vstatus = VERIFICATION_CONFIG[g.verificationStatus] ?? VERIFICATION_CONFIG.UNVERIFIED;
                            return (
                                <div
                                    key={g.id}
                                    id={`admin-guide-${g.id}`}
                                    className="md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center"
                                >
                                    {/* Name */}
                                    <div className="min-w-0 mb-2 md:mb-0">
                                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                            {g.displayName}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {g.languages.slice(0, 3).map(l => (
                                                <span
                                                    key={l}
                                                    className="rounded-full px-2 py-0.5 text-[9px] font-medium"
                                                    style={{ background: "var(--accent-secondary-dim)", color: "var(--accent-secondary)" }}
                                                >
                                                    {l}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-center gap-1.5 text-xs mb-2 md:mb-0" style={{ color: "var(--text-secondary)" }}>
                                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                        {g.city}, {g.country}
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5 text-xs mb-2 md:mb-0">
                                        <Star className="h-3.5 w-3.5" style={{ color: "#f59e0b" }} />
                                        <span style={{ color: "var(--text-primary)" }}>
                                            {g.averageRating > 0 ? g.averageRating.toFixed(1) : "—"}
                                        </span>
                                        <span style={{ color: "var(--text-muted)" }}>({g.totalReviews})</span>
                                    </div>

                                    {/* Verification status */}
                                    <span
                                        className="inline-flex flex-shrink-0 w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold mb-2 md:mb-0"
                                        style={{ background: vstatus.bg, color: vstatus.color }}
                                    >
                                        {g.verificationStatus}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/guides/${g.slug}`}
                                            className="ghost-btn rounded-lg px-3 py-1.5 text-xs"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href={`/guides/${g.slug}`}
                                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs"
                                            style={{ color: "var(--text-muted)" }}
                                        >
                                            <Globe className="h-3 w-3" />
                                            Tours
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {total > 20 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                Page {page + 1} of {Math.ceil(total / 20)} · {total} total
                            </p>
                            <div className="flex gap-2">
                                <button
                                    disabled={page === 0}
                                    onClick={() => load(page - 1)}
                                    className="ghost-btn rounded-lg px-3 py-1.5 text-xs disabled:opacity-40"
                                >
                                    Previous
                                </button>
                                <button
                                    disabled={(page + 1) * 20 >= total}
                                    onClick={() => load(page + 1)}
                                    className="ghost-btn rounded-lg px-3 py-1.5 text-xs disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
