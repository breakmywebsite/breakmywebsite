import { useMemo, ReactNode } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Type for custom node data
interface FlowNodeData extends Record<string, unknown> {
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  className?: string;
  statusClass?: string;
  width?: number;
  height?: number;
  items?: number;
}

type CustomNode = Node<FlowNodeData>;

// Custom node component for flow boxes
const FlowNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div
      className={`px-3 py-2 rounded-lg border-2 shadow-lg backdrop-blur-sm min-w-[80px] text-center ${data.className || "bg-secondary/80 border-border"}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary !w-2 !h-2" />
      <div className="flex flex-col items-center gap-1">
        {data.icon && <div className="text-inherit">{data.icon}</div>}
        <span className="text-xs font-bold">{data.label}</span>
        {data.sublabel && (
          <span className="text-[10px] opacity-70">{data.sublabel}</span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary !w-2 !h-2" />
    </div>
  );
};

// Custom node for groups/containers
const GroupNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div
      className={`rounded-lg border-2 border-dashed p-2 ${data.className || "border-border/50 bg-secondary/20"}`}
      style={{ width: data.width, height: data.height }}
    >
      <span className="text-[10px] font-mono text-muted-foreground">{data.label}</span>
    </div>
  );
};

// Custom node for user icons
const UserNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className={`flex flex-col items-center ${data.className || ""}`}>
      <Handle type="target" position={Position.Left} className="!bg-muted-foreground !w-1.5 !h-1.5" />
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${data.statusClass || "bg-muted"}`}>
        {data.label}
      </div>
      {data.sublabel && <span className="text-[8px] text-muted-foreground mt-0.5">{data.sublabel}</span>}
    </div>
  );
};

// Custom node for queue items
const QueueNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className={`flex gap-1 p-2 rounded-lg border-2 ${data.className || "bg-warning/20 border-warning/40"}`}>
      <Handle type="target" position={Position.Left} className="!bg-warning !w-2 !h-2" />
      <div className="flex flex-col">
        <span className="text-xs font-bold">{data.label}</span>
        <div className="flex gap-0.5 mt-1">
          {Array.from({ length: data.items || 5 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-sm bg-current opacity-40" />
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-warning !w-2 !h-2" />
    </div>
  );
};

// Partition node
const PartitionNode = ({ data }: NodeProps<CustomNode>) => {
  return (
    <div className={`p-2 rounded-lg border-2 min-w-[100px] ${data.className || "bg-primary/10 border-primary/30"}`}>
      <Handle type="target" position={Position.Left} className="!bg-primary !w-2 !h-2" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold">{data.label}</span>
          <span className="text-[8px] text-muted-foreground">(durable)</span>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-sm bg-primary/30 flex items-center justify-center text-[8px]">
              {i}
            </div>
          ))}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary !w-2 !h-2" />
    </div>
  );
};

const nodeTypes = {
  flowNode: FlowNode,
  groupNode: GroupNode,
  userNode: UserNode,
  queueNode: QueueNode,
  partitionNode: PartitionNode,
};

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: "hsl(var(--muted-foreground))", strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--muted-foreground))" },
};

