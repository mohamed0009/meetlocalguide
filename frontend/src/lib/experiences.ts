import experiencesData from "@/lib/data/experiences.json";

export type Experience = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  city: string;
  region: string;
  category: string;
  rating: number;
  reviewCount: number;
  priceMad: number;
  durationHours: number;
  maxGroupSize: number;
  meetingPoint: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
};

export type ExperienceFilterValues = {
  query: string;
  category: string;
  city: string;
  priceRange: string;
  duration: string;
  minRating: string;
};

type ExperienceRecord = Omit<Experience, "coordinates"> & {
  coordinates: {
    lat: number;
    lng: number;
  };
};

const records = experiencesData as ExperienceRecord[];

export const experiences: Experience[] = records.map((record) => ({
  ...record,
  coordinates: {
    lat: Number(record.coordinates.lat),
    lng: Number(record.coordinates.lng),
  },
}));

export const defaultExperienceFilters: ExperienceFilterValues = {
  query: "",
  category: "all",
  city: "all",
  priceRange: "all",
  duration: "all",
  minRating: "all",
};

export function getExperienceFilterOptions(items: Experience[]) {
  const categories = Array.from(new Set(items.map((item) => item.category))).sort((a, b) =>
    a.localeCompare(b)
  );
  const cities = Array.from(new Set(items.map((item) => item.city))).sort((a, b) =>
    a.localeCompare(b)
  );

  return {
    categories,
    cities,
  };
}

function matchRange(value: number, range: string): boolean {
  if (range === "all") {
    return true;
  }

  if (range.endsWith("+")) {
    const minValue = Number(range.slice(0, -1));
    return Number.isFinite(minValue) ? value >= minValue : true;
  }

  const [minRaw, maxRaw] = range.split("-");
  const minValue = Number(minRaw);
  const maxValue = Number(maxRaw);

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) {
    return true;
  }

  return value >= minValue && value <= maxValue;
}

export function filterExperiences(
  items: Experience[],
  filters: ExperienceFilterValues
): Experience[] {
  const normalizedQuery = filters.query.trim().toLowerCase();
  const minRating = filters.minRating === "all" ? undefined : Number(filters.minRating);

  return items.filter((item) => {
    const matchesQuery =
      !normalizedQuery ||
      [item.title, item.summary, item.city, item.region, item.category].some((field) =>
        field.toLowerCase().includes(normalizedQuery)
      );
    const matchesCategory = filters.category === "all" || item.category === filters.category;
    const matchesCity = filters.city === "all" || item.city === filters.city;
    const matchesPrice = matchRange(item.priceMad, filters.priceRange);
    const matchesDuration = matchRange(item.durationHours, filters.duration);
    const matchesRating = minRating === undefined || item.rating >= minRating;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesCity &&
      matchesPrice &&
      matchesDuration &&
      matchesRating
    );
  });
}

export function formatMad(value: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDuration(hours: number): string {
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    if (remainingHours === 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    }

    return `${days} day${days > 1 ? "s" : ""} ${remainingHours}h`;
  }

  if (Number.isInteger(hours)) {
    return `${hours}h`;
  }

  return `${hours.toFixed(1)}h`;
}
