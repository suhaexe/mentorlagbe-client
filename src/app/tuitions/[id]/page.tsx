import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tuition } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ApplyButton } from "@/components/tuition/ApplyButton";

const getTuition = async (id: string): Promise<Tuition | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tuitions/${id}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  return res.json();
};

const TuitionDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const resolvedParams = await params;
  const tuition = await getTuition(resolvedParams.id);

  if (!tuition) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Back navigation */}
      <div className="mb-6">
        <Link
          href="/tuitions"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[#A69BAF] transition-colors hover:text-[#C08BFF]"
        >
          <ArrowLeft size={14} />
          Back to Tuitions
        </Link>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-12">
        {/* Left Column (7 cols): Banner, Header, Description */}
        <div className="space-y-7 lg:col-span-7">
          <div className="overflow-hidden rounded-3xl border border-[#806B88]/20 bg-[#15131B] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <img
              src={tuition.bannerImage}
              alt={tuition.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          <div className="rounded-3xl border border-[#806B88]/20 bg-[#15131B]/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:p-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge className="rounded-full border border-[#C08BFF]/30 bg-[#A45DEB]/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#C08BFF] hover:bg-[#A45DEB]/20">
                {tuition.subject}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-[#806B88]/30 bg-[#101014]/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#C4C0CC]"
              >
                {tuition.classLevel}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full border border-[#806B88]/20 bg-[#1F1B29] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#F5F1F8]"
              >
                {tuition.mode}
              </Badge>
            </div>

            <h1 className="mt-4 font-sans text-2xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-3xl">
              {tuition.title}
            </h1>

            <div className="mt-4 flex items-center gap-3 border-t border-[#806B88]/15 pt-4 text-sm text-[#A69BAF]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#806B88]/25 bg-[#101014] text-[#C08BFF]">
                <User size={14} />
              </div>
              <span>
                Posted by{" "}
                <span className="font-medium text-[#F5F1F8]">
                  {tuition.tutorName}
                </span>
              </span>
            </div>

            <div className="mt-7 border-t border-[#806B88]/15 pt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C08BFF]">
                Overview
              </p>
              <h2 className="mt-1 font-sans text-lg font-medium text-[#F5F1F8]">
                About This Batch
              </h2>
              <p className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#C4C0CC] sm:text-[15px]">
                {tuition.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Tuition Summary & Apply CTA */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:col-span-5">
          <div className="rounded-3xl border border-[#806B88]/20 bg-[#15131B]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:p-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C08BFF]">
              Tuition Summary
            </p>
            <h2 className="mt-1 font-sans text-xl font-medium tracking-[-0.02em] text-[#F5F1F8]">
              Batch{" "}
              <span className="font-heading font-normal italic text-[#C08BFF]">
                details.
              </span>
            </h2>

            {/* Fee highlight box */}
            <div className="mt-5 rounded-2xl border border-[#806B88]/20 bg-[#101014] p-4">
              <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#A69BAF]">
                Monthly Fee
              </span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-sans text-2xl font-semibold tracking-tight text-[#C08BFF]">
                  ৳{tuition.monthlyFee}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#806B88]">
                  / month
                </span>
              </div>
            </div>

            {/* Key info rows */}
            <div className="mt-5 divide-y divide-[#806B88]/15 text-sm">
              <div className="flex items-center justify-between py-3">
                <span className="inline-flex items-center gap-2 text-[#A69BAF]">
                  <BookOpen size={15} className="text-[#C08BFF]" />
                  Subject & Level
                </span>
                <span className="font-medium text-[#F5F1F8]">
                  {tuition.subject} · {tuition.classLevel}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="inline-flex items-center gap-2 text-[#A69BAF]">
                  <Calendar size={15} className="text-[#C08BFF]" />
                  Schedule
                </span>
                <span className="font-medium text-[#F5F1F8]">
                  {tuition.daysPerWeek} Days / Week
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="inline-flex items-center gap-2 text-[#A69BAF]">
                  <MapPin size={15} className="text-[#C08BFF]" />
                  Location
                </span>
                <span className="font-medium text-[#F5F1F8]">
                  {tuition.location || "Online"}
                </span>
              </div>
            </div>

            {/* Apply action */}
            <div className="mt-6 border-t border-[#806B88]/15 pt-5">
              <ApplyButton tuition={tuition} />
            </div>
          </div>

          {/* Subtle helper note card */}
          <div className="flex items-start gap-3 rounded-2xl border border-[#806B88]/15 bg-[#15131B]/60 px-4 py-3.5 text-xs text-[#A69BAF]">
            <Sparkles size={15} className="mt-0.5 shrink-0 text-[#C08BFF]" />
            <p className="leading-relaxed">
              Applications are reviewed directly by the tutor. Make sure your
              profile details are up to date before applying.
            </p>
          </div>
        </div>
      </div>

      {/* Section divider matching sign-in page */}
      <div
        aria-hidden="true"
        className="mt-16 flex items-center gap-4 py-4 sm:mt-20"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#806B88]/25 to-[#806B88]/25" />
        <span className="h-2 w-2 rounded-full bg-[#C08BFF] shadow-[0_0_12px_rgba(192,139,255,0.75)]" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#806B88]/25 to-[#806B88]/25" />
      </div>
    </div>
  );
};

const TuitionDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#101014] text-[#F5F1F8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-20 -z-0 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-[#A45DEB]/[0.08] blur-[140px]"
      />

      <Suspense fallback={<div className="h-16 border-b border-[#806B88]/20 bg-[#101014]" />}>
        <Navbar />
      </Suspense>

      <main className="relative z-10 flex-1 py-10 sm:py-12">
        <Suspense
          fallback={
            <div className="py-24 text-center font-mono text-xs uppercase tracking-[0.2em] text-[#A69BAF]">
              Loading details...
            </div>
          }
        >
          <TuitionDetails params={params} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default TuitionDetailsPage;