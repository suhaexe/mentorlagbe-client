"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  Check,
  HelpCircle,
  Sparkles,
  GraduationCap,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";

const TUTOR_FEATURES = [
  "Unlimited tuition posts",
  "Verified Pro Badge",
  "Priority applicant visibility",
  "Advanced analytics",
];

const STUDENT_FEATURES = [
  "Priority booking for tuitions",
  "Premium student support",
  "Profile highlight to tutors",
  "Unlimited applications",
];

const COMPARISON_ROWS = [
  { feature: "Tuition post limit", tutor: "Unlimited batches", student: "—" },
  {
    feature: "Application limit",
    tutor: "—",
    student: "Unlimited applications",
  },
  {
    feature: "Visibility & trust",
    tutor: "Verified Pro Badge + priority applicants",
    student: "Profile highlight to tutors",
  },
  {
    feature: "Booking & insights",
    tutor: "Advanced analytics",
    student: "Priority booking + premium support",
  },
];

const FAQS = [
  {
    q: "Is Pro really a one-time payment?",
    a: "Yes. Both Tutor Pro ($15) and Student Pro ($10) are one-time upgrades—no recurring monthly subscription traps.",
  },
  {
    q: "Which plan should I pick if I'm a student vs. a tutor?",
    a: "Choose Tutor Pro if you post batches and want unlimited listings, a Verified Pro Badge, and analytics. Choose Student Pro if you apply to batches and want unlimited applications plus priority booking.",
  },
  {
    q: "How quickly do perks unlock after upgrading?",
    a: "Your Pro status and features activate right after your upgrade completes on your account.",
  },
];

const PricingPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [roleFocus, setRoleFocus] = useState<"tutor" | "student">("tutor");
  const [batchesOrApps, setBatchesOrApps] = useState<number>(6);
  const [loadingPlan, setLoadingPlan] = useState<"tutor" | "student" | null>(
    null,
  );

  const handleUpgrade = async (planType: "tutor" | "student") => {
    if (!session?.user) {
      toast.error("Please sign in first");
      return router.push(`/sign-in?redirect=/pricing`);
    }

    const role = session.user.role as string;
    if (role !== planType) {
      return toast.error(`You are logged in as a ${role}, not a ${planType}`);
    }

    setLoadingPlan(planType);
    try {
      const data = await api<{ url: string }>("/api/payments/checkout", {
        method: "POST",
        body: { planType },
      });
      window.location.href = data.url; // Go to Stripe Checkout
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to start checkout";
      toast.error(message);
      setLoadingPlan(null);
    }
  };

  const estimatedOutcome =
    roleFocus === "tutor"
      ? `Managing ${batchesOrApps} active ${batchesOrApps === 1 ? "batch" : "batches"} with unlimited posts & priority applicant visibility`
      : `Submitting up to ${batchesOrApps * 3} targeted applications with profile highlight & priority booking`;

  return (
    <div className="flex min-h-screen flex-col bg-[#101014] text-[#F5F1F8]">
      <Navbar />

      <main className="flex-1 pb-24 pt-12 sm:pt-16">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C08BFF]">
              One-Time Upgrades
            </p>
            <h1 className="mt-3 font-sans text-4xl font-medium tracking-[-0.035em] text-[#F5F1F8] sm:text-5xl">
              Upgrade to{" "}
              <span className="font-heading font-normal italic text-[#C08BFF]">
                Pro.
              </span>
            </h1>
            <p className="mt-3 font-sans text-sm leading-relaxed text-[#A69BAF] sm:text-base">
              Unlock premium features to get the most out of MentorLagbe—pay
              once and keep your edge.
            </p>

            {/* Role Focus Switcher */}
            <div className="mt-7 inline-flex rounded-full border border-[#806B88]/30 bg-[#15131B] p-1">
              <button
                type="button"
                onClick={() => setRoleFocus("tutor")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-medium transition-all ${
                  roleFocus === "tutor"
                    ? "bg-[#A45DEB] text-[#101014] shadow-[0_0_20px_rgba(164,93,235,0.3)]"
                    : "text-[#A69BAF] hover:text-[#F5F1F8]"
                }`}
              >
                <Users size={14} /> Tutor Track
              </button>
              <button
                type="button"
                onClick={() => setRoleFocus("student")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-medium transition-all ${
                  roleFocus === "student"
                    ? "bg-[#A45DEB] text-[#101014] shadow-[0_0_20px_rgba(164,93,235,0.3)]"
                    : "text-[#A69BAF] hover:text-[#F5F1F8]"
                }`}
              >
                <GraduationCap size={14} /> Student Track
              </button>
            </div>
          </div>

          {/* Two-Track Plan Cards */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Tutor Pro Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border p-7 sm:p-9 ${
                roleFocus === "tutor"
                  ? "border-[#C08BFF]/55 bg-[#15131B] shadow-[0_20px_70px_rgba(164,93,235,0.18)]"
                  : "border-[#806B88]/25 bg-[#15131B]/80"
              }`}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#A45DEB]/15 blur-3xl"
              />
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#C08BFF]">
                    For Educators
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#C08BFF]/35 bg-[#A45DEB]/15 px-3 py-1 font-mono text-[11px] font-medium text-[#C08BFF]">
                    <Sparkles size={12} /> Popular
                  </span>
                </div>
                <h2 className="mt-3 font-sans text-2xl font-semibold text-[#F5F1F8]">
                  Tutor Pro
                </h2>
                <p className="mt-1 font-sans text-sm text-[#A69BAF]">
                  For educators who want to scale.
                </p>
                <div className="mt-6 flex items-baseline gap-2 border-b border-[#806B88]/20 pb-6">
                  <span className="font-sans text-4xl font-bold tracking-tight text-[#F5F1F8] sm:text-5xl">
                    $15
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#806B88]">
                    / one-time
                  </span>
                </div>
                <ul className="mt-6 space-y-3.5">
                  {TUTOR_FEATURES.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 font-sans text-sm text-[#E2DCE8]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#A45DEB]/20 text-[#C08BFF]">
                        <Check size={13} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-2">
                <button
                  onClick={() => handleUpgrade("tutor")}
                  disabled={loadingPlan !== null}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#A45DEB] px-6 font-sans text-sm font-semibold text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.3)] transition-colors hover:bg-[#C08BFF] disabled:opacity-50"
                >
                  {loadingPlan === "tutor"
                    ? "Redirecting..."
                    : "Upgrade Tutor Account"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

            {/* Student Pro Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border p-7 sm:p-9 ${
                roleFocus === "student"
                  ? "border-[#C08BFF]/55 bg-[#15131B] shadow-[0_20px_70px_rgba(164,93,235,0.18)]"
                  : "border-[#806B88]/25 bg-[#15131B]/80"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#A69BAF]">
                    For Learners
                  </span>
                  <span className="rounded-full border border-[#806B88]/30 bg-[#101014]/70 px-3 py-1 font-mono text-[11px] text-[#A69BAF]">
                    Student Edge
                  </span>
                </div>
                <h2 className="mt-3 font-sans text-2xl font-semibold text-[#F5F1F8]">
                  Student Pro
                </h2>
                <p className="mt-1 font-sans text-sm text-[#A69BAF]">
                  For students who want an edge.
                </p>
                <div className="mt-6 flex items-baseline gap-2 border-b border-[#806B88]/20 pb-6">
                  <span className="font-sans text-4xl font-bold tracking-tight text-[#F5F1F8] sm:text-5xl">
                    $10
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#806B88]">
                    / one-time
                  </span>
                </div>
                <ul className="mt-6 space-y-3.5">
                  {STUDENT_FEATURES.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 font-sans text-sm text-[#E2DCE8]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#A45DEB]/20 text-[#C08BFF]">
                        <Check size={13} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 pt-2">
                <button
                  onClick={() => handleUpgrade("student")}
                  disabled={loadingPlan !== null}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#C08BFF]/40 bg-[#101014] px-6 font-sans text-sm font-semibold text-[#F5F1F8] transition-colors hover:border-[#C08BFF] hover:bg-[#A45DEB]/20 disabled:opacity-50"
                >
                  {loadingPlan === "student"
                    ? "Redirecting..."
                    : "Upgrade Student Account"}
                  <ArrowRight size={16} className="text-[#C08BFF]" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Interactive Activity Preview Strip */}
          <div className="mt-12 rounded-3xl border border-[#806B88]/25 bg-[#15131B]/90 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#C08BFF]">
                  Interactive Capacity Preview
                </p>
                <h3 className="mt-1.5 font-sans text-lg font-semibold text-[#F5F1F8]">
                  {roleFocus === "tutor"
                    ? "How many tuition batches do you plan to run?"
                    : "How many focus rounds are you planning this term?"}
                </h3>
                <p className="mt-1 font-sans text-sm text-[#A69BAF]">
                  {estimatedOutcome}
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-[#806B88]">
                    {roleFocus === "tutor" ? "Active Batches" : "Study Rounds"}
                  </span>
                  <span className="font-semibold text-[#C08BFF]">
                    {batchesOrApps}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={batchesOrApps}
                  onChange={(e) => setBatchesOrApps(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#241E30] accent-[#A45DEB]"
                />
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-[#806B88]/25 bg-[#15131B]">
            <div className="grid grid-cols-3 border-b border-[#806B88]/20 bg-[#101014]/60 px-6 py-4 font-mono text-xs uppercase tracking-wider text-[#A69BAF]">
              <span>Feature</span>
              <span className="text-[#C08BFF]">Tutor Pro ($15)</span>
              <span>Student Pro ($10)</span>
            </div>
            <div className="divide-y divide-[#806B88]/15">
              {COMPARISON_ROWS.map((row) => (
                <div
                  key={row.feature}
                  className="grid grid-cols-1 gap-2 px-6 py-4 text-sm sm:grid-cols-3 sm:items-center sm:gap-4"
                >
                  <span className="font-medium text-[#F5F1F8]">
                    {row.feature}
                  </span>
                  <span className="text-[#C4C0CC]">{row.tutor}</span>
                  <span className="text-[#C4C0CC]">{row.student}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compact FAQ */}
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-[#806B88]/20 bg-[#15131B]/70 p-6"
              >
                <div className="flex items-start gap-2.5">
                  <HelpCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-[#C08BFF]"
                  />
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-[#F5F1F8]">
                      {item.q}
                    </h3>
                    <p className="mt-2 font-sans text-xs leading-relaxed text-[#A69BAF]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="mt-16 flex items-center gap-4 py-4 sm:mt-20"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#806B88]/25 to-[#806B88]/25" />
          <span className="h-2 w-2 rounded-full bg-[#C08BFF] shadow-[0_0_12px_rgba(192,139,255,0.75)]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#806B88]/25 to-[#806B88]/25" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
