import { useState } from "react";
import { MessageSquare, ThumbsUp, ThumbsDown, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
}

interface DiscussionSectionProps {
  title?: string;
  comments: Comment[];
  accentColor?: string;
}

const CommentItem = ({ 
  comment, 
  depth = 0,
  accentColor = "primary"
}: { 
  comment: Comment; 
  depth?: number;
  accentColor?: string;
}) => {
  const [showReplies, setShowReplies] = useState(depth < 2);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [votes, setVotes] = useState({ up: comment.upvotes, down: comment.downvotes });
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      setUserVote(null);
      setVotes(prev => ({
        ...prev,
        [type]: prev[type] - 1
      }));
    } else {
      if (userVote) {
        setVotes(prev => ({
          ...prev,
          [userVote]: prev[userVote] - 1,
          [type]: prev[type] + 1
        }));
      } else {
        setVotes(prev => ({
          ...prev,
          [type]: prev[type] + 1
        }));
      }
      setUserVote(type);
    }
  };

  return (
    <div className={cn("relative", depth > 0 && "ml-6 pl-4 border-l-2 border-border/50")}>
      <div className="py-3">
        {/* Author info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {comment.avatar}
          </div>
          <span className="font-medium text-sm">{comment.author}</span>
          <span className="text-xs text-muted-foreground">• {comment.timestamp}</span>
        </div>

        {/* Content */}
        <p className="text-sm text-foreground/90 mb-3 leading-relaxed">{comment.content}</p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 px-2", userVote === 'up' && "text-green-500")}
              onClick={() => handleVote('up')}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span className="ml-1 text-xs">{votes.up}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-7 px-2", userVote === 'down' && "text-red-500")}
              onClick={() => handleVote('down')}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              <span className="ml-1 text-xs">{votes.down}</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            <Reply className="h-3.5 w-3.5 mr-1" />
            Reply
          </Button>

          {comment.replies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5 mr-1" />
                  Hide replies
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                  Show {comment.replies.length} replies
                </>
              )}
            </Button>
          )}
        </div>

        {/* Reply input */}
        {showReplyInput && (
          <div className="mt-3 space-y-2">
            <Textarea
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[60px] text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" className="h-7 text-xs">
                Post Reply
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 text-xs"
                onClick={() => {
                  setShowReplyInput(false);
                  setReplyText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {showReplies && comment.replies.length > 0 && (
        <div className="mt-1">
          {comment.replies.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              depth={depth + 1}
              accentColor={accentColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DiscussionSection = ({ title = "Discussion", comments, accentColor = "primary" }: DiscussionSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<'top' | 'new'>('top');

  const totalComments = comments.reduce((acc, comment) => {
    return acc + 1 + comment.replies.length;
  }, 0);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">{title}</h3>
            <span className="text-sm text-muted-foreground">({totalComments} comments)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={sortBy === 'top' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSortBy('top')}
            >
              Top
            </Button>
            <Button
              variant={sortBy === 'new' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSortBy('new')}
            >
              New
            </Button>
          </div>
        </div>
      </div>

      {/* New comment input */}
      <div className="p-4 border-b border-border">
        <Textarea
          placeholder="Share your thoughts on this architecture..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[80px] text-sm mb-2"
        />
        <Button size="sm" disabled={!newComment.trim()}>
          Post Comment
        </Button>
      </div>

      {/* Comments list */}
      <div className="p-4 divide-y divide-border/50">
        {comments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment}
            accentColor={accentColor}
          />
        ))}
      </div>
    </div>
  );
};

// Demo data for each version
export const basicDiscussionData: Comment[] = [
  {
    id: "1",
    author: "Anonymous Dev",
    avatar: "🧑‍💻",
    content: "I've seen this exact pattern cause a 30-minute outage at my company. One slow subscriber blocked notifications for 10,000 users. Never again.",
    timestamp: "2 hours ago",
    upvotes: 47,
    downvotes: 2,
    replies: [
      {
        id: "1-1",
        author: "Anonymous",
        avatar: "👨‍🔧",
        content: "Same here! We had a subscriber webhook that would occasionally timeout. The whole queue would just freeze. Classic head-of-line blocking.",
        timestamp: "1 hour ago",
        upvotes: 23,
        downvotes: 0,
        replies: []
      },
      {
        id: "1-2",
        author: "Anonymous",
        avatar: "🤔",
        content: "How did you fix it? Did you go straight to a message queue or try something simpler first?",
        timestamp: "45 mins ago",
        upvotes: 8,
        downvotes: 0,
        replies: []
      }
    ]
  },
  {
    id: "2",
    author: "Anonymous",
    avatar: "🎯",
    content: "The synchronous approach might be fine for small apps with < 100 users. Don't over-engineer early. But definitely plan for migration.",
    timestamp: "3 hours ago",
    upvotes: 31,
    downvotes: 5,
    replies: [
      {
        id: "2-1",
        author: "Anonymous",
        avatar: "⚡",
        content: "Disagree. Even with 10 users, if one webhook is slow, you're degrading UX for everyone. Start with at least async processing from day 1.",
        timestamp: "2 hours ago",
        upvotes: 18,
        downvotes: 3,
        replies: []
      }
    ]
  },
  {
    id: "3",
    author: "Anonymous",
    avatar: "📚",
    content: "This visualization is great for teaching junior devs why we don't do synchronous fan-out. Bookmarking this.",
    timestamp: "5 hours ago",
    upvotes: 56,
    downvotes: 0,
    replies: []
  }
];

export const advancedDiscussionData: Comment[] = [
  {
    id: "1",
    author: "Anonymous",
    avatar: "🔄",
    content: "The retry logic here is great, but I've seen teams forget about exponential backoff. Without it, you can DDoS your own downstream services during recovery.",
    timestamp: "1 hour ago",
    upvotes: 52,
    downvotes: 1,
    replies: [
      {
        id: "1-1",
        author: "Anonymous",
        avatar: "📈",
        content: "Exponential backoff with jitter is crucial. We use 2^attempt * 1000ms + random(0-1000)ms. Prevents thundering herd.",
        timestamp: "45 mins ago",
        upvotes: 34,
        downvotes: 0,
        replies: []
      }
    ]
  },
  {
    id: "2",
    author: "Anonymous",
    avatar: "💾",
    content: "The volatile queue is the biggest issue here IMO. We lost 50k notifications during a deploy once. Redis with AOF persistence solved it.",
    timestamp: "2 hours ago",
    upvotes: 41,
    downvotes: 2,
    replies: [
      {
        id: "2-1",
        author: "Anonymous",
        avatar: "🤷",
        content: "Isn't Redis with AOF still not truly durable? You can lose up to 1 second of writes on crash.",
        timestamp: "1 hour ago",
        upvotes: 15,
        downvotes: 1,
        replies: []
      },
      {
        id: "2-2",
        author: "Anonymous",
        avatar: "✅",
        content: "True, but for notifications that's usually acceptable. For payments/orders, you'd want Kafka or similar.",
        timestamp: "30 mins ago",
        upvotes: 22,
        downvotes: 0,
        replies: []
      }
    ]
  },
  {
    id: "3",
    author: "Anonymous",
    avatar: "🎭",
    content: "The duplicate detection problem is real. We had users getting 5x the same notification because retries weren't idempotent. Super embarrassing.",
    timestamp: "4 hours ago",
    upvotes: 38,
    downvotes: 0,
    replies: []
  }
];

export const legendaryDiscussionData: Comment[] = [
  {
    id: "1",
    author: "Anonymous",
    avatar: "👑",
    content: "This is basically how Uber and LinkedIn handle their notification systems. Kafka partitioning by user_id gives you ordered delivery per user without global ordering overhead.",
    timestamp: "30 mins ago",
    upvotes: 89,
    downvotes: 3,
    replies: [
      {
        id: "1-1",
        author: "Anonymous",
        avatar: "🏗️",
        content: "At scale, we also add a notification deduplication service in front of Kafka. Catches duplicates before they even hit the log.",
        timestamp: "20 mins ago",
        upvotes: 45,
        downvotes: 0,
        replies: []
      },
      {
        id: "1-2",
        author: "Anonymous",
        avatar: "🔍",
        content: "How do you handle cross-partition transactions? Like when a notification needs to go to multiple users atomically?",
        timestamp: "15 mins ago",
        upvotes: 12,
        downvotes: 0,
        replies: []
      }
    ]
  },
  {
    id: "2",
    author: "Anonymous",
    avatar: "💰",
    content: "One thing not shown here: Kafka's retention means you can replay notifications for debugging/recovery. Saved us during a consumer bug that was silently dropping messages.",
    timestamp: "1 hour ago",
    upvotes: 67,
    downvotes: 1,
    replies: [
      {
        id: "2-1",
        author: "Anonymous",
        avatar: "⏰",
        content: "We keep 7 days retention for notifications. Had to replay 3 days once when we discovered a bug. Users got their notifications late but at least they got them.",
        timestamp: "45 mins ago",
        upvotes: 28,
        downvotes: 0,
        replies: []
      }
    ]
  },
  {
    id: "3",
    author: "Anonymous",
    avatar: "🚀",
    content: "For smaller scale, consider Postgres with SKIP LOCKED for exactly-once. Same guarantees, less operational overhead than Kafka.",
    timestamp: "2 hours ago",
    upvotes: 54,
    downvotes: 4,
    replies: [
      {
        id: "3-1",
        author: "Anonymous",
        avatar: "📊",
        content: "Works until about 10k msg/sec in my experience. After that, you need dedicated message infrastructure.",
        timestamp: "1 hour ago",
        upvotes: 31,
        downvotes: 0,
        replies: []
      }
    ]
  }
];

export default DiscussionSection;
