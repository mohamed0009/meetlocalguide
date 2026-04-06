export type Guide = {
  slug: string;
  name: string;
  headline: string;
  bio: string;
  city: string;
  country: string;
  languages: string[];
  yearsExperience: number;
  rating: number;
  totalReviews: number;
  hourlyRateUsd: number;
  specialties: string[];
  heroImage: string;
};

export type Tour = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  city: string;
  durationHours: number;
  priceUsd: number;
  rating: number;
  totalReviews: number;
  guideSlug: string;
  coverImage: string;
  gallery: string[];
  highlights: string[];
  includes: string[];
  meetingPoint: string;
  featured: boolean;
};

export const guides: Guide[] = [
  {
    slug: "yassine-atlas",
    name: "Yassine El Idrissi",
    headline: "Mountain storyteller and Atlas trek planner",
    bio: "Yassine designs small-group adventures around the Atlas valleys, balancing history, local families, and scenic routes.",
    city: "Marrakech",
    country: "Morocco",
    languages: ["English", "French", "Arabic"],
    yearsExperience: 9,
    rating: 4.9,
    totalReviews: 238,
    hourlyRateUsd: 30,
    specialties: ["Atlas villages", "Hiking", "Berber culture"],
    heroImage:
      "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "salma-medina",
    name: "Salma Bensalem",
    headline: "Medina culture curator for food and craft routes",
    bio: "Salma opens doors to artisan workshops, hidden riads, and family kitchens in the old medinas of Morocco.",
    city: "Fes",
    country: "Morocco",
    languages: ["English", "French", "Arabic"],
    yearsExperience: 7,
    rating: 4.8,
    totalReviews: 184,
    hourlyRateUsd: 28,
    specialties: ["Food walks", "Artisan studios", "Medina navigation"],
    heroImage:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "nora-desert",
    name: "Nora Rahali",
    headline: "Sahara expedition host and sunset route specialist",
    bio: "Nora focuses on desert logistics and comfort, from private camp stays to sunrise dune sessions and safe transfers.",
    city: "Merzouga",
    country: "Morocco",
    languages: ["English", "Arabic"],
    yearsExperience: 8,
    rating: 4.9,
    totalReviews: 311,
    hourlyRateUsd: 32,
    specialties: ["Desert camps", "Camel routes", "Photography stops"],
    heroImage:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "hamza-chefchaouen",
    name: "Hamza Tahiri",
    headline: "North Morocco photographer guide",
    bio: "Hamza turns city walks into visual stories across Chefchaouen and nearby mountain viewpoints.",
    city: "Chefchaouen",
    country: "Morocco",
    languages: ["English", "Spanish", "Arabic"],
    yearsExperience: 5,
    rating: 4.7,
    totalReviews: 126,
    hourlyRateUsd: 24,
    specialties: ["Photo tours", "Blue city routes", "Sunrise points"],
    heroImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  },
];

