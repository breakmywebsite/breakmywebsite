import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://breakmywebsite.com";

export const metadata: Metadata = {
  title: "System Design Concepts - Interactive Visualizations",
  description: "Learn essential system design concepts through interactive visualizations: Auto-scaling, fault tolerance, traffic patterns, caching strategies, and circuit breakers. Perfect for system design interviews.",
  keywords: [
    "auto scaling",
    "fault tolerance",
    "traffic patterns",
    "cache strategies",
    "circuit breaker pattern",
    "system design concepts",
    "distributed systems",
    "scalability",
    "high availability",
    "system design interview prep",
  ],
  openGraph: {
    type: "website",
    url: `${siteUrl}/concepts`,
    title: "System Design Concepts - Interactive Learning",
    description: "Master auto-scaling, fault tolerance, caching, and more through interactive visualizations.",
    siteName: "Break My Website",
  },
  twitter: {
    card: "summary_large_image",
    title: "System Design Concepts - Interactive Learning",
    description: "Master auto-scaling, fault tolerance, caching, and more through interactive visualizations.",
    creator: "@breakmywebsite",
  },
  alternates: {
    canonical: `${siteUrl}/concepts`,
  },
};

export default function ConceptsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
