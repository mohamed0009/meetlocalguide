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
  tags: string[];
  spots: number;
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
      "/images/DSC08508-3.jpg",
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
      "/images/DSC08616-28.jpg",
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
      "/images/DSC08706-53.jpg",
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
      "/images/DSC08975-56.jpg",
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
      "/images/DSC09467-3.jpg",
    gallery: [
      "/images/DSC09467-3.jpg",
      "/images/DSC09468-4.jpg",
      "/images/DSC09470-5.jpg",
    ],
    highlights: [
      "Sunrise viewpoint over ochre dunes",
      "Guided cultural stop at a village cooperative",
      "Private camp lounge with tea ceremony",
    ],
    includes: ["Private transport", "Lunch", "Mineral water", "Photography pauses"],
    meetingPoint: "Jemaa el-Fnaa south gate",
    featured: true,
    tags: ["Desert", "Cultural"],
    spots: 3,
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
      "/images/DSC09418-74.jpg",
    gallery: [
      "/images/DSC09418-74.jpg",
      "/images/DSC09413-71.jpg",
      "/images/DSC09414-72.jpg",
    ],
    highlights: [
      "Morning bakery tasting",
      "Leather and brass artisan demos",
      "Historic madrasa architecture reading",
    ],
    includes: ["Guide", "Tasting samples", "Workshop entry"],
    meetingPoint: "Bab Bou Jeloud fountain",
    featured: true,
    tags: ["Medina", "Food"],
    spots: 5,
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
      "/images/Atlas Mountains in spring Morocco.jpg",
    gallery: [
      "/images/Atlas Mountains in spring Morocco.jpg",
      "/images/DSC07748-1.jpg",
      "/images/DSC07826-36.jpg",
    ],
    highlights: [
      "Guided ridge hike with map brief",
      "Family lunch in a Berber village",
      "Tea stop overlooking valley farms",
    ],
    includes: ["Transport", "Lunch", "Guide assistance", "Trail support"],
    meetingPoint: "Koutoubia parking lane",
    featured: true,
    tags: ["Hiking", "Nature"],
    spots: 4,
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
      "/images/DSC09308-36.jpg",
    gallery: [
      "/images/DSC09308-36.jpg",
      "/images/DSC09306-35.jpg",
      "/images/DSC09301-33.jpg",
    ],
    highlights: [
      "Blue quarter walking route",
      "Photo composition coaching",
      "Sunset terrace break",
    ],
    includes: ["Guide", "Photo route map"],
    meetingPoint: "Plaza Uta el-Hammam",
    featured: false,
    tags: ["Photography", "Walking"],
    spots: 8,
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
      "/images/DSC08368-Pano-45.jpg",
    gallery: [
      "/images/DSC08368-Pano-45.jpg",
      "/images/DSC08362-44.jpg",
      "/images/DSC08361-43.jpg",
    ],
    highlights: [
      "Fresh harbor fish market stop",
      "Rampart walk with wind viewpoints",
      "Coastal lunch reservation",
    ],
    includes: ["Guide", "Lunch reservation", "Local tasting"],
    meetingPoint: "Port gate entrance",
    featured: false,
    tags: ["Coastal", "Cultural"],
    spots: 6,
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
      "/images/DSC08483-61.jpg",
    gallery: [
      "/images/DSC08483-61.jpg",
      "/images/DSC08485-62.jpg",
      "/images/DSC09009-Pano-3.jpg",
    ],
    highlights: [
      "Sunset camel caravan",
      "Premium desert camp suite",
      "Night-sky storytelling session",
    ],
    includes: ["Camp stay", "Dinner and breakfast", "Guide", "4x4 transfers"],
    meetingPoint: "Merzouga center meeting lot",
    featured: false,
    tags: ["Overnight", "Desert"],
    spots: 2,
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

export function getAllGuides(): Guide[] {
  return guides;
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