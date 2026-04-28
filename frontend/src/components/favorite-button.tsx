"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { api, getAccessToken, ApiError } from "@/lib/api-client";

type Props = {
  tourId: string;
  size?: "sm" | "md";
};

export function FavoriteButton({ tourId, size = "md" }: Props) {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }
    api.get<{ favorited: boolean }>(`/favorites/${tourId}/check`)
      .then((r) => setFavorited(r.favorited))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tourId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!getAccessToken()) {
      window.location.href = "/auth/login";
      return;
    }
    if (busy) return;
    setBusy(true);
    const next = !favorited;
    setFavorited(next);
    try {
      if (next) {
        await api.post(`/favorites/${tourId}`, {});
      } else {
        await api.delete(`/favorites/${tourId}`);
      }
    } catch (err) {
      setFavorited(!next);
      if (err instanceof ApiError && err.status === 401) {
        window.location.href = "/auth/login";
      }
    } finally {
      setBusy(false);
    }
  }

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const btnSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center rounded-full ${btnSize}`}
        style={{ background: "rgba(8,8,14,0.55)", backdropFilter: "blur(6px)" }}
      />
    );
  }

  return (
    <button
      type="button"
      id={`fav-btn-${tourId}`}
      onClick={toggle}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={favorited}
      disabled={busy}
      className={`flex items-center justify-center rounded-full transition-all duration-200 ${btnSize}`}
      style={{
        background: favorited ? "var(--accent)" : "rgba(8,8,14,0.55)",
        backdropFilter: "blur(6px)",
        border: favorited ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.15)",
        color: favorited ? "#fff" : "rgba(255,255,255,0.85)",
        opacity: busy ? 0.7 : 1,
        transform: busy ? "scale(0.95)" : "scale(1)",
      }}
    >
      <Heart
        className={iconSize}
        style={{ fill: favorited ? "currentColor" : "none" }}
      />
    </button>
  );
}
