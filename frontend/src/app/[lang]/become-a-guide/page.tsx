import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Become A Guide",
  description: "Join MeetLocalGuide as a verified local expert and grow your travel business.",
};

const benefits = [
  "Reach international travelers",
  "Manage availability with simple tools",
  "Get paid securely on every booking",
];

export default function BecomeAGuidePage() {
  return (
    <section className="shell py-10 sm:py-14">
      <span className="kicker">Partner Program</span>
      <h1 className="brand-font mt-3 text-3xl font-extrabold sm:text-4xl">Become a local guide on MeetLocalGuide</h1>
      <p className="mt-4 max-w-2xl text-sm text-[var(--text-secondary)]">
        Build your profile, publish experiences, and grow your bookings with a premium global audience.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {benefits.map((item) => (
          <article key={item} className="glass-card rounded-2xl p-4 sm:p-5 text-sm">
            {item}
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/auth/register" className="glow-btn w-full rounded-xl px-6 py-3 text-center text-sm sm:w-auto touch-target">
          Apply Now
        </Link>
        <Link href="/contact" className="ghost-btn w-full rounded-xl px-6 py-3 text-center text-sm sm:w-auto touch-target">
          Talk to Partnerships
        </Link>
      </div>
    </section>
  );
}
