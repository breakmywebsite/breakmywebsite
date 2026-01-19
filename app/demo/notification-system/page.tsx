"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicVersion from "@/components/notification-demo/BasicVersion";
import AdvancedVersion from "@/components/notification-demo/AdvancedVersion";
import LegendaryVersion from "@/components/notification-demo/LegendaryVersion";

const NotificationSystemDemo = () => {
  const [activeVersion, setActiveVersion] = useState("basic");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="font-bold text-lg">Notification System</h1>
                <p className="text-xs text-muted-foreground">Evolution from Basic to Legendary</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Version Selector */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Choose Your Architecture Level</h2>
            <p className="text-muted-foreground">
              See how notification systems evolve from naive to production-grade
            </p>
          </div>

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
        </div>
      </main>
    </div>
  );
};

export default NotificationSystemDemo;
