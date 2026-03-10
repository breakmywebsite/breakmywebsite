import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DemoPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function DemoPageLayout({
  title,
  subtitle = "Evolution from Basic to Legendary",
  children,
}: DemoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="font-bold text-lg">{title}</h1>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
