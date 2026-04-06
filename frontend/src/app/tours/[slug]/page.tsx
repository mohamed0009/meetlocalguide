import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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

    if (!tour) {
        return {
            title: "Tour Not Found",
        };
    }

    return {
        title: tour.title,
        description: tour.shortDescription,
    };
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
    const { slug } = await params;
    const tour = getTourBySlug(slug);

    if (!tour) {
        notFound();
    }

    const guide = getGuideBySlug(tour.guideSlug);

    return (
        <div className="container-shell space-y-8 py-10 sm:py-14">
            <div className="space-y-4">
                <span className="section-kicker">Tour Detail</span>
                <h1 className="brand-heading text-4xl leading-tight sm:text-5xl">{tour.title}</h1>
                <p className="max-w-3xl text-[var(--ink-soft)]">{tour.shortDescription}</p>
            </div>

            <div className="card-surface overflow-hidden rounded-3xl">
                <Image
                    src={tour.coverImage}
                    alt={tour.title}
                    width={1600}
                    height={900}
                    priority
                    className="h-[340px] w-full object-cover sm:h-[460px]"
                />
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="space-y-8">
                    <section className="card-surface rounded-3xl p-6 sm:p-8">
                        <h2 className="brand-heading text-2xl">Experience Overview</h2>
                        <p className="mt-3 leading-relaxed text-[var(--ink-soft)]">{tour.description}</p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Duration</p>
                                <p className="mt-1 text-lg font-semibold">{tour.durationHours} hours</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Meeting Point</p>
                                <p className="mt-1 text-lg font-semibold">{tour.meetingPoint}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Rating</p>
                                <p className="mt-1 text-lg font-semibold">
                                    {tour.rating.toFixed(1)} ({tour.totalReviews} reviews)
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">City</p>
                                <p className="mt-1 text-lg font-semibold">{tour.city}</p>
                            </div>
                        </div>
                    </section>

                    <section className="card-surface rounded-3xl p-6 sm:p-8">
                        <h2 className="brand-heading text-2xl">Highlights</h2>
                        <ul className="mt-4 space-y-3 text-[var(--ink-soft)]">
                            {tour.highlights.map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="mt-2 h-2 w-2 rounded-full bg-[var(--terracotta-500)]" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="card-surface rounded-3xl p-6 sm:p-8">
                        <h2 className="brand-heading text-2xl">Gallery</h2>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                            {tour.gallery.map((imageUrl) => (
                                <div key={imageUrl} className="overflow-hidden rounded-2xl">
                                    <Image
                                        src={imageUrl}
                                        alt={`${tour.title} visual`}
                                        width={800}
                                        height={520}
                                        className="h-40 w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
                    <div className="card-surface rounded-3xl p-6">
                        <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Starting at</p>
                        <p className="mt-1 text-3xl font-bold text-[var(--terracotta-700)]">{formatUsd(tour.priceUsd)}</p>
                        <button className="gradient-button mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold">
                            Reserve This Tour
                        </button>
                        <p className="mt-2 text-xs text-[var(--ink-soft)]">Free cancellation up to 48 hours before start.</p>
                    </div>

                    {guide ? (
                        <div className="card-surface rounded-3xl p-6">
                            <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Hosted by</p>
                            <h3 className="mt-2 text-xl font-semibold">{guide.name}</h3>
                            <p className="mt-1 text-sm text-[var(--ink-soft)]">{guide.headline}</p>
                            <Link
                                href={`/guides/${guide.slug}`}
                                className="mt-4 inline-block text-sm font-semibold text-[var(--ocean-800)] hover:text-[var(--terracotta-700)]"
                            >
                                View guide profile
                            </Link>
                        </div>
                    ) : null}

                    <div className="card-surface rounded-3xl p-6">
                        <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Includes</p>
                        <ul className="mt-3 space-y-2 text-sm text-[var(--ink-soft)]">
                            {tour.includes.map((item) => (
                                <li key={item}>- {item}</li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}