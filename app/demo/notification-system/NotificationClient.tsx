"use client";

import { useState } from "react";
import { Zap, Shield, Crown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicVersion from "@/components/notification-demo/BasicVersion";
import AdvancedVersion from "@/components/notification-demo/AdvancedVersion";
import LegendaryVersion from "@/components/notification-demo/LegendaryVersion";

export default function NotificationClient() {
  const [activeVersion, setActiveVersion] = useState("basic");

  return (
    <Tabs value={activeVersion} onValueChange={setActiveVersion} className="w-full">
      <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1">
        <TabsTrigger
          value="basic"
          className="flex flex-col gap-1 py-3 data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive"
        >
          <Zap className="h-5 w-5" />
          <span className="font-semibold">Basic</span>
          <span className="text-xs opacity-70">Naive Approach</span>
        </TabsTrigger>
        <TabsTrigger
          value="advanced"
          className="flex flex-col gap-1 py-3 data-[state=active]:bg-warning/20 data-[state=active]:text-warning"
        >
          <Shield className="h-5 w-5" />
          <span className="font-semibold">Advanced</span>
          <span className="text-xs opacity-70">Better, But...</span>
        </TabsTrigger>
        <TabsTrigger
          value="legendary"
          className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
        >
          <Crown className="h-5 w-5" />
          <span className="font-semibold">Legendary</span>
          <span className="text-xs opacity-70">Production Ready</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="mt-8">
        <BasicVersion />
      </TabsContent>
      <TabsContent value="advanced" className="mt-8">
        <AdvancedVersion />
      </TabsContent>
      <TabsContent value="legendary" className="mt-8">
        <LegendaryVersion />
      </TabsContent>
    </Tabs>
  );
}
