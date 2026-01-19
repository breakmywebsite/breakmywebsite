import { Shield, AlertTriangle } from "lucide-react";

interface RateLimitIndicatorProps {
  remaining: number;
  total: number;
  cooldown: number;
  isLimited: boolean;
}

const RateLimitIndicator = ({ remaining, total, cooldown, isLimited }: RateLimitIndicatorProps) => {
  const percentage = (remaining / total) * 100;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {isLimited ? (
          <AlertTriangle className="h-4 w-4 text-destructive" />
        ) : (
          <Shield className="h-4 w-4 text-primary" />
        )}
        <span className="text-sm font-mono">
          {isLimited ? (
            <span className="text-destructive">Rate Limited ({cooldown}s)</span>
          ) : (
            <span className={remaining <= 2 ? "text-warning" : "text-muted-foreground"}>
              {remaining}/{total} req/min
            </span>
          )}
        </span>
      </div>
      <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${
            isLimited 
              ? "bg-destructive" 
              : remaining <= 2 
                ? "bg-warning" 
                : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default RateLimitIndicator;