// Basic Version Flow Diagram
export const BasicFlowDiagram = () => {
  const nodes: Node[] = useMemo(() => [
    {
      id: "publisher",
      type: "flowNode",
      position: { x: 0, y: 100 },
      data: { label: "Publisher", className: "bg-primary/20 border-primary/40 text-primary" },
    },
    {
      id: "loop",
      type: "groupNode",
      position: { x: 120, y: 20 },
      data: { label: "for each subscriber (SEQUENTIAL)", width: 380, height: 200, className: "border-destructive/40 bg-destructive/5" },
    },
    {
      id: "userA",
      type: "userNode",
      position: { x: 150, y: 80 },
      data: { label: "A", sublabel: "500ms", statusClass: "bg-success" },
    },
    {
      id: "userB",
      type: "userNode",
      position: { x: 220, y: 80 },
      data: { label: "B", sublabel: "waits...", statusClass: "bg-muted" },
    },
    {
      id: "userC",
      type: "userNode",
      position: { x: 290, y: 80 },
      data: { label: "C", sublabel: "FAILS!", statusClass: "bg-destructive text-white" },
    },
    {
      id: "userD",
      type: "userNode",
      position: { x: 360, y: 80 },
      data: { label: "D", sublabel: "blocked", statusClass: "bg-muted/50" },
    },
    {
      id: "userE",
      type: "userNode",
      position: { x: 430, y: 80 },
      data: { label: "E", sublabel: "blocked", statusClass: "bg-muted/50" },
    },
    {
      id: "problem1",
      type: "flowNode",
      position: { x: 140, y: 160 },
      data: { label: "⚠️ Blocking", sublabel: "Each waits for prev", className: "bg-destructive/10 border-destructive/20 text-destructive" },
    },
    {
      id: "problem2",
      type: "flowNode",
      position: { x: 320, y: 160 },
      data: { label: "⚠️ No Retry", sublabel: "Failures are lost", className: "bg-destructive/10 border-destructive/20 text-destructive" },
    },
  ], []);

  const edges: Edge[] = useMemo(() => [
    { id: "e1", source: "publisher", target: "userA", animated: true },
    { id: "e2", source: "userA", target: "userB", animated: true, style: { stroke: "hsl(var(--destructive))" } },
    { id: "e3", source: "userB", target: "userC", animated: true, style: { stroke: "hsl(var(--destructive))" } },
    { id: "e4", source: "userC", target: "userD", animated: false, style: { stroke: "hsl(var(--destructive))", strokeDasharray: "5,5" } },
    { id: "e5", source: "userD", target: "userE", animated: false, style: { stroke: "hsl(var(--muted-foreground))", strokeDasharray: "5,5" } },
  ], []);

  return (
    <div className="h-[280px] w-full rounded-lg border bg-background/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--muted-foreground) / 0.2)" />
      </ReactFlow>
    </div>
  );
};

// Advanced Version Flow Diagram  
export const AdvancedFlowDiagram = () => {
  const nodes: Node[] = useMemo(() => [
    {
      id: "publisher",
      type: "flowNode",
      position: { x: 0, y: 100 },
      data: { label: "Publisher", className: "bg-primary/20 border-primary/40 text-primary" },
    },
    {
      id: "queue",
      type: "queueNode",
      position: { x: 130, y: 90 },
      data: { label: "Message Queue", items: 8, className: "bg-warning/20 border-warning/40 text-warning" },
    },
    {
      id: "worker1",
      type: "flowNode",
      position: { x: 300, y: 30 },
      data: { label: "Worker 1", className: "bg-success/20 border-success/40 text-success" },
    },
    {
      id: "worker2",
      type: "flowNode",
      position: { x: 300, y: 100 },
      data: { label: "Worker 2", className: "bg-success/20 border-success/40 text-success" },
    },
    {
      id: "worker3",
      type: "flowNode",
      position: { x: 300, y: 170 },
      data: { label: "Worker 3", className: "bg-success/20 border-success/40 text-success" },
    },
    {
      id: "user1",
      type: "userNode",
      position: { x: 420, y: 40 },
      data: { label: "A", statusClass: "bg-success" },
    },
    {
      id: "user2",
      type: "userNode",
      position: { x: 420, y: 110 },
      data: { label: "B", statusClass: "bg-success" },
    },
    {
      id: "user3",
      type: "userNode",
      position: { x: 420, y: 180 },
      data: { label: "C", statusClass: "bg-success" },
    },
    {
      id: "retry",
      type: "flowNode",
      position: { x: 180, y: 200 },
      data: { label: "✓ Retry Loop", sublabel: "max 2 retries", className: "bg-success/10 border-success/30 text-success" },
    },
    {
      id: "problem1",
      type: "flowNode",
      position: { x: 480, y: 40 },
      data: { label: "⚠️ No dedup", className: "bg-warning/10 border-warning/20 text-warning" },
    },
    {
      id: "problem2",
      type: "flowNode",
      position: { x: 480, y: 120 },
      data: { label: "⚠️ Volatile", className: "bg-warning/10 border-warning/20 text-warning" },
    },
  ], []);

  const edges: Edge[] = useMemo(() => [
    { id: "e1", source: "publisher", target: "queue" },
    { id: "e2", source: "queue", target: "worker1" },
    { id: "e3", source: "queue", target: "worker2" },
    { id: "e4", source: "queue", target: "worker3" },
    { id: "e5", source: "worker1", target: "user1" },
    { id: "e6", source: "worker2", target: "user2" },
    { id: "e7", source: "worker3", target: "user3" },
    { 
      id: "e8", 
      source: "worker3", 
      target: "retry",
      style: { stroke: "hsl(var(--success))", strokeDasharray: "5,5" },
      animated: false,
    },
  ], []);

  return (
    <div className="h-[300px] w-full rounded-lg border bg-background/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--muted-foreground) / 0.2)" />
      </ReactFlow>
    </div>
  );
};

