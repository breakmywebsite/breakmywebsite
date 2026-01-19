import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  HardDrive, 
  Database,
  Trash2,
  Clock,
  Zap,
  ArrowRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search
} from "lucide-react";
import { CacheEvictionPolicy, CacheEntry } from "./types";

interface CacheStrategiesVisualizerProps {
  onExplanationChange?: (text: string) => void;
}

const POLICY_DESCRIPTIONS: Record<CacheEvictionPolicy, string> = {
  LRU: "Least Recently Used: Evicts the item that hasn't been accessed for the longest time",
  LFU: "Least Frequently Used: Evicts the item with the fewest access counts",
  TTL: "Time-To-Live: Evicts items after a fixed duration regardless of access patterns",
  FIFO: "First In First Out: Evicts items in the order they were added"
};

const CacheStrategiesVisualizer = ({ onExplanationChange }: CacheStrategiesVisualizerProps) => {
  const [policy, setPolicy] = useState<CacheEvictionPolicy>("LRU");
  const [cacheEntries, setCacheEntries] = useState<CacheEntry[]>([]);
  const [maxCacheSize, setMaxCacheSize] = useState(5);
  const [ttlSeconds, setTtlSeconds] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [lastOperation, setLastOperation] = useState<{ type: "hit" | "miss" | "evict"; key: string } | null>(null);
  const [stats, setStats] = useState({ hits: 0, misses: 0, evictions: 0 });
  const [isAutoFetching, setIsAutoFetching] = useState(false);
  const keyCounterRef = useRef<number>(1);

  // Update explanation when policy changes
  useEffect(() => {
    onExplanationChange?.(`📦 ${policy}: ${POLICY_DESCRIPTIONS[policy]}`);
  }, [policy, onExplanationChange]);

  // Auto-fetch simulation
  useEffect(() => {
    if (!isAutoFetching) return;
    
    const interval = setInterval(() => {
      const randomKey = `key-${Math.floor(Math.random() * 10) + 1}`;
      fetchData(randomKey);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isAutoFetching, cacheEntries, policy]);

  // TTL expiration
  useEffect(() => {
    if (policy !== "TTL") return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      setCacheEntries(prev => {
        const expired = prev.filter(e => now - e.createdAt > e.ttl * 1000);
        if (expired.length > 0) {
          setStats(s => ({ ...s, evictions: s.evictions + expired.length }));
          setLastOperation({ type: "evict", key: expired.map(e => e.key).join(", ") });
          onExplanationChange?.(`⏰ TTL expired: ${expired.map(e => e.key).join(", ")} removed from cache`);
        }
        return prev.filter(e => now - e.createdAt <= e.ttl * 1000);
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [policy, ttlSeconds, onExplanationChange]);

  const selectEvictionCandidate = (entries: CacheEntry[]): CacheEntry | null => {
    if (entries.length === 0) return null;
    
    switch (policy) {
      case "LRU":
        return entries.reduce((oldest, e) => e.lastAccess < oldest.lastAccess ? e : oldest);
      case "LFU":
        return entries.reduce((least, e) => e.accessCount < least.accessCount ? e : least);
      case "FIFO":
        return entries.reduce((first, e) => e.createdAt < first.createdAt ? e : first);
      case "TTL":
        return entries.reduce((oldest, e) => e.createdAt < oldest.createdAt ? e : oldest);
    }
  };

  const fetchData = (key: string) => {
    const existingEntry = cacheEntries.find(e => e.key === key);
    
    if (existingEntry) {
      // Cache HIT
      setStats(s => ({ ...s, hits: s.hits + 1 }));
      setLastOperation({ type: "hit", key });
      setCacheEntries(prev => prev.map(e => 
        e.key === key 
          ? { ...e, accessCount: e.accessCount + 1, lastAccess: Date.now() }
          : e
      ));
      onExplanationChange?.(`✅ Cache HIT for "${key}" - Data served from cache instantly!`);
    } else {
      // Cache MISS
      setStats(s => ({ ...s, misses: s.misses + 1 }));
      setLastOperation({ type: "miss", key });
      
      // Check if we need to evict
      if (cacheEntries.length >= maxCacheSize) {
        const evictionCandidate = selectEvictionCandidate(cacheEntries);
        if (evictionCandidate) {
          setStats(s => ({ ...s, evictions: s.evictions + 1 }));
          setCacheEntries(prev => prev.filter(e => e.key !== evictionCandidate.key));
          onExplanationChange?.(`❌ Cache MISS for "${key}" - Evicting "${evictionCandidate.key}" using ${policy} policy`);
        }
      } else {
        onExplanationChange?.(`❌ Cache MISS for "${key}" - Fetching from database...`);
      }
      
      // Add new entry
      const newEntry: CacheEntry = {
        key,
        value: `data-${key}-${Date.now()}`,
        accessCount: 1,
        lastAccess: Date.now(),
        ttl: ttlSeconds,
        createdAt: Date.now()
      };
      setCacheEntries(prev => [...prev.filter(e => e.key !== key), newEntry].slice(-maxCacheSize));
    }
  };

  const addRandomData = () => {
    const key = `key-${keyCounterRef.current++}`;
    fetchData(key);
  };

  const clearCache = () => {
    setCacheEntries([]);
    setStats({ hits: 0, misses: 0, evictions: 0 });
    setLastOperation(null);
    onExplanationChange?.("🧹 Cache cleared!");
  };

  const handleSearch = () => {
    if (searchKey.trim()) {
      fetchData(searchKey.trim());
      setSearchKey("");
    }
  };

  const hitRate = stats.hits + stats.misses > 0 
    ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      {/* Policy Selector & Controls */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Cache Eviction Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["LRU", "LFU", "TTL", "FIFO"] as CacheEvictionPolicy[]).map(p => (
              <Button
                key={p}
                onClick={() => {
                  setPolicy(p);
                  clearCache();
                }}
                variant={policy === p ? "default" : "outline"}
                size="sm"
              >
                {p}
              </Button>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {POLICY_DESCRIPTIONS[policy]}
          </p>
          
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="text-xs text-muted-foreground block mb-1">Cache Size</label>
              <Input
                type="number"
                value={maxCacheSize}
                onChange={(e) => setMaxCacheSize(Math.max(1, parseInt(e.target.value) || 5))}
                min={1}
                max={10}
              />
            </div>
            
            {policy === "TTL" && (
              <div className="flex-1 min-w-[150px]">
                <label className="text-xs text-muted-foreground block mb-1">TTL (seconds)</label>
                <Input
                  type="number"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(Math.max(1, parseInt(e.target.value) || 10))}
                  min={1}
                  max={60}
                />
              </div>
            )}
            
            <Button onClick={addRandomData} className="gap-1">
              <Zap className="h-4 w-4" />
              Add Data
            </Button>
            
            <Button 
              onClick={() => setIsAutoFetching(!isAutoFetching)}
              variant={isAutoFetching ? "destructive" : "outline"}
            >
              {isAutoFetching ? "Stop Auto" : "Auto Fetch"}
            </Button>
            
            <Button onClick={clearCache} variant="outline" className="gap-1">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
          
          {/* Search/Fetch specific key */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter key to fetch..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-5 w-5 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold font-mono text-success">{stats.hits}</p>
            <p className="text-xs text-muted-foreground">Cache Hits</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <XCircle className="h-5 w-5 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-bold font-mono text-destructive">{stats.misses}</p>
            <p className="text-xs text-muted-foreground">Cache Misses</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Trash2 className="h-5 w-5 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold font-mono text-warning">{stats.evictions}</p>
            <p className="text-xs text-muted-foreground">Evictions</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Zap className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold font-mono">{hitRate}%</p>
            <p className="text-xs text-muted-foreground">Hit Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Cache Visualization */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              Cache Contents ({cacheEntries.length}/{maxCacheSize})
            </span>
            {lastOperation && (
              <Badge 
                variant="outline"
                className={
                  lastOperation.type === "hit" ? "border-success/50 text-success" :
                  lastOperation.type === "miss" ? "border-destructive/50 text-destructive" :
                  "border-warning/50 text-warning"
                }
              >
                {lastOperation.type.toUpperCase()}: {lastOperation.key}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cacheEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <HardDrive className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Cache is empty</p>
              <p className="text-sm">Click "Add Data" to populate the cache</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cacheEntries.map((entry, index) => {
                const isEvictionCandidate = selectEvictionCandidate(cacheEntries)?.key === entry.key;
                const ttlRemaining = policy === "TTL" 
                  ? Math.max(0, entry.ttl - (Date.now() - entry.createdAt) / 1000)
                  : null;
                
                return (
                  <div 
                    key={entry.key}
                    className={`p-3 rounded-lg border transition-all ${
                      isEvictionCandidate 
                        ? "border-destructive/50 bg-destructive/10" 
                        : "border-border/50 bg-secondary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-medium">{entry.key}</span>
                        {isEvictionCandidate && (
                          <Badge variant="outline" className="text-destructive border-destructive/50 text-xs">
                            Next to evict
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {policy === "LRU" && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {((Date.now() - entry.lastAccess) / 1000).toFixed(1)}s ago
                          </span>
                        )}
                        {policy === "LFU" && (
                          <span className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            {entry.accessCount} accesses
                          </span>
                        )}
                        {policy === "TTL" && ttlRemaining !== null && (
                          <span className={`flex items-center gap-1 ${ttlRemaining < 3 ? "text-destructive" : ""}`}>
                            <Clock className="h-3 w-3" />
                            {ttlRemaining.toFixed(1)}s left
                          </span>
                        )}
                        {policy === "FIFO" && (
                          <span className="flex items-center gap-1">
                            #{index + 1} in queue
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar for TTL */}
                    {policy === "TTL" && ttlRemaining !== null && (
                      <div className="h-1 bg-muted rounded-full overflow-hidden mt-2">
                        <div 
                          className={`h-full transition-all ${ttlRemaining < 3 ? "bg-destructive" : "bg-primary"}`}
                          style={{ width: `${(ttlRemaining / entry.ttl) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cache Flow Diagram */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cache Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="text-center p-3 rounded-lg bg-secondary/30">
              <Zap className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-xs">Request</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className={`text-center p-3 rounded-lg ${
              lastOperation?.type === "hit" ? "bg-success/20 border border-success/50" : "bg-secondary/30"
            }`}>
              <HardDrive className="h-6 w-6 mx-auto mb-1 text-warning" />
              <p className="text-xs">Cache</p>
            </div>
            <div className="flex flex-col items-center">
              <ArrowRight className={`h-5 w-5 ${lastOperation?.type === "miss" ? "text-destructive" : "text-muted-foreground/30"}`} />
              <span className="text-xs text-muted-foreground">miss</span>
            </div>
            <div className={`text-center p-3 rounded-lg ${
              lastOperation?.type === "miss" ? "bg-destructive/20 border border-destructive/50" : "bg-secondary/30"
            }`}>
              <Database className="h-6 w-6 mx-auto mb-1 text-primary" />
              <p className="text-xs">Database</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheStrategiesVisualizer;
