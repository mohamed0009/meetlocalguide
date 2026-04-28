"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, MessageSquare, AlertCircle } from "lucide-react";
import { api, getAccessToken, type BookingResponse } from "@/lib/api-client";
import { getTourBySlug } from "@/lib/mock-data";
import { formatUsd } from "@/lib/format";

function toLocalDatetimeValue(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function BookTourPage() {
    const params = useParams<{ slug: string }>();
    const router = useRouter();
    const slug = params?.slug ?? "";

    const tour = getTourBySlug(slug);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const defaultEnd = new Date(tomorrow);
    defaultEnd.setHours(tomorrow.getHours() + (tour?.durationHours ?? 4));

    const [startAt, setStartAt] = useState(toLocalDatetimeValue(tomorrow));
    const [endAt, setEndAt] = useState(toLocalDatetimeValue(defaultEnd));
    const [participants, setParticipants] = useState(1);
    const [specialRequests, setSpecialRequests] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authed, setAuthed] = useState<boolean | null>(null);

    useEffect(() => {
        setAuthed(!!getAccessToken());
    }, []);

    if (!tour) {
        return (
            <div className="page-wrapper">
                <div className="shell py-20 text-center">
                    <p className="text-lg" style={{ color: "var(--text-secondary)" }}>Tour not found.</p>
                    <Link href="/tours" className="glow-btn mt-6 inline-flex rounded-xl px-6 py-2.5 text-sm">
                        Browse tours
                    </Link>
                </div>
            </div>
        );
    }

    if (authed === false) {
        return (
            <div className="page-wrapper">
                <div className="shell py-20 text-center max-w-md mx-auto space-y-5">
                    <div
                        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                    >
                        <AlertCircle className="h-7 w-7" />
                    </div>
                    <h1 className="brand-font text-2xl font-700" style={{ color: "var(--text-primary)" }}>
                        Sign in to book
                    </h1>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        You need an account to reserve a tour. It only takes a minute.
                    </p>
                    <Link
                        href={`/auth/login?next=/tours/${slug}/book`}
                        className="glow-btn inline-flex rounded-xl px-8 py-3 text-sm font-semibold"
                    >
                        Log in
                    </Link>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        No account?{" "}
                        <Link href="/auth/register" style={{ color: "var(--accent)" }}>Register free</Link>
                    </p>
                </div>
            </div>
        );
    }

    const totalUsd = tour.priceUsd * participants;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const booking = await api.post<BookingResponse>("/bookings", {
                tourId: tour!.slug,
                startAt: new Date(startAt).toISOString(),
                endAt: new Date(endAt).toISOString(),
                participantCount: participants,
                currency: "USD",
                specialRequests: specialRequests || null,
            });
            router.push(`/booking/${booking.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-wrapper">
            <div className="shell pt-6 pb-4">
                <Link
                    href={`/tours/${slug}`}
                    id="book-back-btn"
                    className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
                    style={{ color: "var(--text-muted)" }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to tour
                </Link>
            </div>

            <div className="shell pb-20">
                <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
                    {/* Booking form */}
                    <div className="space-y-6">
                        <div>
                            <span className="kicker">Reserve Now</span>
                            <h1 className="brand-font mt-2 text-3xl font-700" style={{ color: "var(--text-primary)" }}>
                                Book your experience
                            </h1>
                            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                {tour.title}
                            </p>
                        </div>

                        {error && (
                            <div
                                className="rounded-xl px-4 py-3 text-sm"
                                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626" }}
                            >
                                {error}
                            </div>
                        )}

                        <form id="booking-form" onSubmit={handleSubmit} className="space-y-5">
                            {/* Dates */}
                            <div
                                className="rounded-2xl p-6 space-y-4"
                                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-4 w-4" style={{ color: "var(--accent)" }} />
                                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                        Select Dates
                                    </span>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <label>
                                        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                            Start date &amp; time
                                        </span>
                                        <input
                                            id="booking-start-date"
                                            type="datetime-local"
                                            required
                                            value={startAt}
                                            onChange={e => setStartAt(e.target.value)}
                                            className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                                        />
                                    </label>
                                    <label>
                                        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                            End date &amp; time
                                        </span>
                                        <input
                                            id="booking-end-date"
                                            type="datetime-local"
                                            required
                                            value={endAt}
                                            onChange={e => setEndAt(e.target.value)}
                                            className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Participants */}
                            <div
                                className="rounded-2xl p-6"
                                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="h-4 w-4" style={{ color: "var(--accent)" }} />
                                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                        Participants
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        id="participants-dec"
                                        onClick={() => setParticipants(Math.max(1, participants - 1))}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold transition-colors"
                                        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                                    >
                                        −
                                    </button>
                                    <span id="participants-count" className="brand-font text-2xl font-700 w-8 text-center" style={{ color: "var(--accent)" }}>
                                        {participants}
                                    </span>
                                    <button
                                        type="button"
                                        id="participants-inc"
                                        onClick={() => setParticipants(Math.min(20, participants + 1))}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold transition-colors"
                                        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                                    >
                                        +
                                    </button>
                                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                                        person{participants === 1 ? "" : "s"}
                                    </span>
                                </div>
                            </div>

                            {/* Special requests */}
                            <div
                                className="rounded-2xl p-6"
                                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageSquare className="h-4 w-4" style={{ color: "var(--accent)" }} />
                                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                                        Special Requests
                                        <span className="ml-1 text-[10px] font-normal" style={{ color: "var(--text-muted)" }}>
                                            (optional)
                                        </span>
                                    </span>
                                </div>
                                <textarea
                                    id="booking-special-requests"
                                    rows={4}
                                    maxLength={1500}
                                    placeholder="Dietary needs, accessibility, special occasions…"
                                    value={specialRequests}
                                    onChange={e => setSpecialRequests(e.target.value)}
                                    className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm resize-none"
                                />
                                <p className="mt-1.5 text-right text-[10px]" style={{ color: "var(--text-muted)" }}>
                                    {specialRequests.length}/1500
                                </p>
                            </div>

                            <button
                                id="booking-submit-btn"
                                type="submit"
                                disabled={loading || authed === null}
                                className="glow-btn w-full rounded-xl py-3.5 text-sm font-semibold disabled:opacity-60"
                            >
                                {loading ? "Reserving…" : `Reserve · ${formatUsd(totalUsd)}`}
                            </button>
                            <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
                                Free cancellation up to 48 hours before start.
                            </p>
                        </form>
                    </div>

                    {/* Summary sidebar */}
                    <aside className="lg:sticky lg:top-24 lg:h-fit space-y-4">
                        <div
                            className="relative overflow-hidden rounded-2xl p-6"
                            style={{ background: "var(--bg-card)", border: "1px solid var(--border-accent)" }}
                        >
                            <div
                                className="absolute left-0 right-0 top-0 h-px"
                                style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                            />
                            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                                Booking Summary
                            </p>
                            <h2 className="text-base font-semibold leading-snug mb-4" style={{ color: "var(--text-primary)" }}>
                                {tour.title}
                            </h2>
                            {[
                                { label: "Location", value: tour.city },
                                { label: "Duration", value: `${tour.durationHours} hours` },
                                { label: "Price/person", value: formatUsd(tour.priceUsd) },
                                { label: "Participants", value: `${participants}` },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between py-2 border-b text-sm" style={{ borderColor: "var(--border-subtle)" }}>
                                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                                    <span className="font-medium" style={{ color: "var(--text-primary)" }}>{value}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between mt-3 pt-1">
                                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Total</span>
                                <span className="brand-font text-xl font-700" style={{ color: "var(--accent)" }}>
                                    {formatUsd(totalUsd)}
                                </span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
