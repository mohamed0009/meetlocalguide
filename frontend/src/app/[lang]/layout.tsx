import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, Space_Grotesk } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { I18nProvider } from "@/i18n/provider";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  hasLocale,
  isRtl,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

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

const SITE_URL = "https://meetlocalguide.com";

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_MA",
};

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(
  props: LayoutProps<"/[lang]">
): Promise<Metadata> {
  const { lang } = await props.params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LOCALE;
  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${dict.meta.siteName} | ${dict.meta.tagline}`,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.home.heroSubtitle,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `${SITE_URL}/${l}`])
      ),
      canonical: `${SITE_URL}/${locale}`,
    },
    openGraph: {
      title: dict.meta.siteName,
      description: dict.home.heroSubtitle,
      type: "website",
      locale: OG_LOCALE[locale] ?? "en_US",
      url: `${SITE_URL}/${locale}`,
    },
  };
}

export default async function RootLayout(props: LayoutProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const dir = isRtl(lang) ? "rtl" : "ltr";

  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}
      >
        <I18nProvider dict={dict} locale={lang}>
          <QueryProvider>
            <SiteHeader />
            <main className="flex-1 relative z-10">{props.children}</main>
            <SiteFooter />
          </QueryProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
