"use client";

import { Button } from "@/components/ui/button";
import { Terminal, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <span className="font-mono font-bold text-lg">
              Break<span className="text-primary">My</span>Website
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#systems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Systems
            </a>
            <a href="#concepts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Concepts
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#review" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Review Service
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="hero" size="sm">
              Start Breaking
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <a href="#systems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Systems
              </a>
              <a href="#concepts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Concepts
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#review" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Review Service
              </a>
              <Button variant="hero" size="sm" className="w-fit">
                Start Breaking
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
