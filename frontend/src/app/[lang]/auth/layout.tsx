import { Compass } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="page-wrapper min-h-screen flex items-center justify-center py-12 px-4">
            {/* Background glow */}
            <div
                className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(0,0,0,0.12) 0%, transparent 70%)",
                    filter: "blur(40px)",
                }}
            />

            <div
                className="relative w-full max-w-5xl overflow-hidden rounded-3xl"
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-card)",
                }}
            >
                <div className="grid lg:grid-cols-[1fr_1fr]">
                    {/* Left panel — brand side */}
                    <div
                        className="relative hidden items-end p-10 lg:flex bg-cover bg-center"
                        style={{
                            backgroundImage: `linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 100%), url("/images/DSC08368-Pano-45.jpg")`,
                            borderRight: "1px solid var(--border)",
                        }}
                    >
                        {/* Glow orb */}
                        <div
                            className="absolute -top-10 -left-10 h-64 w-64 rounded-full"
                            style={{
                                background: "radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)",
                                filter: "blur(30px)",
                            }}
                        />

                        <div className="relative z-10 space-y-6">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2.5">
                                <span
                                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                                    style={{
                                        background: "var(--accent)",
                                        boxShadow: "0 0 20px var(--accent-glow)",
                                    }}
                                >
                                    <Compass className="h-4 w-4 text-white" />
                                </span>
                                <span className="brand-font text-lg font-700">
                                    Meet<span style={{ color: "var(--accent)" }}>Local</span>Guide
                                </span>
                            </Link>

                            <span className="kicker inline-block">Welcome</span>
                            <h2
                                className="brand-font text-3xl font-700 leading-tight"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Your Moroccan journey deserves a{" "}
                                <span style={{ color: "var(--accent)" }}>local perspective.</span>
                            </h2>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                Build your traveler account, save favorites, and book verified local experts in minutes.
                            </p>

                            {/* Trust badges */}
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                {[
                                    { value: "4.9★", label: "Average rating" },
                                    { value: "200+", label: "Local guides" },
                                    { value: "12K+", label: "Travelers" },
                                    { value: "Free", label: "Cancellation" },
                                ].map(({ value, label }) => (
                                    <div
                                        key={label}
                                        className="rounded-xl p-3"
                                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)" }}
                                    >
                                        <p className="text-base font-700" style={{ color: "var(--accent)" }}>{value}</p>
                                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right panel — form */}
                    <div
                        className="px-6 py-10 sm:px-10"
                        style={{ background: "var(--bg-elevated)" }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}