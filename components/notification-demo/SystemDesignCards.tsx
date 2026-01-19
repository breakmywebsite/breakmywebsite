import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, FileCode, Layers, Network, Target, Gauge } from "lucide-react";

interface Requirement {
  name: string;
  description: string;
}

interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  route: string;
  description: string;
  requestBody?: string;
  responseBody: string;
}

interface SystemDesignProps {
  version: "basic" | "advanced" | "legendary";
  functionalReqs: Requirement[];
  nonFunctionalReqs: { name: string; description: string; supported: boolean }[];
  highLevelDesign: {
    description: string;
    components: { name: string; description: string }[];
    diagram: string;
  };
  lowLevelDesign: {
    description: string;
    details: { title: string; content: string }[];
  };
  apiEndpoints: ApiEndpoint[];
}

const methodColors = {
  GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  POST: "bg-green-500/20 text-green-400 border-green-500/30",
  PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
};

const SystemDesignCards = ({
  version,
  functionalReqs,
  nonFunctionalReqs,
  highLevelDesign,
  lowLevelDesign,
  apiEndpoints,
}: SystemDesignProps) => {
  const versionColors = {
    basic: "destructive",
    advanced: "warning", 
    legendary: "primary",
  };

  return (
    <div className="space-y-6">
      {/* Requirements Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Functional Requirements */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-primary" />
              Functional Requirements
            </CardTitle>
            <CardDescription>What the system must do</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {functionalReqs.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  <div>
                    <span className="font-medium text-sm">{req.name}</span>
                    <p className="text-xs text-muted-foreground">{req.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Non-Functional Requirements */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="h-5 w-5 text-primary" />
              Non-Functional Requirements
            </CardTitle>
            <CardDescription>Quality attributes & constraints</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {nonFunctionalReqs.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {req.supported ? (
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  )}
                  <div>
                    <span className="font-medium text-sm">{req.name}</span>
                    <p className="text-xs text-muted-foreground">{req.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* High Level Design */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers className="h-5 w-5 text-primary" />
            High Level Design (HLD)
          </CardTitle>
          <CardDescription>{highLevelDesign.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ASCII Diagram */}
          <div className="p-4 rounded-lg bg-secondary/50 font-mono text-xs overflow-x-auto">
            <pre className="text-muted-foreground whitespace-pre">{highLevelDesign.diagram}</pre>
          </div>

          {/* Components */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {highLevelDesign.components.map((comp, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                <h4 className="font-semibold text-sm mb-1">{comp.name}</h4>
                <p className="text-xs text-muted-foreground">{comp.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Low Level Design */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCode className="h-5 w-5 text-primary" />
            Low Level Design (LLD)
          </CardTitle>
          <CardDescription>{lowLevelDesign.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {lowLevelDesign.details.map((detail, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <h4 className="font-semibold text-sm mb-2">{detail.title}</h4>
                <div className="font-mono text-xs bg-background/50 p-3 rounded overflow-x-auto">
                  <pre className="text-muted-foreground whitespace-pre">{detail.content}</pre>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Design */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="h-5 w-5 text-primary" />
            API Design
          </CardTitle>
          <CardDescription>RESTful endpoints for notification management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiEndpoints.map((endpoint, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`${methodColors[endpoint.method]} font-mono text-xs`}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-sm font-mono text-foreground">{endpoint.route}</code>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {endpoint.requestBody && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Request Body</span>
                      <div className="mt-1 p-2 rounded bg-background/50 font-mono text-xs overflow-x-auto">
                        <pre className="text-green-400">{endpoint.requestBody}</pre>
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Response</span>
                    <div className="mt-1 p-2 rounded bg-background/50 font-mono text-xs overflow-x-auto">
                      <pre className="text-blue-400">{endpoint.responseBody}</pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============ DATA FOR EACH VERSION ============

export const basicSystemDesign: SystemDesignProps = {
  version: "basic",
  functionalReqs: [
    { name: "Send Notifications", description: "Deliver messages to subscribed users" },
    { name: "Multi-user Delivery", description: "Send same notification to multiple recipients" },
    { name: "Real-time Delivery", description: "Notifications should arrive promptly" },
  ],
  nonFunctionalReqs: [
    { name: "Scalability", description: "Handle growing user base", supported: false },
    { name: "Fault Tolerance", description: "Continue working despite failures", supported: false },
    { name: "Low Latency", description: "Sub-second delivery times", supported: false },
    { name: "Reliability", description: "Guaranteed delivery", supported: false },
  ],
  highLevelDesign: {
    description: "Simple synchronous architecture with direct delivery",
    components: [
      { name: "API Server", description: "Handles incoming notification requests" },
      { name: "Notification Service", description: "Iterates through users and sends" },
      { name: "User Store", description: "Database of subscribed users" },
    ],
    diagram: `
┌─────────────┐     ┌─────────────────────┐     ┌─────────────┐
│   Client    │────▶│    API Server       │────▶│  User Store │
└─────────────┘     └─────────────────────┘     └─────────────┘
                              │
                              │ for each user (blocking)
                              ▼
                    ┌─────────────────────┐
                    │   User A ──▶ Wait   │
                    │   User B ──▶ Wait   │
                    │   User C ──▶ Wait   │
                    │        ...          │
                    └─────────────────────┘
`,
  },
  lowLevelDesign: {
    description: "Direct iteration with synchronous HTTP calls",
    details: [
      {
        title: "Notification Loop",
        content: `async function notify(message) {
  const users = await db.getUsers();
  
  for (const user of users) {
    // BLOCKING: waits for each
    await sendToUser(user, message);
  }
  
  return { success: true };
}`,
      },
      {
        title: "Send Function",
        content: `async function sendToUser(user, msg) {
  // Direct HTTP call
  const response = await fetch(
    user.webhookUrl,
    {
      method: 'POST',
      body: JSON.stringify(msg)
    }
  );
  
  // No retry on failure!
  return response.ok;
}`,
      },
    ],
  },
  apiEndpoints: [
    {
      method: "POST",
      route: "/api/notifications",
      description: "Send notification to all subscribers (blocks until complete)",
      requestBody: `{
  "message": "Hello World",
  "type": "alert"
}`,
      responseBody: `{
  "success": true,
  "delivered": 5,
  "failed": 0,
  "totalTime": "15000ms"
}`,
    },
    {
      method: "GET",
      route: "/api/subscribers",
      description: "Get list of all subscribers",
      responseBody: `{
  "subscribers": [
    { "id": "1", "name": "User A" },
    { "id": "2", "name": "User B" }
  ]
}`,
    },
  ],
};

export const advancedSystemDesign: SystemDesignProps = {
  version: "advanced",
  functionalReqs: [
    { name: "Send Notifications", description: "Deliver messages to subscribed users" },
    { name: "Multi-user Delivery", description: "Send same notification to multiple recipients" },
    { name: "Retry Failed", description: "Automatically retry failed deliveries" },
    { name: "Parallel Processing", description: "Process multiple users simultaneously" },
  ],
  nonFunctionalReqs: [
    { name: "Scalability", description: "Handle growing user base with workers", supported: true },
    { name: "Fault Tolerance", description: "Retry mechanism for transient failures", supported: true },
    { name: "Low Latency", description: "Parallel processing reduces time", supported: true },
    { name: "Durability", description: "Queue survives crashes", supported: false },
    { name: "Exactly-Once", description: "Prevent duplicate deliveries", supported: false },
  ],
  highLevelDesign: {
    description: "Queue-based architecture with parallel worker pools",
    components: [
      { name: "API Server", description: "Accepts requests and enqueues jobs" },
      { name: "Message Queue", description: "In-memory buffer for pending notifications" },
      { name: "Worker Pool", description: "Parallel consumers processing the queue" },
      { name: "Retry Handler", description: "Re-enqueues failed deliveries" },
    ],
    diagram: `
┌─────────────┐     ┌─────────────────────┐
│   Client    │────▶│    API Server       │
└─────────────┘     └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Message Queue     │◀──── Retry
                    │  [■ ■ ■ ■ ■ ■ ■ ■] │       │
                    └─────────────────────┘       │
                       │     │     │             │
                       ▼     ▼     ▼             │
                    ┌─────┐┌─────┐┌─────┐        │
                    │ W1  ││ W2  ││ W3  │────────┘
                    └─────┘└─────┘└─────┘
                       │     │     │
                       ▼     ▼     ▼
                    [Users delivered in parallel]
`,
  },
  lowLevelDesign: {
    description: "In-memory queue with worker threads and retry logic",
    details: [
      {
        title: "Producer (Enqueue)",
        content: `async function notify(message) {
  const users = await db.getUsers();
  
  for (const user of users) {
    queue.push({
      user,
      message,
      retries: 0
    });
  }
  
  // Return immediately
  return { queued: users.length };
}`,
      },
      {
        title: "Consumer (Worker)",
        content: `async function worker() {
  while (true) {
    const job = await queue.pop();
    
    try {
      await sendToUser(job.user, job.msg);
    } catch (err) {
      if (job.retries < MAX_RETRIES) {
        queue.push({
          ...job,
          retries: job.retries + 1
        });
      }
    }
  }
}`,
      },
      {
        title: "Queue Implementation",
        content: `class InMemoryQueue {
  private items: Job[] = [];
  
  push(job: Job) {
    this.items.push(job);
  }
  
  pop(): Job | undefined {
    return this.items.shift();
  }
  
  // WARNING: Lost on crash!
}`,
      },
      {
        title: "Worker Pool",
        content: `const WORKER_COUNT = 3;
const workers = [];

for (let i = 0; i < WORKER_COUNT; i++) {
  workers.push(
    spawn(worker, { id: i })
  );
}

// No coordination between
// workers - race conditions!`,
      },
    ],
  },
  apiEndpoints: [
    {
      method: "POST",
      route: "/api/notifications",
      description: "Queue notification for async delivery",
      requestBody: `{
  "message": "Hello World",
  "type": "alert",
  "priority": "normal"
}`,
      responseBody: `{
  "success": true,
  "queued": 8,
  "jobId": "job_abc123"
}`,
    },
    {
      method: "GET",
      route: "/api/notifications/:jobId/status",
      description: "Check delivery status of a notification job",
      responseBody: `{
  "jobId": "job_abc123",
  "status": "processing",
  "delivered": 5,
  "pending": 2,
  "failed": 1,
  "retrying": 0
}`,
    },
    {
      method: "GET",
      route: "/api/queue/stats",
      description: "Get queue health metrics",
      responseBody: `{
  "queueLength": 42,
  "activeWorkers": 3,
  "avgProcessingTime": "250ms",
  "retryRate": "15%"
}`,
    },
  ],
};

export const legendarySystemDesign: SystemDesignProps = {
  version: "legendary",
  functionalReqs: [
    { name: "Send Notifications", description: "Deliver messages to subscribed users" },
    { name: "Multi-user Delivery", description: "Send same notification to multiple recipients" },
    { name: "Ordered Delivery", description: "Notifications arrive in order per user" },
    { name: "Exactly-Once", description: "Each notification delivered exactly once" },
    { name: "Replay Support", description: "Re-process notifications from any point" },
  ],
  nonFunctionalReqs: [
    { name: "Scalability", description: "Horizontal scaling via partitions", supported: true },
    { name: "Fault Tolerance", description: "Survives node failures", supported: true },
    { name: "Durability", description: "Persisted to disk with replication", supported: true },
    { name: "Exactly-Once", description: "Idempotency + offset tracking", supported: true },
    { name: "Ordering", description: "Guaranteed per-partition order", supported: true },
    { name: "Back-Pressure", description: "Consumer lag monitoring", supported: true },
  ],
  highLevelDesign: {
    description: "Kafka-style partitioned log with consumer groups",
    components: [
      { name: "API Gateway", description: "Load balancer and request router" },
      { name: "Producer Service", description: "Partitions messages by user_id" },
      { name: "Partitioned Log", description: "Durable, ordered message storage" },
      { name: "Consumer Group", description: "Parallel consumers with offset tracking" },
      { name: "Idempotency Store", description: "Deduplication via message keys" },
      { name: "Offset Store", description: "Tracks consumer progress per partition" },
    ],
    diagram: `
┌─────────────┐     ┌─────────────────────┐
│   Client    │────▶│    API Gateway      │
└─────────────┘     └─────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │  Producer Service   │
                    │  hash(user_id) % N  │
                    └─────────────────────┘
                       │     │     │
          ┌────────────┼─────┼─────┼────────────┐
          ▼            ▼     ▼     ▼            ▼
     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │  P0     │  │   P1    │  │   P2    │  Partitioned
     │ [msg]   │  │ [msg]   │  │ [msg]   │  Log (Kafka)
     │ [msg]   │  │ [msg]   │  │ [msg]   │
     └─────────┘  └─────────┘  └─────────┘
          │            │            │
          ▼            ▼            ▼
     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │Consumer │  │Consumer │  │Consumer │  Consumer
     │   C0    │  │   C1    │  │   C2    │  Group
     └─────────┘  └─────────┘  └─────────┘
          │            │            │
          └────────────┴────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Idempotency     │
              │ Store (Redis)   │
              └─────────────────┘
`,
  },
  lowLevelDesign: {
    description: "Partitioned log with exactly-once delivery semantics",
    details: [
      {
        title: "Producer (Partition)",
        content: `async function notify(userId, msg) {
  const partition = hash(userId) % N;
  const dedupeKey = \`\${userId}_\${uuid()}\`;
  
  const offset = await kafka.produce({
    topic: 'notifications',
    partition,
    key: dedupeKey,
    value: JSON.stringify(msg)
  });
  
  return { partition, offset };
}`,
      },
      {
        title: "Consumer (Exactly-Once)",
        content: `async function consume(partition) {
  while (true) {
    const batch = await kafka.poll(
      partition, 
      currentOffset,
      batchSize: 100
    );
    
    for (const msg of batch) {
      if (await seen(msg.key)) {
        continue; // Skip duplicate
      }
      
      await deliver(msg);
      await markSeen(msg.key);
    }
    
    await commitOffset(partition);
  }
}`,
      },
      {
        title: "Idempotency Check",
        content: `// Redis-based deduplication
async function seen(key: string) {
  return redis.exists(
    \`dedupe:\${key}\`
  );
}

async function markSeen(key: string) {
  await redis.setex(
    \`dedupe:\${key}\`,
    TTL_7_DAYS,
    '1'
  );
}`,
      },
      {
        title: "Offset Management",
        content: `// Kafka consumer offsets
async function commitOffset(p) {
  await kafka.commit({
    topic: 'notifications',
    partition: p,
    offset: currentOffset
  });
}

// On restart, resume from
// last committed offset
const startOffset = 
  await kafka.getOffset(p);`,
      },
    ],
  },
  apiEndpoints: [
    {
      method: "POST",
      route: "/api/v2/notifications",
      description: "Publish notification to partitioned log",
      requestBody: `{
  "userId": "user_123",
  "message": "Hello World",
  "type": "alert",
  "idempotencyKey": "unique_key_123"
}`,
      responseBody: `{
  "success": true,
  "partition": 2,
  "offset": 1547,
  "dedupeKey": "user_123_uuid"
}`,
    },
    {
      method: "GET",
      route: "/api/v2/notifications/:userId/history",
      description: "Get notification history for a user (ordered)",
      responseBody: `{
  "userId": "user_123",
  "notifications": [
    {
      "id": "msg_001",
      "message": "First",
      "deliveredAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "msg_002", 
      "message": "Second",
      "deliveredAt": "2024-01-15T10:00:01Z"
    }
  ],
  "nextCursor": "offset_1548"
}`,
    },
    {
      method: "GET",
      route: "/api/v2/partitions/lag",
      description: "Get consumer lag per partition",
      responseBody: `{
  "partitions": [
    { "id": 0, "lag": 12, "lastOffset": 1500 },
    { "id": 1, "lag": 0, "lastOffset": 890 },
    { "id": 2, "lag": 5, "lastOffset": 2100 }
  ],
  "totalLag": 17,
  "healthy": true
}`,
    },
    {
      method: "POST",
      route: "/api/v2/partitions/:id/replay",
      description: "Replay messages from a specific offset",
      requestBody: `{
  "fromOffset": 1000,
  "toOffset": 1500
}`,
      responseBody: `{
  "replayId": "replay_abc",
  "partition": 0,
  "messagesQueued": 500,
  "estimatedTime": "30s"
}`,
    },
  ],
};

export default SystemDesignCards;
