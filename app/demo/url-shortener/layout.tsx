import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://breakmywebsite.com";

export const metadata: Metadata = {
  title: "URL Shortener - System Design Demo",
  description: "Build a scalable URL shortener from scratch. Learn about rate limiting, caching, database sharding, analytics, and distributed systems architecture.",
  keywords: [
    "url shortener",
    "short url",
    "rate limiting",
    "redis cache",
    "database sharding",
    "analytics",
    "system design",
    "scalable architecture",
    "distributed systems",
    "link shortener",
    "bit.ly clone",
    "tinyurl system design",
  ],
  openGraph: {
    type: "website",
    url: `${siteUrl}/demo/url-shortener`,
    title: "URL Shortener System Design - Interactive Demo",
    description: "Design and build a scalable URL shortener with rate limiting, caching, and analytics.",
    siteName: "Break My Website",
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Shortener System Design - Interactive Demo",
    description: "Design and build a scalable URL shortener with rate limiting, caching, and analytics.",
    creator: "@breakmywebsite",
  },
  alternates: {
    canonical: `${siteUrl}/demo/url-shortener`,
  },
};

export default function UrlShortenerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
