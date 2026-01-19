// SEO Utility Functions for Next.js

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://breakmywebsite.com";

export const siteConfig = {
  name: "Break My Website",
  description: "Master system design through interactive visualizations and real-world examples",
  url: siteUrl,
  ogImage: `${siteUrl}/og-image.jpg`,
  links: {
    twitter: "https://twitter.com/breakmywebsite",
    github: "https://github.com/breakmywebsite",
  },
  keywords: [
    "system design",
    "software architecture",
    "distributed systems",
    "scalability",
    "system design interview",
    "software engineering",
  ],
};

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = siteConfig.ogImage,
  url = siteUrl,
  type = "website",
  publishedTime,
  authors = [],
}: SEOProps) {
  const allKeywords = [...siteConfig.keywords, ...keywords];
  
  return {
    title,
    description,
    keywords: allKeywords,
    authors: authors.length > 0 ? authors.map(name => ({ name })) : [{ name: siteConfig.name }],
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@breakmywebsite",
    },
    alternates: {
      canonical: url,
    },
  };
}

// Generate FAQ JSON-LD Schema
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Generate Article JSON-LD Schema
export function generateArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  };
}

// Generate Breadcrumb JSON-LD Schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate SoftwareApplication JSON-LD Schema
export function generateSoftwareSchema({
  name,
  description,
  category,
  offers,
}: {
  name: string;
  description: string;
  category: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: category,
    operatingSystem: "Web",
    offers: offers || {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "100",
    },
  };
}

// Generate HowTo JSON-LD Schema
export function generateHowToSchema({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
