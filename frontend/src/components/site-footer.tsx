import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="mt-20 border-t border-[var(--line)] bg-[#fff9ef]">
            <div className="container-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <h3 className="brand-heading text-2xl font-semibold">MeetLocalGuide</h3>
                    <p className="mt-3 text-sm text-[var(--ink-soft)]">
                        A curated marketplace connecting travelers with trusted Moroccan local guides.
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--ocean-800)]">
                        Explore
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
                        <li>
                            <Link href="/tours" className="hover:text-[var(--terracotta-700)]">
                                Tour Listings
                            </Link>
                        </li>
                        <li>
                            <Link href="/guides/salma-medina" className="hover:text-[var(--terracotta-700)]">
                                Top Guides
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/register" className="hover:text-[var(--terracotta-700)]">
                                Join as Guide
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--ocean-800)]">
                        Regions
                    </h4>
                    <ul className="mt-4 space-y-2 text-sm text-[var(--ink-soft)]">
                        <li>Marrakech</li>
                        <li>Fes</li>
                        <li>Chefchaouen</li>
                        <li>Sahara</li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--ocean-800)]">
                        Contact
                    </h4>
                    <p className="mt-4 text-sm text-[var(--ink-soft)]">hello@meetlocalguide.com</p>
                    <p className="text-sm text-[var(--ink-soft)]">+212 5 24 00 00 00</p>
                    <p className="mt-3 text-xs text-[var(--ink-soft)]">Serving travelers from USA, UK, and France.</p>
                </div>
            </div>
            <div className="border-t border-[var(--line)] py-4 text-center text-xs text-[var(--ink-soft)]">
                2026 MeetLocalGuide. All rights reserved.
            </div>
        </footer>
    );
}