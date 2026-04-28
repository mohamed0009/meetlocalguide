import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact MeetLocalGuide for bookings, custom itineraries, and partnership inquiries.",
};

export default function ContactPage() {
  return (
    <section className="shell py-10 sm:py-14">
      <span className="kicker">Contact</span>
      <h1 className="brand-font mt-3 text-3xl font-extrabold sm:text-4xl">Talk with our travel concierge team</h1>
      <p className="mt-4 max-w-2xl text-sm text-[var(--text-secondary)]">
        Need custom itineraries, private groups, or help with your booking? Reach out and we will respond within 24 hours.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Contact Details</h2>
          <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
            <li>Email: hello@meetlocalguide.com</li>
            <li>Phone: +212 5 24 00 00 00</li>
            <li>Hours: Mon - Sat, 09:00 - 19:00</li>
          </ul>
        </div>
        <form className="glass-card rounded-2xl p-5 sm:p-6">
          <label className="mb-3 block text-sm">
            <span className="mb-1 block">Name</span>
            <input className="dark-input h-11 w-full rounded-xl px-3 py-2" required />
          </label>
          <label className="mb-3 block text-sm">
            <span className="mb-1 block">Email</span>
            <input type="email" className="dark-input h-11 w-full rounded-xl px-3 py-2" required />
          </label>
          <label className="mb-4 block text-sm">
            <span className="mb-1 block">Message</span>
            <textarea className="dark-input min-h-32 w-full rounded-xl px-3 py-2" required />
          </label>
          <button className="glow-btn w-full rounded-xl px-5 py-2.5 text-sm sm:w-auto touch-target" type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
}
