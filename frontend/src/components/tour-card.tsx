import Image from "next/image";
import Link from "next/link";
import { formatUsd } from "@/lib/format";
import { getGuideBySlug, type Tour } from "@/lib/mock-data";

type TourCardProps = {
    tour: Tour;
    index?: number;
};

export function TourCard({ tour, index = 0 }: TourCardProps) {
    const guide = getGuideBySlug(tour.guideSlug);
    const delayClass = ["[animation-delay:0ms]", "[animation-delay:70ms]", "[animation-delay:140ms]", "[animation-delay:210ms]"];

    return (
        <article className={`card-surface fade-up overflow-hidden rounded-3xl ${delayClass[index % delayClass.length]}`}>
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={tour.coverImage}
                    alt={tour.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold">
                    {tour.city}
                </div>
            </div>

            <div className="space-y-4 p-5">
                <div className="space-y-1">
                    <h3 className="text-xl font-semibold leading-tight">{tour.title}</h3>
                    <p className="text-sm text-[var(--ink-soft)]">{tour.shortDescription}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-[var(--ink-soft)]">
                    <span>{tour.durationHours}h experience</span>
                    <span>
                        {tour.rating.toFixed(1)} ({tour.totalReviews})
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.08em] text-[var(--ink-soft)]">Starting at</p>
                        <p className="text-lg font-bold text-[var(--terracotta-700)]">{formatUsd(tour.priceUsd)}</p>
                    </div>
                    <Link href={`/tours/${tour.slug}`} className="gradient-button rounded-full px-4 py-2 text-sm font-semibold">
                        View Tour
                    </Link>
                </div>

                {guide ? <p className="text-xs text-[var(--ink-soft)]">Hosted by {guide.name}</p> : null}
            </div>
        </article>
    );
}