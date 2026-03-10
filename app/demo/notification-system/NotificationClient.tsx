"use client";

import { useState } from "react";
import VersionTabs, { type Version } from "@/components/shared/VersionTabs";
import BasicVersion from "@/components/notification-demo/BasicVersion";
import AdvancedVersion from "@/components/notification-demo/AdvancedVersion";
import LegendaryVersion from "@/components/notification-demo/LegendaryVersion";

export default function NotificationClient() {
  const [activeVersion, setActiveVersion] = useState<Version>("basic");

  return (
    <VersionTabs
      value={activeVersion}
      onValueChange={setActiveVersion}
      basicContent={<BasicVersion />}
      advancedContent={<AdvancedVersion />}
      legendaryContent={<LegendaryVersion />}
    />
  );
}
