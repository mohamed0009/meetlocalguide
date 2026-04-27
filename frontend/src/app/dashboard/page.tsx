"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Users, ArrowRight, LogOut, AlertCircle, Compass } from "lucide-react";
import { api, getAccessToken, getStoredUser, clearAuthTokens, type BookingResponse, type PagedResponse, type StoredUser } from "@/lib/api-client";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Pending", color: "#d97706", bg: "rgba(217,119,6,0.1)" },
    CONFIRMED: { label: "Confirmed", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
    CANCELLED: { label: "Cancelled", color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
    COMPLETED: { label: "Completed", color: "var(--accent-secondary)", bg: "var(--accent-secondary-dim)" },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function DashboardPage() {
    const [user, setUser] = useState<StoredUser | null>(null);
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            window.location.href = "/auth/login";
            return;
        }
        const stored = getStoredUser();
        setUser(stored);

        api.get<PagedResponse<BookingResponse>>("/bookings/me?size=20&sort=createdAt,desc")
            .then(page => setBookings(page.content))
            .catch(err => setError(err instanceof Error ? err.message : "Could not load bookings."))
            .finally(() => setLoading(false));
    }, []);

    function handleLogout() {
        clearAuthTokens();
        window.location.href = "/";
    }

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="shell py-20 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                    <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>Loading your dashboard…</p>
                </div>
            </div>
        );
    }

    const upcomingCount = bookings.filter(b => b.status === "CONFIRMED" || b.status === "PENDING").length;
    const completedCount = bookings.filter(b => b.status === "COMPLETED").length;

    return (
        <div className="page-wrapper">
            {/* Header */}
            <div
                className="border-b"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
                <div className="shell py-10">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <span className="kicker">Traveler Dashboard</span>
                            <h1 className="brand-font mt-2 text-3xl font-700" style={{ color: "var(--text-primary)" }}>
                                Welcome back,{" "}
                                <span style={{ color: "var(--accent)" }}>
                                    {user?.email?.split("@")[0] ?? "traveler"}
                                </span>
                            </h1>
                            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                                {user?.email}
                            </p>
                        </div>
                        <button
                            id="dashboard-logout-btn"
                            onClick={handleLogout}
                            className="ghost-btn flex items-center gap-2 rounded-xl px-4 py-2 text-xs"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Log out
                        </button>
                    </div>

                    {/* Quick stats */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        {[
                            { label: "Total Bookings", value: bookings.length },
                            { label: "Upcoming", value: upcomingCount, accent: true },
                            { label: "Completed", value: completedCount },
                        ].map(({ label, value, accent }) => (
                            <div
                                key={label}
                                className="rounded-2xl p-5"
                                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                            >
                                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                    {label}
                                </p>
                                <p className="brand-font mt-2 text-3xl font-700" style={{ color: accent ? "var(--accent)" : "var(--text-primary)" }}>
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="shell py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                        My Bookings
                    </h2>
                    <Link href="/tours" className="glow-btn flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs">
                        Browse Tours
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {error && (
                    <div
                        className="rounded-xl px-4 py-3 text-sm flex items-center gap-3"
                        style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626" }}
                    >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {bookings.length === 0 && !error ? (
                    <div
                        className="rounded-2xl p-12 text-center"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                        <div
                            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                        >
                            <Compass className="h-7 w-7" />
                        </div>
                        <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                            No bookings yet
                        </h3>
                        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                            Start exploring Morocco with a verified local guide.
                        </p>
                        <Link href="/tours" className="glow-btn mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm">
                            Explore Tours
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((b) => {
                            const status = STATUS_CONFIG[b.status] ?? { label: b.status, color: "var(--text-secondary)", bg: "var(--bg-surface)" };
                            return (
                                <div
                                    key={b.id}
                                    id={`booking-item-${b.id}`}
                                    className="rounded-2xl p-5 sm:p-6"
                                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                                >
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="space-y-1">
                                            <Link
                                                href={`/tours/${b.tourSlug}`}
                                                className="text-base font-semibold transition-colors duration-200 hover:text-[var(--accent)]"
                                                style={{ color: "var(--text-primary)" }}
                                            >
                                                {b.tourTitle}
                                            </Link>
                                            <p className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                                                {b.id}
                                            </p>
                                        </div>
                                        <span
                                            className="flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                                            style={{ background: status.bg, color: status.color }}
                                        >
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                                            {formatDate(b.startAt)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                                            {formatDate(b.endAt)}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Users className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                                            {b.participantCount} person{b.participantCount === 1 ? "" : "s"}
                                        </span>
                                        <span className="font-semibold" style={{ color: "var(--accent)" }}>
                                            {b.totalAmount} {b.currency}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex gap-3">
                                        <Link
                                            href={`/booking/${b.id}`}
                                            className="ghost-btn rounded-lg px-4 py-1.5 text-xs"
                                        >
                                            View Details
                                        </Link>
                                        {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                                            <Link
                                                href={`/tours/${b.tourSlug}`}
                                                className="text-xs font-medium transition-colors duration-200"
                                                style={{ color: "var(--text-muted)" }}
                                            >
                                                Tour page →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
