import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Clock, Database, TrendingUp, HardDrive, Bell, Globe } from "lucide-react";
import { SystemVersion, VERSION_THEMES, getMetricsConfig } from "./types";

interface UnifiedMetricsDashboardProps {
  version: SystemVersion;
  systemType: "url" | "notification";
  isSimulating?: boolean;
  externalStats?: {
    sent?: number;
    failed?: number;
    totalLatency?: number;
  };
}

const UnifiedMetricsDashboard = ({ 
  version, 
  systemType, 
  isSimulating,
  externalStats 
}: UnifiedMetricsDashboardProps) => {
  const [metrics, setMetrics] = useState({
    rps: 0,
    latency: 0,
    cacheHitRate: 0,
    dbLoad: 0,
    throughput: 0,
  });

  const theme = VERSION_THEMES[version];
  const config = useMemo(() => getMetricsConfig(version), [version]);

  useEffect(() => {
    const interval = setInterval(() => {
      const variance = isSimulating ? 0.1 : 0.02;
      setMetrics({
        rps: Math.round(config.targetRps * (0.9 + Math.random() * variance)),
        latency: Math.round(config.targetLatency * (0.9 + Math.random() * variance)),
        cacheHitRate: Math.round(config.targetCacheHit * (0.95 + Math.random() * 0.1)),
        dbLoad: Math.round(config.targetDbLoad * (0.9 + Math.random() * variance)),
        throughput: Math.round(config.targetThroughput * (0.9 + Math.random() * variance)),
      });
    }, 500);

    return () => clearInterval(interval);
  }, [version, isSimulating, config]);

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const SystemIcon = systemType === "url" ? Globe : Bell;
  const rpsLabel = systemType === "url" ? "req/sec" : "msg/sec";
  const throughputLabel = systemType === "url" ? "URLs/sec" : "Delivered/sec";

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-5 w-5 animate-pulse" style={{ color: theme.color }} />
          Live Metrics: {theme.name}
          <span className="ml-auto flex items-center gap-1 text-xs font-normal text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Simulated
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="text-center p-3 rounded-lg bg-secondary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t opacity-10" style={{ backgroundColor: theme.color }} />
            <Zap className="h-5 w-5 mx-auto mb-1" style={{ color: theme.color }} />
            <p className="text-xl font-bold font-mono">{formatNumber(metrics.rps)}</p>
            <p className="text-xs text-muted-foreground">{rpsLabel}</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-secondary/30">
            <Clock className="h-5 w-5 mx-auto mb-1 text-warning" />
            <p className="text-xl font-bold font-mono">{metrics.latency}<span className="text-xs">ms</span></p>
            <p className="text-xs text-muted-foreground">P99 Latency</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-secondary/30">
            <HardDrive className="h-5 w-5 mx-auto mb-1 text-warning" />
            <p className="text-xl font-bold font-mono">{metrics.cacheHitRate}<span className="text-xs">%</span></p>
            <p className="text-xs text-muted-foreground">{systemType === "url" ? "Cache Hit" : "Queue Eff."}</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-secondary/30">
            <Database className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className={`text-xl font-bold font-mono ${metrics.dbLoad > 80 ? "text-destructive" : metrics.dbLoad > 50 ? "text-warning" : "text-success"}`}>
              {metrics.dbLoad}<span className="text-xs">%</span>
            </p>
            <p className="text-xs text-muted-foreground">{systemType === "url" ? "DB Load" : "Worker Load"}</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-secondary/30 col-span-2 md:col-span-1">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-success" />
            <p className="text-xl font-bold font-mono text-success">{formatNumber(metrics.throughput)}</p>
            <p className="text-xs text-muted-foreground">{throughputLabel}</p>
          </div>
        </div>

        {/* Performance Bars */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{systemType === "url" ? "Cache Efficiency" : "Queue Processing"}</span>
              <span className="font-mono" style={{ color: theme.color }}>{metrics.cacheHitRate}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${metrics.cacheHitRate}%`, backgroundColor: theme.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{systemType === "url" ? "DB Load" : "Worker Utilization"}</span>
              <span className={`font-mono ${metrics.dbLoad > 80 ? "text-destructive" : metrics.dbLoad > 50 ? "text-warning" : "text-success"}`}>
                {metrics.dbLoad}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${metrics.dbLoad}%`, 
                  backgroundColor: metrics.dbLoad > 80 ? "#ef4444" : metrics.dbLoad > 50 ? "#eab308" : "#22c55e" 
                }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Latency Target (50ms)</span>
              <span className={`font-mono ${metrics.latency > 50 ? "text-destructive" : "text-success"}`}>
                {metrics.latency}ms
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden relative">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min((metrics.latency / 300) * 100, 100)}%`,
                  backgroundColor: metrics.latency > 50 ? "#ef4444" : "#22c55e"
                }}
              />
              <div className="absolute top-0 h-full w-0.5 bg-muted-foreground/50" style={{ left: `${(50/300) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2 py-1 rounded-full bg-secondary/50">
              {version === "basic" 
                ? (systemType === "url" ? "No caching" : "Synchronous") 
                : version === "advanced" 
                  ? (systemType === "url" ? "Redis cache" : "Parallel workers") 
                  : (systemType === "url" ? "Distributed cache" : "Partitioned log")}
            </span>
            <span className="px-2 py-1 rounded-full bg-secondary/50">
              {version === "basic" 
                ? "Single instance" 
                : version === "advanced" 
                  ? "3 workers" 
                  : "10+ partitions"}
            </span>
            <span className="px-2 py-1 rounded-full" style={{ backgroundColor: theme.color + "20", color: theme.color }}>
              {version === "basic" ? "~100/s" : version === "advanced" ? "~5K/s" : "~50K/s"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedMetricsDashboard;
