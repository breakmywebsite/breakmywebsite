import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  TrendingUp, 
  Zap,
  Globe,
  Clock,
  AlertTriangle,
  Play,
  Pause
} from "lucide-react";
import { TrafficPattern } from "./types";

interface TrafficPatternsVisualizerProps {
  onExplanationChange?: (text: string) => void;
}

interface TrafficDataPoint {
  time: number;
  value: number;
  pattern: TrafficPattern;
}

const PATTERN_CONFIGS: Record<TrafficPattern, { 
  label: string; 
  description: string; 
  color: string;
  generator: (time: number, base: number) => number;
}> = {
  steady: {
    label: "Steady",
    description: "Consistent traffic with minor variations",
    color: "#22c55e",
    generator: (time, base) => base + Math.sin(time * 0.1) * 10 + Math.random() * 5
  },
  gradual: {
    label: "Gradual Increase",
    description: "Traffic slowly increases over time",
    color: "#eab308",
    generator: (time, base) => base + time * 2 + Math.random() * 10
  },
  burst: {
    label: "Burst Traffic",
    description: "Periodic bursts of high traffic",
    color: "#f97316",
    generator: (time, base) => {
      const burst = Math.sin(time * 0.05) > 0.7 ? 150 : 0;
      return base + burst + Math.random() * 20;
    }
  },
  spike: {
    label: "Viral Spike",
    description: "Sudden massive traffic spike (10x normal)",
    color: "#ef4444",
    generator: (time, base) => {
      if (time > 30 && time < 60) {
        return base * 10 * Math.sin((time - 30) * 0.1) + Math.random() * 50;
      }
      return base + Math.random() * 10;
    }
  },
  regional: {
    label: "Regional Distribution",
    description: "Traffic varies by geographic region and timezone",
    color: "#8b5cf6",
    generator: (time, base) => {
      // Simulate different regions waking up
      const usTraffic = Math.sin(time * 0.08) * 30;
      const euTraffic = Math.sin(time * 0.08 + 2) * 25;
      const asiaTraffic = Math.sin(time * 0.08 + 4) * 35;
      return base + usTraffic + euTraffic + asiaTraffic + Math.random() * 15;
    }
  }
};

