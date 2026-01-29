import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://breakmywebsite.com";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Break My Website - Master System Design Through Interactive Learning",
    template: "%s | Break My Website",
  },
  description: "Master system design concepts through interactive visualizations, real-world demos, and hands-on examples. Learn auto-scaling, fault tolerance, caching strategies, circuit breakers, and more.",
  applicationName: "Break My Website",
  keywords: [
    "system design",
    "software architecture",
    "distributed systems",
    "auto scaling",
    "fault tolerance",
    "circuit breaker",
    "caching strategies",
    "load balancing",
    "microservices",
    "system design interview",
    "interactive learning",
    "notification system",
    "url shortener",
    "rate limiting",
    "system design tutorial",
    "software engineering",
    "scalability",
    "high availability",
    "system design patterns",
  ],
  authors: [{ name: "Break My Website", url: siteUrl }],
  creator: "Break My Website",
  publisher: "Break My Website",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Break My Website - Master System Design Through Interactive Learning",
    description: "Master system design concepts through interactive visualizations, real-world demos, and hands-on examples. Learn auto-scaling, fault tolerance, caching, circuit breakers, and more.",
    siteName: "Break My Website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Break My Website - Master System Design",
    description: "Master system design through interactive visualizations and real-world examples.",
    creator: "@breakmywebsite",
    site: "@breakmywebsite",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication", // Changed from WebSite to SoftwareApplication
    "name": "Break My Website",
    "description": "Master system design and chaos engineering through interactive simulations. Inject latency, crash databases, and learn to build resilient architecture.",
    "url": siteUrl,
    "applicationCategory": "EducationalApplication", // Tells Google it's an educational tool
    "operatingSystem": "Web",
    "inLanguage": "en-US",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Break My Website",
      "url": siteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`,
      },
      "sameAs": [
        "https://twitter.com/breakmywebsite",
        "https://github.com/breakmywebsite",
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
