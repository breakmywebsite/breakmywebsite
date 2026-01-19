import { useState, useEffect } from "react";
import { Bell, X, Check, AlertCircle, Clock, User, MessageSquare, Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: "message" | "like" | "order" | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
  status?: "delivered" | "failed" | "delayed" | "duplicate";
}

interface WebPreviewProps {
  version: "basic" | "advanced" | "legendary";
  notifications: Notification[];
  isLoading?: boolean;
  showIssues?: boolean;
}

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "message": return <MessageSquare className="h-4 w-4 text-primary" />;
    case "like": return <Heart className="h-4 w-4 text-destructive" />;
    case "order": return <ShoppingCart className="h-4 w-4 text-success" />;
    default: return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

const WebPreview = ({ version, notifications, isLoading, showIssues }: WebPreviewProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="rounded-lg border border-border bg-background overflow-hidden">
      {/* Mock Browser Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-warning/60" />
          <div className="w-3 h-3 rounded-full bg-success/60" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground font-mono">
            yourapp.com/dashboard
          </div>
        </div>
      </div>

      {/* Mock App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">A</span>
          </div>
          <span className="font-semibold text-sm">YourApp</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            {isLoading && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary animate-ping" />
            )}
          </button>
          
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
            <span className="text-sm font-semibold">Notifications</span>
            <Badge variant="outline" className="text-xs">
              {version === "basic" && "Basic"}
              {version === "advanced" && "Advanced"}
              {version === "legendary" && "Legendary"}
            </Badge>
          </div>
          
          <ScrollArea className="h-[200px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[180px] text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs">Run the demo to see them appear</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-secondary/30 transition-colors ${
                      !notification.read ? "bg-primary/5" : ""
                    } ${notification.status === "failed" ? "opacity-50" : ""}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium truncate">{notification.title}</p>
                          {showIssues && notification.status && (
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] flex-shrink-0 ${
                                notification.status === "failed" ? "text-destructive border-destructive/30" :
                                notification.status === "delayed" ? "text-warning border-warning/30" :
                                notification.status === "duplicate" ? "text-destructive border-destructive/30" :
                                "text-success border-success/30"
                              }`}
                            >
                              {notification.status === "failed" && <X className="h-2 w-2 mr-1" />}
                              {notification.status === "delayed" && <Clock className="h-2 w-2 mr-1" />}
                              {notification.status === "duplicate" && <AlertCircle className="h-2 w-2 mr-1" />}
                              {notification.status === "delivered" && <Check className="h-2 w-2 mr-1" />}
                              {notification.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{notification.description}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Issues Summary for Basic/Advanced */}
          {showIssues && version === "basic" && notifications.some(n => n.status === "failed" || n.status === "delayed") && (
            <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Some notifications failed or were delayed due to sequential processing
              </p>
            </div>
          )}

          {showIssues && version === "advanced" && notifications.some(n => n.status === "duplicate") && (
            <div className="px-4 py-2 bg-warning/10 border-t border-warning/20">
              <p className="text-xs text-warning flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Duplicate notification detected - no deduplication in place
              </p>
            </div>
          )}

          {version === "legendary" && notifications.length > 0 && (
            <div className="px-4 py-2 bg-success/10 border-t border-success/20">
              <p className="text-xs text-success flex items-center gap-1">
                <Check className="h-3 w-3" />
                All notifications delivered in order with exactly-once guarantee
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mock Page Content */}
      <div className="p-4 bg-secondary/20 min-h-[80px]">
        <div className="space-y-2">
          <div className="h-3 bg-secondary/50 rounded w-3/4" />
          <div className="h-3 bg-secondary/50 rounded w-1/2" />
          <div className="h-3 bg-secondary/50 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default WebPreview;
