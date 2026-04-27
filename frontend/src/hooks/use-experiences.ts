"use client";

import { useQuery } from "@tanstack/react-query";
import type { Experience } from "@/lib/experiences";

type ExperiencesResponse = {
  data: Experience[];
  meta: {
    count: number;
    generatedAt: string;
  };
};

async function fetchExperiences(): Promise<Experience[]> {
  const response = await fetch("/api/experiences", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unable to load experiences right now.");
  }

  const payload = (await response.json()) as ExperiencesResponse;
  return payload.data;
}

export function useExperiences() {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: fetchExperiences,
  });
}