// Legendary Version Flow Diagram
export const LegendaryFlowDiagram = () => {
  const nodes: Node[] = useMemo(() => [
    {
      id: "publisher",
      type: "flowNode",
      position: { x: 0, y: 120 },
      data: { label: "Publisher", sublabel: "hash(userId)", className: "bg-primary/20 border-primary/40 text-primary" },
    },
    {
      id: "partition0",
      type: "partitionNode",
      position: { x: 150, y: 20 },
      data: { label: "Partition 0" },
    },
    {
      id: "partition1",
      type: "partitionNode",
      position: { x: 150, y: 110 },
      data: { label: "Partition 1" },
    },
    {
      id: "partition2",
      type: "partitionNode",
      position: { x: 150, y: 200 },
      data: { label: "Partition 2" },
    },
    {
      id: "consumer0",
      type: "flowNode",
      position: { x: 320, y: 25 },
      data: { label: "Consumer 0", className: "bg-success/20 border-success/40 text-success" },
    },
    {
      id: "consumer1",
      type: "flowNode",
      position: { x: 320, y: 115 },
      data: { label: "Consumer 1", className: "bg-success/20 border-success/40 text-success" },
    },
    {
      id: "consumer2",
      type: "flowNode",
      position: { x: 320, y: 205 },
      data: { label: "Consumer 2", className: "bg-success/20 border-success/40 text-success" },
    },
    {
      id: "users0",
      type: "flowNode",
      position: { x: 450, y: 25 },
      data: { label: "Users A,B,G,J", className: "bg-muted border-border" },
    },
    {
      id: "users1",
      type: "flowNode",
      position: { x: 450, y: 115 },
      data: { label: "Users C,D,H", className: "bg-muted border-border" },
    },
    {
      id: "users2",
      type: "flowNode",
      position: { x: 450, y: 205 },
      data: { label: "Users E,F,I", className: "bg-muted border-border" },
    },
    {
      id: "feature1",
      type: "flowNode",
      position: { x: 150, y: 280 },
      data: { label: "✓ Ordered", sublabel: "per partition", className: "bg-success/10 border-success/30 text-success" },
    },
    {
      id: "feature2",
      type: "flowNode",
      position: { x: 300, y: 280 },
      data: { label: "✓ Idempotent", sublabel: "dedupe keys", className: "bg-success/10 border-success/30 text-success" },
    },
    {
      id: "feature3",
      type: "flowNode",
      position: { x: 450, y: 280 },
      data: { label: "✓ Offset", sublabel: "tracking", className: "bg-success/10 border-success/30 text-success" },
    },
  ], []);

  const edges: Edge[] = useMemo(() => [
    { id: "e1", source: "publisher", target: "partition0" },
    { id: "e2", source: "publisher", target: "partition1" },
    { id: "e3", source: "publisher", target: "partition2" },
    { id: "e4", source: "partition0", target: "consumer0" },
    { id: "e5", source: "partition1", target: "consumer1" },
    { id: "e6", source: "partition2", target: "consumer2" },
    { id: "e7", source: "consumer0", target: "users0" },
    { id: "e8", source: "consumer1", target: "users1" },
    { id: "e9", source: "consumer2", target: "users2" },
  ], []);

  return (
    <div className="h-[360px] w-full rounded-lg border bg-background/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--muted-foreground) / 0.2)" />
      </ReactFlow>
    </div>
  );
};

export default { BasicFlowDiagram, AdvancedFlowDiagram, LegendaryFlowDiagram };
