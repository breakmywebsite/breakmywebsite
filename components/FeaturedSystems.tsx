import SystemCard from "@/components/SystemCard";
import { Link, Bell, MessageSquare, Database, Search, ShoppingCart } from "lucide-react";

const systems = [
  {
    title: "URL Shortener",
    description: "A complete URL shortening service with analytics. Explore rate limiting, caching strategies, and hash collision handling.",
    difficulty: "Beginner" as const,
    status: "Live" as const,
    failurePoints: 4,
    tags: ["caching", "hashing", "rate-limiting"],
    icon: <Link className="h-6 w-6" />,
    demoUrl: "/demo/url-shortener",
  },
  {
    title: "Notification System",
    description: "Real-time notification delivery with multiple channels. Learn about message queues, delivery guarantees, and fan-out patterns.",
    difficulty: "Intermediate" as const,
    status: "Live" as const,
    failurePoints: 6,
    tags: ["queue", "pub-sub", "delivery"],
    icon: <Bell className="h-6 w-6" />,
    demoUrl: "/demo/notification-system",
  },
  {
    title: "Chat Application",
    description: "Real-time messaging with presence detection. Understand WebSocket handling, message ordering, and offline sync.",
    difficulty: "Intermediate" as const,
    status: "Live" as const,
    failurePoints: 5,
    tags: ["websocket", "ordering", "consistency"],
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    title: "Distributed Cache",
    description: "Multi-node caching layer with eviction policies. Explore cache coherency, thundering herd, and invalidation strategies.",
    difficulty: "Advanced" as const,
    status: "Live" as const,
    failurePoints: 7,
    tags: ["distributed", "eviction", "coherency"],
    icon: <Database className="h-6 w-6" />,
  },
  {
    title: "Search Engine",
    description: "Full-text search with autocomplete and ranking. Learn inverted indexes, relevance scoring, and query optimization.",
    difficulty: "Advanced" as const,
    status: "Coming Soon" as const,
    failurePoints: 8,
    tags: ["indexing", "ranking", "sharding"],
    icon: <Search className="h-6 w-6" />,
  },
  {
    title: "E-Commerce Cart",
    description: "Shopping cart with inventory management. Handle race conditions, stock reservations, and checkout flows.",
    difficulty: "Intermediate" as const,
    status: "Coming Soon" as const,
    failurePoints: 5,
    tags: ["transactions", "inventory", "concurrency"],
    icon: <ShoppingCart className="h-6 w-6" />,
  },
];

const FeaturedSystems = () => {
  return (
    <section id="systems" className="py-24 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-sm font-mono text-primary mb-4 block">// FEATURED SYSTEMS</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Real Systems. Real Problems.
          </h2>
          <p className="text-muted-foreground">
            Each system is a fully functional demo with intentional design limitations. 
            Explore, stress-test, and understand why systems fail.
          </p>
        </div>

        {/* Systems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => (
            <SystemCard key={system.title} {...system} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSystems;
