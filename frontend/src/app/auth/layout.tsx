export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="container-shell py-10 sm:py-14">
            <div className="card-surface grid min-h-[640px] overflow-hidden rounded-[2rem] lg:grid-cols-[1fr_1fr]">
                <div className="hero-grid relative hidden bg-[#fff4e6] p-10 lg:block">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--sand-200)]/40 via-transparent to-[var(--ocean-100)]/60" />
                    <div className="relative max-w-sm space-y-6">
                        <span className="section-kicker">Welcome to MeetLocalGuide</span>
                        <h2 className="brand-heading text-4xl leading-tight">
                            Your Moroccan journey deserves a local perspective.
                        </h2>
                        <p className="text-[var(--ink-soft)]">
                            Build your traveler account, save favorites, and book verified local experts in minutes.
                        </p>
                    </div>
                </div>
                <div className="bg-white px-6 py-10 sm:px-10">{children}</div>
            </div>
        </section>
    );
}