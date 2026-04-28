"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Users, ArrowRight, LogOut, AlertCircle, Compass, Heart, Star } from "lucide-react";
import { api, getAccessToken, getStoredUser, clearAuthTokens, type BookingResponse, type FavoriteSummary, type PagedResponse, type StoredUser } from "@/lib/api-client";

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

function formatDuration(minutes: number) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

type Tab = "bookings" | "saved";

export default function DashboardPage() {
    const [user] = useState<StoredUser | null>(() => getStoredUser());
    const [tab, setTab] = useState<Tab>("bookings");

    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [bookingsError, setBookingsError] = useState<string | null>(null);

    const [favorites, setFavorites] = useState<FavoriteSummary[]>([]);
    const [favLoading, setFavLoading] = useState(false);
    const [favLoaded, setFavLoaded] = useState(false);
    const [favError, setFavError] = useState<string | null>(null);

    useEffect(() => {
        const token = getAccessToken();
        if (!token) {
            window.location.href = "/auth/login";
            return;
        }

        api.get<PagedResponse<BookingResponse>>("/bookings/me?size=20&sort=createdAt,desc")
            .then(page => setBookings(page.content))
            .catch(err => setBookingsError(err instanceof Error ? err.message : "Could not load bookings."))
            .finally(() => setBookingsLoading(false));
    }, []);

    useEffect(() => {
        if (tab !== "saved" || favLoaded) return;
        const timer = setTimeout(() => setFavLoading(true), 0);
        api.get<PagedResponse<FavoriteSummary>>("/favorites/me?size=50&sort=savedAt,desc")
            .then(page => setFavorites(page.content))
            .catch(err => setFavError(err instanceof Error ? err.message : "Could not load saved tours."))
            .finally(() => { setFavLoading(false); setFavLoaded(true); });
        return () => clearTimeout(timer);
    }, [tab, favLoaded]);

    function handleLogout() {
        clearAuthTokens();
        window.location.href = "/";
    }

    async function removeFavorite(tourId: string, favoriteId: string) {
        setFavorites(prev => prev.filter(f => f.favoriteId !== favoriteId));
        try {
            await api.delete(`/favorites/${tourId}`);
        } catch {
            setFavLoaded(false);
        }
    }

    const loading = bookingsLoading;

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
                <div className="shell py-8 sm:py-10">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                            className="ghost-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:w-auto touch-target"
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
                {/* Tabs */}
                <div
                    className="flex w-full gap-1 rounded-xl p-1 sm:w-fit overflow-x-auto"
                    style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                >
                    {([
                        { id: "bookings" as Tab, label: "My Bookings", icon: <Calendar className="h-3.5 w-3.5" /> },
                        { id: "saved" as Tab, label: "Saved Tours", icon: <Heart className="h-3.5 w-3.5" /> },
                    ]).map(({ id, label, icon }) => (
                        <button
                            key={id}
                            id={`tab-${id}`}
                            onClick={() => setTab(id)}
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200"
                            style={tab === id ? {
                                background: "var(--bg-card)",
                                color: "var(--accent)",
                                border: "1px solid var(--border-accent)",
                                boxShadow: "var(--shadow-card)",
                            } : {
                                background: "transparent",
                                color: "var(--text-secondary)",
                                border: "1px solid transparent",
                            }}
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>

                {/* Bookings tab */}
                {tab === "bookings" && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                                My Bookings
                            </h2>
                            <Link href="/tours" className="glow-btn flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:w-auto touch-target">
                                Browse Tours
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {bookingsError && (
                            <div
                                className="rounded-xl px-4 py-3 text-sm flex items-center gap-3"
                                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626" }}
                            >
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {bookingsError}
                            </div>
                        )}

                        {bookings.length === 0 && !bookingsError ? (
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
                            bookings.map((b) => {
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

                                        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                                            <Link
                                                href={`/booking/${b.id}`}
                                                className="ghost-btn w-full rounded-lg px-4 py-2 text-center text-xs sm:w-auto touch-target"
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
                            })
                        )}
                    </div>
                )}

                {/* Saved tab */}
                {tab === "saved" && (
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                                Saved Tours
                            </h2>
                            <Link href="/tours" className="glow-btn flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:w-auto touch-target">
                                Browse Tours
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>

                        {favError && (
                            <div
                                className="rounded-xl px-4 py-3 text-sm flex items-center gap-3"
                                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626" }}
                            >
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {favError}
                            </div>
                        )}

                        {favLoading && (
                            <div className="py-12 text-center">
                                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                            </div>
                        )}

                        {!favLoading && favorites.length === 0 && !favError && (
                            <div
                                className="rounded-2xl p-12 text-center"
                                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                            >
                                <div
                                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                                    style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                                >
                                    <Heart className="h-7 w-7" />
                                </div>
                                <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                                    No saved tours yet
                                </h3>
                                <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                    Tap the heart on any tour to save it for later.
                                </p>
                                <Link href="/tours" className="glow-btn mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm">
                                    Explore Tours
                                </Link>
                            </div>
                        )}

                        {!favLoading && favorites.length > 0 && (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {favorites.map((f) => (
                                    <div
                                        key={f.favoriteId}
                                        id={`fav-item-${f.favoriteId}`}
                                        className="rounded-2xl overflow-hidden"
                                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                                    >
                                        <div className="p-5 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>
                                                        {f.tourCity}
                                                    </p>
                                                    <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
                                                        {f.tourTitle}
                                                    </h3>
                                                </div>
                                                <button
                                                    type="button"
                                                    id={`fav-remove-${f.favoriteId}`}
                                                    onClick={() => removeFavorite(f.tourId, f.favoriteId)}
                                                    aria-label="Remove from saved"
                                                    className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full transition-colors duration-200 sm:h-8 sm:w-8 touch-target"
                                                    style={{
                                                        background: "var(--accent-dim)",
                                                        color: "var(--accent)",
                                                        border: "1px solid var(--border-accent)",
                                                    }}
                                                >
                                                    <Heart className="h-3.5 w-3.5 fill-current" />
                                                </button>
                                            </div>

                                            {f.tourShortDescription && (
                                                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                                                    {f.tourShortDescription}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDuration(f.tourDurationMinutes)}
                                                </span>
                                                {f.tourAverageRating !== null && (
                                                    <span className="flex items-center gap-1" style={{ color: "#fbbf24" }}>
                                                        <Star className="h-3 w-3 fill-current" />
                                                        {f.tourAverageRating.toFixed(1)}
                                                        <span style={{ color: "var(--text-muted)" }}>({f.tourTotalReviews})</span>
                                                    </span>
                                                )}
                                                <span className="font-semibold" style={{ color: "var(--accent)" }}>
                                                    {f.tourBasePriceAmount} {f.tourBaseCurrency}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
                                                <Link
                                                    href={`/tours/${f.tourSlug}`}
                                                    className="glow-btn flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:flex-1"
                                                >
                                                    View Tour
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                                <Link
                                                    href={`/tours/${f.tourSlug}/book`}
                                                    className="ghost-btn w-full rounded-xl px-4 py-2 text-center text-xs sm:w-auto"
                                                >
                                                    Book
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
