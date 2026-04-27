import { NextResponse } from "next/server";
import { experiences } from "@/lib/experiences";

export async function GET() {
  return NextResponse.json(
    {
      data: experiences,
      meta: {
        count: experiences.length,
        generatedAt: new Date().toISOString(),
      },
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
      },
    }
  );
}
