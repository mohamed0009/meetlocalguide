"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { Filter, MapPin, RotateCcw, Star, Timer, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ExperienceFilterValues } from "@/lib/experiences";

const PRICE_OPTIONS = [
    { value: "all", label: "Any price" },
    { value: "0-400", label: "Up to 400 MAD" },
    { value: "400-800", label: "400–800 MAD" },
    { value: "800-1200", label: "800–1200 MAD" },
    { value: "1200+", label: "1200+ MAD" },
];

const DURATION_OPTIONS = [
    { value: "all", label: "Any duration" },
    { value: "0-2", label: "Up to 2h" },
    { value: "2-4", label: "2–4h" },
    { value: "4-8", label: "4–8h" },
    { value: "8+", label: "8h+" },
];

const RATING_OPTIONS = [
    { value: "all", label: "Any rating" },
    { value: "4", label: "4.0+" },
    { value: "4.5", label: "4.5+" },
    { value: "4.8", label: "4.8+" },
];

type FiltersProps = {
    form: UseFormReturn<ExperienceFilterValues>;
    categories: string[];
    cities: string[];
    resultsCount: number;
    isRefreshing: boolean;
    onReset: () => void;
};

function FilterLabel({ icon: Icon, children }: { icon?: React.ElementType; children: React.ReactNode }) {
    return (
        <span
            className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
        >
            {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
            {children}
        </span>
    );
}

export default function Filters({
    form,
    categories,
    cities,
    resultsCount,
    isRefreshing,
    onReset,
}: FiltersProps) {
    const { control, register } = form;

    return (
        <section
            className="rounded-2xl p-4 sm:p-5"
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            {/* Header row */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                    >
                        <Filter className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                            Filter Experiences
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                                {resultsCount}
                            </span>{" "}
                            result{resultsCount === 1 ? "" : "s"}
                            {isRefreshing ? " · refreshing..." : ""}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    id="filters-reset-btn"
                    onClick={onReset}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 sm:w-auto touch-target"
                    style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)";
                        (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    }}
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                </button>
            </div>

            {/* Filter grid */}
            <form
                onSubmit={(e) => e.preventDefault()}
                aria-label="Experience filters"
                className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-6"
            >
                {/* Search */}
                <div className="xl:col-span-2">
                    <FilterLabel>Search</FilterLabel>
                    <Input
                        {...register("query")}
                        id="filter-search"
                        aria-label="Search experiences"
                        placeholder="Desert, medina, food tour..."
                        className="h-11"
                    />
                </div>

                {/* City */}
                <div>
                    <FilterLabel icon={MapPin}>City</FilterLabel>
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="filter-city" aria-label="Filter by city" className="h-11">
                                    <SelectValue placeholder="All cities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All cities</SelectItem>
                                    {cities.map((city) => (
                                        <SelectItem key={city} value={city}>
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Category */}
                <div>
                    <FilterLabel>Category</FilterLabel>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="filter-category" aria-label="Filter by category" className="h-11">
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All categories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Price */}
                <div>
                    <FilterLabel icon={Wallet}>Price</FilterLabel>
                    <Controller
                        name="priceRange"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="filter-price" aria-label="Filter by price range" className="h-11">
                                    <SelectValue placeholder="Any price" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PRICE_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Duration */}
                <div>
                    <FilterLabel icon={Timer}>Duration</FilterLabel>
                    <Controller
                        name="duration"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="filter-duration" aria-label="Filter by duration" className="h-11">
                                    <SelectValue placeholder="Any duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DURATION_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {/* Rating — second row */}
                <div className="xl:col-span-1">
                    <FilterLabel icon={Star}>Rating</FilterLabel>
                    <Controller
                        name="minRating"
                        control={control}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="filter-rating" aria-label="Filter by minimum rating" className="h-11">
                                    <SelectValue placeholder="Any rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RATING_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>
            </form>
        </section>
    );
}
