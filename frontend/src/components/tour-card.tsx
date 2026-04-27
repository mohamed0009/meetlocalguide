"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Star, ArrowRight } from "lucide-react";
import { formatUsd } from "@/lib/format";
import { getGuideBySlug, type Tour } from "@/lib/mock-data";

type TourCardProps = {
    tour: Tour;
    index?: number;
};

export function TourCard({ tour, index = 0 }: TourCardProps) {
    const guide = getGuideBySlug(tour.guideSlug);
    const [hovered, setHovered] = useState(false);

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="group overflow-hidden rounded-2xl"
            style={{
                background: "var(--bg-card)",
                border: hovered ? "1px solid var(--border-accent)" : "1px solid var(--border)",
                boxShadow: hovered ? "var(--shadow-glow)" : "var(--shadow-card)",
                transition: "border-color 250ms ease, box-shadow 250ms ease",
            }}
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={tour.coverImage}
                    alt={tour.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover"
                    style={{
                        transform: hovered ? "scale(1.06)" : "scale(1)",
                        transition: "transform 500ms ease",
                    }}
                />

                {/* Gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to top, rgba(8,8,14,0.85) 0%, rgba(8,8,14,0.2) 50%, transparent 100%)",
                    }}
                />

                {/* City badge */}
                <div
                    className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white"
                    style={{
                        background: "var(--accent)",
                        border: "1px solid var(--accent)",
                    }}
                >
                    {tour.city}
                </div>

                {/* Rating badge */}
                <div
                    className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
                    style={{
                        background: "rgba(8,8,14,0.75)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid var(--border)",
                        color: "#fbbf24",
                    }}
                >
                    <Star className="h-3 w-3 fill-current" />
                    {tour.rating.toFixed(1)}
                </div>

                {/* Price on image bottom-left */}
                <div className="absolute bottom-3 left-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>
                        Starting at
                    </p>
                    <p className="text-xl font-700 leading-none text-white" style={{ textShadow: "0 0 12px rgba(0,0,0,0.5)" }}>
                        {formatUsd(tour.priceUsd)}
                    </p>
                </div>

                {/* Urgency badge bottom-right */}
                {tour.spots !== undefined && tour.spots <= 4 && (
                    <div className="urgency absolute bottom-3 right-3">
                        <span className="urgency-dot" />
                        {tour.spots} spot{tour.spots === 1 ? "" : "s"} left
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="space-y-3 p-5">
                {/* Tags */}
                {tour.tags && tour.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tour.tags.map((tag) => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                )}
                <div>
                    <h3 className="text-base font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
                        {tour.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                        {tour.shortDescription}
                    </p>
                </div>

                <div
                    className="flex items-center gap-3 text-xs"
                    style={{ color: "var(--text-muted)" }}
                >
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {tour.durationHours}h experience
                    </span>
                    <span className="h-3.5 w-px" style={{ background: "var(--border)" }} />
                    <span>
                        {tour.totalReviews} reviews
                    </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                    {guide && (
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            By <span style={{ color: "var(--text-secondary)" }}>{guide.name}</span>
                        </p>
                    )}
                    <Link
                        href={`/tours/${tour.slug}`}
                        id={`tour-card-cta-${tour.slug}`}
                        className="ml-auto glow-btn flex items-center gap-1.5 rounded-full px-4 py-2 text-xs"
                    >
                        View Tour
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}