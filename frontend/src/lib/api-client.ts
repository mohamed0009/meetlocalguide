const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api/v1";

// ── Token helpers (browser only) ──────────────────────────────────────────

export type StoredUser = {
  id: string;
  email: string;
  accountStatus: string;
  roles: string[];
};

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mlg_access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mlg_refresh_token");
}

export function setAuthTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem("mlg_access_token", accessToken);
  localStorage.setItem("mlg_refresh_token", refreshToken);
}

export function clearAuthTokens(): void {
  localStorage.removeItem("mlg_access_token");
  localStorage.removeItem("mlg_refresh_token");
  localStorage.removeItem("mlg_user");
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("mlg_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser): void {
  localStorage.setItem("mlg_user", JSON.stringify(user));
}

export function isAdmin(): boolean {
  return getStoredUser()?.roles.includes("ROLE_ADMIN") ?? false;
}

// ── Token refresh ─────────────────────────────────────────────────────────

async function tryRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearAuthTokens();
      return null;
    }
    const data = await res.json();
    setAuthTokens(data.accessToken, data.refreshToken);
    return data.accessToken as string;
  } catch {
    return null;
  }
}

// ── Core fetch wrapper ────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _retry = true
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && _retry) {
    const newToken = await tryRefresh();
    if (newToken) return apiFetch<T>(path, options, false);
    clearAuthTokens();
    if (typeof window !== "undefined") window.location.href = "/auth/login";
    throw new ApiError(401, "Unauthorized");
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Public API object ─────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: "GET" }),

  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: (path: string) =>
    apiFetch<void>(path, { method: "DELETE" }),
};

// ── Domain types mirroring backend DTOs ──────────────────────────────────

export type AuthResponse = {
  tokenType: string;
  accessToken: string;
  accessTokenExpiresInSeconds: number;
  refreshToken: string;
  user: StoredUser;
};

export type TourSummary = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  city: string;
  durationMinutes: number;
  basePriceAmount: number;
  baseCurrency: string;
  averageRating: number;
  totalReviews: number;
  guideSlug: string;
  guideDisplayName: string;
};

export type TourDetail = TourSummary & {
  description: string;
  region: string;
  country: string;
  meetingPoint: string;
  latitude: number;
  longitude: number;
  maxGroupSize: number;
  status: string;
  featured: boolean;
  tags: string[];
  images: { url: string; altText: string; sortOrder: number }[];
};

export type GuideSummary = {
  id: string;
  slug: string;
  displayName: string;
  city: string;
  country: string;
  verificationStatus: string;
  averageRating: number;
  totalReviews: number;
  languages: string[];
};

export type BookingResponse = {
  id: string;
  status: string;
  travelerId: string;
  travelerEmail: string;
  tourId: string;
  tourSlug: string;
  tourTitle: string;
  startAt: string;
  endAt: string;
  participantCount: number;
  unitPriceAmount: number;
  totalAmount: number;
  currency: string;
  specialRequests: string | null;
  cancellationReason: string | null;
  cancelledAt: string | null;
  createdAt: string;
};

export type PagedResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};
