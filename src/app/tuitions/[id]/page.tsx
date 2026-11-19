import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tuition } from "@/types";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ApplyButton } from "@/components/tuition/ApplyButton";

const getTuition = async (id: string): Promise<Tuition | null> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tuitions/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
};

// 1. Move the await params inside this component
const TuitionDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const tuition = await getTuition(resolvedParams.id);
  
  if (!tuition) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4">
      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column (Details) */}
        <div className="md:col-span-2 space-y-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tuition.bannerImage}
            alt={tuition.title}
            className="w-full rounded-xl object-cover max-h-[400px]"
          />
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge>{tuition.subject}</Badge>
              <Badge variant="outline">{tuition.classLevel}</Badge>
              <Badge variant="secondary">{tuition.mode}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{tuition.title}</h1>
            <p className="mt-2 text-muted-foreground">Posted by <span className="font-semibold">{tuition.tutorName}</span></p>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-xl font-bold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{tuition.description}</p>
          </div>
        </div>

        {/* Right Column (Sidebar / Apply) */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Tuition Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Monthly Fee</span>
                <span className="font-bold text-primary text-lg">৳{tuition.monthlyFee}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Days / Week</span>
                <span className="font-medium">{tuition.daysPerWeek} Days</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground">Location</span>
                <span className="font-medium">{tuition.location || "Online"}</span>
              </div>
            </div>

            <ApplyButton tuition={tuition} />
            
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Outer component is no longer async and does not await params
const TuitionDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Navbar />
      </Suspense>
      
      <main className="flex-1 py-10">
        <Suspense fallback={<div className="text-center py-20 text-muted-foreground">Loading details...</div>}>
          {/* 3. Pass the params Promise directly to the wrapped component */}
          <TuitionDetails params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default TuitionDetailsPage;