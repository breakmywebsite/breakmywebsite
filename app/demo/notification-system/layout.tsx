import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://breakmywebsite.com";

export const metadata: Metadata = {
  title: "Notification System - System Design Demo",
  description: "Explore a complete notification system design from basic to legendary implementations. Learn about message queues, pub-sub patterns, scalability, fault tolerance, and distributed architecture.",
  keywords: [
    "notification system",
    "push notifications",
    "message queue",
    "pub-sub pattern",
    "kafka",
    "rabbitmq",
    "distributed systems",
    "real-time notifications",
    "system design",
    "scalable architecture",
    "websocket notifications",
    "fcm",
    "apns",
  ],
  openGraph: {
    type: "website",
    url: `${siteUrl}/demo/notification-system`,
    title: "Notification System Design - Interactive Demo",
    description: "Learn how to design scalable notification systems from basic to legendary implementations.",
    siteName: "Break My Website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notification System Design - Interactive Demo",
    description: "Learn how to design scalable notification systems from basic to legendary implementations.",
    creator: "@breakmywebsite",
  },
  alternates: {
    canonical: `${siteUrl}/demo/notification-system`,
  },
};

export default function NotificationSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
