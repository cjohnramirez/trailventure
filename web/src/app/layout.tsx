import type { Metadata, Viewport } from "next";
import { Alumni_Sans, Geist, Geist_Mono } from "next/font/google";

import { earlyAccessBannerScript } from "@/components/layout/early-access-banner";
import { Providers } from "@/components/providers";

import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const alumniSans = Alumni_Sans({
  variable: "--font-alumni-sans",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TrailVenture · Tour packages across the Philippines and beyond",
    template: "%s · TrailVenture",
  },
  description:
    "Search tour packages by destination, date and budget, compare tiers and itineraries, and book. TrailVenture is an early-access portfolio project.",
  applicationName: "TrailVenture",
  openGraph: { type: "website", siteName: "TrailVenture", locale: "en_PH" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#131413" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${alumniSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: earlyAccessBannerScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
