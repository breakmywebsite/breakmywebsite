import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Play, RotateCcw, Users, Bell, CheckCircle, XCircle, Clock, Shield, ArrowRight, Monitor, GitGraph } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import WebPreview from "./WebPreview";
import { AdvancedFlowDiagram } from "./FlowDiagram";
import DiscussionSection, { advancedDiscussionData } from "./DiscussionSection";
import SystemDesignCards, { advancedSystemDesign } from "./SystemDesignCards";
import { UnifiedFlowAnimation, UnifiedMetricsDashboard, UnifiedLoadSimulator } from "@/components/visualization";


interface Subscriber {
  id: string;
  name: string;
  status: "idle" | "queued" | "receiving" | "success" | "failed" | "retrying";
  receivedAt?: number;
  latency?: number;
  retries?: number;
}

interface QueueItem {
  subscriberId: string;
  status: "pending" | "processing" | "done" | "failed";
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

const AdvancedVersion = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: "1", name: "User A", status: "idle" },
    { id: "2", name: "User B", status: "idle" },
    { id: "3", name: "User C", status: "idle" },
    { id: "4", name: "User D", status: "idle" },
    { id: "5", name: "User E", status: "idle" },
    { id: "6", name: "User F", status: "idle" },
    { id: "7", name: "User G", status: "idle" },
    { id: "8", name: "User H", status: "idle" },
  ]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [webNotifications, setWebNotifications] = useState<WebNotification[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({ sent: 0, failed: 0, retried: 0, totalLatency: 0 });
  const [workerStatus, setWorkerStatus] = useState<("idle" | "busy")[]>(["idle", "idle", "idle"]);
  const [hasDuplicate, setHasDuplicate] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const reset = () => {
    setSubscribers(subscribers.map(s => ({ ...s, status: "idle", receivedAt: undefined, latency: undefined, retries: 0 })));
    setQueue([]);
    setWebNotifications([]);
    setIsRunning(false);
    setStats({ sent: 0, failed: 0, retried: 0, totalLatency: 0 });
    setWorkerStatus(["idle", "idle", "idle"]);
    setHasDuplicate(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const simulateAdvancedNotification = () => {
    if (isRunning) return;
    reset();
    setIsRunning(true);

    // Initialize queue with all subscribers
    const initialQueue: QueueItem[] = subscribers.map(s => ({
      subscriberId: s.id,
      status: "pending" as const
    }));
    setQueue(initialQueue);
    setSubscribers(prev => prev.map(s => ({ ...s, status: "queued" })));

    let processingIndex = 0;
    const maxRetries = 2;
    const retryQueue: { subscriberId: string; retries: number }[] = [];

    const processNext = (workerIndex: number) => {
      // Check retry queue first
      if (retryQueue.length > 0) {
        const retryItem = retryQueue.shift()!;
        processSubscriber(retryItem.subscriberId, workerIndex, retryItem.retries);
        return;
      }

      // Then check main queue
      if (processingIndex < subscribers.length) {
        const subscriber = subscribers[processingIndex];
        processingIndex++;
        processSubscriber(subscriber.id, workerIndex, 0);
      } else {
        setWorkerStatus(prev => {
          const updated = [...prev];
          updated[workerIndex] = "idle";
          return updated;
        });
        
        // Check if all workers are done
        setTimeout(() => {
          setWorkerStatus(prev => {
            if (prev.every(w => w === "idle") && retryQueue.length === 0) {
              setIsRunning(false);
            }
            return prev;
          });
        }, 100);
      }
    };

    const processSubscriber = (subscriberId: string, workerIndex: number, currentRetries: number) => {
      setWorkerStatus(prev => {
        const updated = [...prev];
        updated[workerIndex] = "busy";
        return updated;
      });

      setSubscribers(prev => prev.map(s => 
        s.id === subscriberId ? { ...s, status: currentRetries > 0 ? "retrying" : "receiving" } : s
      ));

      setQueue(prev => prev.map(q => 
        q.subscriberId === subscriberId ? { ...q, status: "processing" } : q
      ));

      const willFail = Math.random() < 0.25; // 25% failure rate
      const latency = 200 + Math.random() * 400;

      setTimeout(() => {
        const notifTypes: ("message" | "like" | "order" | "system")[] = ["message", "like", "order", "system"];
        const sub = subscribers.find(s => s.id === subscriberId);
        const notifType = notifTypes[parseInt(subscriberId) % notifTypes.length];
        const titles = {
          message: "New message from John",
          like: "Sarah liked your post",
          order: "Order #1234 shipped",
          system: "System maintenance scheduled"
        };

        if (willFail && currentRetries < maxRetries) {
          // Add to retry queue
          retryQueue.push({ subscriberId, retries: currentRetries + 1 });
          setStats(prev => ({ ...prev, retried: prev.retried + 1 }));
          setSubscribers(prev => prev.map(s => 
            s.id === subscriberId ? { ...s, status: "queued", retries: currentRetries + 1 } : s
          ));
        } else if (willFail) {
          // Max retries exceeded
          setSubscribers(prev => prev.map(s => 
            s.id === subscriberId ? { ...s, status: "failed", latency, retries: currentRetries } : s
          ));
          setQueue(prev => prev.map(q => 
            q.subscriberId === subscriberId ? { ...q, status: "failed" } : q
          ));
          setStats(prev => ({ ...prev, failed: prev.failed + 1, totalLatency: prev.totalLatency + latency }));
          setWebNotifications(prev => [...prev, {
            id: `notif-${subscriberId}-${Date.now()}`,
            type: notifType,
            title: titles[notifType],
            description: `Failed after ${currentRetries} retries`,
            time: "Just now",
            read: false,
            status: "failed" as const
          }]);
        } else {
          // Success - but might create duplicate in advanced version (no dedup)
          const isDuplicate = currentRetries > 0 && Math.random() < 0.3;
          
          setSubscribers(prev => prev.map(s => 
            s.id === subscriberId ? { ...s, status: "success", receivedAt: Date.now(), latency, retries: currentRetries } : s
          ));
          setQueue(prev => prev.map(q => 
            q.subscriberId === subscriberId ? { ...q, status: "done" } : q
          ));
          setStats(prev => ({ ...prev, sent: prev.sent + 1, totalLatency: prev.totalLatency + latency }));
          setWebNotifications(prev => [...prev, {
            id: `notif-${subscriberId}-${Date.now()}`,
            type: notifType,
            title: titles[notifType],
            description: sub ? `Delivered to ${sub.name}` : "Delivered",
            time: "Just now",
            read: false,
            status: isDuplicate ? "duplicate" as const : "delivered" as const
          }]);
          if (isDuplicate) {
            setHasDuplicate(true);
            // Add duplicate notification
            setTimeout(() => {
              setWebNotifications(prev => [...prev, {
                id: `notif-${subscriberId}-dup-${Date.now()}`,
                type: notifType,
                title: titles[notifType] + " (DUPLICATE)",
                description: "Same notification sent twice!",
                time: "Just now",
                read: false,
                status: "duplicate" as const
              }]);
            }, 200);
          }
        }

        // Process next item
        processNext(workerIndex);
      }, latency);
    };

    // Start 3 parallel workers
    setTimeout(() => processNext(0), 0);
    setTimeout(() => processNext(1), 100);
    setTimeout(() => processNext(2), 200);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getStatusColor = (status: Subscriber["status"]) => {
    switch (status) {
      case "queued": return "bg-secondary";
      case "receiving": return "bg-primary/50 animate-pulse";
      case "retrying": return "bg-warning/50 animate-pulse";
      case "success": return "bg-success";
      case "failed": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
        <Shield className="h-8 w-8 text-warning" />
        <div>
          <h3 className="font-bold text-lg text-warning">Advanced Implementation</h3>
          <p className="text-sm text-muted-foreground">
            Message queue with parallel workers and retry logic - better, but not perfect
          </p>
        </div>
      </div>

      {/* System Design Cards */}
      <SystemDesignCards {...advancedSystemDesign} />

      {/* What This Solves */}
      <Card className="glass-card border-success/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            Improvements Over Basic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-success/5 border border-success/10">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Parallel Processing
              </h4>
              <p className="text-sm text-muted-foreground">
                3 workers process simultaneously, reducing total time by ~3x
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/10">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Retry Mechanism
              </h4>
              <p className="text-sm text-muted-foreground">
                Failed deliveries are retried up to 2 times before giving up
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/10">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Queue Decoupling
              </h4>
              <p className="text-sm text-muted-foreground">
                Notifications are queued, isolating producers from consumers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Flow Diagram */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitGraph className="h-5 w-5 text-primary" />
              System Flow
            </CardTitle>
            <CardDescription>How notifications flow through the queue-based system</CardDescription>
          </CardHeader>
          <CardContent>
            <AdvancedFlowDiagram />
          </CardContent>
        </Card>

        {/* Architecture */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Architecture
            </CardTitle>
            <CardDescription>Queue-based with parallel workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 font-mono text-sm">
                <pre className="text-muted-foreground whitespace-pre-wrap">{`// Producer
function sendNotification(message) {
  for (user of subscribers) {
    queue.push({ user, message });
  }
}

// Workers (x3)
while (item = queue.pop()) {
  try {
    await sendToUser(item);
  } catch (e) {
    if (item.retries < MAX_RETRIES) {
      queue.push({ ...item, retries++ });
    }
  }
}`}</pre>
              </div>

              {/* Worker Status */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Worker Status</h4>
                <div className="flex gap-2">
                  {workerStatus.map((status, i) => (
                    <div 
                      key={i}
                      className={`flex-1 p-2 rounded-lg text-center text-sm font-medium ${
                        status === "busy" 
                          ? "bg-primary/20 text-primary animate-pulse" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      Worker {i + 1}: {status}
                    </div>
                  ))}
                </div>
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
            <CardDescription>Watch parallel processing with retries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={simulateAdvancedNotification} 
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

            {/* Subscribers Grid */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                Subscribers ({subscribers.length})
              </div>
              <div className="grid grid-cols-4 gap-2">
                {subscribers.map((sub) => (
                  <div 
                    key={sub.id}
                    className="p-2 rounded-lg border text-center transition-all duration-300"
                  >
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${getStatusColor(sub.status)}`}>
                      {sub.status === "failed" ? (
                        <XCircle className="h-3 w-3 text-white" />
                      ) : sub.status === "retrying" ? (
                        <Clock className="h-3 w-3 text-white" />
                      ) : (
                        <span className="text-xs font-bold">{sub.name.split(" ")[1]}</span>
                      )}
                    </div>
                    <p className="text-xs font-medium">{sub.name}</p>
                    {sub.retries !== undefined && sub.retries > 0 && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {sub.retries} retry
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            {(stats.sent > 0 || stats.failed > 0 || stats.retried > 0) && (
              <div className="grid grid-cols-4 gap-3 p-4 rounded-lg bg-secondary/30">
                <div className="text-center">
                  <p className="text-xl font-bold text-success">{stats.sent}</p>
                  <p className="text-xs text-muted-foreground">Delivered</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-warning">{stats.retried}</p>
                  <p className="text-xs text-muted-foreground">Retried</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-destructive">{stats.failed}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{Math.round(stats.totalLatency / Math.max(1, stats.sent + stats.failed))}ms</p>
                  <p className="text-xs text-muted-foreground">Avg Time</p>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span>Queued</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary/50" />
                <span>Processing</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-warning/50" />
                <span>Retrying</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Success</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>Failed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remaining Issues */}
      <Card className="glass-card border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Remaining Problems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/10">
              <h4 className="font-semibold mb-2">No Deduplication</h4>
              <p className="text-sm text-muted-foreground">
                If a message is processed twice during retry, users get duplicate notifications.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/10">
              <h4 className="font-semibold mb-2">No Ordering</h4>
              <p className="text-sm text-muted-foreground">
                Parallel workers mean notifications may arrive out of order.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/10">
              <h4 className="font-semibold mb-2">In-Memory Queue</h4>
              <p className="text-sm text-muted-foreground">
                Server crash = lost queue. No persistence or durability guarantees.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/5 border border-warning/10">
              <h4 className="font-semibold mb-2">No Rate Control</h4>
              <p className="text-sm text-muted-foreground">
                All workers run at full speed, potentially overwhelming downstream services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Web Preview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            User Experience Preview
          </CardTitle>
          <CardDescription>How end-users see notifications - notice possible duplicates</CardDescription>
        </CardHeader>
        <CardContent>
          <WebPreview 
            version="advanced" 
            notifications={webNotifications} 
            isLoading={isRunning}
            showIssues={true}
          />
        </CardContent>
      </Card>

      {/* Visual Experience Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <UnifiedMetricsDashboard 
          version="advanced" 
          systemType="notification"
          isSimulating={isRunning} 
        />
        <UnifiedLoadSimulator version="advanced" systemType="notification" />
      </div>

      <UnifiedFlowAnimation version="advanced" systemType="notification" />

      {/* Discussion Section */}
      <DiscussionSection 
        title="Discussion: Advanced Approach" 
        comments={advancedDiscussionData}
        accentColor="warning"
      />
    </div>
  );
};

export default AdvancedVersion;
