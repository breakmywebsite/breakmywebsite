"use client";

import { Zap, Shield, Crown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type Version = "basic" | "advanced" | "legendary";

interface VersionConfig {
  label: string;
  subtitle: string;
}

const defaultVersionConfig: Record<Version, VersionConfig> = {
  basic: { label: "Basic", subtitle: "Naive Approach" },
  advanced: { label: "Advanced", subtitle: "Better, But..." },
  legendary: { label: "Legendary", subtitle: "Production Ready" },
};

interface VersionTabsProps {
  value: Version;
  onValueChange: (value: Version) => void;
  versionConfig?: Partial<Record<Version, VersionConfig>>;
  basicContent: React.ReactNode;
  advancedContent: React.ReactNode;
  legendaryContent: React.ReactNode;
}

export default function VersionTabs({
  value,
  onValueChange,
  versionConfig,
  basicContent,
  advancedContent,
  legendaryContent,
}: VersionTabsProps) {
  const config = {
    ...defaultVersionConfig,
    ...versionConfig,
  };

  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as Version)} className="w-full">
      <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1">
        <TabsTrigger
          value="basic"
          className="flex flex-col gap-1 py-3 data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive"
        >
          <Zap className="h-5 w-5" />
          <span className="font-semibold">{config.basic.label}</span>
          <span className="text-xs opacity-70">{config.basic.subtitle}</span>
        </TabsTrigger>
        <TabsTrigger
          value="advanced"
          className="flex flex-col gap-1 py-3 data-[state=active]:bg-warning/20 data-[state=active]:text-warning"
        >
          <Shield className="h-5 w-5" />
          <span className="font-semibold">{config.advanced.label}</span>
          <span className="text-xs opacity-70">{config.advanced.subtitle}</span>
        </TabsTrigger>
        <TabsTrigger
          value="legendary"
          className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
        >
          <Crown className="h-5 w-5" />
          <span className="font-semibold">{config.legendary.label}</span>
          <span className="text-xs opacity-70">{config.legendary.subtitle}</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="mt-8">
        {basicContent}
      </TabsContent>
      <TabsContent value="advanced" className="mt-8">
        {advancedContent}
      </TabsContent>
      <TabsContent value="legendary" className="mt-8">
        {legendaryContent}
      </TabsContent>
    </Tabs>
  );
}
