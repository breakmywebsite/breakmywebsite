import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Plus, 
  Minus, 
  Activity, 
  DollarSign, 
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { ServerInstance } from "./types";

interface AutoScalingVisualizerProps {
  onExplanationChange?: (text: string) => void;
}

const AutoScalingVisualizer = ({ onExplanationChange }: AutoScalingVisualizerProps) => {
  const [servers, setServers] = useState<ServerInstance[]>([
    { id: "server-1", status: "healthy", cpu: 30, memory: 40, requests: 50, createdAt: Date.now() }
  ]);
  const [trafficLevel, setTrafficLevel] = useState(50);
  const [isAutoScaling, setIsAutoScaling] = useState(true);
  const [scaleUpThreshold, setScaleUpThreshold] = useState(70);
  const [scaleDownThreshold, setScaleDownThreshold] = useState(30);
  const [minInstances, setMinInstances] = useState(1);
  const [maxInstances, setMaxInstances] = useState(8);
  const [isSimulating, setIsSimulating] = useState(false);
  const [costPerHour, setCostPerHour] = useState(0);
  const [responseTime, setResponseTime] = useState(50);
  const animationRef = useRef<number | undefined>(undefined);

  // Calculate average CPU across all healthy servers
  const avgCpu = servers.filter(s => s.status === "healthy")
    .reduce((sum, s) => sum + s.cpu, 0) / Math.max(servers.filter(s => s.status === "healthy").length, 1);

  // Auto-scaling logic
  useEffect(() => {
    if (!isAutoScaling || !isSimulating) return;

    const interval = setInterval(() => {
      setServers(prev => {
        const healthyCount = prev.filter(s => s.status === "healthy").length;
        const startingCount = prev.filter(s => s.status === "starting").length;
        
        // Scale up if CPU > threshold and below max
        if (avgCpu > scaleUpThreshold && healthyCount + startingCount < maxInstances) {
          const newServer: ServerInstance = {
            id: `server-${Date.now()}`,
            status: "starting",
            cpu: 0,
            memory: 0,
            requests: 0,
            createdAt: Date.now()
          };
          onExplanationChange?.(`🚀 Scaling UP: CPU at ${avgCpu.toFixed(0)}% exceeds ${scaleUpThreshold}% threshold. Adding new instance...`);
          return [...prev, newServer];
        }
        
        // Scale down if CPU < threshold and above min
        if (avgCpu < scaleDownThreshold && healthyCount > minInstances) {
          const serverToRemove = prev.find(s => s.status === "healthy");
          if (serverToRemove) {
            onExplanationChange?.(`📉 Scaling DOWN: CPU at ${avgCpu.toFixed(0)}% below ${scaleDownThreshold}% threshold. Terminating instance...`);
            return prev.map(s => 
              s.id === serverToRemove.id ? { ...s, status: "terminating" as const } : s
            );
          }
        }
        
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoScaling, isSimulating, avgCpu, scaleUpThreshold, scaleDownThreshold, minInstances, maxInstances, onExplanationChange]);

  // Update server states (starting -> healthy, terminating -> removed)
  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prev => {
        let updated = prev.map(s => {
          if (s.status === "starting" && Date.now() - s.createdAt > 3000) {
            return { ...s, status: "healthy" as const, cpu: 20, memory: 30 };
          }
          return s;
        });
        
        // Remove terminated servers
        updated = updated.filter(s => 
          s.status !== "terminating" || Date.now() - s.createdAt < 5000
        );
        
        return updated;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Simulate traffic impact on servers
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setServers(prev => {
        const healthyServers = prev.filter(s => s.status === "healthy");
        const requestsPerServer = trafficLevel / Math.max(healthyServers.length, 1);
        
        return prev.map(s => {
          if (s.status !== "healthy") return s;
          
          const targetCpu = Math.min(95, (requestsPerServer / 100) * 80 + Math.random() * 10);
          const targetMemory = Math.min(90, (requestsPerServer / 100) * 60 + Math.random() * 10);
          
          return {
            ...s,
            cpu: s.cpu + (targetCpu - s.cpu) * 0.1,
            memory: s.memory + (targetMemory - s.memory) * 0.1,
            requests: Math.round(requestsPerServer)
          };
        });
      });

      // Calculate response time based on load
      const healthyCount = servers.filter(s => s.status === "healthy").length;
      const loadFactor = trafficLevel / (healthyCount * 100);
      setResponseTime(Math.round(50 + loadFactor * 200 + Math.random() * 20));
      
      // Calculate cost
      setCostPerHour(servers.length * 0.05);
    }, 200);

    return () => clearInterval(interval);
  }, [isSimulating, trafficLevel, servers.length]);

  const getStatusColor = (status: ServerInstance["status"]) => {
    switch (status) {
      case "healthy": return "bg-success";
      case "unhealthy": return "bg-destructive";
      case "starting": return "bg-warning animate-pulse";
      case "terminating": return "bg-muted animate-pulse";
    }
  };

  const getStatusIcon = (status: ServerInstance["status"]) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-3 w-3" />;
      case "unhealthy": return <AlertTriangle className="h-3 w-3" />;
      case "starting": return <Loader2 className="h-3 w-3 animate-spin" />;
      case "terminating": return <Minus className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Auto Scaling Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              variant={isSimulating ? "destructive" : "default"}
            >
              {isSimulating ? "Stop Simulation" : "Start Simulation"}
            </Button>
            <Button
              onClick={() => setIsAutoScaling(!isAutoScaling)}
              variant={isAutoScaling ? "default" : "outline"}
            >
              Auto Scaling: {isAutoScaling ? "ON" : "OFF"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex justify-between">
                <span>Traffic Level</span>
                <span className="font-mono">{trafficLevel} req/s</span>
              </label>
              <Slider
                value={[trafficLevel]}
                onValueChange={([v]) => setTrafficLevel(v)}
                min={10}
                max={500}
                step={10}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex justify-between">
                <span>Scale-Up Threshold</span>
                <span className="font-mono">{scaleUpThreshold}% CPU</span>
              </label>
              <Slider
                value={[scaleUpThreshold]}
                onValueChange={([v]) => setScaleUpThreshold(v)}
                min={50}
                max={95}
                step={5}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex justify-between">
                <span>Scale-Down Threshold</span>
                <span className="font-mono">{scaleDownThreshold}% CPU</span>
              </label>
              <Slider
                value={[scaleDownThreshold]}
                onValueChange={([v]) => setScaleDownThreshold(v)}
                min={10}
                max={50}
                step={5}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex justify-between">
                <span>Instance Range</span>
                <span className="font-mono">{minInstances} - {maxInstances}</span>
              </label>
              <div className="flex gap-2">
                <Slider
                  value={[minInstances]}
                  onValueChange={([v]) => setMinInstances(Math.min(v, maxInstances - 1))}
                  min={1}
                  max={4}
                  step={1}
                  className="flex-1"
                />
                <Slider
                  value={[maxInstances]}
                  onValueChange={([v]) => setMaxInstances(Math.max(v, minInstances + 1))}
                  min={2}
                  max={10}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Server className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold font-mono">{servers.filter(s => s.status === "healthy").length}</p>
            <p className="text-xs text-muted-foreground">Active Instances</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Activity className="h-5 w-5 mx-auto mb-2 text-warning" />
            <p className={`text-2xl font-bold font-mono ${avgCpu > 80 ? "text-destructive" : avgCpu > 60 ? "text-warning" : "text-success"}`}>
              {avgCpu.toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">Avg CPU Usage</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto mb-2 text-success" />
            <p className={`text-2xl font-bold font-mono ${responseTime > 200 ? "text-destructive" : responseTime > 100 ? "text-warning" : "text-success"}`}>
              {responseTime}ms
            </p>
            <p className="text-xs text-muted-foreground">Response Time</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold font-mono">${costPerHour.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Cost/Hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Server Instances Visualization */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Server Instances
            </span>
            <div className="flex items-center gap-2 text-xs font-normal">
              {avgCpu > scaleUpThreshold && (
                <Badge variant="outline" className="text-success border-success/50 gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Scaling Up
                </Badge>
              )}
              {avgCpu < scaleDownThreshold && servers.filter(s => s.status === "healthy").length > minInstances && (
                <Badge variant="outline" className="text-warning border-warning/50 gap-1">
                  <TrendingDown className="h-3 w-3" />
                  Scaling Down
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {servers.map((server) => (
              <div 
                key={server.id}
                className={`relative p-3 rounded-lg border transition-all duration-300 ${
                  server.status === "terminating" 
                    ? "opacity-50 scale-95 border-muted" 
                    : server.status === "starting"
                      ? "border-warning/50 bg-warning/5"
                      : "border-border/50 bg-secondary/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(server.status)}`} />
                    <span className="text-xs font-mono text-muted-foreground">
                      {server.id.slice(-4)}
                    </span>
                  </div>
                  {getStatusIcon(server.status)}
                </div>
                
                {server.status === "healthy" && (
                  <>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CPU</span>
                        <span className={`font-mono ${server.cpu > 80 ? "text-destructive" : server.cpu > 60 ? "text-warning" : "text-success"}`}>
                          {server.cpu.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            server.cpu > 80 ? "bg-destructive" : server.cpu > 60 ? "bg-warning" : "bg-success"
                          }`}
                          style={{ width: `${server.cpu}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Memory</span>
                        <span className="font-mono">{server.memory.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${server.memory}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between pt-1">
                        <span className="text-muted-foreground">Requests</span>
                        <span className="font-mono">{server.requests}/s</span>
                      </div>
                    </div>
                  </>
                )}
                
                {server.status === "starting" && (
                  <div className="text-center py-2">
                    <Loader2 className="h-6 w-6 mx-auto animate-spin text-warning" />
                    <p className="text-xs text-muted-foreground mt-1">Starting...</p>
                  </div>
                )}
                
                {server.status === "terminating" && (
                  <div className="text-center py-2">
                    <Minus className="h-6 w-6 mx-auto text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mt-1">Terminating...</p>
                  </div>
                )}
              </div>
            ))}
            
            {/* Placeholder for potential new instance */}
            {servers.length < maxInstances && avgCpu > scaleUpThreshold && (
              <div className="p-3 rounded-lg border border-dashed border-success/30 bg-success/5 flex items-center justify-center">
                <div className="text-center">
                  <Plus className="h-5 w-5 mx-auto text-success/50" />
                  <p className="text-xs text-success/50 mt-1">New instance</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scaling Timeline */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Scaling Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
            {/* Scale down zone */}
            <div 
              className="absolute inset-y-0 left-0 bg-warning/20"
              style={{ width: `${scaleDownThreshold}%` }}
            />
            {/* Optimal zone */}
            <div 
              className="absolute inset-y-0 bg-success/20"
              style={{ left: `${scaleDownThreshold}%`, width: `${scaleUpThreshold - scaleDownThreshold}%` }}
            />
            {/* Scale up zone */}
            <div 
              className="absolute inset-y-0 right-0 bg-destructive/20"
              style={{ width: `${100 - scaleUpThreshold}%` }}
            />
            
            {/* Current CPU indicator */}
            <div 
              className="absolute inset-y-0 w-1 bg-foreground transition-all duration-300"
              style={{ left: `${avgCpu}%` }}
            />
            
            {/* Labels */}
            <div className="absolute inset-0 flex items-center justify-between px-3 text-xs">
              <span className="text-warning">Scale Down</span>
              <span className="text-success">Optimal</span>
              <span className="text-destructive">Scale Up</span>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
            <span>0%</span>
            <span>{scaleDownThreshold}%</span>
            <span>{scaleUpThreshold}%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoScalingVisualizer;
