"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Star, RefreshCw, AlertCircle, Archive } from "lucide-react";
import { api, type TourSummary, type PagedResponse } from "@/lib/api-client";

export default function AdminToursPage() {
    const [tours, setTours] = useState<TourSummary[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [archiving, setArchiving] = useState<string | null>(null);

    function load(p = 0) {
        setLoading(true);
        api.get<PagedResponse<TourSummary>>(`/tours?size=20&page=${p}&sort=title,asc`)
            .then(data => {
                setTours(data.content);
                setTotal(data.totalElements);
                setPage(p);
            })
            .catch(err => setError(err instanceof Error ? err.message : "Failed to load tours."))
            .finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, []);

    async function archiveTour(tourId: string) {
        if (!confirm("Archive this tour? It will no longer appear in listings.")) return;
        setArchiving(tourId);
        try {
            await api.delete(`/tours/${tourId}`);
            setTours(prev => prev.filter(t => t.id !== tourId));
            setTotal(prev => prev - 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Archive failed.");
        } finally {
            setArchiving(null);
        }
    }

    return (
        <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <span className="kicker">Admin</span>
                    <h1 className="brand-font mt-1 text-2xl font-700" style={{ color: "var(--text-primary)" }}>
                        Tours
                        <span className="ml-2 text-sm font-normal" style={{ color: "var(--text-muted)" }}>
                            ({total})
                        </span>
                    </h1>
                </div>
                <button
                    id="admin-tours-refresh"
                    onClick={() => load(page)}
                    className="ghost-btn flex items-center gap-2 rounded-xl px-4 py-2 text-xs"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh
                </button>
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
            ) : (
                <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    {/* Header */}
                    <div
                        className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 text-[10px] font-semibold uppercase tracking-widest border-b"
                        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                        <span>Tour</span>
                        <span>City</span>
                        <span>Duration</span>
                        <span>Rating</span>
                        <span>Actions</span>
                    </div>

                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {tours.map(t => {
                            return (
                                <div
                                    key={t.id}
                                    id={`admin-tour-${t.id}`}
                                    className="md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center"
                                >
                                    {/* Title */}
                                    <div className="min-w-0 mb-2 md:mb-0">
                                        <Link
                                            href={`/tours/${t.slug}`}
                                            className="text-sm font-medium truncate block hover:text-[var(--accent)] transition-colors"
                                            style={{ color: "var(--text-primary)" }}
                                        >
                                            {t.title}
                                        </Link>
                                        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                                            by {t.guideDisplayName}
                                        </p>
                                    </div>

                                    {/* City */}
                                    <div className="flex items-center gap-1.5 text-xs mb-2 md:mb-0" style={{ color: "var(--text-secondary)" }}>
                                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                        {t.city}
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-center gap-1.5 text-xs mb-2 md:mb-0" style={{ color: "var(--text-secondary)" }}>
                                        <Clock className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                                        {Math.round(t.durationMinutes / 60)}h
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1.5 text-xs mb-2 md:mb-0">
                                        <Star className="h-3.5 w-3.5" style={{ color: "#f59e0b" }} />
                                        <span style={{ color: "var(--text-primary)" }}>
                                            {t.averageRating > 0 ? t.averageRating.toFixed(1) : "—"}
                                        </span>
                                        <span style={{ color: "var(--text-muted)" }}>({t.totalReviews})</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/tours/${t.slug}`}
                                            className="ghost-btn rounded-lg px-3 py-1.5 text-xs"
                                        >
                                            View
                                        </Link>
                                        <button
                                            disabled={archiving === t.id}
                                            onClick={() => archiveTour(t.id)}
                                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                                            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                                        >
                                            <Archive className="h-3 w-3" />
                                            {archiving === t.id ? "…" : "Archive"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {total > 20 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                Page {page + 1} of {Math.ceil(total / 20)}
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