const TrafficPatternsVisualizer = ({ onExplanationChange }: TrafficPatternsVisualizerProps) => {
  const [activePattern, setActivePattern] = useState<TrafficPattern>("steady");
  const [isRunning, setIsRunning] = useState(false);
  const [dataPoints, setDataPoints] = useState<TrafficDataPoint[]>([]);
  const [currentRps, setCurrentRps] = useState(100);
  const [peakRps, setPeakRps] = useState(100);
  const [systemStatus, setSystemStatus] = useState<"healthy" | "stressed" | "overloaded">("healthy");
  const timeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const baseRps = 100;
  const maxCapacity = 500;

  // Update pattern explanation
  useEffect(() => {
    const config = PATTERN_CONFIGS[activePattern];
    onExplanationChange?.(`📊 ${config.label}: ${config.description}`);
  }, [activePattern, onExplanationChange]);

  // Generate traffic data
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      timeRef.current += 1;
      const config = PATTERN_CONFIGS[activePattern];
      const value = Math.max(0, config.generator(timeRef.current, baseRps));
      
      setCurrentRps(Math.round(value));
      setPeakRps(prev => Math.max(prev, value));
      
      // Update system status
      if (value > maxCapacity * 0.9) {
        setSystemStatus("overloaded");
      } else if (value > maxCapacity * 0.6) {
        setSystemStatus("stressed");
      } else {
        setSystemStatus("healthy");
      }

      setDataPoints(prev => {
        const newPoints = [...prev, { time: timeRef.current, value, pattern: activePattern }];
        return newPoints.slice(-100); // Keep last 100 points
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, activePattern]);

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid
    ctx.strokeStyle = "hsl(220, 15%, 20%)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const y = (rect.height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Draw capacity line
    const capacityY = rect.height - (maxCapacity / 1000) * rect.height;
    ctx.strokeStyle = "hsl(0, 72%, 51%)";
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, capacityY);
    ctx.lineTo(rect.width, capacityY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw data
    if (dataPoints.length < 2) return;

    const config = PATTERN_CONFIGS[activePattern];
    ctx.strokeStyle = config.color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    dataPoints.forEach((point, i) => {
      const x = (i / 100) * rect.width;
      const y = rect.height - (point.value / 1000) * rect.height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Fill area under curve
    ctx.lineTo(rect.width, rect.height);
    ctx.lineTo(0, rect.height);
    ctx.closePath();
    ctx.fillStyle = config.color + "20";
    ctx.fill();

  }, [dataPoints, activePattern]);

  const resetSimulation = () => {
    timeRef.current = 0;
    setDataPoints([]);
    setCurrentRps(100);
    setPeakRps(100);
    setSystemStatus("healthy");
  };

  const changePattern = (pattern: TrafficPattern) => {
    setActivePattern(pattern);
    resetSimulation();
  };

  return (
    <div className="space-y-6">
      {/* Pattern Selector */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Traffic Pattern Simulator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PATTERN_CONFIGS) as TrafficPattern[]).map(pattern => {
              const config = PATTERN_CONFIGS[pattern];
              return (
                <Button
                  key={pattern}
                  onClick={() => changePattern(pattern)}
                  variant={activePattern === pattern ? "default" : "outline"}
                  size="sm"
                  style={{
                    borderColor: activePattern === pattern ? config.color : undefined,
                    backgroundColor: activePattern === pattern ? config.color : undefined
                  }}
                >
                  {config.label}
                </Button>
              );
            })}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              variant={isRunning ? "destructive" : "default"}
            >
              {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetSimulation} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Zap className="h-5 w-5 mx-auto mb-2" style={{ color: PATTERN_CONFIGS[activePattern].color }} />
            <p className="text-2xl font-bold font-mono">{currentRps}</p>
            <p className="text-xs text-muted-foreground">Current RPS</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold font-mono">{Math.round(peakRps)}</p>
            <p className="text-xs text-muted-foreground">Peak RPS</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Globe className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold font-mono">{maxCapacity}</p>
            <p className="text-xs text-muted-foreground">Max Capacity</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            {systemStatus === "healthy" ? (
              <Activity className="h-5 w-5 mx-auto mb-2 text-success" />
            ) : systemStatus === "stressed" ? (
              <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-warning" />
            ) : (
              <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-destructive animate-pulse" />
            )}
            <p className={`text-lg font-bold ${
              systemStatus === "healthy" ? "text-success" :
              systemStatus === "stressed" ? "text-warning" : "text-destructive"
            }`}>
              {systemStatus.charAt(0).toUpperCase() + systemStatus.slice(1)}
            </p>
            <p className="text-xs text-muted-foreground">System Status</p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Traffic Over Time
            </span>
            <Badge 
              variant="outline" 
              style={{ borderColor: PATTERN_CONFIGS[activePattern].color, color: PATTERN_CONFIGS[activePattern].color }}
            >
              {PATTERN_CONFIGS[activePattern].label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas 
              ref={canvasRef}
              className="w-full h-48 rounded-lg"
              style={{ background: "hsl(220, 20%, 6%)" }}
            />
            <div className="absolute top-2 right-2 text-xs text-muted-foreground">
              <span className="text-destructive">— Max Capacity ({maxCapacity} RPS)</span>
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
              Time →
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-3">
            {PATTERN_CONFIGS[activePattern].description}
          </p>
        </CardContent>
      </Card>

      {/* Regional Traffic (for regional pattern) */}
      {activePattern === "regional" && (
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Regional Traffic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { region: "Americas", traffic: Math.round(30 + Math.sin(timeRef.current * 0.08) * 30), color: "#3b82f6" },
                { region: "Europe", traffic: Math.round(25 + Math.sin(timeRef.current * 0.08 + 2) * 25), color: "#22c55e" },
                { region: "Asia-Pacific", traffic: Math.round(35 + Math.sin(timeRef.current * 0.08 + 4) * 35), color: "#eab308" }
              ].map(({ region, traffic, color }) => (
                <div key={region} className="text-center p-3 rounded-lg bg-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">{region}</p>
                  <p className="text-xl font-bold font-mono" style={{ color }}>{traffic}%</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ width: `${traffic}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrafficPatternsVisualizer;
