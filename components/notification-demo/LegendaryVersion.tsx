import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Users, Bell, CheckCircle, XCircle, Crown, Database, Layers, Shield, Zap, ArrowRight, Monitor, GitGraph } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import WebPreview from "./WebPreview";
import { LegendaryFlowDiagram } from "./FlowDiagram";
import DiscussionSection, { legendaryDiscussionData } from "./DiscussionSection";
import SystemDesignCards, { legendarySystemDesign } from "./SystemDesignCards";
import { UnifiedFlowAnimation, UnifiedMetricsDashboard, UnifiedLoadSimulator } from "@/components/visualization";


interface Subscriber {
  id: string;
  name: string;
  partition: number;
  status: "idle" | "queued" | "receiving" | "success" | "acknowledged";
  messageId?: string;
  sequence?: number;
}

interface Message {
  id: string;
  content: string;
  partition: number;
  sequence: number;
  status: "pending" | "persisted" | "delivered" | "acknowledged";
  dedupeKey: string;
}

interface Partition {
  id: number;
  messages: Message[];
  currentOffset: number;
  consumerOffset: number;
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

const LegendaryVersion = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    { id: "1", name: "User A", partition: 0, status: "idle" },
    { id: "2", name: "User B", partition: 0, status: "idle" },
    { id: "3", name: "User C", partition: 1, status: "idle" },
    { id: "4", name: "User D", partition: 1, status: "idle" },
    { id: "5", name: "User E", partition: 2, status: "idle" },
    { id: "6", name: "User F", partition: 2, status: "idle" },
    { id: "7", name: "User G", partition: 0, status: "idle" },
    { id: "8", name: "User H", partition: 1, status: "idle" },
    { id: "9", name: "User I", partition: 2, status: "idle" },
    { id: "10", name: "User J", partition: 0, status: "idle" },
  ]);
  const [partitions, setPartitions] = useState<Partition[]>([
    { id: 0, messages: [], currentOffset: 0, consumerOffset: 0 },
    { id: 1, messages: [], currentOffset: 0, consumerOffset: 0 },
    { id: 2, messages: [], currentOffset: 0, consumerOffset: 0 },
  ]);
  const [webNotifications, setWebNotifications] = useState<WebNotification[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [duplicateBlocked, setDuplicateBlocked] = useState(false);
  const [stats, setStats] = useState({ sent: 0, failed: 0, totalLatency: 0, acknowledged: 0, duplicatesBlocked: 0, throughput: 0 });
  const [processedDedupeKeys, setProcessedDedupeKeys] = useState<Set<string>>(new Set());
  const [consumerLag, setConsumerLag] = useState([0, 0, 0]);
  const startTimeRef = useRef<number>(0);

  const reset = () => {
    setSubscribers(subscribers.map(s => ({ ...s, status: "idle", messageId: undefined, sequence: undefined })));
    setPartitions([
      { id: 0, messages: [], currentOffset: 0, consumerOffset: 0 },
      { id: 1, messages: [], currentOffset: 0, consumerOffset: 0 },
      { id: 2, messages: [], currentOffset: 0, consumerOffset: 0 },
    ]);
    setWebNotifications([]);
    setIsRunning(false);
    setShowDuplicate(false);
    setDuplicateBlocked(false);
    setStats({ sent: 0, failed: 0, totalLatency: 0, acknowledged: 0, duplicatesBlocked: 0, throughput: 0 });
    setProcessedDedupeKeys(new Set());
    setConsumerLag([0, 0, 0]);
  };

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const simulateLegendaryNotification = () => {
    if (isRunning) return;
    reset();
    setIsRunning(true);
    startTimeRef.current = Date.now();

    // Step 1: Write to partitioned log (persist first)
    const newMessages: Message[] = [];
    const updatedPartitions = [...partitions];
    
    subscribers.forEach((sub, idx) => {
      const partition = updatedPartitions[sub.partition];
      const message: Message = {
        id: generateMessageId(),
        content: "New notification",
        partition: sub.partition,
        sequence: partition.currentOffset,
        status: "pending",
        dedupeKey: `${sub.id}_${Date.now()}`
      };
      partition.messages.push(message);
      partition.currentOffset++;
      newMessages.push(message);
    });

    setPartitions(updatedPartitions);

    // Step 2: Mark as persisted
    setTimeout(() => {
      setPartitions(prev => prev.map(p => ({
        ...p,
        messages: p.messages.map(m => ({ ...m, status: "persisted" as const }))
      })));
      setSubscribers(prev => prev.map(s => ({ ...s, status: "queued" })));
    }, 300);

    // Step 3: Process each partition independently (ordered within partition)
    partitions.forEach((partition, pIdx) => {
      const partitionSubscribers = subscribers.filter(s => s.partition === pIdx);
      
      partitionSubscribers.forEach((sub, sIdx) => {
        const delay = 500 + (pIdx * 100) + (sIdx * 200); // Staggered by partition
        
        setTimeout(() => {
          // Delivery
          setSubscribers(prev => prev.map(s => 
            s.id === sub.id ? { ...s, status: "receiving", sequence: sIdx } : s
          ));

          setTimeout(() => {
            // Success + Acknowledge
            const notifTypes: ("message" | "like" | "order" | "system")[] = ["message", "like", "order", "system"];
            const notifType = notifTypes[parseInt(sub.id) % notifTypes.length];
            const titles = {
              message: "New message from John",
              like: "Sarah liked your post",
              order: "Order #1234 shipped",
              system: "System maintenance scheduled"
            };

            setSubscribers(prev => prev.map(s => 
              s.id === sub.id ? { ...s, status: "success" } : s
            ));
            setStats(prev => ({ ...prev, sent: prev.sent + 1 }));

            // Add to web notifications
            setWebNotifications(prev => [...prev, {
              id: `notif-${sub.id}-${Date.now()}`,
              type: notifType,
              title: titles[notifType],
              description: `Delivered to ${sub.name} (Partition ${pIdx}, Seq ${sIdx})`,
              time: "Just now",
              read: false,
              status: "delivered" as const
            }]);

            setTimeout(() => {
              setSubscribers(prev => prev.map(s => 
                s.id === sub.id ? { ...s, status: "acknowledged" } : s
              ));
              setPartitions(prev => prev.map((p, i) => 
                i === pIdx ? { ...p, consumerOffset: p.consumerOffset + 1 } : p
              ));
              setStats(prev => ({ 
                ...prev, 
                acknowledged: prev.acknowledged + 1,
                throughput: Math.round((prev.acknowledged + 1) / ((Date.now() - startTimeRef.current) / 1000))
              }));

              // Check if all done
              const totalAcked = subscribers.length;
              setStats(prev => {
                if (prev.acknowledged >= totalAcked - 1) {
                  setTimeout(() => setIsRunning(false), 200);
                }
                return prev;
              });
            }, 150);
          }, 200);
        }, delay);
      });
    });
  };

  const simulateDuplicate = () => {
    if (!isRunning && stats.acknowledged > 0) {
      setShowDuplicate(true);
      setTimeout(() => {
        setDuplicateBlocked(true);
        setStats(prev => ({ ...prev, duplicatesBlocked: prev.duplicatesBlocked + 1 }));
      }, 800);
    }
  };

  const getStatusColor = (status: Subscriber["status"]) => {
    switch (status) {
      case "queued": return "bg-secondary";
      case "receiving": return "bg-primary/50 animate-pulse";
      case "success": return "bg-success";
      case "acknowledged": return "bg-primary";
      default: return "bg-muted";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
        <Crown className="h-8 w-8 text-primary" />
        <div>
          <h3 className="font-bold text-lg text-primary">Legendary Implementation</h3>
          <p className="text-sm text-muted-foreground">
            Kafka-style partitioned log with exactly-once semantics - production ready
          </p>
        </div>
      </div>

      {/* System Design Cards */}
      <SystemDesignCards {...legendarySystemDesign} />

      {/* All Problems Solved */}
      <Card className="glass-card border-success/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            All Problems Solved
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-success/5 border border-success/10">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Database className="h-4 w-4 text-success" />
                Durable Persistence
              </h4>
              <p className="text-sm text-muted-foreground">
                Messages written to partitioned log before delivery. Survives crashes.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/10">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-success" />
                Ordered Delivery
              </h4>
              <p className="text-sm text-muted-foreground">
                Partitioning by user ensures messages arrive in order per user.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/10">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                Exactly-Once Semantics
              </h4>
              <p className="text-sm text-muted-foreground">
                Idempotency keys + consumer offsets prevent duplicate processing.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-success/5 border border-success/10">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-success" />
                Back-Pressure
              </h4>
              <p className="text-sm text-muted-foreground">
                Consumer lag monitoring allows graceful degradation under load.
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
            <CardDescription>How notifications flow through the Kafka-style partitioned log</CardDescription>
          </CardHeader>
          <CardContent>
            <LegendaryFlowDiagram />
          </CardContent>
        </Card>

        {/* Architecture */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Architecture
            </CardTitle>
            <CardDescription>Kafka-style partitioned log with consumers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 font-mono text-sm">
                <pre className="text-muted-foreground whitespace-pre-wrap">{`// Producer
function sendNotification(userId, msg) {
  partition = hash(userId) % NUM_PARTITIONS
  offset = log[partition].append({
    id: uuid(),
    dedupeKey: \`\${userId}_\${timestamp}\`,
    msg
  })
  return { partition, offset }
}

// Consumer (per partition)
while (true) {
  batch = log[partition].read(offset, 100)
  for (msg of batch) {
    if (seen.has(msg.dedupeKey)) continue
    await deliver(msg)
    seen.add(msg.dedupeKey)
  }
  commitOffset(partition, batch.lastOffset)
}`}</pre>
              </div>

              {/* Partitions Visualization */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Partition State</h4>
                <div className="space-y-2">
                  {partitions.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                      <span className="text-xs font-mono w-20">Partition {i}</span>
                      <div className="flex-1">
                        <Progress 
                          value={p.currentOffset > 0 ? (p.consumerOffset / p.currentOffset) * 100 : 0} 
                          className="h-2"
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">
                        {p.consumerOffset}/{p.currentOffset}
                      </span>
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
            <CardDescription>Watch partition-aware processing with acks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={simulateLegendaryNotification} 
                disabled={isRunning}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Send Notification
              </Button>
              <Button 
                variant="outline" 
                onClick={simulateDuplicate}
                disabled={isRunning || stats.acknowledged === 0}
                className="gap-2"
              >
                <Shield className="h-4 w-4" />
                Try Duplicate
              </Button>
              <Button variant="outline" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Duplicate Blocked Indicator */}
            {showDuplicate && (
              <div className={`p-3 rounded-lg border transition-all ${
                duplicateBlocked 
                  ? "bg-success/10 border-success/20" 
                  : "bg-warning/10 border-warning/20 animate-pulse"
              }`}>
                {duplicateBlocked ? (
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Duplicate blocked by idempotency check!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-warning">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-medium">Checking dedupe key...</span>
                  </div>
                )}
              </div>
            )}

            {/* Subscribers Grid by Partition */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" />
                Subscribers by Partition
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map(partitionId => (
                  <div key={partitionId} className="p-3 rounded-lg bg-secondary/20 border border-border/50">
                    <div className="text-xs font-mono text-muted-foreground mb-2 flex items-center gap-1">
                      <Database className="h-3 w-3" />
                      Partition {partitionId}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {subscribers.filter(s => s.partition === partitionId).map((sub) => (
                        <div 
                          key={sub.id}
                          className="p-1.5 rounded border text-center"
                        >
                          <div className={`w-5 h-5 rounded-full mx-auto mb-0.5 flex items-center justify-center ${getStatusColor(sub.status)}`}>
                            {sub.status === "acknowledged" ? (
                              <CheckCircle className="h-3 w-3 text-white" />
                            ) : (
                              <span className="text-[10px] font-bold">{sub.name.split(" ")[1]}</span>
                            )}
                          </div>
                          <p className="text-[10px]">{sub.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 p-4 rounded-lg bg-secondary/30">
              <div className="text-center">
                <p className="text-xl font-bold text-success">{stats.sent}</p>
                <p className="text-xs text-muted-foreground">Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{stats.acknowledged}</p>
                <p className="text-xs text-muted-foreground">Acknowledged</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-warning">{stats.duplicatesBlocked}</p>
                <p className="text-xs text-muted-foreground">Dupes Blocked</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{stats.throughput}/s</p>
                <p className="text-xs text-muted-foreground">Throughput</p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span>Queued</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary/50" />
                <span>Delivering</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Delivered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Acknowledged</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Production Considerations */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Production Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h4 className="font-semibold mb-2">Replication Factor</h4>
              <p className="text-sm text-muted-foreground">
                In production, each partition would be replicated 3x for fault tolerance.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h4 className="font-semibold mb-2">Consumer Groups</h4>
              <p className="text-sm text-muted-foreground">
                Multiple consumer groups can read the same log independently (e.g., email + push).
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h4 className="font-semibold mb-2">Dead Letter Queue</h4>
              <p className="text-sm text-muted-foreground">
                Failed messages after N retries go to DLQ for manual inspection.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <h4 className="font-semibold mb-2">Compaction</h4>
              <p className="text-sm text-muted-foreground">
                Old acknowledged messages are periodically compacted to save storage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evolution Summary */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Architecture Evolution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
            <div className="flex-1 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
              <Zap className="h-6 w-6 text-destructive mx-auto mb-2" />
              <h4 className="font-semibold">Basic</h4>
              <p className="text-xs text-muted-foreground mt-1">Sync loop, no retries, O(n) time</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
            <div className="flex-1 p-4 rounded-lg bg-warning/10 border border-warning/20 text-center">
              <Shield className="h-6 w-6 text-warning mx-auto mb-2" />
              <h4 className="font-semibold">Advanced</h4>
              <p className="text-xs text-muted-foreground mt-1">Queue + workers + retries, in-memory</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
            <div className="flex-1 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
              <Crown className="h-6 w-6 text-primary mx-auto mb-2" />
              <h4 className="font-semibold">Legendary</h4>
              <p className="text-xs text-muted-foreground mt-1">Partitioned log, exactly-once, durable</p>
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
          <CardDescription>How end-users see notifications - ordered, no duplicates, all delivered</CardDescription>
        </CardHeader>
        <CardContent>
          <WebPreview 
            version="legendary" 
            notifications={webNotifications} 
            isLoading={isRunning}
            showIssues={false}
          />
        </CardContent>
      </Card>

      {/* Visual Experience Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <UnifiedMetricsDashboard 
          version="legendary" 
          systemType="notification"
          isSimulating={isRunning} 
        />
        <UnifiedLoadSimulator version="legendary" systemType="notification" />
      </div>

      <UnifiedFlowAnimation version="legendary" systemType="notification" />

      {/* Discussion Section */}
      <DiscussionSection 
        title="Discussion: Legendary Approach" 
        comments={legendaryDiscussionData}
        accentColor="primary"
      />
    </div>
  );
};

export default LegendaryVersion;
