import type { Metadata } from "next";
import { getAllTours, getAllGuides } from "@/lib/mock-data";
import { PremiumHomeClient } from "./premium-home-client";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover handcrafted Moroccan tours led by trusted local guides in Marrakech, Fes, Sahara, and beyond.",
};

export default function HomePage() {
  const tours = getAllTours();
  const guides = getAllGuides();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "MeetLocalGuide",
    url: "https://meetlocalguide.com",
    areaServed: "Morocco",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "12000",
    },
    makesOffer: tours.slice(0, 6).map((tour) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "TouristTrip",
        name: tour.title,
        description: tour.shortDescription,
      },
      price: tour.priceUsd,
      priceCurrency: "USD",
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PremiumHomeClient tours={tours} guides={guides} />
    </>
  );
}
