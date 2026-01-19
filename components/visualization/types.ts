// Centralized types for visualization components
export type SystemVersion = "basic" | "advanced" | "legendary";

export type VersionTheme = {
  color: string;
  name: string;
  bgClass: string;
  textClass: string;
};

export const VERSION_THEMES: Record<SystemVersion, VersionTheme> = {
  basic: {
    color: "#ef4444",
    name: "Basic",
    bgClass: "bg-destructive/20",
    textClass: "text-destructive",
  },
  advanced: {
    color: "#eab308",
    name: "Advanced",
    bgClass: "bg-warning/20",
    textClass: "text-warning",
  },
  legendary: {
    color: "#22c55e",
    name: "Legendary",
    bgClass: "bg-success/20",
    textClass: "text-success",
  },
};

export interface SimulationStats {
  processed: number;
  success: number;
  failed: number;
  avgLatency: number;
  throughput: number;
  cacheHits?: number;
  retries?: number;
}

export interface FlowNode {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: string;
  color: string;
}

export interface FlowConfig {
  nodes: FlowNode[];
  showCache: boolean;
  showQueue: boolean;
  showPartitions: boolean;
  parallelism: number;
  processingSpeed: number;
  failureRate: number;
  cacheHitRate: number;
}

export const getFlowConfig = (version: SystemVersion, systemType: "url" | "notification"): FlowConfig => {
  const baseConfigs: Record<SystemVersion, Partial<FlowConfig>> = {
    basic: {
      showCache: false,
      showQueue: false,
      showPartitions: false,
      parallelism: 1,
      processingSpeed: 500,
      failureRate: 0.2,
      cacheHitRate: 0,
    },
    advanced: {
      showCache: true,
      showQueue: true,
      showPartitions: false,
      parallelism: 3,
      processingSpeed: 150,
      failureRate: 0.08,
      cacheHitRate: 0.7,
    },
    legendary: {
      showCache: true,
      showQueue: true,
      showPartitions: true,
      parallelism: 10,
      processingSpeed: 20,
      failureRate: 0.02,
      cacheHitRate: 0.85,
    },
  };

  return {
    nodes: [],
    ...baseConfigs[version],
  } as FlowConfig;
};

export interface MetricsConfig {
  targetRps: number;
  targetLatency: number;
  targetCacheHit: number;
  targetDbLoad: number;
  targetThroughput: number;
  maxThroughput: number;
}

export const getMetricsConfig = (version: SystemVersion): MetricsConfig => {
  switch (version) {
    case "basic":
      return {
        targetRps: 100,
        targetLatency: 250,
        targetCacheHit: 0,
        targetDbLoad: 95,
        targetThroughput: 80,
        maxThroughput: 100,
      };
    case "advanced":
      return {
        targetRps: 5000,
        targetLatency: 25,
        targetCacheHit: 70,
        targetDbLoad: 35,
        targetThroughput: 4500,
        maxThroughput: 5000,
      };
    case "legendary":
      return {
        targetRps: 50000,
        targetLatency: 5,
        targetCacheHit: 85,
        targetDbLoad: 15,
        targetThroughput: 48000,
        maxThroughput: 50000,
      };
  }
};
