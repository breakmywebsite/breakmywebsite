import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Shield, 
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Activity,
  Power,
  PowerOff
} from "lucide-react";

interface CircuitBreakerVisualizerProps {
  onExplanationChange?: (text: string) => void;
}

type CircuitState = "closed" | "open" | "half-open";

interface RequestResult {
  id: number;
  success: boolean;
  timestamp: number;
}

const CircuitBreakerVisualizer = ({ onExplanationChange }: CircuitBreakerVisualizerProps) => {
  const [circuitState, setCircuitState] = useState<CircuitState>("closed");
  const [failureCount, setFailureCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failureThreshold, setFailureThreshold] = useState(5);
  const [recoveryTimeout, setRecoveryTimeout] = useState(10);
  const [halfOpenSuccessRequired, setHalfOpenSuccessRequired] = useState(3);
  const [halfOpenSuccessCount, setHalfOpenSuccessCount] = useState(0);
  const [serviceHealth, setServiceHealth] = useState(100);
  const [isSimulating, setIsSimulating] = useState(false);
  const [requests, setRequests] = useState<RequestResult[]>([]);
  const [timeUntilHalfOpen, setTimeUntilHalfOpen] = useState(0);
  const openTimeRef = useRef<number>(0);
  const requestIdRef = useRef<number>(0);

  // State transition logic
  useEffect(() => {
    if (circuitState === "closed" && failureCount >= failureThreshold) {
      setCircuitState("open");
      openTimeRef.current = Date.now();
      setTimeUntilHalfOpen(recoveryTimeout);
      onExplanationChange?.(`🔴 Circuit OPENED! ${failureCount} consecutive failures detected. Blocking all requests for ${recoveryTimeout}s to let the service recover.`);
    }
  }, [failureCount, failureThreshold, circuitState, recoveryTimeout, onExplanationChange]);

  // Recovery timeout
  useEffect(() => {
    if (circuitState !== "open") return;
    
    const interval = setInterval(() => {
      const elapsed = (Date.now() - openTimeRef.current) / 1000;
      const remaining = Math.max(0, recoveryTimeout - elapsed);
      setTimeUntilHalfOpen(remaining);
      
      if (remaining <= 0) {
        setCircuitState("half-open");
        setHalfOpenSuccessCount(0);
        onExplanationChange?.(`🟡 Circuit HALF-OPEN. Testing service health with limited requests. Need ${halfOpenSuccessRequired} successes to close.`);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [circuitState, recoveryTimeout, halfOpenSuccessRequired, onExplanationChange]);

  // Half-open to closed
  useEffect(() => {
    if (circuitState === "half-open" && halfOpenSuccessCount >= halfOpenSuccessRequired) {
      setCircuitState("closed");
      setFailureCount(0);
      onExplanationChange?.(`🟢 Circuit CLOSED. Service recovered successfully!`);
    }
  }, [halfOpenSuccessCount, halfOpenSuccessRequired, circuitState, onExplanationChange]);

  // Simulate requests
  useEffect(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      // Determine if request succeeds based on service health
      const isSuccess = Math.random() * 100 < serviceHealth;
      
      // Circuit breaker logic
      if (circuitState === "open") {
        // Request is blocked
        const result: RequestResult = {
          id: requestIdRef.current++,
          success: false,
          timestamp: Date.now()
        };
        setRequests(prev => [...prev.slice(-20), result]);
        return;
      }
      
      const result: RequestResult = {
        id: requestIdRef.current++,
        success: isSuccess,
        timestamp: Date.now()
      };
      setRequests(prev => [...prev.slice(-20), result]);
      
      if (isSuccess) {
        setSuccessCount(prev => prev + 1);
        setFailureCount(0);
        if (circuitState === "half-open") {
          setHalfOpenSuccessCount(prev => prev + 1);
        }
      } else {
        setFailureCount(prev => prev + 1);
        if (circuitState === "half-open") {
          setCircuitState("open");
          openTimeRef.current = Date.now();
          setTimeUntilHalfOpen(recoveryTimeout);
          onExplanationChange?.(`🔴 Circuit REOPENED! Failed during half-open state. Restarting recovery timeout.`);
        }
      }
    }, 300);
    
    return () => clearInterval(interval);
  }, [isSimulating, serviceHealth, circuitState, recoveryTimeout, onExplanationChange]);

  const getStateColor = (state: CircuitState) => {
    switch (state) {
      case "closed": return "bg-success";
      case "open": return "bg-destructive";
      case "half-open": return "bg-warning";
    }
  };

  const getStateIcon = (state: CircuitState) => {
    switch (state) {
      case "closed": return <Power className="h-6 w-6" />;
      case "open": return <PowerOff className="h-6 w-6" />;
      case "half-open": return <RefreshCw className="h-6 w-6 animate-spin" />;
    }
  };

  const resetCircuit = () => {
    setCircuitState("closed");
    setFailureCount(0);
    setSuccessCount(0);
    setHalfOpenSuccessCount(0);
    setRequests([]);
    setTimeUntilHalfOpen(0);
    onExplanationChange?.("Circuit breaker reset to closed state.");
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Circuit Breaker Controls
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
            <Button onClick={resetCircuit} variant="outline">
              Reset Circuit
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex justify-between">
                <span>Service Health</span>
                <span className={`font-mono ${serviceHealth < 50 ? "text-destructive" : serviceHealth < 80 ? "text-warning" : "text-success"}`}>
                  {serviceHealth}%
                </span>
              </label>
              <Slider
                value={[serviceHealth]}
                onValueChange={([v]) => setServiceHealth(v)}
                min={0}
                max={100}
                step={5}
              />
              <p className="text-xs text-muted-foreground">Simulate degraded service by lowering health</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex justify-between">
                <span>Failure Threshold</span>
                <span className="font-mono">{failureThreshold} failures</span>
              </label>
              <Slider
                value={[failureThreshold]}
                onValueChange={([v]) => setFailureThreshold(v)}
                min={1}
                max={10}
                step={1}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex justify-between">
                <span>Recovery Timeout</span>
                <span className="font-mono">{recoveryTimeout}s</span>
              </label>
              <Slider
                value={[recoveryTimeout]}
                onValueChange={([v]) => setRecoveryTimeout(v)}
                min={5}
                max={30}
                step={5}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex justify-between">
                <span>Half-Open Success Required</span>
                <span className="font-mono">{halfOpenSuccessRequired}</span>
              </label>
              <Slider
                value={[halfOpenSuccessRequired]}
                onValueChange={([v]) => setHalfOpenSuccessRequired(v)}
                min={1}
                max={5}
                step={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Circuit State Display */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-8">
            {/* Circuit Breaker Visualization */}
            <div className={`relative w-32 h-32 rounded-full ${getStateColor(circuitState)} flex items-center justify-center transition-colors duration-300`}>
              <div className="text-center text-background">
                {getStateIcon(circuitState)}
                <p className="text-sm font-bold mt-1">{circuitState.toUpperCase()}</p>
              </div>
              
              {/* Animated ring for half-open */}
              {circuitState === "half-open" && (
                <div className="absolute inset-0 rounded-full border-4 border-warning animate-ping opacity-30" />
              )}
            </div>
            
            {/* State Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={
                  circuitState === "closed" ? "border-success/50 text-success" :
                  circuitState === "open" ? "border-destructive/50 text-destructive" :
                  "border-warning/50 text-warning"
                }>
                  {circuitState === "closed" && "Allowing all requests"}
                  {circuitState === "open" && "Blocking all requests"}
                  {circuitState === "half-open" && "Testing service health"}
                </Badge>
              </div>
              
              <div className="text-sm space-y-1">
                <p className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  Consecutive failures: <span className="font-mono">{failureCount}/{failureThreshold}</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Total successes: <span className="font-mono">{successCount}</span>
                </p>
                {circuitState === "open" && (
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    Time until half-open: <span className="font-mono">{timeUntilHalfOpen.toFixed(1)}s</span>
                  </p>
                )}
                {circuitState === "half-open" && (
                  <p className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-warning" />
                    Success count: <span className="font-mono">{halfOpenSuccessCount}/{halfOpenSuccessRequired}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Failure progress bar */}
          <div className="mt-6 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Failure Counter</span>
              <span>{failureCount}/{failureThreshold}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${failureCount >= failureThreshold ? "bg-destructive" : "bg-warning"}`}
                style={{ width: `${(failureCount / failureThreshold) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Request Stream */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live Request Stream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {requests.map(req => (
              <div
                key={req.id}
                className={`w-3 h-3 rounded-full transition-all ${
                  req.success ? "bg-success" : "bg-destructive"
                }`}
                title={`Request #${req.id}: ${req.success ? "Success" : "Failed"}`}
              />
            ))}
            {requests.length === 0 && (
              <p className="text-sm text-muted-foreground">Start simulation to see requests...</p>
            )}
          </div>
          
          <div className="flex gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-success" />
              Success
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              Failed/Blocked
            </span>
          </div>
        </CardContent>
      </Card>

      {/* State Machine Diagram */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Circuit Breaker State Machine</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 py-4">
            <div className={`flex-1 p-4 rounded-lg text-center transition-all ${
              circuitState === "closed" ? "bg-success/20 border-2 border-success" : "bg-secondary/30"
            }`}>
              <Power className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="font-medium">CLOSED</p>
              <p className="text-xs text-muted-foreground">Normal operation</p>
            </div>
            
            <div className="flex flex-col items-center text-xs text-muted-foreground">
              <span>failures ≥ {failureThreshold}</span>
              <Zap className="h-4 w-4" />
            </div>
            
            <div className={`flex-1 p-4 rounded-lg text-center transition-all ${
              circuitState === "open" ? "bg-destructive/20 border-2 border-destructive" : "bg-secondary/30"
            }`}>
              <PowerOff className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p className="font-medium">OPEN</p>
              <p className="text-xs text-muted-foreground">Fail-fast mode</p>
            </div>
            
            <div className="flex flex-col items-center text-xs text-muted-foreground">
              <span>timeout {recoveryTimeout}s</span>
              <Clock className="h-4 w-4" />
            </div>
            
            <div className={`flex-1 p-4 rounded-lg text-center transition-all ${
              circuitState === "half-open" ? "bg-warning/20 border-2 border-warning" : "bg-secondary/30"
            }`}>
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-warning" />
              <p className="font-medium">HALF-OPEN</p>
              <p className="text-xs text-muted-foreground">Testing recovery</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CircuitBreakerVisualizer;
