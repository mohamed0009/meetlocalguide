"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock3, MapPin, Star, Users, ArrowRight } from "lucide-react";
import { formatDuration, formatMad, type Experience } from "@/lib/experiences";
import { cn } from "@/lib/utils";

type ExperienceCardProps = {
    experience: Experience;
    compact?: boolean;
    active?: boolean;
    onSelect: (experienceId: string) => void;
    onHover: (experienceId: string | null) => void;
};

export default function ExperienceCard({
    experience,
    compact = false,
    active = false,
    onSelect,
    onHover,
}: ExperienceCardProps) {
    const [imageIndex, setImageIndex] = useState(0);
    const [hovered, setHovered] = useState(false);

    const nextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setImageIndex((prev) => (prev + 1) % experience.images.length);
    };

    const previousImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setImageIndex((prev) => (prev - 1 + experience.images.length) % experience.images.length);
    };

    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className={cn("overflow-hidden rounded-2xl cursor-pointer transition-all duration-250")}
            style={{
                background: "var(--bg-card)",
                border: active
                    ? "1px solid var(--accent)"
                    : hovered
                        ? "1px solid var(--border-accent)"
                        : "1px solid var(--border)",
                boxShadow: active
                    ? "var(--shadow-glow)"
                    : hovered
                        ? "0 4px 24px rgba(0,0,0,0.5)"
                        : "var(--shadow-card)",
            }}
            onMouseEnter={() => { setHovered(true); onHover(experience.id); }}
            onMouseLeave={() => { setHovered(false); onHover(null); }}
            onFocus={() => onHover(experience.id)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(experience.id)}
            aria-label={`${experience.title} experience card`}
        >
            {/* Image */}
            <div className={cn("relative overflow-hidden", compact ? "aspect-[16/10]" : "aspect-[4/3]")}>
                <Image
                    src={experience.images[imageIndex]}
                    alt={experience.title}
                    fill
                    sizes={compact ? "(min-width: 1280px) 340px, 100vw" : "(min-width: 1280px) 420px, 100vw"}
                    className="object-cover"
                    style={{
                        transform: hovered ? "scale(1.05)" : "scale(1)",
                        transition: "transform 500ms ease",
                    }}
                />

                {/* Dark gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(to top, rgba(8,8,14,0.8) 0%, rgba(8,8,14,0.1) 50%, transparent 100%)",
                    }}
                />

                {/* Top badges */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                    <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-white"
                        style={{
                            background: "var(--accent)",
                        }}
                    >
                        {experience.city}
                    </span>
                    <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold bg-white"
                        style={{
                            color: "var(--text-primary)",
                        }}
                    >
                        {experience.category}
                    </span>
                </div>

                {/* Rating top-right */}
                <div
                    className="absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                    style={{
                        background: "rgba(8,8,14,0.75)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid var(--border)",
                        color: "#fbbf24",
                    }}
                >
                    <Star className="h-3 w-3 fill-current" />
                    {experience.rating.toFixed(1)}
                </div>

                {/* Image nav */}
                {experience.images.length > 1 && (
                    <>
                        <button
                            type="button"
                            aria-label="Previous image"
                            onClick={previousImage}
                            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 sm:h-7 sm:w-7 touch-target"
                            style={{
                                background: "rgba(8,8,14,0.75)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid var(--border)",
                                color: "var(--text-primary)",
                            }}
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next image"
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-200 sm:h-7 sm:w-7 touch-target"
                            style={{
                                background: "rgba(8,8,14,0.75)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid var(--border)",
                                color: "var(--text-primary)",
                            }}
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>

                        {/* Dot indicators */}
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                            {experience.images.map((img, idx) => (
                                <button
                                    key={img}
                                    type="button"
                                    aria-label={`Show image ${idx + 1}`}
                                    onClick={(e) => { e.stopPropagation(); setImageIndex(idx); }}
                                    className="h-1.5 w-1.5 rounded-full transition-all duration-200"
                                    style={{
                                        background: imageIndex === idx ? "var(--accent)" : "rgba(255,255,255,0.4)",
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Active indicator */}
                {active && (
                    <div
                        className="absolute inset-0 rounded-2xl"
                        style={{ boxShadow: "inset 0 0 0 2px var(--accent)" }}
                    />
                )}
            </div>

            {/* Content */}
            <div className={cn("space-y-3 p-4", !compact && "p-4 sm:p-5")}>
                <div>
                    <h3
                        className={cn(
                            "font-semibold leading-tight",
                            compact ? "text-sm" : "text-[15px] sm:text-base"
                        )}
                        style={{ color: "var(--text-primary)" }}
                    >
                        {experience.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                        {experience.summary}
                    </p>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {experience.city}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock3 className="h-3 w-3" />
                        {formatDuration(experience.durationHours)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Up to {experience.maxGroupSize}
                    </span>
                </div>

                {/* Price + CTA */}
                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                            Price / person
                        </p>
                        <p
                            className="text-lg font-700 leading-none"
                            style={{
                                color: "var(--text-primary)",
                            }}
                        >
                            {formatMad(experience.priceMad)}
                        </p>
                    </div>

                    <Link
                        href={`/tours/${experience.slug}`}
                        id={`exp-card-cta-${experience.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            "glow-btn flex w-full items-center justify-center gap-1.5 rounded-full text-xs font-semibold sm:w-auto touch-target",
                            compact ? "px-3 py-2" : "px-4 py-2.5"
                        )}
                    >
                        View Details
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}
