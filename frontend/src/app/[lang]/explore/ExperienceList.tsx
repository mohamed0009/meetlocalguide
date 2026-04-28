"use client";

import { AlertCircle, Compass } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import { useExperiences } from "@/hooks/use-experiences";
import {
    defaultExperienceFilters,
    filterExperiences,
    getExperienceFilterOptions,
    type ExperienceFilterValues,
} from "@/lib/experiences";
import ExperienceCard from "./ExperienceCard";
import Filters from "./Filters";

const ExperiencesMap = lazy(() => import("./Map"));

export default function ExperienceList() {
    const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
    const [hoveredExperienceId, setHoveredExperienceId] = useState<string | null>(null);

    const form = useForm<ExperienceFilterValues>({
        defaultValues: defaultExperienceFilters,
    });

    const watchedFilters = useWatch({ control: form.control }) as ExperienceFilterValues | undefined;
    const activeFilters = watchedFilters ?? defaultExperienceFilters;

    const {
        data: experiences = [],
        isPending,
        isError,
        isFetching,
        error,
        refetch,
    } = useExperiences();

    const options = useMemo(() => getExperienceFilterOptions(experiences), [experiences]);
    const filteredExperiences = useMemo(() => filterExperiences(experiences, activeFilters), [activeFilters, experiences]);

    const resolvedSelectedExperienceId = useMemo(() => {
        if (filteredExperiences.length === 0) return null;
        if (selectedExperienceId && filteredExperiences.some((e) => e.id === selectedExperienceId)) {
            return selectedExperienceId;
        }
        return filteredExperiences[0].id;
    }, [filteredExperiences, selectedExperienceId]);

    const selectedExperience = useMemo(
        () => filteredExperiences.find((e) => e.id === resolvedSelectedExperienceId) ?? null,
        [filteredExperiences, resolvedSelectedExperienceId]
    );

    const secondaryExperiences = useMemo(
        () => filteredExperiences.filter((e) => e.id !== resolvedSelectedExperienceId),
        [filteredExperiences, resolvedSelectedExperienceId]
    );

    const resetFilters = () => form.reset(defaultExperienceFilters);

    /* ── Loading ── */
    if (isPending) {
        return (
            <div className="space-y-5">
                <Filters
                    form={form}
                    categories={[]}
                    cities={[]}
                    resultsCount={0}
                    isRefreshing
                    onReset={resetFilters}
                />
                <LoadingState />
            </div>
        );
    }

    /* ── Error ── */
    if (isError) {
        return (
            <div className="space-y-5">
                <Filters
                    form={form}
                    categories={options.categories}
                    cities={options.cities}
                    resultsCount={filteredExperiences.length}
                    isRefreshing={isFetching}
                    onReset={resetFilters}
                />
                <div
                    className="rounded-2xl p-10 text-center"
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid rgba(0,0,0,0.25)",
                    }}
                >
                    <div
                        className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ background: "rgba(0,0,0,0.15)", color: "var(--accent)" }}
                    >
                        <AlertCircle className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                        Unable to load experiences
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {error instanceof Error ? error.message : "Please try again in a few moments."}
                    </p>
                    <button
                        id="error-retry-btn"
                        type="button"
                        onClick={() => void refetch()}
                        className="glow-btn mt-6 rounded-xl px-6 py-2.5 text-sm"
                    >
                        Retry loading
                    </button>
                </div>
            </div>
        );
    }

    /* ── Main ── */
    return (
        <section className="space-y-5">
            <Filters
                form={form}
                categories={options.categories}
                cities={options.cities}
                resultsCount={filteredExperiences.length}
                isRefreshing={isFetching}
                onReset={resetFilters}
            />

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.7fr)]">
                {/* Map panel */}
                <div
                    className="rounded-2xl p-2.5"
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                    }}
                >
                    <Suspense fallback={<MapSkeleton />}>
                        <ExperiencesMap
                            experiences={filteredExperiences}
                            selectedExperienceId={resolvedSelectedExperienceId}
                            hoveredExperienceId={hoveredExperienceId}
                            onSelectExperience={setSelectedExperienceId}
                            onHoverExperience={setHoveredExperienceId}
                        />
                    </Suspense>
                </div>

                {/* Card panel */}
                <aside className="space-y-4 xl:max-h-[76vh] xl:overflow-auto xl:pr-1.5">
                    {selectedExperience ? (
                        <ExperienceCard
                            key={selectedExperience.id}
                            experience={selectedExperience}
                            active
                            onSelect={setSelectedExperienceId}
                            onHover={setHoveredExperienceId}
                        />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="rounded-2xl p-10 text-center"
                            style={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <div
                                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
                                style={{ background: "var(--accent-dim)", color: "var(--accent)" }}
                            >
                                <Compass className="h-6 w-6" />
                            </div>
                            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                                No experiences match
                            </h2>
                            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                                Try broadening city, budget, duration, or category.
                            </p>
                        </motion.div>
                    )}

                    {secondaryExperiences.length > 0 && (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            {secondaryExperiences.slice(0, 4).map((exp) => (
                                <ExperienceCard
                                    key={exp.id}
                                    experience={exp}
                                    compact
                                    active={exp.id === hoveredExperienceId}
                                    onSelect={setSelectedExperienceId}
                                    onHover={setHoveredExperienceId}
                                />
                            ))}
                        </div>
                    )}
                </aside>
            </div>
        </section>
    );
}

function LoadingState() {
    return (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(360px,0.7fr)]">
            <div
                className="rounded-2xl p-2.5"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
                <div className="skeleton h-[58vh] min-h-[440px] rounded-xl" />
            </div>

            <div className="space-y-4">
                <div
                    className="overflow-hidden rounded-2xl"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                    <div className="skeleton aspect-[4/3]" />
                    <div className="p-5 space-y-3">
                        <div className="skeleton h-4 w-2/3 rounded-lg" />
                        <div className="skeleton h-3 w-full rounded-lg" />
                        <div className="skeleton h-3 w-1/2 rounded-lg" />
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-2xl"
                            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                        >
                            <div className="skeleton aspect-[16/10]" />
                            <div className="p-4 space-y-2">
                                <div className="skeleton h-3 w-3/4 rounded-lg" />
                                <div className="skeleton h-3 w-1/2 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function MapSkeleton() {
    return (
        <div className="skeleton flex h-[58vh] min-h-[440px] items-center justify-center rounded-xl">
            <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
                style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
            />
        </div>
    );
}