export const tours: Tour[] = [
  {
    slug: "marrakech-desert-immersion",
    title: "Marrakech Desert Immersion",
    shortDescription: "One-day desert route with curated stops and private camp lunch.",
    description:
      "A fast-paced but comfortable route from Marrakech to dramatic arid landscapes, with local stories, scenic breaks, and a private lunch setup.",
    city: "Marrakech",
    durationHours: 10,
    priceUsd: 125,
    rating: 4.9,
    totalReviews: 152,
    guideSlug: "nora-desert",
    coverImage:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Sunrise viewpoint over ochre dunes",
      "Guided cultural stop at a village cooperative",
      "Private camp lounge with tea ceremony",
    ],
    includes: ["Private transport", "Lunch", "Mineral water", "Photography pauses"],
    meetingPoint: "Jemaa el-Fnaa south gate",
    featured: true,
  },
  {
    slug: "fes-medina-storywalk",
    title: "Fes Medina Storywalk",
    shortDescription: "Craft, food, and architecture route through hidden medina corridors.",
    description:
      "Explore layered neighborhoods of Fes with a local expert, tasting regional snacks and meeting artisans in centuries-old workshops.",
    city: "Fes",
    durationHours: 4,
    priceUsd: 49,
    rating: 4.8,
    totalReviews: 203,
    guideSlug: "salma-medina",
    coverImage:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Morning bakery tasting",
      "Leather and brass artisan demos",
      "Historic madrasa architecture reading",
    ],
    includes: ["Guide", "Tasting samples", "Workshop entry"],
    meetingPoint: "Bab Bou Jeloud fountain",
    featured: true,
  },
  {
    slug: "atlas-mountain-daybreak",
    title: "Atlas Mountain Daybreak",
    shortDescription: "Moderate mountain trek with village lunch and panoramic ridge views.",
    description:
      "A day route to the High Atlas foothills focused on comfortable pace, local encounters, and dramatic viewpoints over terraced valleys.",
    city: "Marrakech",
    durationHours: 8,
    priceUsd: 95,
    rating: 4.9,
    totalReviews: 174,
    guideSlug: "yassine-atlas",
    coverImage:
      "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Guided ridge hike with map brief",
      "Family lunch in a Berber village",
      "Tea stop overlooking valley farms",
    ],
    includes: ["Transport", "Lunch", "Guide assistance", "Trail support"],
    meetingPoint: "Koutoubia parking lane",
    featured: true,
  },
  {
    slug: "chefchaouen-blue-alleys",
    title: "Chefchaouen Blue Alleys",
    shortDescription: "Photo-oriented walk through the iconic blue district.",
    description:
      "Capture the calm rhythm of Chefchaouen on a photo-driven route, including rooftop perspective points and less crowded side streets.",
    city: "Chefchaouen",
    durationHours: 3,
    priceUsd: 38,
    rating: 4.7,
    totalReviews: 98,
    guideSlug: "hamza-chefchaouen",
    coverImage:
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Blue quarter walking route",
      "Photo composition coaching",
      "Sunset terrace break",
    ],
    includes: ["Guide", "Photo route map"],
    meetingPoint: "Plaza Uta el-Hammam",
    featured: false,
  },
  {
    slug: "essaouira-coastal-rhythm",
    title: "Essaouira Coastal Rhythm",
    shortDescription: "Harbor, medina walls, and ocean-view lunch in one route.",
    description:
      "A relaxed coastal itinerary through Essaouira's fishing harbor, ramparts, and old medina with tasting moments and open-sea views.",
    city: "Essaouira",
    durationHours: 6,
    priceUsd: 72,
    rating: 4.6,
    totalReviews: 87,
    guideSlug: "salma-medina",
    coverImage:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Fresh harbor fish market stop",
      "Rampart walk with wind viewpoints",
      "Coastal lunch reservation",
    ],
    includes: ["Guide", "Lunch reservation", "Local tasting"],
    meetingPoint: "Port gate entrance",
    featured: false,
  },
  {
    slug: "sahara-camp-under-stars",
    title: "Sahara Camp Under Stars",
    shortDescription: "Overnight premium camp route with sunset dunes and stargazing.",
    description:
      "Travel deep into the Sahara for an overnight camp experience, including sunset camel segment, dinner fire circle, and dawn viewpoints.",
    city: "Merzouga",
    durationHours: 20,
    priceUsd: 210,
    rating: 4.9,
    totalReviews: 261,
    guideSlug: "nora-desert",
    coverImage:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518972559570-0d0e3bf8f63f?auto=format&fit=crop&w=1200&q=80",
    ],
    highlights: [
      "Sunset camel caravan",
      "Premium desert camp suite",
      "Night-sky storytelling session",
    ],
    includes: ["Camp stay", "Dinner and breakfast", "Guide", "4x4 transfers"],
    meetingPoint: "Merzouga center meeting lot",
    featured: false,
  },
];

export function getAllTours(): Tour[] {
  return tours;
}

export function getFeaturedTours(): Tour[] {
  return tours.filter((tour) => tour.featured);
}

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find((tour) => tour.slug === slug);
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getToursByGuide(guideSlug: string): Tour[] {
  return tours.filter((tour) => tour.guideSlug === guideSlug);
}

export function getCities(): string[] {
  const citySet = new Set(tours.map((tour) => tour.city));
  return Array.from(citySet).sort((a, b) => a.localeCompare(b));
}

type TourSearchFilters = {
  query?: string;
  city?: string;
  maxPriceUsd?: number;
  minDurationHours?: number;
};

export function searchTours(filters: TourSearchFilters): Tour[] {
  const query = filters.query?.trim().toLowerCase();

  return tours.filter((tour) => {
    const matchesQuery =
      !query ||
      [tour.title, tour.shortDescription, tour.description, tour.city].some((value) =>
        value.toLowerCase().includes(query)
      );

    const matchesCity = !filters.city || tour.city === filters.city;
    const matchesPrice =
      filters.maxPriceUsd === undefined || tour.priceUsd <= filters.maxPriceUsd;
    const matchesDuration =
      filters.minDurationHours === undefined ||
      tour.durationHours >= filters.minDurationHours;

    return matchesQuery && matchesCity && matchesPrice && matchesDuration;
  });
}