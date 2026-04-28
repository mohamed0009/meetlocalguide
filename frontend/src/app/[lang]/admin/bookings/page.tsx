"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Users, RefreshCw, AlertCircle } from "lucide-react";
import { api, type BookingResponse, type PagedResponse } from "@/lib/api-client";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Pending", color: "#d97706", bg: "rgba(217,119,6,0.1)" },
    CONFIRMED: { label: "Confirmed", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
    CANCELLED: { label: "Cancelled", color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
    COMPLETED: { label: "Completed", color: "var(--accent-secondary)", bg: "var(--accent-secondary-dim)" },
};

const UPDATABLE_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    function load() {
        setLoading(true);
        api.get<PagedResponse<BookingResponse>>("/bookings/me?size=50&sort=createdAt,desc")
            .then(p => setBookings(p.content))
            .catch(err => setError(err instanceof Error ? err.message : "Failed to load bookings."))
            .finally(() => setLoading(false));
    }

    useEffect(load, []);

    async function updateStatus(bookingId: string, newStatus: string) {
        setUpdating(bookingId);
        try {
            const updated = await api.patch<BookingResponse>(`/bookings/${bookingId}/status`, { status: newStatus });
            setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Status update failed.");
        } finally {
            setUpdating(null);
        }
    }

    async function cancelBooking(bookingId: string) {
        if (!confirm("Cancel this booking?")) return;
        setUpdating(bookingId);
        try {
            const updated = await api.patch<BookingResponse>(`/bookings/${bookingId}/cancel`, { reason: "Cancelled by admin" });
            setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Cancellation failed.");
        } finally {
            setUpdating(null);
        }
    }

    return (
        <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <span className="kicker">Admin</span>
                    <h1 className="brand-font mt-1 text-2xl font-700" style={{ color: "var(--text-primary)" }}>
                        Bookings
                    </h1>
                </div>
                <button
                    id="admin-bookings-refresh"
                    onClick={load}
                    className="ghost-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:w-auto touch-target"
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
            ) : bookings.length === 0 ? (
                <div className="rounded-2xl p-12 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No bookings found.</p>
                </div>
            ) : (
                <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    {/* Table header */}
                    <div
                        className="hidden sm:grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-3 text-[10px] font-semibold uppercase tracking-widest border-b"
                        style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                        <span>Tour</span>
                        <span>Dates</span>
                        <span>Guests</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>

                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {bookings.map(b => {
                            const status = STATUS_CONFIG[b.status] ?? { label: b.status, color: "var(--text-secondary)", bg: "var(--bg-surface)" };
                            const busy = updating === b.id;
                            return (
                                <div
                                    key={b.id}
                                    id={`admin-booking-${b.id}`}
                                    className="sm:grid sm:grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr] gap-4 px-6 py-4 items-center"
                                >
                                    {/* Tour */}
                                    <div className="min-w-0 mb-2 sm:mb-0">
                                        <Link
                                            href={`/tours/${b.tourSlug}`}
                                            className="text-sm font-medium truncate block hover:text-[var(--accent)] transition-colors"
                                            style={{ color: "var(--text-primary)" }}
                                        >
                                            {b.tourTitle}
                                        </Link>
                                        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                                            {b.travelerEmail}
                                        </p>
                                    </div>

                                    {/* Dates */}
                                    <div className="flex items-center gap-1.5 text-xs mb-2 sm:mb-0" style={{ color: "var(--text-secondary)" }}>
                                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                        <span>{formatDate(b.startAt)}</span>
                                    </div>

                                    {/* Guests */}
                                    <div className="flex items-center gap-1.5 text-xs mb-2 sm:mb-0" style={{ color: "var(--text-secondary)" }}>
                                        <Users className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                                        {b.participantCount}
                                    </div>

                                    {/* Status badge */}
                                    <span
                                        className="inline-flex flex-shrink-0 w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold mb-2 sm:mb-0"
                                        style={{ background: status.bg, color: status.color }}
                                    >
                                        {status.label}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2">
                                        <select
                                            disabled={busy || b.status === "CANCELLED"}
                                            value={b.status}
                                            onChange={e => updateStatus(b.id, e.target.value)}
                                            className="dark-input h-9 w-full rounded-lg px-2 py-1.5 text-xs sm:w-auto"
                                            style={{ fontSize: "11px" }}
                                        >
                                            {UPDATABLE_STATUSES.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        {b.status !== "CANCELLED" && (
                                            <button
                                                disabled={busy}
                                                onClick={() => cancelBooking(b.id)}
                                                className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-colors w-full sm:w-auto touch-target"
                                                style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.2)" }}
                                            >
                                                {busy ? "…" : "Cancel"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
