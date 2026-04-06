import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Register",
    description:
        "Create your MeetLocalGuide account to book tours and connect with local Moroccan guides.",
};

export default function RegisterPage() {
    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2">
                <h1 className="brand-heading text-4xl">Create your account</h1>
                <p className="text-sm text-[var(--ink-soft)]">
                    Join in less than a minute and start planning your Morocco trip with confidence.
                </p>
            </div>

            <form className="space-y-4">
                <label className="block space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)]">Full name</span>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--ocean-600)]"
                    />
                </label>

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
                        placeholder="Create a strong password"
                        className="w-full rounded-xl border border-[var(--line)] px-3 py-2 outline-none focus:border-[var(--ocean-600)]"
                    />
                </label>

                <button type="submit" className="gradient-button w-full rounded-xl px-4 py-3 text-sm font-semibold">
                    Create Account
                </button>
            </form>

            <p className="text-sm text-[var(--ink-soft)]">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-[var(--terracotta-700)] hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}