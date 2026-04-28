"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Map, Users, TrendingUp } from "lucide-react";
import { api, type PagedResponse, type BookingResponse, type TourSummary, type GuideSummary } from "@/lib/api-client";

type Stats = {
    tours: number;
    guides: number;
    bookings: number;
    confirmed: number;
};

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<Stats>({ tours: 0, guides: 0, bookings: 0, confirmed: 0 });
    const [recentBookings, setRecentBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.allSettled([
            api.get<PagedResponse<TourSummary>>("/tours?size=1"),
            api.get<PagedResponse<GuideSummary>>("/guides?size=1"),
            api.get<PagedResponse<BookingResponse>>("/bookings/me?size=5&sort=createdAt,desc"),
        ]).then(([toursRes, guidesRes, bookingsRes]) => {
            const newStats: Stats = { tours: 0, guides: 0, bookings: 0, confirmed: 0 };
            if (toursRes.status === "fulfilled") newStats.tours = toursRes.value.totalElements;
            if (guidesRes.status === "fulfilled") newStats.guides = guidesRes.value.totalElements;
            if (bookingsRes.status === "fulfilled") {
                newStats.bookings = bookingsRes.value.totalElements;
                const items = bookingsRes.value.content;
                newStats.confirmed = items.filter(b => b.status === "CONFIRMED").length;
                setRecentBookings(items);
            }
            setStats(newStats);
        }).finally(() => setLoading(false));
    }, []);

    const STATUS_COLOR: Record<string, string> = {
        PENDING: "#d97706",
        CONFIRMED: "#16a34a",
        CANCELLED: "#dc2626",
        COMPLETED: "var(--accent-secondary)",
    };

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Header */}
            <div>
                <span className="kicker">Admin</span>
                <h1 className="brand-font mt-1 text-2xl font-700" style={{ color: "var(--text-primary)" }}>
                    Platform Overview
                </h1>
            </div>

            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    { label: "Total Tours", value: stats.tours, Icon: Map, accent: false },
                    { label: "Active Guides", value: stats.guides, Icon: Users, accent: false },
                    { label: "My Bookings", value: stats.bookings, Icon: BookOpen, accent: true },
                    { label: "Confirmed", value: stats.confirmed, Icon: TrendingUp, accent: true },
                ].map(({ label, value, Icon, accent }) => (
                    <div
                        key={label}
                        className="rounded-2xl p-4 sm:p-5"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                {label}
                            </p>
                            <span
                                className="flex h-8 w-8 items-center justify-center rounded-xl"
                                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                            >
                                <Icon className="h-4 w-4" />
                            </span>
                        </div>
                        <p className="brand-font text-3xl font-700" style={{ color: accent ? "var(--accent)" : "var(--text-primary)" }}>
                            {loading ? "—" : value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Recent bookings */}
            <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
                <div className="flex flex-col gap-2 px-6 py-4 border-b sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border)" }}>
                    <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Recent Bookings</h2>
                    <Link
                        href="/admin/bookings"
                        className="flex items-center gap-1 text-xs font-semibold transition-colors"
                        style={{ color: "var(--accent)" }}
                    >
                        View all <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {loading ? (
                    <div className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>
                ) : recentBookings.length === 0 ? (
                    <div className="p-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>No bookings found.</div>
                ) : (
                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {recentBookings.map(b => (
                            <div key={b.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                                        {b.tourTitle}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                                        {b.travelerEmail} · {b.participantCount}p
                                    </p>
                                </div>
                                <span
                                    className="flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                                    style={{
                                        color: STATUS_COLOR[b.status] ?? "var(--text-secondary)",
                                        background: "var(--bg-surface)",
                                    }}
                                >
                                    {b.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick links */}
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    { href: "/admin/tours", label: "Manage Tours", desc: "Edit, archive or feature tours", Icon: Map },
                    { href: "/admin/guides", label: "Manage Guides", desc: "View and filter guide profiles", Icon: Users },
                    { href: "/admin/bookings", label: "All Bookings", desc: "Monitor booking statuses", Icon: BookOpen },
                ].map(({ href, label, desc, Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group rounded-2xl p-4 sm:p-5 transition-all duration-200"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-glow)";
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "none";
                        }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span
                                className="flex h-9 w-9 items-center justify-center rounded-xl"
                                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                            >
                                <Icon className="h-4.5 w-4.5" />
                            </span>
                            <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                                {label}
                            </span>
                        </div>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
