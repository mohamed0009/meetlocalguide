import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-brand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meetlocalguide.com"),
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
    url: "https://www.meetlocalguide.com",
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
      className={`${manrope.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col page-atmosphere">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
