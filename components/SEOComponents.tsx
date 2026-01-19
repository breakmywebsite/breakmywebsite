import { ReactNode } from 'react';

// Semantic article wrapper with schema
export function Article({ 
  children, 
  title, 
  author, 
  datePublished 
}: { 
  children: ReactNode; 
  title: string; 
  author?: string; 
  datePublished?: string;
}) {
  return (
    <article 
      itemScope 
      itemType="https://schema.org/Article"
      className="semantic-article"
    >
      <meta itemProp="headline" content={title} />
      {author && <meta itemProp="author" content={author} />}
      {datePublished && <meta itemProp="datePublished" content={datePublished} />}
      {children}
    </article>
  );
}

// Semantic section with proper heading structure
export function Section({
  children,
  title,
  id,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={className}>
      {title && <h2 className="section-title">{title}</h2>}
      {children}
    </section>
  );
}

// Breadcrumb component for navigation
export function Breadcrumb({
  items,
}: {
  items: Array<{ name: string; href: string }>;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li
              key={item.href}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <a itemProp="item" href={item.href}>
                <span itemProp="name">{item.name}</span>
              </a>
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Video component with schema
export function VideoWithSchema({
  title,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  embedUrl,
}: {
  title: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  embedUrl: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    embedUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="video-container">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </>
  );
}

// FAQ component with schema
export function FAQ({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const schema = {
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div itemScope itemType="https://schema.org/FAQPage">
        {faqs.map((faq, index) => (
          <div
            key={index}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 itemProp="name">{faq.question}</h3>
            <div
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Review/Rating component with schema
export function Rating({
  itemName,
  ratingValue,
  bestRating = 5,
  ratingCount,
}: {
  itemName: string;
  ratingValue: number;
  bestRating?: number;
  ratingCount: number;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: itemName,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      bestRating,
      ratingCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div
        itemScope
        itemType="https://schema.org/Product"
      >
        <meta itemProp="name" content={itemName} />
        <div
          itemProp="aggregateRating"
          itemScope
          itemType="https://schema.org/AggregateRating"
        >
          <meta itemProp="ratingValue" content={String(ratingValue)} />
          <meta itemProp="bestRating" content={String(bestRating)} />
          <meta itemProp="ratingCount" content={String(ratingCount)} />
          <span className="rating">
            {ratingValue} / {bestRating} ({ratingCount} reviews)
          </span>
        </div>
      </div>
    </>
  );
}
