import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, Pause, RotateCcw, Globe, Server, Database, Zap, User, 
  ArrowRight, ArrowLeft, Bell, MessageSquare, Layers 
} from "lucide-react";
import { SystemVersion, VERSION_THEMES, getFlowConfig } from "./types";

interface Particle {
  id: number;
  x: number;
  y: number;
  originY: number;
  status: "pending" | "to-lb" | "to-server" | "to-cache" | "to-db" | "at-db" | "returning" | "complete" | "failed";
  speed: number;
  delay: number;
  isCacheHit: boolean;
  waitTime: number;
  currentWait: number;
}

interface UnifiedFlowAnimationProps {
  version: SystemVersion;
  systemType: "url" | "notification";
  title?: string;
}

const UnifiedFlowAnimation = ({ version, systemType, title }: UnifiedFlowAnimationProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({ cacheHits: 0, dbHits: 0, completed: 0, failed: 0 });
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const config = useMemo(() => getFlowConfig(version, systemType), [version, systemType]);
  const theme = VERSION_THEMES[version];
  const particleCount = 8;

  // Layout positions
  const userX = 30;
  const lbX = 80;
  const serverX = 140;
  const cacheX = 200;
  const dbX = 260;
  const centerY = 140;

  const initParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const isCacheHit = config.showCache && Math.random() < config.cacheHitRate;
      const originY = 40 + (i % 4) * 55;
      newParticles.push({
        id: i,
        x: userX,
        y: originY,
        originY,
        status: "pending",
        speed: 4 + (version === "legendary" ? 2 : version === "advanced" ? 1 : 0),
        delay: Math.floor(i / config.parallelism) * 400,
        isCacheHit,
        waitTime: isCacheHit ? 100 : version === "basic" ? 800 : version === "advanced" ? 400 : 200,
        currentWait: 0,
      });
    }
    return newParticles;
  }, [config, version]);

  const startAnimation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setStats({ cacheHits: 0, dbHits: 0, completed: 0, failed: 0 });
    setParticles(initParticles());
    startTimeRef.current = Date.now();
  };

  const stopAnimation = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const resetAnimation = () => {
    stopAnimation();
    setParticles([]);
    setStats({ cacheHits: 0, dbHits: 0, completed: 0, failed: 0 });
  };

  useEffect(() => {
    if (!isRunning) return;

    let lastTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;
      const elapsed = now - startTimeRef.current;

      setParticles(prev => {
        const updated = prev.map(p => {
          if (p.status === "complete" || p.status === "failed") return p;
          if (elapsed < p.delay) return p;

          const speed = p.speed;
          let newX = p.x;
          let newY = p.y;
          let newStatus: Particle["status"] = p.status;
          let newWait = p.currentWait;

          switch (p.status) {
            case "pending":
              newStatus = "to-lb";
              break;

            case "to-lb":
              if (p.x < lbX) {
                newX = Math.min(p.x + speed, lbX);
              }
              if (p.y < centerY) {
                newY = Math.min(p.y + speed * 0.5, centerY);
              } else if (p.y > centerY) {
                newY = Math.max(p.y - speed * 0.5, centerY);
              }
              if (newX >= lbX && Math.abs(newY - centerY) < 2) {
                newY = centerY;
                newStatus = "to-server";
              }
              break;

            case "to-server":
              if (p.x < serverX) {
                newX = Math.min(p.x + speed, serverX);
              } else {
                newStatus = config.showCache ? "to-cache" : "to-db";
              }
              break;

            case "to-cache":
              if (p.x < cacheX) {
                newX = Math.min(p.x + speed, cacheX);
              } else {
                newStatus = p.isCacheHit ? "at-db" : "to-db";
              }
              break;

            case "to-db":
              if (p.x < dbX) {
                newX = Math.min(p.x + speed, dbX);
              } else {
                newStatus = "at-db";
              }
              break;

            case "at-db":
              newWait = p.currentWait + deltaTime;
              if (newWait >= p.waitTime) {
                newStatus = "returning";
              }
              break;

            case "returning":
              if (p.x > userX) {
                newX = Math.max(p.x - speed * 1.5, userX);
              }
              if (p.y < p.originY) {
                newY = Math.min(p.y + speed, p.originY);
              } else if (p.y > p.originY) {
                newY = Math.max(p.y - speed, p.originY);
              }
              if (newX <= userX && Math.abs(newY - p.originY) < 2) {
                const finalStatus: Particle["status"] = Math.random() < config.failureRate ? "failed" : "complete";
                newStatus = finalStatus;
              }
              break;
          }

          return { ...p, x: newX, y: newY, status: newStatus, currentWait: newWait };
        });

        return updated;
      });

      // Check if all done
      setParticles(current => {
        const allDone = current.every(p => p.status === "complete" || p.status === "failed");
        if (allDone && current.length > 0) {
          setIsRunning(false);
        }
        return current;
      });

      if (isRunning) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, config]);

  // Update stats
  useEffect(() => {
    let cacheHits = 0, dbHits = 0, completed = 0, failed = 0;
    particles.forEach(p => {
      if (p.status === "complete") {
        completed++;
        if (p.isCacheHit) cacheHits++;
        else dbHits++;
      } else if (p.status === "failed") {
        failed++;
      }
    });
    setStats({ cacheHits, dbHits, completed, failed });
  }, [particles]);

  const SystemIcon = systemType === "url" ? Globe : Bell;
  const displayTitle = title || (systemType === "url" ? "URL Request Flow" : "Notification Flow");

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <SystemIcon className="h-5 w-5" style={{ color: theme.color }} />
          {displayTitle}: {theme.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-[280px] bg-secondary/20 rounded-lg border border-border/50 overflow-hidden">
          {/* Direction indicators */}
          <div className="absolute top-2 left-2 flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowRight className="h-3 w-3" /> Request
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3 w-3" /> Response
          </div>

          {/* Users */}
          <div className="absolute" style={{ left: userX - 15, top: 15 }}>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">Users</span>
            </div>
          </div>

          {/* Load Balancer / Gateway */}
          <div className="absolute" style={{ left: lbX - 20, top: centerY - 25 }}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isRunning ? "animate-pulse" : ""}`} style={{ backgroundColor: theme.color + "30" }}>
              {systemType === "url" ? (
                <Globe className="h-5 w-5" style={{ color: theme.color }} />
              ) : (
                <MessageSquare className="h-5 w-5" style={{ color: theme.color }} />
              )}
            </div>
            <span className="text-xs text-muted-foreground block text-center mt-1">
              {systemType === "url" ? "LB" : "Gateway"}
            </span>
          </div>

          {/* Server / Worker */}
          <div className="absolute" style={{ left: serverX - 20, top: centerY - 25 }}>
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <Server className="h-5 w-5 text-success" />
            </div>
            <span className="text-xs text-muted-foreground block text-center mt-1">
              {systemType === "url" ? "API" : "Worker"}
            </span>
          </div>

          {/* Cache / Queue */}
          {config.showCache && (
            <div className="absolute" style={{ left: cacheX - 20, top: centerY - 25 }}>
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                {config.showQueue ? (
                  <Layers className="h-5 w-5 text-warning" />
                ) : (
                  <Zap className="h-5 w-5 text-warning" />
                )}
              </div>
              <span className="text-xs text-muted-foreground block text-center mt-1">
                {systemType === "url" ? "Redis" : "Queue"}
              </span>
            </div>
          )}

          {/* Database / Store */}
          <div className="absolute" style={{ left: dbX - 20, top: centerY - 25 }}>
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground block text-center mt-1">
              {config.showPartitions ? "Kafka" : "DB"}
            </span>
          </div>

          {/* Partitions for legendary */}
          {config.showPartitions && (
            <>
              <div className="absolute" style={{ left: dbX - 25, top: centerY + 40 }}>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-4 w-4 text-primary/60" />
                </div>
                <span className="text-xs text-muted-foreground/60 block text-center">P1</span>
              </div>
              <div className="absolute" style={{ left: dbX + 15, top: centerY + 40 }}>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database className="h-4 w-4 text-primary/60" />
                </div>
                <span className="text-xs text-muted-foreground/60 block text-center">P2</span>
              </div>
            </>
          )}

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1={userX + 10} y1={centerY - 10} x2={lbX} y2={centerY - 10} stroke={theme.color} strokeWidth="2" strokeOpacity="0.3" />
            <line x1={lbX + 10} y1={centerY - 10} x2={serverX} y2={centerY - 10} stroke={theme.color} strokeWidth="2" strokeOpacity="0.3" />
            {config.showCache && (
              <line x1={serverX + 10} y1={centerY - 10} x2={cacheX} y2={centerY - 10} stroke="#eab308" strokeWidth="2" strokeOpacity="0.3" />
            )}
            <line x1={config.showCache ? cacheX + 10 : serverX + 10} y1={centerY - 10} x2={dbX} y2={centerY - 10} stroke="#14b8a6" strokeWidth="2" strokeOpacity="0.3" />
            
            {/* Return path */}
            <line x1={dbX} y1={centerY + 10} x2={config.showCache ? cacheX + 10 : serverX + 10} y2={centerY + 10} stroke="#22c55e" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 2" />
            {config.showCache && (
              <line x1={cacheX} y1={centerY + 10} x2={serverX + 10} y2={centerY + 10} stroke="#22c55e" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 2" />
            )}
            <line x1={serverX} y1={centerY + 10} x2={lbX + 10} y2={centerY + 10} stroke="#22c55e" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 2" />
            <line x1={lbX} y1={centerY + 10} x2={userX + 10} y2={centerY + 10} stroke="#22c55e" strokeWidth="2" strokeOpacity="0.2" strokeDasharray="4 2" />
          </svg>

          {/* Animated Particles */}
          {particles.map(p => {
            const isDone = p.status === "complete" || p.status === "failed";
            const isReturning = p.status === "returning";
            const isWaiting = p.status === "at-db";
            
            let particleColor = theme.color;
            if (isReturning) particleColor = "#22c55e";
            else if (p.isCacheHit && !["pending", "to-lb", "to-server"].includes(p.status)) particleColor = "#eab308";
            
            if (isDone) {
              return (
                <div
                  key={p.id}
                  className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${p.status === "complete" ? "bg-success" : "bg-destructive"}`}
                  style={{
                    left: userX,
                    top: p.originY,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              );
            }
            
            return (
              <div
                key={p.id}
                className={`absolute rounded-full shadow-lg transition-shadow ${isWaiting ? "animate-pulse" : ""}`}
                style={{
                  left: p.x,
                  top: p.y,
                  width: isWaiting ? 16 : 12,
                  height: isWaiting ? 16 : 12,
                  backgroundColor: particleColor,
                  boxShadow: `0 0 ${isWaiting ? 12 : 8}px ${particleColor}`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-success/20">
            <p className="text-lg font-bold font-mono text-success">{stats.completed}</p>
            <p className="text-muted-foreground">Complete</p>
          </div>
          <div className="p-2 rounded-lg bg-warning/20">
            <p className="text-lg font-bold font-mono text-warning">{stats.cacheHits}</p>
            <p className="text-muted-foreground">{systemType === "url" ? "Cache Hits" : "Fast Path"}</p>
          </div>
          <div className="p-2 rounded-lg bg-primary/20">
            <p className="text-lg font-bold font-mono text-primary">{stats.dbHits}</p>
            <p className="text-muted-foreground">{systemType === "url" ? "DB Hits" : "Full Path"}</p>
          </div>
          <div className="p-2 rounded-lg bg-destructive/20">
            <p className="text-lg font-bold font-mono text-destructive">{stats.failed}</p>
            <p className="text-muted-foreground">Failed</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button onClick={startAnimation} className="flex-1 gap-2" style={{ backgroundColor: theme.color }}>
              <Play className="h-4 w-4" />
              Simulate Flow
            </Button>
          ) : (
            <Button onClick={stopAnimation} variant="destructive" className="flex-1 gap-2">
              <Pause className="h-4 w-4" />
              Stop
            </Button>
          )}
          <Button onClick={resetAnimation} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedFlowAnimation;
