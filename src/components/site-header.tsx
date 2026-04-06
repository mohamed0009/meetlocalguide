import Link from "next/link";

const navItems = [
    { href: "/tours", label: "Tours" },
    { href: "/guides/salma-medina", label: "Guides" },
    { href: "/auth/register", label: "Become a Guide" },
];

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[#fffdf8]/92 backdrop-blur">
            <div className="container-shell flex items-center justify-between gap-3 py-4">
                <Link href="/" className="brand-heading text-2xl font-semibold text-[var(--foreground)]">
                    Meet<span className="text-[var(--terracotta-500)]">Local</span>Guide
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-semibold text-[var(--ink-soft)] transition-colors hover:text-[var(--terracotta-700)]"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <Link
                        href="/auth/login"
                        className="ghost-button rounded-full px-4 py-2 text-sm font-semibold"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/tours"
                        className="gradient-button rounded-full px-4 py-2 text-sm font-semibold"
                    >
                        Explore Tours
                    </Link>
                </div>
            </div>
        </header>
    );
}