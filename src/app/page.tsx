import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TuitionCard } from "@/components/tuition/TuitionCard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsAndTestimonials } from "@/components/home/StatsAndTestimonials";
import { Tuition } from "@/types";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "react";

const getFeaturedTuitions = async (): Promise<Tuition[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tuitions/featured`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
};

const FeaturedTuitions = async () => {
  const tuitions = await getFeaturedTuitions();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tuitions.map((tuition) => (
        <TuitionCard key={tuition._id} tuition={tuition} />
      ))}
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 py-20">
          <div className="mx-auto max-w-7xl px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Find Your Ideal Tutor <br className="hidden md:block" />
              or Mentorship Batch Today
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Connect with verified tutors for personalized academic guidance. Search by subject, class level, and budget.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/tuitions" className={buttonVariants({ size: "lg" })}>
                Browse Tuitions
              </Link>
              <Link href="/pricing" className={buttonVariants({ size: "lg", variant: "outline" })}>
                View Pro Plans
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Tuitions */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Tuitions</h2>
            <Link href="/tuitions" className="text-primary hover:underline">
              View All
            </Link>
          </div>
          <Suspense fallback={<div className="py-10 text-center text-muted-foreground">Loading tuitions...</div>}>
            <FeaturedTuitions />
          </Suspense>
        </section>

        {/* Extra Section 1 */}
        <HowItWorks />

        {/* Extra Section 2 */}
        <StatsAndTestimonials />
        
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;