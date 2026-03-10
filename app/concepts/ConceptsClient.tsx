"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AutoScalingVisualizer,
  FaultToleranceVisualizer,
  TrafficPatternsVisualizer,
  CacheStrategiesVisualizer,
  CircuitBreakerVisualizer
} from "@/components/concepts";

const CONCEPTS = [
  { id: "auto-scaling", label: "Auto Scaling", icon: "📈" },
  { id: "fault-tolerance", label: "Fault Tolerance", icon: "🛡️" },
  { id: "traffic-patterns", label: "Traffic Patterns", icon: "📊" },
  { id: "cache-strategies", label: "Cache Strategies", icon: "⚡" },
  { id: "circuit-breaker", label: "Circuit Breaker", icon: "🔌" },
];

export default function ConceptsClient() {
  const [activeConcept, setActiveConcept] = useState("auto-scaling");
  const [explanation, setExplanation] = useState("");

  return (
    <Tabs value={activeConcept} onValueChange={setActiveConcept}>
      <TabsList className="flex flex-wrap h-auto gap-1 mb-6">
        {CONCEPTS.map(c => (
          <TabsTrigger key={c.id} value={c.id} className="gap-1">
            <span>{c.icon}</span> {c.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {explanation && (
        <Card className="glass-card mb-6">
          <CardContent className="p-4 flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <p className="text-sm">{explanation}</p>
          </CardContent>
        </Card>
      )}

      <TabsContent value="auto-scaling"><AutoScalingVisualizer onExplanationChange={setExplanation} /></TabsContent>
      <TabsContent value="fault-tolerance"><FaultToleranceVisualizer onExplanationChange={setExplanation} /></TabsContent>
      <TabsContent value="traffic-patterns"><TrafficPatternsVisualizer onExplanationChange={setExplanation} /></TabsContent>
      <TabsContent value="cache-strategies"><CacheStrategiesVisualizer onExplanationChange={setExplanation} /></TabsContent>
      <TabsContent value="circuit-breaker"><CircuitBreakerVisualizer onExplanationChange={setExplanation} /></TabsContent>
    </Tabs>
  );
}
