// Re-exports shared SystemDesignCards component with URL shortener data
export { default, type SystemDesignProps } from "@/components/shared/SystemDesignCards";

import type { SystemDesignProps } from "@/components/shared/SystemDesignCards";

export const basicUrlDesign: SystemDesignProps = {
  version: "basic",
  apiDescription: "RESTful endpoints for URL shortening",
  functionalReqs: [
    { name: "Shorten URL", description: "Generate a short code for any valid URL" },
    { name: "Redirect", description: "Redirect short URL to original destination" },
    { name: "Analytics", description: "Track click counts per shortened URL" },
  ],
  nonFunctionalReqs: [
    { name: "Scalability", description: "Handle growing traffic", supported: false },
    { name: "Low Latency", description: "Sub-100ms redirects", supported: false },
    { name: "High Availability", description: "99.9% uptime", supported: false },
    { name: "Durability", description: "No data loss", supported: true },
  ],
  highLevelDesign: {
    description: "Simple single-server architecture with direct database access",
    components: [
      { name: "API Server", description: "Handles URL creation and redirects" },
      { name: "Database", description: "Stores URL mappings and click data" },
    ],
    diagram: `
┌─────────────┐     ┌─────────────────────┐     ┌─────────────┐
│   Client    │────▶│    API Server       │────▶│  Database   │
└─────────────┘     └─────────────────────┘     └─────────────┘
                              │
                              │ Every request hits DB
                              ▼
                    ┌─────────────────────┐
                    │  SELECT * FROM urls │
                    │  WHERE code = ?     │
                    │  (blocking query)   │
                    └─────────────────────┘
`,
  },
  lowLevelDesign: {
    description: "Direct database queries for every operation",
    details: [
      {
        title: "URL Shortening",
        content: `async function shorten(url: string) {
  // Generate random code
  const code = generateCode();

  // Direct DB insert
  await db.query(
    'INSERT INTO urls (code, url)',
    [code, url]
  );

  return { shortUrl: code };
}`,
      },
      {
        title: "Redirect Handler",
        content: `async function redirect(code: string) {
  // DB query for EVERY request
  const result = await db.query(
    'SELECT url FROM urls WHERE code = ?',
    [code]
  );

  // No caching - DB bottleneck!
  return result.rows[0]?.url;
}`,
      },
    ],
  },
  apiEndpoints: [
    {
      method: "POST",
      route: "/api/shorten",
      description: "Create a shortened URL",
      requestBody: `{
  "url": "https://example.com/long-url"
}`,
      responseBody: `{
  "shortCode": "abc123",
  "shortUrl": "https://brk.my/abc123"
}`,
    },
    {
      method: "GET",
      route: "/:code",
      description: "Redirect to original URL (every request hits database)",
      responseBody: `HTTP 302 Redirect
Location: https://example.com/long-url`,
    },
  ],
};

