import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, MapPin, Star, Users } from "lucide-react";
import { TourCard } from "@/components/tour-card";
import { formatUsd } from "@/lib/format";
import { getGuideBySlug, getToursByGuide, guides } from "@/lib/mock-data";

type GuidePageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuideBySlug(slug);
    if (!guide) return { title: "Guide Not Found" };
    return {
        title: `${guide.name} - Local Guide`,
        description: guide.headline,
    };
}

export default async function GuideProfilePage({ params }: GuidePageProps) {
    const { slug } = await params;
    const guide = getGuideBySlug(slug);
    if (!guide) notFound();

    const toursByGuide = getToursByGuide(guide.slug);

    return (
        <div className="page-wrapper">
            {/* Back */}
            <div className="shell pt-6 pb-4">
                <Link
                    href="/tours"
                    id="guide-back-btn"
                    className="inline-flex items-center gap-2 text-sm transition-colors duration-200"
                    style={{ color: "var(--text-muted)" }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tours
                </Link>
            </div>

            <div className="shell space-y-8 pb-20">
                {/* Hero card */}
                <section
                    className="overflow-hidden rounded-2xl"
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                        {/* Guide image */}
                        <div className="relative overflow-hidden">
                            <Image
                                src={guide.heroImage}
                                alt={guide.name}
                                width={1200}
                                height={900}
                                priority
                                className="h-72 w-full object-cover sm:h-96 lg:h-full"
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(to top, rgba(255,255,255,0.8) 0%, transparent 60%)",
                                }}
                            />
                        </div>

                        {/* Guide info */}
                        <div className="space-y-5 p-6 sm:p-10">
                            <span className="kicker">Guide Profile</span>
                            <h1 className="brand-font text-3xl font-700 sm:text-4xl" style={{ color: "var(--text-primary)" }}>
                                {guide.name}
                            </h1>
                            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
                                {guide.headline}
                            </p>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                {guide.bio}
                            </p>

                            {/* Stats grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { Icon: Users, label: "Experience", value: `${guide.yearsExperience} years` },
                                    {
                                        Icon: Star,
                                        label: "Rating",
                                        value: `${guide.rating.toFixed(1)} (${guide.totalReviews})`,
                                        accent: true,
                                    },
                                    {
                                        Icon: MapPin,
                                        label: "Location",
                                        value: `${guide.city}, ${guide.country}`,
                                    },
                                    {
                                        Icon: Globe,
                                        label: "Hourly rate",
                                        value: formatUsd(guide.hourlyRateUsd),
                                        accent: true,
                                    },
                                ].map(({ Icon, label, value, accent }) => (
                                    <div
                                        key={label}
                                        className="rounded-xl p-4"
                                        style={{
                                            background: "var(--bg-surface)",
                                            border: "1px solid var(--border)",
                                        }}
                                    >
                                        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                                            {label}
                                        </p>
                                        <p
                                            className="mt-1.5 text-base font-semibold"
                                            style={{ color: accent ? "var(--accent)" : "var(--text-primary)" }}
                                        >
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Book CTA */}
                            <button
                                id="guide-book-btn"
                                type="button"
                                className="glow-btn rounded-xl px-7 py-3 text-sm font-semibold"
                            >
                                Book This Guide
                            </button>
                        </div>
                    </div>
                </section>

                {/* Specialties */}
                <section
                    className="rounded-2xl p-6 sm:p-8"
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <h2 className="brand-font text-xl font-700 mb-5" style={{ color: "var(--text-primary)" }}>
                        Specialties
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {guide.specialties.map((specialty) => (
                            <span
                                key={specialty}
                                className="rounded-full px-4 py-1.5 text-sm font-medium"
                                style={{
                                    background: "var(--accent-dim)",
                                    border: "1px solid var(--border-accent)",
                                    color: "var(--accent)",
                                }}
                            >
                                {specialty}
                            </span>
                        ))}
                    </div>

                    <div className="mt-6">
                        <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                            Languages
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {guide.languages.map((lang) => (
                                <span
                                    key={lang}
                                    className="rounded-full px-3 py-1 text-xs font-medium"
                                    style={{
                                        background: "var(--bg-surface)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Guide's tours */}
                <section className="space-y-6">
                    <h2 className="brand-font text-2xl font-700" style={{ color: "var(--text-primary)" }}>
                        Tours by{" "}
                        <span style={{ color: "var(--accent)" }}>{guide.name.split(" ")[0]}</span>
                    </h2>
                    {toursByGuide.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {toursByGuide.map((tour, index) => (
                                <TourCard key={tour.slug} tour={tour} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div
                            className="rounded-2xl p-10 text-center"
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                This guide has no published tours yet.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}