"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, setAuthTokens, setStoredUser, type AuthResponse } from "@/lib/api-client";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            {children}
        </span>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!agreed) {
            setError("Please accept the Terms of Service to continue.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const data = await api.post<AuthResponse>("/auth/register", {
                email,
                password,
                displayName,
            });
            setAuthTokens(data.accessToken, data.refreshToken);
            setStoredUser(data.user);
            router.push("/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-7">
            <div className="space-y-2">
                <h1 className="brand-font text-3xl font-700" style={{ color: "var(--text-primary)" }}>
                    Create your account
                </h1>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Join in less than a minute and start planning your Morocco trip with confidence.
                </p>
            </div>

            {error && (
                <div
                    className="rounded-xl px-4 py-3 text-sm"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "#dc2626" }}
                >
                    {error}
                </div>
            )}

            <form id="register-form" className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                    <FieldLabel>Full name</FieldLabel>
                    <input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        required
                        minLength={2}
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                    />
                </label>

                <label className="block">
                    <FieldLabel>Email</FieldLabel>
                    <input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                    />
                </label>

                <label className="block">
                    <FieldLabel>Password</FieldLabel>
                    <input
                        id="register-password"
                        type="password"
                        placeholder="Create a strong password"
                        required
                        minLength={8}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="dark-input w-full rounded-xl px-3.5 py-2.5 text-sm"
                    />
                    <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Min 8 chars — must include upper, lower, number, and special character.
                    </p>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        className="mt-0.5 accent-[var(--accent)]"
                        checked={agreed}
                        onChange={e => setAgreed(e.target.checked)}
                    />
                    <span className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        I agree to the{" "}
                        <a href="#" style={{ color: "var(--accent)" }}>Terms of Service</a>{" "}
                        and{" "}
                        <a href="#" style={{ color: "var(--accent)" }}>Privacy Policy</a>.
                    </span>
                </label>

                <button
                    id="register-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="glow-btn mt-1 w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60"
                >
                    {loading ? "Creating account…" : "Create Account"}
                </button>
            </form>

            <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold transition-colors duration-200" style={{ color: "var(--accent)" }}>
                    Log in
                </Link>
            </p>
        </div>
    );
}
