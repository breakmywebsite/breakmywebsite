"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface SystemCardProps {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "Live" | "Coming Soon";
  failurePoints: number;
  tags: string[];
  icon: React.ReactNode;
  demoUrl?: string;
}

const difficultyColors = {
  Beginner: "bg-success/10 text-success border-success/20",
  Intermediate: "bg-warning/10 text-warning border-warning/20",
  Advanced: "bg-destructive/10 text-destructive border-destructive/20",
};

const SystemCard = ({
  title,
  description,
  difficulty,
  status,
  failurePoints,
  tags,
  icon,
  demoUrl,
}: SystemCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (status === "Live" && demoUrl) {
      router.push(demoUrl);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`group glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 ${
        status === "Live" && demoUrl ? "cursor-pointer" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={difficultyColors[difficulty]}>
                {difficulty}
              </Badge>
              {status === "Live" ? (
                <span className="flex items-center gap-1 text-xs text-success">
                  <CheckCircle className="h-3 w-3" /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <XCircle className="h-3 w-3" /> Coming Soon
                </span>
              )}
            </div>
          </div>
        </div>
        {status === "Live" && demoUrl && (
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {/* Failure Points */}
      <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <span className="text-sm">
          <span className="font-medium text-foreground">{failurePoints}</span>{" "}
          <span className="text-muted-foreground">known failure points to explore</span>
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-mono rounded bg-secondary text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SystemCard;
