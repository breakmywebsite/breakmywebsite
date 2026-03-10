import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationClient from "./NotificationClient";

export default function NotificationSystemDemo() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div>
              <h1 className="font-bold text-lg">Notification System</h1>
              <p className="text-xs text-muted-foreground">Evolution from Basic to Legendary</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Choose Your Architecture Level</h2>
            <p className="text-muted-foreground">
              See how notification systems evolve from naive to production-grade
            </p>
          </div>
          <NotificationClient />
        </div>
      </main>
    </div>
  );
}
