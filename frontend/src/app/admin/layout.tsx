"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarCheck,
    Map,
    Users,
    LogOut,
    Compass,
    ChevronRight,
} from "lucide-react";
import { getAccessToken, getStoredUser, clearAuthTokens, isAdmin as checkIsAdmin } from "@/lib/api-client";

const NAV = [
    { href: "/admin", label: "Overview", Icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", Icon: CalendarCheck },
    { href: "/admin/tours", label: "Tours", Icon: Map },
    { href: "/admin/guides", label: "Guides", Icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = getAccessToken();
        if (!token) { window.location.href = "/auth/login"; return; }
        if (!checkIsAdmin()) { window.location.href = "/dashboard"; return; }
        setReady(true);
    }, []);

    if (!ready) {
        return (
            <div className="page-wrapper">
                <div className="shell py-20 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                </div>
            </div>
        );
    }

    const user = getStoredUser();

    return (
        <div className="flex min-h-[calc(100vh-64px)]">
            {/* Sidebar */}
            <aside
                className="hidden lg:flex w-60 flex-shrink-0 flex-col border-r"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
                {/* Brand */}
                <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
                    <span
                        className="flex h-8 w-8 items-center justify-center rounded-xl"
                        style={{ background: "var(--accent)", boxShadow: "0 0 14px var(--accent-glow)" }}
                    >
                        <Compass className="h-4 w-4 text-white" />
                    </span>
                    <div>
                        <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Admin Panel</p>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>MeetLocalGuide</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV.map(({ href, label, Icon }) => {
                        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                id={`admin-nav-${label.toLowerCase()}`}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                                style={{
                                    background: active ? "var(--accent-dim)" : "transparent",
                                    color: active ? "var(--accent)" : "var(--text-secondary)",
                                    borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                                }}
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                {label}
                                {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + logout */}
                <div className="px-3 pb-4 border-t pt-4 space-y-2" style={{ borderColor: "var(--border)" }}>
                    <div className="px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                            Logged in as
                        </p>
                        <p className="mt-0.5 text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                            {user?.email}
                        </p>
                    </div>
                    <button
                        id="admin-logout-btn"
                        onClick={() => { clearAuthTokens(); window.location.href = "/"; }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#dc2626")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                        <LogOut className="h-4 w-4" />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Mobile top bar */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex border-t" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                {NAV.map(({ href, label, Icon }) => {
                    const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors"
                            style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
                        >
                            <Icon className="h-5 w-5" />
                            {label}
                        </Link>
                    );
                })}
            </div>

            {/* Main content */}
            <main className="flex-1 overflow-auto pb-20 lg:pb-0">
                {children}
            </main>
        </div>
    );
}
