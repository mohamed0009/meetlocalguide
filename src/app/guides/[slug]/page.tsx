import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
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

    if (!guide) {
        return {
            title: "Guide Not Found",
        };
    }

    return {
        title: `${guide.name} - Local Guide`,
        description: guide.headline,
    };
}

export default async function GuideProfilePage({ params }: GuidePageProps) {
    const { slug } = await params;
    const guide = getGuideBySlug(slug);

    if (!guide) {
        notFound();
    }

    const toursByGuide = getToursByGuide(guide.slug);

    return (
        <div className="container-shell space-y-8 py-10 sm:py-14">
            <section className="card-surface overflow-hidden rounded-3xl">
                <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                    <Image
                        src={guide.heroImage}
                        alt={guide.name}
                        width={1200}
                        height={900}
                        priority
                        className="h-72 w-full object-cover sm:h-96"
                    />
                    <div className="space-y-5 p-6 sm:p-10">
                        <span className="section-kicker">Guide Profile</span>
                        <h1 className="brand-heading text-4xl sm:text-5xl">{guide.name}</h1>
                        <p className="text-lg text-[var(--ink-soft)]">{guide.headline}</p>
                        <p className="leading-relaxed text-[var(--ink-soft)]">{guide.bio}</p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Experience</p>
                                <p className="mt-1 text-xl font-semibold">{guide.yearsExperience} years</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Hourly rate</p>
                                <p className="mt-1 text-xl font-semibold text-[var(--terracotta-700)]">{formatUsd(guide.hourlyRateUsd)}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Rating</p>
                                <p className="mt-1 text-xl font-semibold">
                                    {guide.rating.toFixed(1)} ({guide.totalReviews})
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Location</p>
                                <p className="mt-1 text-xl font-semibold">
                                    {guide.city}, {guide.country}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="card-surface rounded-3xl p-6 sm:p-8">
                <h2 className="brand-heading text-2xl">Specialties</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                    {guide.specialties.map((specialty) => (
                        <span
                            key={specialty}
                            className="rounded-full border border-[var(--line)] bg-[#fff4e6] px-4 py-1 text-sm font-semibold"
                        >
                            {specialty}
                        </span>
                    ))}
                </div>

                <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.09em] text-[var(--ocean-800)]">Languages</h3>
                <p className="mt-2 text-[var(--ink-soft)]">{guide.languages.join(" • ")}</p>
            </section>

            <section className="space-y-6">
                <h2 className="brand-heading text-3xl">Tours by {guide.name.split(" ")[0]}</h2>
                {toursByGuide.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {toursByGuide.map((tour, index) => (
                            <TourCard key={tour.slug} tour={tour} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="card-surface rounded-3xl p-8 text-center text-[var(--ink-soft)]">
                        This guide has no published tours yet.
                    </div>
                )}
            </section>
        </div>
    );
}