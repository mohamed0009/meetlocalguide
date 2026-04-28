"use client";

import Link from "next/link";
import { Compass, MapPin, Mail, Phone, X } from "lucide-react";
import { useLocalizedHref } from "@/i18n/provider";

const exploreLinks = [
    { href: "/destinations", label: "Destinations" },
    { href: "/experiences", label: "Experiences" },
    { href: "/tours", label: "Tour Listings" },
    { href: "/guides/salma-medina", label: "Top Guides" },
    { href: "/become-a-guide", label: "Join as Guide" },
];

const regionLinks = [
    "Marrakech",
    "Fes",
    "Chefchaouen",
    "Sahara",
    "Casablanca",
    "Essaouira",
];

export function SiteFooter() {
    const localize = useLocalizedHref();
    return (
        <footer
            className="relative z-10 mt-24"
            style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border)" }}
        >
            {/* Red glow accent at top */}
            <div
                className="absolute -top-px left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }}
            />

            <div className="shell py-14">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand block */}
                    <div className="lg:col-span-1">
                        <Link href={localize("/")} className="flex items-center gap-2.5 w-fit">
                            <span
                                className="flex h-8 w-8 items-center justify-center rounded-lg"
                                style={{
                                    background: "var(--accent)",
                                    boxShadow: "0 0 16px var(--accent-glow)",
                                }}
                            >
                                <Compass className="h-4 w-4 text-white" />
                            </span>
                            <span className="brand-font text-lg font-700">
                                Meet<span style={{ color: "var(--accent)" }}>Local</span>Guide
                            </span>
                        </Link>

                        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            A curated marketplace connecting international travelers with trusted Moroccan local guides.
                        </p>

                        {/* Socials */}
                        <div className="mt-6 flex items-center gap-3">
                            {(["X", "IG", "GH"] as const).map((label) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200"
                                    style={{
                                        background: "var(--bg-surface)",
                                        border: "1px solid var(--border)",
                                        color: "var(--text-muted)",
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-accent)";
                                        (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                                        (e.currentTarget as HTMLElement).style.background = "var(--accent-subtle)";
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                                        (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                                        (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)";
                                    }}
                                >
                                    {label === "X" ? <X className="h-4 w-4" /> : <span className="text-xs font-bold">{label}</span>}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore links */}
                    <div>
                        <h4
                            className="text-xs font-semibold uppercase tracking-widest mb-5"
                            style={{ color: "var(--accent)" }}
                        >
                            Explore
                        </h4>
                        <ul className="space-y-3">
                            {exploreLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={localize(link.href)}
                                        className="text-sm transition-colors duration-200"
                                        style={{ color: "var(--text-secondary)" }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Regions */}
                    <div>
                        <h4
                            className="text-xs font-semibold uppercase tracking-widest mb-5"
                            style={{ color: "var(--accent)" }}
                        >
                            Regions
                        </h4>
                        <ul className="space-y-3">
                            {regionLinks.map((region) => (
                                <li key={region}>
                                    <Link
                                        href={localize(`/tours?city=${encodeURIComponent(region)}`)}
                                        className="text-sm transition-colors duration-200 flex items-center gap-2"
                                        style={{ color: "var(--text-secondary)" }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                                        }}
                                    >
                                        <MapPin className="h-3 w-3 opacity-50 flex-shrink-0" />
                                        {region}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4
                            className="text-xs font-semibold uppercase tracking-widest mb-5"
                            style={{ color: "var(--accent)" }}
                        >
                            Contact
                        </h4>
                        <div className="space-y-3">
                            <a
                                href="mailto:hello@meetlocalguide.com"
                                className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                                style={{ color: "var(--text-secondary)" }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                                }}
                            >
                                <Mail className="h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                hello@meetlocalguide.com
                            </a>
                            <a
                                href="tel:+2125240000"
                                className="flex items-center gap-2.5 text-sm transition-colors duration-200"
                                style={{ color: "var(--text-secondary)" }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                                }}
                            >
                                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: "var(--accent)" }} />
                                +212 5 24 00 00 00
                            </a>
                            <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                                Serving travelers from USA, UK, and France.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div
                className="shell py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
                style={{ borderTop: "1px solid var(--border)" }}
            >
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    © 2026 MeetLocalGuide. All rights reserved.
                </p>
                <div className="flex items-center gap-5">
                    {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="text-xs transition-colors duration-200"
                            style={{ color: "var(--text-muted)" }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                            }}
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}