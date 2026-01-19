import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Play, RotateCcw, Users, Bell, XCircle, Clock, Zap, Monitor, GitGraph } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import WebPreview from "./WebPreview";
import { BasicFlowDiagram } from "./FlowDiagram";
import DiscussionSection, { basicDiscussionData } from "./DiscussionSection";
import SystemDesignCards, { basicSystemDesign } from "./SystemDesignCards";
import { 
  UnifiedFlowAnimation, 
  UnifiedMetricsDashboard, 
  UnifiedLoadSimulator 
} from "@/components/visualization";

interface Subscriber {
  id: string;
  name: string;
  status: "idle" | "receiving" | "success" | "failed" | "slow";
  receivedAt?: number;
  latency?: number;
}

interface Notification {
  id: string;
  message: string;
  timestamp: number;
  status: "pending" | "sending" | "partial" | "complete";
}

interface WebNotification {
  id: string;
  type: "message" | "like" | "order" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  status?: "delivered" | "failed" | "delayed" | "duplicate";
}

const BasicVersion = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: "1", name: "User A", status: "idle" },
    { id: "2", name: "User B", status: "idle" },
    { id: "3", name: "User C", status: "idle" },
    { id: "4", name: "User D", status: "idle" },
    { id: "5", name: "User E", status: "idle" },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [webNotifications, setWebNotifications] = useState<WebNotification[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [failureOccurred, setFailureOccurred] = useState(false);
  const [stats, setStats] = useState({ sent: 0, failed: 0, totalLatency: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const reset = () => {
    setSubscribers(subscribers.map(s => ({ ...s, status: "idle", receivedAt: undefined, latency: undefined })));
    setNotifications([]);
    setWebNotifications([]);
    setIsRunning(false);
    setCurrentStep(0);
    setFailureOccurred(false);
    setStats({ sent: 0, failed: 0, totalLatency: 0 });
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const simulateBasicNotification = () => {
    if (isRunning) return;
    reset();
    setIsRunning(true);

    const notificationId = Date.now().toString();
    setNotifications([{
      id: notificationId,
      message: "New message received!",
      timestamp: Date.now(),
      status: "sending"
    }]);

    let step = 0;
    const totalSteps = subscribers.length;

    intervalRef.current = setInterval(() => {
      if (step >= totalSteps) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, status: failureOccurred ? "partial" : "complete" } : n
        ));
        return;
      }

      const subscriberIndex = step;
      const subscriber = subscribers[subscriberIndex];
      
      // Simulate sequential processing with random failures
      const willFail = Math.random() < 0.3; // 30% chance of failure
      const isSlow = Math.random() < 0.4; // 40% chance of being slow
      const latency = isSlow ? 800 + Math.random() * 1200 : 100 + Math.random() * 200;

      setSubscribers(prev => prev.map((s, i) => 
        i === subscriberIndex ? { ...s, status: "receiving" } : s
      ));

      setTimeout(() => {
        const notifTypes: ("message" | "like" | "order" | "system")[] = ["message", "like", "order", "system"];
        const notifType = notifTypes[subscriberIndex % notifTypes.length];
        const titles = {
          message: "New message from John",
          like: "Sarah liked your post",
          order: "Order #1234 shipped",
          system: "System maintenance scheduled"
        };
        
        if (willFail) {
          setFailureOccurred(true);
          setSubscribers(prev => prev.map((s, i) => 
            i === subscriberIndex ? { ...s, status: "failed", latency } : s
          ));
          setStats(prev => ({ ...prev, failed: prev.failed + 1, totalLatency: prev.totalLatency + latency }));
          setWebNotifications(prev => [...prev, {
            id: `notif-${subscriberIndex}-${Date.now()}`,
            type: notifType,
            title: titles[notifType],
            description: `Failed to deliver to ${subscriber.name}`,
            time: "Just now",
            read: false,
            status: "failed" as const
          }]);
        } else {
          setSubscribers(prev => prev.map((s, i) => 
            i === subscriberIndex ? { 
              ...s, 
              status: isSlow ? "slow" : "success", 
              receivedAt: Date.now(),
              latency 
            } : s
          ));
          setStats(prev => ({ ...prev, sent: prev.sent + 1, totalLatency: prev.totalLatency + latency }));
          setWebNotifications(prev => [...prev, {
            id: `notif-${subscriberIndex}-${Date.now()}`,
            type: notifType,
            title: titles[notifType],
            description: `Delivered to ${subscriber.name}`,
            time: "Just now",
            read: false,
            status: isSlow ? "delayed" as const : "delivered" as const
          }]);
        }
      }, latency);

      step++;
      setCurrentStep(step);
    }, 1500); // Sequential - one at a time
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getStatusColor = (status: Subscriber["status"]) => {
    switch (status) {
      case "receiving": return "bg-primary/50 animate-pulse";
      case "success": return "bg-success";
      case "failed": return "bg-destructive";
      case "slow": return "bg-warning";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <div>
          <h3 className="font-bold text-lg text-destructive">Basic Implementation</h3>
          <p className="text-sm text-muted-foreground">
            Direct synchronous delivery with no fault tolerance - the "what could go wrong?" approach
          </p>
        </div>
      </div>

      {/* System Design Cards */}
      <SystemDesignCards {...basicSystemDesign} />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Flow Diagram */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitGraph className="h-5 w-5 text-primary" />
              System Flow
            </CardTitle>
            <CardDescription>How notifications flow through the basic system</CardDescription>
          </CardHeader>
          <CardContent>
            <BasicFlowDiagram />
          </CardContent>
        </Card>

        {/* Architecture */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Architecture
            </CardTitle>
            <CardDescription>Simple synchronous fan-out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 font-mono text-sm">
                <pre className="text-muted-foreground whitespace-pre-wrap">{`function sendNotification(message) {
  for (user of subscribers) {
    // Blocking call - waits for each
    await sendToUser(user, message);
    // If this fails, next users
    // might not get notified!
  }
}`}</pre>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Problems:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    Sequential processing - O(n) time complexity
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    No retry mechanism for failures
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    One slow subscriber blocks everyone
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    No delivery guarantees
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Demo */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Live Demo
            </CardTitle>
            <CardDescription>Watch the problems unfold in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={simulateBasicNotification} 
                disabled={isRunning}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Send Notification
              </Button>
              <Button variant="outline" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Progress */}
            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing subscribers...</span>
                  <span>{currentStep}/{subscribers.length}</span>
                </div>
                <Progress value={(currentStep / subscribers.length) * 100} />
              </div>
            )}

            {/* Subscribers Grid */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                Subscribers ({subscribers.length})
              </div>
              <div className="grid grid-cols-5 gap-2">
                {subscribers.map((sub, index) => (
                  <div 
                    key={sub.id}
                    className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                      currentStep === index + 1 && isRunning ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${getStatusColor(sub.status)}`}>
                      {sub.status === "failed" ? (
                        <XCircle className="h-4 w-4 text-white" />
                      ) : sub.status === "slow" ? (
                        <Clock className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-xs font-bold">{sub.name.split(" ")[1]}</span>
                      )}
                    </div>
                    <p className="text-xs font-medium">{sub.name}</p>
                    {sub.latency && (
                      <p className="text-xs text-muted-foreground">{Math.round(sub.latency)}ms</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            {(stats.sent > 0 || stats.failed > 0) && (
              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-secondary/30">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{stats.sent}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{Math.round(stats.totalLatency)}ms</p>
                  <p className="text-xs text-muted-foreground">Total Time</p>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span>Waiting</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary/50 animate-pulse" />
                <span>Processing</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Success</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>Slow</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>Failed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Web Preview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            User Experience Preview
          </CardTitle>
          <CardDescription>How end-users see notifications in the browser</CardDescription>
        </CardHeader>
        <CardContent>
          <WebPreview 
            version="basic" 
            notifications={webNotifications} 
            isLoading={isRunning}
            showIssues={true}
          />
        </CardContent>
      </Card>

      {/* Failure Analysis */}
      <Card className="glass-card border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Why This Breaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
              <h4 className="font-semibold mb-2">Head-of-Line Blocking</h4>
              <p className="text-sm text-muted-foreground">
                If User A is slow, Users B-E wait. One slow subscriber degrades experience for everyone.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
              <h4 className="font-semibold mb-2">No Retry Logic</h4>
              <p className="text-sm text-muted-foreground">
                Failed deliveries are permanently lost. Users miss critical notifications.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
              <h4 className="font-semibold mb-2">Poor Scalability</h4>
              <p className="text-sm text-muted-foreground">
                With 1M subscribers, each notification takes hours to deliver sequentially.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/10">
              <h4 className="font-semibold mb-2">Single Point of Failure</h4>
              <p className="text-sm text-muted-foreground">
                If the sending process crashes, partially-sent notifications can't be recovered.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Experience Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <UnifiedMetricsDashboard 
          version="basic" 
          systemType="notification"
          isSimulating={isRunning} 
          externalStats={stats}
        />
        <UnifiedLoadSimulator version="basic" systemType="notification" />
      </div>

      <UnifiedFlowAnimation version="basic" systemType="notification" />

      {/* Discussion Section */}
      <DiscussionSection 
        title="Discussion: Basic Approach" 
        comments={basicDiscussionData}
        accentColor="destructive"
      />
    </div>
  );
};

export default BasicVersion;
