import { Play, Search, MessageSquare, Lightbulb } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore the System",
    description: "Interact with live demos. Use the system as a real user would—create, read, update, and delete.",
    icon: <Play className="h-6 w-6" />,
  },
  {
    number: "02",
    title: "Discover Weaknesses",
    description: "Push the system to its limits. Find the documented failure points or discover new ones.",
    icon: <Search className="h-6 w-6" />,
  },
  {
    number: "03",
    title: "Suggest Improvements",
    description: "Submit your architectural proposals. Explain how you'd fix the issues you found.",
    icon: <MessageSquare className="h-6 w-6" />,
  },
  {
    number: "04",
    title: "Learn & Iterate",
    description: "Review curated solutions. Understand trade-offs and build better mental models.",
    icon: <Lightbulb className="h-6 w-6" />,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-sm font-mono text-primary mb-4 block">// HOW IT WORKS</span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Learn by Doing
          </h2>
          <p className="text-muted-foreground">
            System design isn't learned from slides. It's learned from breaking things 
            and understanding why they broke.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="relative glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && index % 2 === 0 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-border" />
                )}
                
                {/* Step Number */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-primary/20 font-mono">{step.number}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
