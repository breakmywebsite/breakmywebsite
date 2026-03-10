import DemoPageLayout from "@/components/shared/DemoPageLayout";
import NotificationClient from "./NotificationClient";

export default function NotificationSystemDemo() {
  return (
    <DemoPageLayout title="Notification System">
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Choose Your Architecture Level</h2>
          <p className="text-muted-foreground">
            See how notification systems evolve from naive to production-grade
          </p>
        </div>
        <NotificationClient />
      </div>
    </DemoPageLayout>
  );
}
