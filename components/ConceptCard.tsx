import { ArrowRight } from "lucide-react";

interface ConceptCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "primary" | "warning" | "destructive" | "success";
}

const colorClasses = {
  primary: "bg-primary/10 border-primary/20 text-primary",
  warning: "bg-warning/10 border-warning/20 text-warning",
  destructive: "bg-destructive/10 border-destructive/20 text-destructive",
  success: "bg-success/10 border-success/20 text-success",
};

const ConceptCard = ({ title, description, icon, color }: ConceptCardProps) => {
  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium mb-1 flex items-center gap-2">
          {title}
          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
        </h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default ConceptCard;