export const advancedUrlDesign: SystemDesignProps = {
  version: "advanced",
  apiDescription: "RESTful endpoints for URL shortening",
  functionalReqs: [
    { name: "Shorten URL", description: "Generate a short code for any valid URL" },
    { name: "Redirect", description: "Redirect short URL to original destination" },
    { name: "Analytics", description: "Track click counts and referrers" },
    { name: "Custom Aliases", description: "Allow users to choose custom short codes" },
  ],
  nonFunctionalReqs: [
    { name: "Scalability", description: "Handle 10K+ req/s with caching", supported: true },
    { name: "Low Latency", description: "Sub-20ms cached redirects", supported: true },
    { name: "High Availability", description: "Single cache point of failure", supported: false },
    { name: "Durability", description: "Data persisted in DB", supported: true },
    { name: "Cache Consistency", description: "Cache invalidation issues", supported: false },
  ],
  highLevelDesign: {
    description: "Cache-through architecture with Redis for hot URLs",
    components: [
      { name: "Load Balancer", description: "Distributes traffic across API servers" },
      { name: "API Servers", description: "Stateless servers handling requests" },
      { name: "Redis Cache", description: "In-memory cache for fast lookups" },
      { name: "Database", description: "Persistent storage for all URLs" },
    ],
    diagram: `
┌─────────────┐     ┌───────────────┐     ┌─────────────────────┐
│   Client    │────▶│ Load Balancer │────▶│    API Servers      │
└─────────────┘     └───────────────┘     └─────────────────────┘
                                                   │
                           ┌───────────────────────┼───────────────────────┐
                           │                       │                       │
                           ▼                       ▼                       ▼
                    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
                    │    Redis    │◀───────▶│    Redis    │◀───────▶│    Redis    │
                    │   (Cache)   │         │   (Cache)   │         │   (Cache)   │
                    └─────────────┘         └─────────────┘         └─────────────┘
                           │                       │                       │
                           └───────────────────────┼───────────────────────┘
                                                   ▼
                                          ┌─────────────────┐
                                          │   PostgreSQL    │
                                          │    (Primary)    │
                                          └─────────────────┘
`,
  },
  lowLevelDesign: {
    description: "Cache-aside pattern with TTL-based expiration",
    details: [
      {
        title: "Cache-Through Read",
        content: `async function getUrl(code: string) {
  // Try cache first
  let url = await redis.get(code);

  if (!url) {
    // Cache miss - query DB
    url = await db.query(
      'SELECT url FROM urls WHERE code = ?',
      [code]
    );

    // Populate cache (TTL: 1 hour)
    await redis.setex(code, 3600, url);
  }

  return url;
}`,
      },
      {
        title: "Write-Through",
        content: `async function createUrl(url: string) {
  const code = generateCode();

  // Write to DB first
  await db.query(
    'INSERT INTO urls (code, url)',
    [code, url]
  );

  // Then update cache
  await redis.setex(code, 3600, url);

  return { shortCode: code };
}`,
      },
      {
        title: "Cache Invalidation",
        content: `// Problem: Stale data
// If URL is updated in DB,
// cache still has old value
// until TTL expires

async function updateUrl(code, newUrl) {
  await db.update(code, newUrl);
  await redis.del(code); // Invalidate
  // Race condition possible!
}`,
      },
      {
        title: "Rate Limiting",
        content: `async function checkRateLimit(ip: string) {
  const key = \`rate:\${ip}\`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  return count <= 100; // 100 req/min
}`,
      },
    ],
  },
  apiEndpoints: [
    {
      method: "POST",
      route: "/api/shorten",
      description: "Create shortened URL with optional custom alias",
      requestBody: `{
  "url": "https://example.com/long-url",
  "customAlias": "my-link" // optional
}`,
      responseBody: `{
  "shortCode": "my-link",
  "shortUrl": "https://brk.my/my-link",
  "expiresAt": null
}`,
    },
    {
      method: "GET",
      route: "/:code",
      description: "Redirect with cache lookup (70% cache hit rate)",
      responseBody: `HTTP 302 Redirect
X-Cache: HIT
X-Response-Time: 12ms`,
    },
    {
      method: "GET",
      route: "/api/stats/:code",
      description: "Get analytics for a shortened URL",
      responseBody: `{
  "code": "my-link",
  "clicks": 1523,
  "uniqueVisitors": 892,
  "topReferrers": ["twitter.com", "linkedin.com"]
}`,
    },
  ],
};

