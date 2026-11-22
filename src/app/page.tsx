import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsAndTestimonials } from "@/components/home/StatsAndTestimonials";
import {
  FeaturedTuitions,
  FeaturedTuitionsSkeleton,
} from "@/components/home/FeaturedIndex";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Suspense } from "react";
import { StayConnected } from "@/components/home/StayConnected";

function SectionBridge({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-full max-w-7xl items-center gap-4 px-5 py-3 sm:px-8 lg:px-10"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C08BFF]/25 to-[#C08BFF]/40" />
      <span className="inline-flex items-center gap-2 rounded-full border border-[#C08BFF]/20 bg-[#15131B]/80 px-3.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-[#A69BAF]">
        <span className="size-1.5 rounded-full bg-[#C08BFF]" />
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C08BFF]/25 to-[#C08BFF]/40" />
    </div>
  );
}

const HomePage = () => {
  // throw new Error("Test error boundary");
  return (
    <div className="flex min-h-screen flex-col bg-[#101014] text-[#F5F1F8]">
      <Navbar />
      <main className="relative flex-1 bg-[#101014]">
        <Hero />

        <SectionBridge label="Verified Listings" />

        <Suspense fallback={<FeaturedTuitionsSkeleton />}>
          <FeaturedTuitions />
        </Suspense>

        <SectionBridge label="How It Works" />

        <HowItWorks />

        <SectionBridge label="Subjects & Community" />

        <StatsAndTestimonials />

        <SectionBridge label="Start Your Journey" />

        <StayConnected />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;