import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, MapPin, Star } from "lucide-react";
import { formatUsd } from "@/lib/format";
import { getAllTours, getGuideBySlug, getTourBySlug } from "@/lib/mock-data";

type TourDetailPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return getAllTours().map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const tour = getTourBySlug(slug);
    if (!tour) return { title: "Tour Not Found" };
    return {
        title: tour.title,
        description: tour.shortDescription,
    };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
    const { slug } = await params;
    const tour = getTourBySlug(slug);

    if (!tour) notFound();

    const guide = getGuideBySlug(tour.guideSlug);

    return (
        <div className="page-wrapper">
            {/* Back link */}
            <div className="shell pt-6 pb-4">
                <Link
                    href="/tours"
                    id="tour-detail-back-btn"
                    className="inline-flex items-center gap-2 text-sm transition-colors duration-200 hover:text-white"
                    style={{ color: "var(--text-muted)" }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tours
                </Link>
            </div>

            <div className="shell space-y-8 pb-20">
                {/* Page header */}
                <div className="space-y-3">
                    <span className="kicker">Tour Detail</span>
                    <h1
                        className="brand-font text-3xl font-700 leading-tight sm:text-4xl lg:text-5xl"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {tour.title}
                    </h1>
                    <p className="max-w-3xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
                        {tour.shortDescription}
                    </p>

                    {/* Quick meta badges */}
                    <div className="flex flex-wrap gap-3 pt-1">
                        {[
                            { Icon: MapPin, value: tour.city },
                            { Icon: Clock, value: `${tour.durationHours} hours` },
                            { Icon: Star, value: `${tour.rating.toFixed(1)} (${tour.totalReviews} reviews)` },
                        ].map(({ Icon, value }) => (
                            <span
                                key={value}
                                className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium"
                                style={{
                                    background: "var(--bg-surface)",
                                    border: "1px solid var(--border)",
                                    color: "var(--text-secondary)",
                                }}
                            >
                                <Icon className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                                {value}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Hero image */}
                <div
                    className="overflow-hidden rounded-2xl"
                    style={{ border: "1px solid var(--border)" }}
                >
                    <Image
                        src={tour.coverImage}
                        alt={tour.title}
                        width={1600}
                        height={900}
                        priority
                        className="h-[300px] w-full object-cover sm:h-[440px]"
                        style={{ display: "block" }}
                    />
                </div>

                {/* Main grid */}
                <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                    {/* Left column */}
                    <div className="space-y-6">
                        {/* Overview */}
                        <section
                            className="rounded-2xl p-6 sm:p-8"
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <h2 className="brand-font text-xl font-700" style={{ color: "var(--text-primary)" }}>
                                Experience Overview
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                {tour.description}
                            </p>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                {[
                                    { label: "Duration", value: `${tour.durationHours} hours` },
                                    { label: "Meeting Point", value: tour.meetingPoint },
                                    { label: "Rating", value: `${tour.rating.toFixed(1)} · ${tour.totalReviews} reviews` },
                                    { label: "City", value: tour.city },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="rounded-xl p-4"
                                        style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                                    >
                                        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                            {label}
                                        </p>
                                        <p className="mt-1.5 text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Highlights */}
                        <section
                            className="rounded-2xl p-6 sm:p-8"
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <h2 className="brand-font text-xl font-700" style={{ color: "var(--text-primary)" }}>
                                Highlights
                            </h2>
                            <ul className="mt-4 space-y-3">
                                {tour.highlights.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span
                                            className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                                            style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                                        >
                                            <Check className="h-3 w-3" />
                                        </span>
                                        <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Gallery */}
                        {tour.gallery.length > 0 && (
                            <section
                                className="rounded-2xl p-6 sm:p-8"
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <h2 className="brand-font text-xl font-700 mb-4" style={{ color: "var(--text-primary)" }}>
                                    Gallery
                                </h2>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {tour.gallery.map((imageUrl) => (
                                        <div
                                            key={imageUrl}
                                            className="overflow-hidden rounded-xl"
                                            style={{ border: "1px solid var(--border)" }}
                                        >
                                            <Image
                                                src={imageUrl}
                                                alt={`${tour.title} visual`}
                                                width={800}
                                                height={520}
                                                className="h-36 w-full object-cover transition-transform duration-500 hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right column — sticky sidebar */}
                    <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
                        {/* Booking card */}
                        <div
                            className="relative overflow-hidden rounded-2xl p-6"
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-accent)",
                                boxShadow: "0 0 30px rgba(0,0,0,0.08)",
                            }}
                        >
                            {/* Top glow */}
                            <div
                                className="absolute left-0 right-0 top-0 h-px"
                                style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
                            />

                            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                Starting at
                            </p>
                            <p
                                className="brand-font mt-1 text-4xl font-700"
                                style={{ color: "var(--accent)", textShadow: "0 0 20px var(--accent-glow)" }}
                            >
                                {formatUsd(tour.priceUsd)}
                            </p>
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>per person</p>

                            <Link
                                href={`/tours/${tour.slug}/book`}
                                id="tour-reserve-btn"
                                className="glow-btn mt-5 block w-full rounded-xl py-3 text-sm font-semibold text-center"
                            >
                                Reserve This Tour
                            </Link>
                            <p className="mt-3 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                                Free cancellation up to 48 hours before start.
                            </p>
                        </div>

                        {/* Guide card */}
                        {guide && (
                            <div
                                className="rounded-2xl p-6"
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl text-base font-bold"
                                        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                                    >
                                        {guide.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                            Hosted by
                                        </p>
                                        <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                                            {guide.name}
                                        </h3>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                    {guide.headline}
                                </p>
                                <Link
                                    href={`/guides/${guide.slug}`}
                                    id="tour-guide-profile-link"
                                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
                                    style={{ color: "var(--accent)" }}
                                >
                                    View guide profile
                                    <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                                </Link>
                            </div>
                        )}

                        {/* Includes */}
                        <div
                            className="rounded-2xl p-6"
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <p className="text-[10px] font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                                What's included
                            </p>
                            <ul className="space-y-2.5">
                                {tour.includes.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5">
                                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}