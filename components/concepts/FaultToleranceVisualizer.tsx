import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Database, 
  HardDrive,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Zap,
  Clock,
  ArrowRight,
  Loader2,
  Shield
} from "lucide-react";
import { FailureType } from "./types";

interface FaultToleranceVisualizerProps {
  onExplanationChange?: (text: string) => void;
}

interface ComponentState {
  id: string;
  type: "server" | "database" | "cache" | "loadbalancer";
  label: string;
  status: "healthy" | "unhealthy" | "recovering" | "rerouting";
  isPrimary?: boolean;
}

interface RequestFlow {
  id: string;
  path: string[];
  currentStep: number;
  status: "pending" | "success" | "failed" | "rerouted";
}

const FaultToleranceVisualizer = ({ onExplanationChange }: FaultToleranceVisualizerProps) => {
  const [components, setComponents] = useState<ComponentState[]>([
    { id: "lb", type: "loadbalancer", label: "Load Balancer", status: "healthy" },
    { id: "server-1", type: "server", label: "Server 1", status: "healthy" },
    { id: "server-2", type: "server", label: "Server 2", status: "healthy" },
    { id: "server-3", type: "server", label: "Server 3", status: "healthy" },
    { id: "cache", type: "cache", label: "Redis Cache", status: "healthy" },
    { id: "db-primary", type: "database", label: "Primary DB", status: "healthy", isPrimary: true },
    { id: "db-replica", type: "database", label: "Replica DB", status: "healthy" },
  ]);
  
  const [requests, setRequests] = useState<RequestFlow[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeFailure, setActiveFailure] = useState<FailureType>("none");
  const [recoveryProgress, setRecoveryProgress] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    rerouted: 0,
    downtime: 0,
    recoveryTime: 0
  });
  
  const failureStartRef = useRef<number>(0);
  const requestIdRef = useRef<number>(0);

  // Inject failure
  const injectFailure = (type: FailureType) => {
    if (type === "none") {
      // Start recovery
      setRecoveryProgress(0);
      onExplanationChange?.("🔄 Recovery initiated. Auto-healing is replacing failed instances...");
      
      const recoveryInterval = setInterval(() => {
        setRecoveryProgress(prev => {
          if (prev >= 100) {
            clearInterval(recoveryInterval);
            setComponents(prev => prev.map(c => ({ ...c, status: "healthy" })));
            setActiveFailure("none");
            const recoveryTime = Date.now() - failureStartRef.current;
            setStats(s => ({ ...s, recoveryTime: recoveryTime / 1000 }));
            onExplanationChange?.(`✅ Recovery complete! All systems healthy. Recovery time: ${(recoveryTime / 1000).toFixed(1)}s`);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return;
    }
    
    setActiveFailure(type);
    failureStartRef.current = Date.now();
    
    setComponents(prev => {
      switch (type) {
        case "server":
          onExplanationChange?.("⚠️ Server failure detected! Load balancer is rerouting traffic to healthy instances...");
          return prev.map(c => 
            c.id === "server-2" ? { ...c, status: "unhealthy" } : c
          );
        case "database":
          onExplanationChange?.("🔥 Primary database failure! Promoting replica to primary...");
          return prev.map(c => 
            c.id === "db-primary" ? { ...c, status: "unhealthy" } :
            c.id === "db-replica" ? { ...c, label: "Replica → Primary", status: "rerouting" } : c
          );
        case "cache":
          onExplanationChange?.("⚡ Cache failure! Requests falling back to database...");
          return prev.map(c => 
            c.type === "cache" ? { ...c, status: "unhealthy" } : c
          );
        case "network":
          onExplanationChange?.("🌐 Network partition detected! Isolated nodes are being removed from pool...");
          return prev.map(c => 
            c.id === "server-3" ? { ...c, status: "unhealthy" } : c
          );
        default:
          return prev;
      }
    });
  };

  // Generate requests
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      const newRequest: RequestFlow = {
        id: `req-${requestIdRef.current++}`,
        path: ["lb", "server-1", "cache", "db-primary"],
        currentStep: 0,
        status: "pending"
      };
      
      setRequests(prev => [...prev.slice(-10), newRequest]);
      setStats(s => ({ ...s, total: s.total + 1 }));
    }, 500);
    
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Process requests
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setRequests(prev => prev.map(req => {
        if (req.status !== "pending") return req;
        
        const nextStep = req.currentStep + 1;
        const currentComponent = components.find(c => c.id === req.path[req.currentStep]);
        
        // Check if current component is unhealthy
        if (currentComponent?.status === "unhealthy") {
          // Try to reroute
          const healthyAlternative = components.find(c => 
            c.type === currentComponent.type && c.status === "healthy" && c.id !== currentComponent.id
          );
          
          if (healthyAlternative) {
            setStats(s => ({ ...s, rerouted: s.rerouted + 1 }));
            return {
              ...req,
              path: req.path.map((p, i) => i === req.currentStep ? healthyAlternative.id : p),
              status: "rerouted" as const
            };
          } else {
            setStats(s => ({ ...s, failed: s.failed + 1 }));
            return { ...req, status: "failed" as const };
          }
        }
        
        if (nextStep >= req.path.length) {
          setStats(s => ({ ...s, success: s.success + 1 }));
          return { ...req, currentStep: nextStep, status: "success" as const };
        }
        
        return { ...req, currentStep: nextStep };
      }));
      
      // Update downtime
      if (activeFailure !== "none") {
        setStats(s => ({ ...s, downtime: (Date.now() - failureStartRef.current) / 1000 }));
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [isSimulating, components, activeFailure]);

  const getStatusColor = (status: ComponentState["status"]) => {
    switch (status) {
      case "healthy": return "border-success/50 bg-success/10";
      case "unhealthy": return "border-destructive/50 bg-destructive/10 animate-pulse";
      case "recovering": return "border-warning/50 bg-warning/10";
      case "rerouting": return "border-primary/50 bg-primary/10";
    }
  };

  const getStatusIcon = (status: ComponentState["status"]) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4 text-success" />;
      case "unhealthy": return <XCircle className="h-4 w-4 text-destructive" />;
      case "recovering": return <Loader2 className="h-4 w-4 text-warning animate-spin" />;
      case "rerouting": return <RefreshCw className="h-4 w-4 text-primary animate-spin" />;
    }
  };

  const getComponentIcon = (type: ComponentState["type"]) => {
    switch (type) {
      case "server": return <Server className="h-5 w-5" />;
      case "database": return <Database className="h-5 w-5" />;
      case "cache": return <HardDrive className="h-5 w-5" />;
      case "loadbalancer": return <Zap className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Fault Injection Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setIsSimulating(!isSimulating)}
              variant={isSimulating ? "destructive" : "default"}
            >
              {isSimulating ? "Stop Traffic" : "Start Traffic"}
            </Button>
            
            <div className="h-8 w-px bg-border" />
            
            <Button
              onClick={() => injectFailure("server")}
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
              disabled={activeFailure !== "none"}
            >
              <Server className="h-4 w-4 mr-1" />
              Kill Server
            </Button>
            
            <Button
              onClick={() => injectFailure("database")}
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
              disabled={activeFailure !== "none"}
            >
              <Database className="h-4 w-4 mr-1" />
              Kill Database
            </Button>
            
            <Button
              onClick={() => injectFailure("cache")}
              variant="outline"
              className="border-warning/50 text-warning hover:bg-warning/10"
              disabled={activeFailure !== "none"}
            >
              <HardDrive className="h-4 w-4 mr-1" />
              Kill Cache
            </Button>
            
            {activeFailure !== "none" && (
              <Button
                onClick={() => injectFailure("none")}
                variant="default"
                className="bg-success hover:bg-success/90"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Trigger Recovery
              </Button>
            )}
          </div>
          
          {recoveryProgress > 0 && recoveryProgress < 100 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Recovery Progress</span>
                <span className="text-success font-mono">{recoveryProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success transition-all"
                  style={{ width: `${recoveryProgress}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="glass-card">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold font-mono">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total Requests</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold font-mono text-success">{stats.success}</p>
            <p className="text-xs text-muted-foreground">Successful</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold font-mono text-destructive">{stats.failed}</p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold font-mono text-warning">{stats.rerouted}</p>
            <p className="text-xs text-muted-foreground">Rerouted</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold font-mono text-destructive">{stats.downtime.toFixed(1)}s</p>
            <p className="text-xs text-muted-foreground">Downtime</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold font-mono text-success">{stats.recoveryTime.toFixed(1)}s</p>
            <p className="text-xs text-muted-foreground">Recovery Time</p>
          </CardContent>
        </Card>
      </div>

      {/* System Architecture */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              System Components
            </span>
            {activeFailure !== "none" && (
              <Badge variant="outline" className="border-destructive/50 text-destructive gap-1">
                <AlertTriangle className="h-3 w-3" />
                {activeFailure.charAt(0).toUpperCase() + activeFailure.slice(1)} Failure Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Load Balancer */}
            <div className="md:col-span-3 flex justify-center">
              {components.filter(c => c.type === "loadbalancer").map(comp => (
                <div
                  key={comp.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(comp.status)} flex items-center gap-3`}
                >
                  {getComponentIcon(comp.type)}
                  <div>
                    <p className="font-medium text-sm">{comp.label}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getStatusIcon(comp.status)}
                      <span>{comp.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Connection lines */}
            <div className="md:col-span-3 flex justify-center">
              <div className="flex gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 w-px bg-border relative">
                    <ArrowRight className="absolute -bottom-2 -left-1.5 h-3 w-3 rotate-90 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Servers */}
            {components.filter(c => c.type === "server").map(comp => (
              <div
                key={comp.id}
                className={`p-4 rounded-lg border-2 ${getStatusColor(comp.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  {getComponentIcon(comp.type)}
                  {getStatusIcon(comp.status)}
                </div>
                <p className="font-medium text-sm">{comp.label}</p>
                <p className="text-xs text-muted-foreground">{comp.status}</p>
              </div>
            ))}
            
            {/* Connection to cache/db */}
            <div className="md:col-span-3 flex justify-center gap-8">
              <div className="h-8 w-px bg-border relative">
                <ArrowRight className="absolute -bottom-2 -left-1.5 h-3 w-3 rotate-90 text-muted-foreground" />
              </div>
            </div>
            
            {/* Cache */}
            <div className="md:col-span-3 flex justify-center">
              {components.filter(c => c.type === "cache").map(comp => (
                <div
                  key={comp.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(comp.status)} flex items-center gap-3`}
                >
                  {getComponentIcon(comp.type)}
                  <div>
                    <p className="font-medium text-sm">{comp.label}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getStatusIcon(comp.status)}
                      <span>{comp.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Connection to db */}
            <div className="md:col-span-3 flex justify-center gap-8">
              <div className="h-8 w-px bg-border relative">
                <ArrowRight className="absolute -bottom-2 -left-1.5 h-3 w-3 rotate-90 text-muted-foreground" />
              </div>
            </div>
            
            {/* Databases */}
            <div className="md:col-span-3 flex justify-center gap-4">
              {components.filter(c => c.type === "database").map(comp => (
                <div
                  key={comp.id}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(comp.status)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    {getComponentIcon(comp.type)}
                    <div className="flex items-center gap-1">
                      {comp.isPrimary && (
                        <Badge variant="outline" className="text-xs">Primary</Badge>
                      )}
                      {getStatusIcon(comp.status)}
                    </div>
                  </div>
                  <p className="font-medium text-sm">{comp.label}</p>
                  <p className="text-xs text-muted-foreground">{comp.status}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Live Request Flow */}
          {requests.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-sm font-medium mb-3">Live Request Flow</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {requests.slice(-8).map(req => (
                  <div 
                    key={req.id}
                    className={`flex items-center gap-2 text-xs p-1.5 rounded ${
                      req.status === "success" ? "bg-success/10" :
                      req.status === "failed" ? "bg-destructive/10" :
                      req.status === "rerouted" ? "bg-warning/10" :
                      "bg-secondary/30"
                    }`}
                  >
                    <span className="font-mono text-muted-foreground w-16">{req.id}</span>
                    <div className="flex items-center gap-1 flex-1">
                      {req.path.map((step, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span className={i <= req.currentStep ? "text-primary" : "text-muted-foreground"}>
                            {step}
                          </span>
                          {i < req.path.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                        </span>
                      ))}
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        req.status === "success" ? "border-success/50 text-success" :
                        req.status === "failed" ? "border-destructive/50 text-destructive" :
                        req.status === "rerouted" ? "border-warning/50 text-warning" :
                        "border-muted"
                      }
                    >
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FaultToleranceVisualizer;
