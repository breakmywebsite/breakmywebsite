import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3, TrendingUp, Clock, Globe } from "lucide-react";

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
  clickHistory: { timestamp: Date; referrer: string }[];
}

interface UrlAnalyticsProps {
  urls: ShortenedUrl[];
}

const COLORS = ['hsl(174, 72%, 56%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(142, 72%, 45%)', 'hsl(220, 15%, 50%)', 'hsl(190, 80%, 45%)'];

const UrlAnalytics = ({ urls }: UrlAnalyticsProps) => {
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const avgClicksPerUrl = urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : 0;
  
  // Get referrer distribution
  const referrerData = urls.flatMap(u => u.clickHistory)
    .reduce((acc, click) => {
      acc[click.referrer] = (acc[click.referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(referrerData).map(([name, value]) => ({ name, value }));

  // Get clicks per URL for bar chart
  const barData = urls.slice(0, 6).map(url => ({
    name: url.shortCode,
    clicks: url.clicks
  }));

  // Recent activity
  const recentClicks = urls
    .flatMap(u => u.clickHistory.map(c => ({ ...c, shortCode: u.shortCode })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <section className="max-w-6xl mx-auto mb-16">
      <div className="text-center mb-8">
        <span className="text-sm font-mono text-primary mb-4 block">// ANALYTICS</span>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Real-time Analytics
        </h2>
        <p className="text-muted-foreground">
          Simulate clicks to see analytics update in real-time. Notice how cache invalidation affects data freshness.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card rounded-xl p-4 text-center">
          <BarChart3 className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalClicks}</p>
          <p className="text-xs text-muted-foreground">Total Clicks</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <TrendingUp className="h-5 w-5 text-success mx-auto mb-2" />
          <p className="text-2xl font-bold">{avgClicksPerUrl}</p>
          <p className="text-xs text-muted-foreground">Avg per URL</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Clock className="h-5 w-5 text-warning mx-auto mb-2" />
          <p className="text-2xl font-bold">{urls.length}</p>
          <p className="text-xs text-muted-foreground">URLs Created</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <Globe className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{Object.keys(referrerData).length}</p>
          <p className="text-xs text-muted-foreground">Referrer Sources</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4">Clicks by URL</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(215, 20%, 55%)" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(215, 20%, 55%)" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(220, 20%, 7%)', 
                    border: '1px solid hsl(220, 15%, 15%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)'
                  }}
                />
                <Bar 
                  dataKey="clicks" 
                  fill="hsl(174, 72%, 56%)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No click data yet
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4">Traffic Sources</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(220, 20%, 7%)', 
                    border: '1px solid hsl(220, 15%, 15%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No referrer data yet
            </div>
          )}
          {pieData.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {recentClicks.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentClicks.map((click, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="font-mono text-sm text-primary">brk.my/{click.shortCode}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{click.referrer}</span>
                  <span>{new Date(click.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default UrlAnalytics;
