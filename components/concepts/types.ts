// Centralized types for system design concepts

export type ConceptCategory = 
  | "scaling"
  | "reliability"
  | "traffic"
  | "data"
  | "distributed"
  | "messaging"
  | "observability";

export interface ConceptDefinition {
  id: string;
  title: string;
  category: ConceptCategory;
  description: string;
  icon: string;
  color: "primary" | "warning" | "destructive" | "success";
  learnMore: string;
  tradeoffs: {
    pros: string[];
    cons: string[];
  };
}

// Server instance for scaling visualizations
export interface ServerInstance {
  id: string;
  status: "healthy" | "unhealthy" | "starting" | "terminating";
  cpu: number;
  memory: number;
  requests: number;
  createdAt: number;
}

// Traffic simulation types
export type TrafficPattern = "steady" | "burst" | "gradual" | "spike" | "regional";

export interface TrafficConfig {
  pattern: TrafficPattern;
  baseRps: number;
  peakRps: number;
  duration: number;
}

// Failure injection types
export type FailureType = "server" | "database" | "cache" | "network" | "none";

export interface FailureConfig {
  type: FailureType;
  affectedNodes: string[];
  duration: number;
  recoveryTime: number;
}

// Architecture comparison
export interface ArchitectureConfig {
  name: string;
  components: ComponentConfig[];
  connections: ConnectionConfig[];
}

export interface ComponentConfig {
  id: string;
  type: "server" | "loadbalancer" | "cache" | "database" | "queue" | "cdn" | "replica" | "shard";
  label: string;
  x: number;
  y: number;
  status?: "healthy" | "unhealthy" | "overloaded";
}

export interface ConnectionConfig {
  from: string;
  to: string;
  label?: string;
  animated?: boolean;
}

// Distributed systems
export type ConsistencyModel = "strong" | "eventual" | "causal";
export type ProcessingGuarantee = "at-least-once" | "at-most-once" | "exactly-once";

// Cache strategies
export type CacheEvictionPolicy = "LRU" | "LFU" | "TTL" | "FIFO";

export interface CacheEntry {
  key: string;
  value: string;
  accessCount: number;
  lastAccess: number;
  ttl: number;
  createdAt: number;
}

// Queue/Messaging
export interface QueueStats {
  depth: number;
  consumerLag: number;
  throughput: number;
  dlqSize: number;
  retryCount: number;
}

// Metrics and observability
export interface SystemMetrics {
  latencyP50: number;
  latencyP99: number;
  errorRate: number;
  qps: number;
  availability: number;
  saturation: number;
}

export interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  metric: string;
  threshold: number;
  currentValue: number;
  triggeredAt: number;
}

// SLO/SLA
export interface SLOConfig {
  name: string;
  target: number;
  current: number;
  budget: number;
  budgetRemaining: number;
}
