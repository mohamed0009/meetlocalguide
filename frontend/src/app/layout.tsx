import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-brand",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meetlocalguide.com"),
  title: {
    default: "MeetLocalGuide | Discover Morocco with Local Experts",
    template: "%s | MeetLocalGuide",
  },
  description:
    "Book trusted local guides in Morocco for handcrafted tours, cultural experiences, and unforgettable city adventures.",
  openGraph: {
    title: "MeetLocalGuide",
    description:
      "Discover Morocco with verified local guides and curated experiences.",
    type: "website",
    locale: "en_US",
    url: "https://meetlocalguide.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <QueryProvider>
          <SiteHeader />
          <main className="flex-1 relative z-10">{children}</main>
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
