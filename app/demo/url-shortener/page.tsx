import DemoPageLayout from "@/components/shared/DemoPageLayout";
import UrlShortenerClient from "./UrlShortenerClient";

export default function UrlShortenerPage() {
  return (
    <DemoPageLayout title="URL Shortener System">
      <UrlShortenerClient />
    </DemoPageLayout>
  );
}
