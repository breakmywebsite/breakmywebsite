import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, AlertTriangle } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      
      {/* Floating Elements */}
      <div className="absolute top-32 left-[15%] animate-float opacity-20">
        <div className="w-20 h-20 rounded-lg border border-primary/30 bg-primary/5 backdrop-blur" />
      </div>
      <div className="absolute bottom-32 right-[15%] animate-float opacity-20" style={{ animationDelay: '1s' }}>
        <div className="w-16 h-16 rounded-full border border-warning/30 bg-warning/5 backdrop-blur" />
      </div>
      <div className="absolute top-48 right-[25%] animate-float opacity-15" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-12 rounded border border-destructive/30 bg-destructive/5 backdrop-blur" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8 animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Learn System Design by Breaking Things</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Systems Fail.
            <br />
            <span className="gradient-text">Learn Why.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Explore live systems with intentional limitations. Understand how they behave, fail, and scale. 
            Master system design through hands-on exploration.
          </p>

          {/* Terminal Preview */}
          <div className="glass-card rounded-xl p-4 max-w-xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-warning/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
              <span className="text-xs text-muted-foreground ml-2 font-mono">system_analysis.sh</span>
            </div>
            <div className="font-mono text-sm text-left space-y-1">
              <p className="text-muted-foreground">$ <span className="text-foreground">analyze --system url-shortener</span></p>
              <p className="text-success">✓ Rate limiting: Enabled (100 req/min)</p>
              <p className="text-warning flex items-center gap-2">
                <AlertTriangle className="h-3 w-3" />
                Warning: Cache invalidation bottleneck detected
              </p>
              <p className="text-destructive">✗ Known issue: Hash collision under high load</p>
              <p className="text-muted-foreground">
                $ <span className="terminal-cursor" />
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button variant="hero" size="xl" className="group">
              Explore Systems
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="hero-outline" size="xl">
              View Concepts
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div>
              <p className="text-3xl font-bold gradient-text">12+</p>
              <p className="text-sm text-muted-foreground">Live Systems</p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">50+</p>
              <p className="text-sm text-muted-foreground">Concepts</p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">100%</p>
              <p className="text-sm text-muted-foreground">Hands-on</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
