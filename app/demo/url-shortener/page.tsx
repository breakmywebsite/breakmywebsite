"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  AlertTriangle, 
  Clock,
  BarChart3,
  Zap,
  Database,
  RefreshCw,
  Shield,
  Crown
} from "lucide-react";
import Link from "next/link";
import UrlAnalytics from "@/components/demo/UrlAnalytics";
import RateLimitIndicator from "@/components/demo/RateLimitIndicator";
import UrlSystemDesignCards, { 
  basicUrlDesign, 
  advancedUrlDesign, 
  legendaryUrlDesign 
} from "@/components/demo/UrlSystemDesignCards";
import { 
  UnifiedFlowAnimation, 
  UnifiedMetricsDashboard, 
  UnifiedLoadSimulator 
} from "@/components/visualization";
import { z } from "zod";

const urlSchema = z.string().url({ message: "Please enter a valid URL" }).max(2048, { message: "URL too long" });

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  clickHistory: { timestamp: Date; referrer: string }[];
}

const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60000;

const generateShortCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const UrlShortenerDemo = () => {
  const [activeVersion, setActiveVersion] = useState("basic");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(RATE_LIMIT);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('demo-shortened-urls');
    if (stored) {
      const parsed = JSON.parse(stored);
      setShortenedUrls(parsed.map((u: { id: string; originalUrl: string; shortCode: string; createdAt: string; clicks: number; clickHistory: { timestamp: string; referrer: string }[] }) => ({
        ...u,
        createdAt: new Date(u.createdAt),
        clickHistory: u.clickHistory.map((c) => ({
          ...c,
          timestamp: new Date(c.timestamp)
        }))
      })));
    }
  }, []);

  useEffect(() => {
    if (shortenedUrls.length > 0) {
      localStorage.setItem('demo-shortened-urls', JSON.stringify(shortenedUrls));
    }
  }, [shortenedUrls]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const validTimestamps = requestTimestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
      setRequestTimestamps(validTimestamps);
      setRemainingRequests(RATE_LIMIT - validTimestamps.length);
      
      if (validTimestamps.length >= RATE_LIMIT) {
        setIsRateLimited(true);
        const oldestTimestamp = Math.min(...validTimestamps);
        setCooldownTime(Math.ceil((RATE_LIMIT_WINDOW - (now - oldestTimestamp)) / 1000));
      } else {
        setIsRateLimited(false);
        setCooldownTime(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [requestTimestamps]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = urlSchema.safeParse(url.trim());
    if (!result.success) {
      setError(result.error.issues[0]?.message || "Invalid URL");
      return;
    }

    if (isRateLimited) {
      setError(`Rate limit exceeded. Please wait ${cooldownTime} seconds.`);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    setRequestTimestamps(prev => [...prev, Date.now()]);

    const hasCollision = Math.random() < 0.1;
    let shortCode = generateShortCode();
    
    if (hasCollision) {
      shortCode = generateShortCode();
    }

    const newUrl: ShortenedUrl = {
      id: crypto.randomUUID(),
      originalUrl: result.data,
      shortCode,
      createdAt: new Date(),
      clicks: 0,
      clickHistory: []
    };

    setShortenedUrls(prev => [newUrl, ...prev]);
    setUrl("");
    setIsLoading(false);
  };

  const handleCopy = async (shortCode: string, id: string) => {
    const fullUrl = `https://brk.my/${shortCode}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const simulateClick = (id: string) => {
    setShortenedUrls(prev => prev.map(u => {
      if (u.id === id) {
        const referrers = ['Direct', 'Twitter', 'LinkedIn', 'Google', 'Facebook', 'Reddit'];
        return {
          ...u,
          clicks: u.clicks + 1,
          clickHistory: [
            ...u.clickHistory,
            { 
              timestamp: new Date(), 
              referrer: referrers[Math.floor(Math.random() * referrers.length)] 
            }
          ]
        };
      }
      return u;
    }));
  };

  const clearAll = () => {
    setShortenedUrls([]);
    localStorage.removeItem('demo-shortened-urls');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="font-bold text-lg">URL Shortener System</h1>
                <p className="text-xs text-muted-foreground">Evolution from Basic to Legendary</p>
              </div>
            </div>
            <RateLimitIndicator 
              remaining={remainingRequests} 
              total={RATE_LIMIT} 
              cooldown={cooldownTime}
              isLimited={isRateLimited}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Live Demo Section */}
        <section className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-6">
            <span className="text-sm font-mono text-primary mb-2 block">// LIVE DEMO</span>
            <h2 className="text-2xl font-bold mb-2">Try It Out</h2>
            <p className="text-muted-foreground text-sm">
              Shorten URLs and explore system behavior with rate limiting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter a URL to shorten (e.g., https://example.com/very-long-path)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 bg-secondary/50 border-border/50 font-mono text-sm"
                  disabled={isRateLimited || isLoading}
                />
                {error && (
                  <p className="text-destructive text-sm mt-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                variant="hero" 
                size="lg"
                disabled={isRateLimited || isLoading}
                className="min-w-[140px]"
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : isRateLimited ? (
                  <>
                    <Clock className="h-4 w-4" />
                    {cooldownTime}s
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Shorten
                  </>
                )}
              </Button>
            </div>

            {remainingRequests <= 2 && !isRateLimited && (
              <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm text-warning">
                  {remainingRequests} request{remainingRequests !== 1 ? 's' : ''} remaining before rate limit
                </span>
              </div>
            )}
          </form>

          {shortenedUrls.length > 0 && (
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Shortened URLs ({shortenedUrls.length})
                </h3>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>

              <div className="space-y-3">
                {shortenedUrls.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-primary font-medium">
                            brk.my/{item.shortCode}
                          </span>
                          <button
                            onClick={() => handleCopy(item.shortCode, item.id)}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                          >
                            {copiedId === item.id ? (
                              <Check className="h-4 w-4 text-success" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.originalUrl}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-lg font-bold">{item.clicks}</p>
                          <p className="text-xs text-muted-foreground">clicks</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => simulateClick(item.id)}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Simulate Click
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Version Selector - Following Notification System Pattern */}
        <section className="mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Choose Your Architecture Level</h2>
            <p className="text-muted-foreground">
              See how URL shortener systems evolve from naive to production-grade
            </p>
          </div>

          <Tabs value={activeVersion} onValueChange={setActiveVersion} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1">
              <TabsTrigger 
                value="basic" 
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-destructive/20 data-[state=active]:text-destructive"
              >
                <Zap className="h-5 w-5" />
                <span className="font-semibold">Basic</span>
                <span className="text-xs opacity-70">Direct to DB</span>
              </TabsTrigger>
              <TabsTrigger 
                value="advanced"
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-warning/20 data-[state=active]:text-warning"
              >
                <Shield className="h-5 w-5" />
                <span className="font-semibold">Advanced</span>
                <span className="text-xs opacity-70">With Cache</span>
              </TabsTrigger>
              <TabsTrigger 
                value="legendary"
                className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Legendary</span>
                <span className="text-xs opacity-70">Distributed</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-8 space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="font-bold text-lg text-destructive">Basic Implementation</h3>
                  <p className="text-sm text-muted-foreground">
                    Direct database access for every request - simple but doesn't scale
                  </p>
                </div>
              </div>

              {/* System Design Cards */}
              <UrlSystemDesignCards {...basicUrlDesign} />

              {/* Visualizations */}
              <div className="grid lg:grid-cols-2 gap-6">
                <UnifiedFlowAnimation version="basic" systemType="url" />
                <UnifiedLoadSimulator version="basic" systemType="url" />
              </div>
              <UnifiedMetricsDashboard version="basic" systemType="url" />
            </TabsContent>

            <TabsContent value="advanced" className="mt-8 space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-warning/10 border border-warning/20">
                <Shield className="h-8 w-8 text-warning" />
                <div>
                  <h3 className="font-bold text-lg text-warning">Advanced Implementation</h3>
                  <p className="text-sm text-muted-foreground">
                    Redis caching for hot URLs - faster but cache invalidation is tricky
                  </p>
                </div>
              </div>

              {/* System Design Cards */}
              <UrlSystemDesignCards {...advancedUrlDesign} />

              {/* Visualizations */}
              <div className="grid lg:grid-cols-2 gap-6">
                <UnifiedFlowAnimation version="advanced" systemType="url" />
                <UnifiedLoadSimulator version="advanced" systemType="url" />
              </div>
              <UnifiedMetricsDashboard version="advanced" systemType="url" />
            </TabsContent>

            <TabsContent value="legendary" className="mt-8 space-y-8">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <Crown className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-bold text-lg text-primary">Legendary Implementation</h3>
                  <p className="text-sm text-muted-foreground">
                    Globally distributed with edge caching - production-ready at any scale
                  </p>
                </div>
              </div>

              {/* System Design Cards */}
              <UrlSystemDesignCards {...legendaryUrlDesign} />

              {/* Visualizations */}
              <div className="grid lg:grid-cols-2 gap-6">
                <UnifiedFlowAnimation version="legendary" systemType="url" />
                <UnifiedLoadSimulator version="legendary" systemType="url" />
              </div>
              <UnifiedMetricsDashboard version="legendary" systemType="url" />
            </TabsContent>
          </Tabs>
        </section>

        {/* Analytics Section */}
        {shortenedUrls.length > 0 && (
          <UrlAnalytics urls={shortenedUrls} />
        )}
      </main>
    </div>
  );
};

export default UrlShortenerDemo;
