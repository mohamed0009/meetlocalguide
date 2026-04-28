import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn how MeetLocalGuide connects travelers with trusted Moroccan local guides.",
};

export default function AboutPage() {
  return (
    <section className="shell py-14">
      <span className="kicker">About</span>
      <h1 className="brand-font mt-3 text-4xl font-extrabold">Built for meaningful travel in Morocco</h1>
      <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
        MeetLocalGuide is a curated travel marketplace that helps travelers find trusted local experts for authentic experiences.
        We vet every guide profile, optimize booking confidence, and focus on quality-first journeys.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <article className="glass-card rounded-2xl p-5">
          <h2 className="font-semibold">Trust & Safety</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Identity checks, quality reviews, and transparent ratings.</p>
        </article>
        <article className="glass-card rounded-2xl p-5">
          <h2 className="font-semibold">Local Expertise</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Guides with deep regional knowledge and personal storytelling.</p>
        </article>
        <article className="glass-card rounded-2xl p-5">
          <h2 className="font-semibold">Conversion-first UX</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Fast booking flow, clear pricing, and instant confirmation.</p>
        </article>
      </div>
    </section>
  );
}
