"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, Users, MapPin, ArrowRight, Clock } from "lucide-react";
import { api, getAccessToken, type BookingResponse } from "@/lib/api-client";

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Pending", color: "#d97706", bg: "rgba(217,119,6,0.1)" },
    CONFIRMED: { label: "Confirmed", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
    CANCELLED: { label: "Cancelled", color: "#dc2626", bg: "rgba(220,38,38,0.1)" },
    COMPLETED: { label: "Completed", color: "var(--accent-secondary)", bg: "var(--accent-secondary-dim)" },
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function BookingConfirmationPage() {
    const params = useParams<{ id: string }>();
    const id = params?.id ?? "";

    const [booking, setBooking] = useState<BookingResponse | null>(null);
    const [loading, setLoading] = useState(() => Boolean(getAccessToken()));
    const [error, setError] = useState<string | null>(() =>
        getAccessToken() ? null : "Please log in to view your booking."
    );

    useEffect(() => {
        if (!getAccessToken()) return;
        api.get<BookingResponse>(`/bookings/${id}`)
            .then(setBooking)
            .catch(err => setError(err instanceof Error ? err.message : "Could not load booking."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className="shell py-20 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                    <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>Loading booking…</p>
                </div>
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="page-wrapper">
                <div className="shell py-20 text-center max-w-md mx-auto space-y-4">
                    <p className="text-base" style={{ color: "#dc2626" }}>{error ?? "Booking not found."}</p>
                    <Link href="/dashboard" className="glow-btn inline-flex rounded-xl px-6 py-2.5 text-sm">
                        My Bookings
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = STATUS_LABELS[booking.status] ?? { label: booking.status, color: "var(--text-secondary)", bg: "var(--bg-surface)" };

    return (
        <div className="page-wrapper">
            <div className="shell py-10 sm:py-14">
                <div className="mx-auto max-w-2xl space-y-8">
                    {/* Success header */}
                    <div className="text-center space-y-4">
                        <div
                            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
                            style={{ background: "rgba(22,163,74,0.12)" }}
                        >
                            <CheckCircle className="h-9 w-9" style={{ color: "#16a34a" }} />
                        </div>
                        <h1 className="brand-font text-2xl font-700 sm:text-3xl" style={{ color: "var(--text-primary)" }}>
                            Booking Received!
                        </h1>
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            Your tour has been reserved. The guide will confirm within 24 hours.
                        </p>
                        <span
                            className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold"
                            style={{ background: statusInfo.bg, color: statusInfo.color }}
                        >
                            {statusInfo.label}
                        </span>
                    </div>

                    {/* Booking details */}
                    <div
                        className="relative overflow-hidden rounded-2xl"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                        <div
                            className="absolute left-0 right-0 top-0 h-px"
                            style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                        />

                        <div className="p-6 sm:p-8 space-y-5">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                                    Booking ID
                                </p>
                                <p className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
                                    {booking.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                                    Tour
                                </p>
                                <Link
                                    href={`/tours/${booking.tourSlug}`}
                                    className="text-base font-semibold transition-colors duration-200"
                                    style={{ color: "var(--accent)" }}
                                >
                                    {booking.tourTitle}
                                </Link>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>
                                            Start
                                        </p>
                                        <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                                            {formatDate(booking.startAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>
                                            End
                                        </p>
                                        <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                                            {formatDate(booking.endAt)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Users className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>
                                            Participants
                                        </p>
                                        <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                                            {booking.participantCount} person{booking.participantCount === 1 ? "" : "s"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>
                                            Total
                                        </p>
                                        <p className="text-base font-semibold" style={{ color: "var(--accent)" }}>
                                            {booking.totalAmount} {booking.currency}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {booking.specialRequests && (
                                <div className="rounded-xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                                        Special Requests
                                    </p>
                                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                        {booking.specialRequests}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/dashboard"
                            id="booking-view-all-btn"
                            className="glow-btn flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
                        >
                            View All Bookings
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/tours"
                            id="booking-browse-more-btn"
                            className="ghost-btn flex-1 rounded-xl py-3 text-sm text-center"
                        >
                            Browse More Tours
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
