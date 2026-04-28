import type { Metadata } from "next";
import ExperienceList from "./ExperienceList";
import { Compass } from "lucide-react";

export const metadata: Metadata = {
    title: "Explore Experiences Map",
    description:
        "Discover Moroccan experiences on an interactive map. Filter by city, category, duration, price, and rating to find your perfect local guide activity.",
    alternates: {
        canonical: "/explore",
    },
    openGraph: {
        title: "Explore Experiences in Morocco | MeetLocalGuide",
        description:
            "Browse cultural, desert, adventure, and food experiences with map-first discovery.",
        url: "https://meetlocalguide.com/explore",
        type: "website",
    },
};

export default function ExplorePage() {
    return (
        <div className="page-wrapper">
            {/* Page header */}
            <div
                className="relative overflow-hidden border-b bg-cover bg-center"
                style={{
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.85) 0%, var(--bg-elevated) 100%), url("/images/DSC08790-76.jpg")`,
                    borderColor: "var(--border)",
                }}
            >
                {/* Background grid */}
                <div
                    className="absolute inset-0 hero-grid-lines opacity-40"
                />
                {/* Top glow */}
                <div
                    className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2"
                    style={{
                        background: "radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, transparent 70%)",
                        filter: "blur(20px)",
                    }}
                />

                <div className="shell relative z-10 py-10 sm:py-14">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="kicker">
                            <Compass className="h-3 w-3" />
                            Experiences Map Explorer
                        </span>
                    </div>
                    <h1
                        className="brand-font text-3xl font-700 leading-tight sm:text-4xl lg:text-5xl"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Explore Morocco with{" "}
                        <span style={{ color: "var(--accent)", textShadow: "0 0 30px rgba(0,0,0,0.35)" }}>
                            local guides
                        </span>
                        , city by city.
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
                        Compare curated experiences on an interactive map, then refine by category,
                        budget, duration, and rating to find the right activity for your trip.
                    </p>
                </div>
            </div>

            {/* Main content */}
            <div className="shell py-8">
                <ExperienceList />
            </div>
        </div>
    );
}
