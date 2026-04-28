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

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const data = await api.post<AuthResponse>("/auth/login", { email, password });
            setAuthTokens(data.accessToken, data.refreshToken);
            setStoredUser(data.user);
            const isAdmin = data.user.roles.includes("ROLE_ADMIN");
            router.push(isAdmin ? "/admin" : "/dashboard");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-7">
            <div className="space-y-2">
                <h1 className="brand-font text-3xl font-700" style={{ color: "var(--text-primary)" }}>
                    Welcome back
                </h1>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Access your bookings, saved tours, and traveler preferences.
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

            <form id="login-form" className="space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                    <FieldLabel>Email</FieldLabel>
                    <input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="dark-input h-11 w-full rounded-xl px-3.5 py-2.5 text-sm"
                    />
                </label>

                <label className="block">
                    <FieldLabel>Password</FieldLabel>
                    <input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="dark-input h-11 w-full rounded-xl px-3.5 py-2.5 text-sm"
                    />
                </label>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "var(--text-muted)" }}>
                        <input type="checkbox" className="rounded" />
                        Remember me
                    </label>
                    <a href="#" className="text-xs transition-colors duration-200" style={{ color: "var(--accent)" }}>
                        Forgot password?
                    </a>
                </div>

                <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="glow-btn mt-1 w-full rounded-xl py-3 text-sm font-semibold disabled:opacity-60 touch-target"
                >
                    {loading ? "Logging in…" : "Log In"}
                </button>
            </form>

            <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>or continue with</span>
                <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            </div>

            <button
                id="login-google-btn"
                type="button"
                className="ghost-btn w-full rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 touch-target"
            >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.2 10.23c0-.7-.06-1.38-.17-2.03H10v3.84h5.19a4.44 4.44 0 0 1-1.93 2.9v2.41h3.12c1.83-1.68 2.88-4.16 2.88-7.12Z" fill="#4285F4" />
                    <path d="M10 20c2.62 0 4.82-.87 6.42-2.35l-3.12-2.41c-.87.58-1.98.93-3.3.93-2.53 0-4.68-1.71-5.45-4.01H1.36v2.49A9.99 9.99 0 0 0 10 20Z" fill="#34A853" />
                    <path d="M4.55 12.16A5.97 5.97 0 0 1 4.24 10c0-.75.13-1.48.31-2.16V5.35H1.36A9.99 9.99 0 0 0 0 10c0 1.62.38 3.14 1.06 4.5l3.49-2.34Z" fill="#FBBC05" />
                    <path d="M10 3.98c1.42 0 2.7.49 3.7 1.45L16.49 2.9C14.82 1.34 12.62.4 10 .4A9.99 9.99 0 0 0 1.36 5.35L4.55 7.7C5.32 5.4 7.47 3.98 10 3.98Z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>

            <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                New traveler?{" "}
                <Link href="/auth/register" className="font-semibold transition-colors duration-200" style={{ color: "var(--accent)" }}>
                    Create an account
                </Link>
            </p>
        </div>
    );
}
