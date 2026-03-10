import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedSystems from "@/components/FeaturedSystems";
import Concepts from "@/components/Concepts";
import HowItWorks from "@/components/HowItWorks";
import ReviewService from "@/components/ReviewService";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedSystems />
        <Concepts />
        <HowItWorks />
        <ReviewService />
      </main>
      <Footer />
    </div>
  );
}
