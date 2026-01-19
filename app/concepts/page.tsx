"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const ConceptsDemo = () => {
  const [activeConcept, setActiveConcept] = useState("auto-scaling");
  const [explanation, setExplanation] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Back</Button></Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="font-bold text-lg">System Design Concepts</h1>
              <p className="text-xs text-muted-foreground">Interactive learning for interviews</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeConcept} onValueChange={setActiveConcept}>
          <TabsList className="flex flex-wrap h-auto gap-1 mb-6">
            {CONCEPTS.map(c => (
              <TabsTrigger key={c.id} value={c.id} className="gap-1">
                <span>{c.icon}</span> {c.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Explanation Panel */}
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
      </main>
    </div>
  );
};

export default ConceptsDemo;
