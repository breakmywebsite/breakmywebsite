import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Building2, Rocket, Shield } from "lucide-react";

const benefits = [
  {
    icon: <Building2 className="h-5 w-5" />,
    title: "Architecture Review",
    description: "Get expert feedback on your system design before you build or scale.",
  },
  {
    icon: <Rocket className="h-5 w-5" />,
    title: "Scalability Analysis",
    description: "Identify bottlenecks and get recommendations for handling 10x-100x growth.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Failure Prevention",
    description: "Discover single points of failure and implement redundancy strategies.",
  },
];

const ReviewService = () => {
  return (
    <section id="review" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div>
                <span className="text-sm font-mono text-primary mb-4 block">// FOR STARTUPS & TEAMS</span>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Get Your System Design Reviewed
                </h2>
                <p className="text-muted-foreground mb-8">
                  Planning to scale? Launching a new service? Get expert eyes on your architecture 
                  before issues become production incidents.
                </p>

                <ul className="space-y-4 mb-8">
                  {["Detailed written report", "Video walkthrough", "1:1 Q&A session", "Actionable recommendations"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <CheckCircle className="h-5 w-5 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Button variant="hero" size="lg" className="group">
                  Request a Review
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Benefits Cards */}
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div 
                    key={benefit.title}
                    className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewService;
