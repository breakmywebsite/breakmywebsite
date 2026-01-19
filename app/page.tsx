import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedSystems from "@/components/FeaturedSystems";
import Concepts from "@/components/Concepts";
import HowItWorks from "@/components/HowItWorks";
import ReviewService from "@/components/ReviewService";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://breakmywebsite.com";

export const metadata: Metadata = {
  title: "Home - Learn System Design Interactively",
  description: "Master system design concepts with interactive visualizations. Explore auto-scaling, fault tolerance, circuit breakers, caching strategies, notification systems, URL shorteners, and more.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Break My Website - Interactive System Design Learning",
    description: "Master system design concepts with interactive visualizations and real-world examples.",
    siteName: "Break My Website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Break My Website - Interactive System Design Learning",
    description: "Master system design concepts with interactive visualizations and real-world examples.",
    creator: "@breakmywebsite",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Break My Website',
    description: 'Master system design concepts through interactive visualizations and real-world examples',
    url: 'https://breakmywebsite.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://breakmywebsite.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Break My Website',
    url: 'https://breakmywebsite.com',
    logo: 'https://breakmywebsite.com/logo.png',
    description: 'Interactive system design learning platform',
    sameAs: [
      'https://twitter.com/breakmywebsite',
      'https://github.com/breakmywebsite',
    ],
  };

  const educationalJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'System Design Mastery',
    description: 'Learn system design through interactive visualizations',
    provider: {
      '@type': 'Organization',
      name: 'Break My Website',
      url: 'https://breakmywebsite.com',
    },
    educationalLevel: 'Intermediate to Advanced',
    teaches: [
      'Auto Scaling',
      'Fault Tolerance',
      'Circuit Breaker Pattern',
      'Caching Strategies',
      'Distributed Systems',
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalJsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <FeaturedSystems />
        <Concepts />
        <HowItWorks />
        <ReviewService />
      </main>
      <Footer />
    </div>
  );
}