export const legendaryUrlDesign: SystemDesignProps = {
  version: "legendary",
  apiDescription: "RESTful endpoints for URL shortening",
  functionalReqs: [
    { name: "Shorten URL", description: "Generate globally unique short codes" },
    { name: "Redirect", description: "Sub-10ms redirects worldwide via edge" },
    { name: "Real-time Analytics", description: "Stream processing for live stats" },
    { name: "Custom Domains", description: "Bring your own domain support" },
    { name: "Link Management", description: "Edit, expire, and A/B test links" },
  ],
  nonFunctionalReqs: [
    { name: "Scalability", description: "50K+ req/s with horizontal scaling", supported: true },
    { name: "Low Latency", description: "P99 < 10ms via edge caching", supported: true },
    { name: "High Availability", description: "99.99% uptime with multi-region", supported: true },
    { name: "Durability", description: "Replicated across 3 regions", supported: true },
    { name: "Consistency", description: "Eventual consistency with conflict resolution", supported: true },
    { name: "Observability", description: "Full distributed tracing", supported: true },
  ],
  highLevelDesign: {
    description: "Globally distributed architecture with edge caching and event-driven analytics",
    components: [
      { name: "CDN/Edge", description: "Cloudflare Workers at 300+ PoPs" },
      { name: "API Gateway", description: "Rate limiting, auth, routing" },
      { name: "URL Service", description: "Stateless microservice cluster" },
      { name: "Distributed Cache", description: "Redis Cluster with geo-replication" },
      { name: "Database", description: "CockroachDB for global consistency" },
      { name: "Event Stream", description: "Kafka for analytics pipeline" },
    ],
    diagram: `
                              ┌─────────────────────────────────────────┐
                              │           Edge Network (CDN)            │
                              │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │
                              │  │ PoP │  │ PoP │  │ PoP │  │ PoP │    │
                              │  │ US  │  │ EU  │  │ ASIA│  │ ...│    │
                              │  └──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘    │
                              └─────┼────────┼────────┼────────┼───────┘
                                    │        │        │        │
                                    └────────┼────────┘        │
                                             ▼                 │
                              ┌──────────────────────────┐     │
                              │      API Gateway         │◀────┘
                              │  (Auth, Rate Limit)      │
                              └────────────┬─────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
             ┌────────────┐         ┌────────────┐         ┌────────────┐
             │ URL Svc    │         │ URL Svc    │         │ URL Svc    │
             │ (Region A) │         │ (Region B) │         │ (Region C) │
             └─────┬──────┘         └─────┬──────┘         └─────┬──────┘
                   │                      │                      │
         ┌─────────┴──────────┬───────────┴───────────┬──────────┴─────────┐
         ▼                    ▼                       ▼                    ▼
  ┌─────────────┐      ┌─────────────┐        ┌─────────────┐      ┌─────────────┐
  │   Redis     │      │   Redis     │        │ CockroachDB │      │   Kafka     │
  │  (Cluster)  │      │  (Replica)  │        │   (Global)  │      │  (Events)   │
  └─────────────┘      └─────────────┘        └─────────────┘      └─────────────┘
`,
  },
  lowLevelDesign: {
    description: "Edge-first architecture with event sourcing for analytics",
    details: [
      {
        title: "Edge Worker (CDN)",
        content: `// Cloudflare Worker
export default {
  async fetch(request) {
    const code = getCode(request.url);

    // Check edge cache first
    const cached = await caches.default.match(code);
    if (cached) {
      trackClick(code, request); // async
      return Response.redirect(cached);
    }

    // Fallback to origin
    return fetch(\`\${ORIGIN}/\${code}\`);
  }
}`,
      },
      {
        title: "ID Generation",
        content: `// Snowflake-like ID generator
class IdGenerator {
  // 64-bit ID:
  // 41 bits: timestamp (69 years)
  // 10 bits: machine ID (1024 nodes)
  // 12 bits: sequence (4096/ms)

  generate(): bigint {
    const ts = Date.now() - EPOCH;
    const seq = this.sequence++;

    return (BigInt(ts) << 22n) |
           (BigInt(this.machineId) << 12n) |
           BigInt(seq);
  }
}`,
      },
      {
        title: "Analytics Pipeline",
        content: `// Kafka consumer for analytics
async function processClicks() {
  for await (const event of kafka.consume('clicks')) {
    // Aggregate in time windows
    await clickhouse.insert({
      code: event.code,
      timestamp: event.ts,
      geo: event.geo,
      referrer: event.ref,
    });

    // Real-time counters
    await redis.zincrby('trending', 1, event.code);
  }
}`,
      },
      {
        title: "Conflict Resolution",
        content: `// Handle custom alias conflicts
async function createWithAlias(url, alias) {
  try {
    return await db.insert({
      code: alias,
      url: url,
      created: Date.now(),
    });
  } catch (e) {
    if (e.code === 'CONFLICT') {
      // Last-write-wins with timestamp
      const existing = await db.get(alias);
      if (existing.created < Date.now()) {
        return await db.update(alias, url);
      }
    }
    throw e;
  }
}`,
      },
    ],
  },
  apiEndpoints: [
    {
      method: "POST",
      route: "/api/v2/urls",
      description: "Create URL with full options (custom domain, expiry, A/B)",
      requestBody: `{
  "url": "https://example.com/long-url",
  "alias": "promo-2024",
  "domain": "link.mycompany.com",
  "expiresAt": "2024-12-31T23:59:59Z",
  "abTest": {
    "variants": ["url-a", "url-b"],
    "weights": [50, 50]
  }
}`,
      responseBody: `{
  "id": "url_7kj8H2mNpQ",
  "shortUrl": "https://link.mycompany.com/promo-2024",
  "qrCode": "https://api.brk.my/qr/promo-2024",
  "analytics": "https://api.brk.my/analytics/promo-2024"
}`,
    },
    {
      method: "GET",
      route: "/:code",
      description: "Edge-cached redirect with sub-10ms latency",
      responseBody: `HTTP 302 Redirect
CF-Cache-Status: HIT
CF-Ray: 8a1b2c3d4e5f
X-Response-Time: 3ms`,
    },
    {
      method: "GET",
      route: "/api/v2/analytics/:code/realtime",
      description: "WebSocket stream for real-time click analytics",
      responseBody: `{
  "type": "click",
  "timestamp": "2024-01-15T10:30:00Z",
  "geo": { "country": "US", "city": "NYC" },
  "device": "mobile",
  "referrer": "twitter.com"
}`,
    },
  ],
};
