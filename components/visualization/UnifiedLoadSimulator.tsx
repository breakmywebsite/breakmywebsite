import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Square, Users, Clock, CheckCircle2, XCircle, Zap, Flame, Snowflake } from "lucide-react";
import { SystemVersion, VERSION_THEMES, getMetricsConfig } from "./types";

interface UnifiedLoadSimulatorProps {
  version: SystemVersion;
  systemType: "url" | "notification";
  onSimulationChange?: (isRunning: boolean) => void;
  onLoadChange?: (userCount: number) => void;
}

const UnifiedLoadSimulator = ({ 
  version, 
  systemType,
  onSimulationChange,
  onLoadChange 
}: UnifiedLoadSimulatorProps) => {
  const [userCount, setUserCount] = useState([100]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({ success: 0, failed: 0, avgLatency: 0, throughput: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const theme = VERSION_THEMES[version];
  const metricsConfig = useMemo(() => getMetricsConfig(version), [version]);

  const config = useMemo(() => ({
    maxThroughput: metricsConfig.maxThroughput,
    baseLatency: metricsConfig.targetLatency,
    failureRate: version === "basic" ? 0.15 : version === "advanced" ? 0.05 : 0.01,
    processingSpeed: version === "basic" ? 15 : version === "advanced" ? 50 : 100,
  }), [metricsConfig, version]);

  const users = userCount[0];

  const calculateETA = () => {
    const requestsPerSecond = Math.min(config.maxThroughput, users * 10);
    const totalRequests = users * 10;
    const seconds = totalRequests / requestsPerSecond;
    if (seconds < 60) return `${Math.ceil(seconds)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const startSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setResults({ success: 0, failed: 0, avgLatency: 0, throughput: 0 });
    onSimulationChange?.(true);

    const totalRequests = users * 10;
    const requestsPerTick = Math.ceil(totalRequests / 50);
    let processed = 0;
    let successCount = 0;
    let failedCount = 0;
    let totalLatency = 0;

    intervalRef.current = setInterval(() => {
      processed += requestsPerTick;
      
      const batchSuccess = Math.round(requestsPerTick * (1 - config.failureRate * (users > config.maxThroughput / 10 ? 2 : 1)));
      const batchFailed = requestsPerTick - batchSuccess;
      
      successCount += batchSuccess;
      failedCount += batchFailed;
      
      const loadFactor = Math.min(users / (config.maxThroughput / 10), 3);
      const latency = config.baseLatency * loadFactor + Math.random() * 10;
      totalLatency += latency * requestsPerTick;

      const progressPercent = Math.min((processed / totalRequests) * 100, 100);
      setProgress(progressPercent);
      
      setResults({
        success: successCount,
        failed: failedCount,
        avgLatency: Math.round(totalLatency / processed),
        throughput: Math.round(processed / ((progressPercent / 100) * parseFloat(calculateETA()) || 1)),
      });

      if (progressPercent >= 100) {
        clearInterval(intervalRef.current!);
        setIsRunning(false);
        onSimulationChange?.(false);
      }
    }, 100);
  };

  const stopSimulation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    onSimulationChange?.(false);
  };

  useEffect(() => {
    onLoadChange?.(users);
  }, [users, onLoadChange]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const isOverloaded = users > config.maxThroughput / 10;
  const entityName = systemType === "url" ? "Users" : "Subscribers";

  // Visual user dots
  const renderUserDots = () => {
    const maxVisible = 50;
    const displayCount = Math.min(users, maxVisible);
    const scale = users > maxVisible ? users / maxVisible : 1;

    return (
      <div className="flex flex-wrap gap-1 justify-center py-3">
        {Array.from({ length: displayCount }).map((_, i) => {
          const actualIndex = Math.floor(i * scale);
          const isProcessed = (actualIndex / users) < (progress / 100);
          
          return (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                isProcessed ? "" : "bg-muted"
              } ${!isProcessed && isRunning ? "animate-pulse" : ""}`}
              style={{
                backgroundColor: isProcessed ? theme.color : undefined,
                transform: isProcessed ? "scale(1.1)" : "scale(1)",
                opacity: isProcessed ? 1 : 0.4
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-5 w-5" style={{ color: theme.color }} />
          Load Simulator: {theme.name}
          {users > 1000 && <Flame className="h-4 w-4 text-orange-500 animate-pulse ml-auto" />}
          {users <= 100 && <Snowflake className="h-4 w-4 text-blue-400 ml-auto" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Count Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Number of {entityName}</span>
            <span className="font-mono font-bold" style={{ color: isOverloaded ? "#ef4444" : theme.color }}>
              {users.toLocaleString()}
            </span>
          </div>
          <Slider
            value={userCount}
            onValueChange={setUserCount}
            min={10}
            max={10000}
            step={10}
            disabled={isRunning}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>10</span>
            <span>100</span>
            <span>1K</span>
            <span>10K</span>
          </div>
        </div>

        {/* Visual User Representation */}
        <div className="min-h-[60px] flex items-center justify-center border border-border/50 rounded-lg bg-secondary/20">
          {renderUserDots()}
        </div>

        {/* Warning if overloaded */}
        {isOverloaded && !isRunning && (
          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            System will be overloaded! Max capacity: {(config.maxThroughput / 10).toLocaleString()} {entityName.toLowerCase()}
          </div>
        )}

        {/* ETA */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Est. Time:</span>
          </div>
          <span className="font-mono">{calculateETA()}</span>
        </div>

        {/* Progress Bar */}
        {(isRunning || progress > 0) && (
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-200 relative overflow-hidden"
                style={{ width: `${progress}%`, backgroundColor: theme.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>
        )}

        {/* Results */}
        {progress > 0 && (
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-success/20">
              <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-success" />
              <p className="font-bold font-mono">{results.success.toLocaleString()}</p>
              <p className="text-muted-foreground">Success</p>
            </div>
            <div className="p-2 rounded-lg bg-destructive/20">
              <XCircle className="h-4 w-4 mx-auto mb-1 text-destructive" />
              <p className="font-bold font-mono">{results.failed.toLocaleString()}</p>
              <p className="text-muted-foreground">Failed</p>
            </div>
            <div className="p-2 rounded-lg bg-warning/20">
              <Clock className="h-4 w-4 mx-auto mb-1 text-warning" />
              <p className="font-bold font-mono">{results.avgLatency}ms</p>
              <p className="text-muted-foreground">Latency</p>
            </div>
            <div className="p-2 rounded-lg bg-secondary/30">
              <Zap className="h-4 w-4 mx-auto mb-1" style={{ color: theme.color }} />
              <p className="font-bold font-mono">{results.throughput.toLocaleString()}</p>
              <p className="text-muted-foreground">/sec</p>
            </div>
          </div>
        )}

        {/* Expected Time at Different Scales */}
        {!isRunning && progress === 0 && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded bg-secondary/30">
              <p className="font-mono font-bold">{version === "basic" ? "50s" : version === "advanced" ? "2s" : "0.2s"}</p>
              <p className="text-muted-foreground">100 {entityName.toLowerCase()}</p>
            </div>
            <div className="p-2 rounded bg-secondary/30">
              <p className="font-mono font-bold">{version === "basic" ? "8.3m" : version === "advanced" ? "20s" : "2s"}</p>
              <p className="text-muted-foreground">10K {entityName.toLowerCase()}</p>
            </div>
            <div className="p-2 rounded bg-secondary/30">
              <p className="font-mono font-bold">{version === "basic" ? "2.8h" : version === "advanced" ? "3.3m" : "20s"}</p>
              <p className="text-muted-foreground">1M {entityName.toLowerCase()}</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button 
              onClick={startSimulation} 
              className="flex-1 gap-2" 
              style={{ backgroundColor: theme.color }}
            >
              <Play className="h-4 w-4" />
              Run Load Test
            </Button>
          ) : (
            <Button onClick={stopSimulation} variant="destructive" className="flex-1 gap-2">
              <Square className="h-4 w-4" />
              Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedLoadSimulator;
