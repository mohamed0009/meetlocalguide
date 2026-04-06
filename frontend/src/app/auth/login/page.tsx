import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Log In",
    description: "Log in to manage bookings and discover local Moroccan tours.",
};

export default function LoginPage() {
    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2">
                <h1 className="brand-heading text-4xl">Welcome back</h1>
                <p className="text-sm text-[var(--ink-soft)]">Access your bookings, saved tours, and traveler preferences.</p>
            </div>

            <form className="space-y-4">
                <label className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)]">Email</span>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--ocean-600)]"
                    />
                </label>

                <label className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)]">Password</span>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--ocean-600)]"
                    />
                </label>

                <button type="submit" className="gradient-button w-full rounded-xl px-4 py-3 text-sm font-semibold">
                    Log In
                </button>
            </form>

            <p className="text-sm text-[var(--ink-soft)]">
                New traveler?{" "}
                <Link href="/auth/register" className="font-semibold text-[var(--terracotta-700)] hover:underline">
                    Create an account
                </Link>
            </p>
        </div>
    );
}