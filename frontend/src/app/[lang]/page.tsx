import type { Metadata } from "next";
import { getAllTours, getAllGuides } from "@/lib/mock-data";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover handcrafted Moroccan tours led by trusted local guides in Marrakech, Fes, Sahara, and beyond.",
};

export default function HomePage() {
  const tours = getAllTours();
  const guides = getAllGuides();
  return <HomeClient tours={tours} guides={guides} />;
}
