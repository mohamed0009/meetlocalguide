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
    <section className="shell py-14">
      <span className="kicker">Partner Program</span>
      <h1 className="brand-font mt-3 text-4xl font-extrabold">Become a local guide on MeetLocalGuide</h1>
      <p className="mt-4 max-w-2xl text-sm text-[var(--text-secondary)]">
        Build your profile, publish experiences, and grow your bookings with a premium global audience.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {benefits.map((item) => (
          <article key={item} className="glass-card rounded-2xl p-5 text-sm">
            {item}
          </article>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Link href="/auth/register" className="glow-btn rounded-xl px-6 py-3 text-sm">
          Apply Now
        </Link>
        <Link href="/contact" className="ghost-btn rounded-xl px-6 py-3 text-sm">
          Talk to Partnerships
        </Link>
      </div>
    </section>
  );
}
