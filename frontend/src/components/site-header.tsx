"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Compass } from "lucide-react";
import { useI18n, useLocalizedHref } from "@/i18n/provider";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
    const { dict } = useI18n();
    const localize = useLocalizedHref();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navItems = [
        { href: "/destinations", label: "Destinations" },
        { href: "/experiences", label: "Experiences" },
        { href: "/tours", label: dict.nav.tours },
        { href: "/guides", label: dict.nav.guides },
        { href: "/about", label: "About" },
    ];

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 24);
        handler();
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    return (
        <>
            <header
                className="sticky top-0 z-50 transition-all duration-300"
                style={{
                    background: scrolled
                        ? "rgba(255, 255, 255, 0.88)"
                        : "transparent",
                    backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
                    WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
                    borderBottom: scrolled
                        ? "1px solid rgba(0,0,0,0.06)"
                        : "1px solid transparent",
                    boxShadow: scrolled
                        ? "0 4px 32px rgba(0,0,0,0.05)"
                        : "none",
                }}
            >
                <div className="shell flex items-center justify-between gap-4 py-4">
                    {/* Logo */}
                    <Link href={localize("/")} id="header-logo" className="flex items-center gap-2 group">
                        <Compass
                            className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45"
                            style={{ color: "var(--accent)" }}
                            aria-hidden="true"
                        />
                        <span
                            className="brand-font text-[18px] sm:text-[22px] font-500 tracking-tight mt-0.5"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Meet<span style={{ color: "var(--accent)" }}>Local</span>Guide
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={localize(item.href)}
                                className="group relative py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300"
                                style={{ color: "var(--text-secondary)" }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                                }}
                            >
                                {item.label}
                                <span
                                    className="absolute -bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[var(--accent)] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"
                                />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden items-center gap-4 md:flex">
                        <LanguageSwitcher compact />
                        <Link
                            href={localize("/auth/login")}
                            id="header-login-btn"
                            className="text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300"
                            style={{ color: "var(--text-primary)" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
                        >
                            {dict.nav.login}
                        </Link>
                        <Link
                            href={localize("/tours")}
                            id="header-explore-btn"
                            className="rounded-full px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-white transition-transform duration-300 hover:scale-105"
                            style={{ background: "var(--accent)", boxShadow: "0 4px 14px var(--accent-glow)" }}
                        >
                            {dict.nav.browseTours}
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <LanguageSwitcher compact />
                        <button
                            id="mobile-menu-toggle"
                            aria-label="Toggle mobile menu"
                            onClick={() => setMobileOpen((v) => !v)}
                            className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-lg transition-colors duration-200 touch-target"
                            style={{
                                background: mobileOpen ? "var(--accent-subtle)" : "transparent",
                                color: mobileOpen ? "var(--accent)" : "var(--text-secondary)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        id="mobile-nav-drawer"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="fixed inset-x-0 top-[64px] z-40 md:hidden"
                        style={{
                            background: "rgba(255,255,255,0.97)",
                            backdropFilter: "blur(24px)",
                            borderBottom: "1px solid var(--border)",
                        }}
                    >
                        <nav className="shell py-6 flex flex-col gap-2" aria-label="Mobile navigation">
                            {navItems.map((item, i) => (
                                <motion.div
                                    key={item.href}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={localize(item.href)}
                                        onClick={() => setMobileOpen(false)}
                                        className="block py-3 text-sm font-semibold uppercase tracking-[0.1em] transition-colors duration-200 touch-target"
                                        style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                                            (e.currentTarget as HTMLElement).style.paddingLeft = "8px";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                                            (e.currentTarget as HTMLElement).style.paddingLeft = "0px";
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="mt-6 flex flex-col gap-3">
                                <Link
                                    href={localize("/auth/login")}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-center"
                                    style={{ color: "var(--text-primary)", border: "1px solid var(--border)" }}
                                >
                                    {dict.nav.login}
                                </Link>
                                <Link
                                    href={localize("/tours")}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-center text-white"
                                    style={{ background: "var(--accent)" }}
                                >
                                    {dict.nav.browseTours}
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
