import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsAndTestimonials } from "@/components/home/StatsAndTestimonials";

const AboutPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-muted/30 py-20 text-center">
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl mb-4">About MentorLagbe</h1>
            <p className="text-lg text-muted-foreground">
              MentorLagbe is a smart tuition and mentorship platform designed to bridge the gap between qualified tutors and eager students. 
              We provide a secure, verified ecosystem where learning thrives.
            </p>
          </div>
        </section>
        
        <HowItWorks />
        <StatsAndTestimonials />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;