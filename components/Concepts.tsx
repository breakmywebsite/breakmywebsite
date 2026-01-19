import ConceptCard from "@/components/ConceptCard";
import { 
  Zap, 
  Clock, 
  Shield, 
  RefreshCw, 
  GitBranch, 
  Server,
  Lock,
  Activity
} from "lucide-react";

const concepts = [
  {
    title: "Rate Limiting",
    description: "Protect your services from abuse with token buckets, sliding windows, and adaptive limits.",
    icon: <Clock className="h-5 w-5" />,
    color: "primary" as const,
  },
  {
    title: "Caching Strategies",
    description: "Understand cache-aside, write-through, and cache invalidation patterns.",
    icon: <Zap className="h-5 w-5" />,
    color: "success" as const,
  },
  {
    title: "Circuit Breakers",
    description: "Prevent cascading failures with fault tolerance patterns and graceful degradation.",
    icon: <Shield className="h-5 w-5" />,
    color: "warning" as const,
  },
  {
    title: "Eventual Consistency",
    description: "Navigate CAP theorem trade-offs with real-world consistency examples.",
    icon: <RefreshCw className="h-5 w-5" />,
    color: "destructive" as const,
  },
  {
    title: "Load Balancing",
    description: "Distribute traffic effectively with round-robin, least-connections, and weighted algorithms.",
    icon: <GitBranch className="h-5 w-5" />,
    color: "primary" as const,
  },
  {
    title: "Database Sharding",
    description: "Scale horizontally with partitioning strategies and handle cross-shard queries.",
    icon: <Server className="h-5 w-5" />,
    color: "success" as const,
  },
  {
    title: "Concurrency Control",
    description: "Master locks, semaphores, and optimistic vs pessimistic locking patterns.",
    icon: <Lock className="h-5 w-5" />,
    color: "warning" as const,
  },
  {
    title: "Health Monitoring",
    description: "Implement health checks, metrics collection, and alerting strategies.",
    icon: <Activity className="h-5 w-5" />,
    color: "destructive" as const,
  },
];

const Concepts = () => {
  return (
    <section id="concepts" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-sm font-mono text-primary mb-4 block">// CORE CONCEPTS</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Master the Fundamentals
          </h2>
          <p className="text-muted-foreground">
            Small, focused examples that explain essential system design patterns. 
            Each concept includes interactive demos and failure scenarios.
          </p>
        </div>

        {/* Concepts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 max-w-6xl mx-auto">
          {concepts.map((concept) => (
            <ConceptCard key={concept.title} {...concept} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Concepts;
