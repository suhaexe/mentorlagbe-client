"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type Track = "student" | "tutor";

interface Stage {
  id: string;
  code: string;
  title: string;
  metric: string;
  summary: string;
  detail: string;
  nodeX: number;
  nodeY: number;
}

const STAGES: Record<Track, Stage[]> = {
  student: [
    {
      id: "scan",
      code: "01 / DISCOVERY",
      title: "Every listing is audited before it touches your screen.",
      metric: "100% Admin-Verified Batches",
      summary: "No ghost ads, no bait-and-switch agencies.",
      detail:
        "Before a tuition goes live on MentorLagbe, our team verifies the tutor's credentials, schedule, and fee transparency—so you only spend time on real batches.",
      nodeX: 140,
      nodeY: 150,
    },
    {
      id: "signal",
      code: "02 / DIRECT SIGNAL",
      title: "Your application goes straight to the mentor.",
      metric: "0 Middlemen · 0 Commission",
      summary: "No broker taking half the first month's salary.",
      detail:
        "Traditional tuition media sit in the middle, inflate fees, and delay replies. On MentorLagbe, your note and class preference land directly in the tutor's queue.",
      nodeX: 400,
      nodeY: 75,
    },
    {
      id: "launch",
      code: "03 / IGNITION",
      title: "Accepted once. Ready for class immediately.",
      metric: "Instant Status Sync",
      summary: "Clear confirmation, transparent monthly fee, zero guesswork.",
      detail:
        "The moment a tutor accepts your request, your batch status flips live and you move straight into your first session with full clarity on schedule and expectations.",
      nodeX: 660,
      nodeY: 150,
    },
  ],
  tutor: [
    {
      id: "publish",
      code: "01 / BROADCAST",
      title: "Publish structured batches, not scattered posts.",
      metric: "Unlimited Posts on Pro",
      summary: "Define subject, mode, days per week, and exact monthly fee.",
      detail:
        "Instead of chasing leads across noisy social groups, present your teaching like a real program—built for serious students looking for your exact subject and level.",
      nodeX: 140,
      nodeY: 150,
    },
    {
      id: "vet",
      code: "02 / TRUST LAYER",
      title: "Verification gives serious students confidence.",
      metric: "Verified Pro Badge",
      summary: "Stand out instantly with platform-backed credibility.",
      detail:
        "Admin verification and Tutor Pro status separate dedicated educators from random listings, bringing higher-intent applicants directly to your batch.",
      nodeX: 400,
      nodeY: 75,
    },
    {
      id: "scale",
      code: "03 / AUTONOMY",
      title: "Keep 100% of what you earn. Every single month.",
      metric: "0% Cut · One-Time Pro",
      summary: "No recurring subscription traps or agency commissions.",
      detail:
        "Review incoming student notes, accept the right fit, and build recurring batches without giving up a percentage of your hard-earned tuition fees.",
      nodeX: 660,
      nodeY: 150,
    },
  ],
};

const CONTRAST_ROWS = [
  {
    dimension: "Who sits between student & tutor",
    legacy: "Brokers, Facebook pages & commission agents",
    mentorlagbe: "Nobody. Direct peer-to-peer connection",
  },
  {
    dimension: "Fee & commission structure",
    legacy: "50%–60% first-month cut taken by middlemen",
    mentorlagbe: "0% commission on tuitions",
  },
  {
    dimension: "Listing authenticity",
    legacy: "Unverified posts, fake leads, outdated numbers",
    mentorlagbe: "Admin-audited batches before publication",
  },
  {
    dimension: "Application clarity",
    legacy: "Endless DMs and unanswered phone calls",
    mentorlagbe: "Structured batch metadata + live status tracking",
  },
];

export default function AboutPage() {
  const [track, setTrack] = useState<Track>("student");
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const stages = STAGES[track];
  const currentStage = stages[activeIndex] ?? stages[0];

  const handleTrackSwitch = (nextTrack: Track) => {
    setTrack(nextTrack);
    setActiveIndex(0);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#101014] text-[#F5F1F8]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-[#A45DEB]/[0.08] blur-[150px]" />
        <div className="absolute bottom-1/4 right-[-10%] h-[380px] w-[380px] rounded-full bg-[#C08BFF]/[0.05] blur-[130px]" />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 pb-28 pt-12 sm:pt-20">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 gap-10 border-b border-[#806B88]/20 pb-14 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#C08BFF]">
                Manifesto &amp; Architecture
              </p>

              <h1 className="mt-4 font-sans text-4xl font-medium leading-[0.98] tracking-[-0.045em] text-[#F5F1F8] sm:text-6xl lg:text-[4.5rem]">
                Tuitions shouldn&apos;t pass through{" "}
                <span className="font-heading font-normal italic text-[#C08BFF]">
                  middlemen.
                </span>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:pb-1">
              <p className="font-sans text-sm leading-relaxed text-[#A69BAF] sm:text-base">
                MentorLagbe was built to strip out the brokers, commission cuts,
                and guesswork from private tutoring in Bangladesh—replacing them
                with verified batches and a direct line between learner and
                mentor.
              </p>
            </div>
          </div>

          <section
            aria-labelledby="architecture-heading"
            className="pt-16 sm:pt-20"
          >
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#806B88]">
                  Interactive System Blueprint
                </p>
                <h2
                  id="architecture-heading"
                  className="mt-2 font-sans text-2xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-3xl"
                >
                  Inspect how a connection travels.
                </h2>
              </div>

              <div className="flex items-center gap-6 border-b border-[#806B88]/20">
                {(["student", "tutor"] as Track[]).map((item) => {
                  const active = track === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleTrackSwitch(item)}
                      className={`relative pb-3 font-mono text-xs uppercase tracking-[0.2em] transition-colors ${
                        active
                          ? "font-semibold text-[#F5F1F8]"
                          : "text-[#806B88] hover:text-[#C08BFF]"
                      }`}
                    >
                      {item === "student" ? "Student Path" : "Tutor Path"}
                      {active && (
                        <motion.span
                          layoutId="about-track-indicator"
                          className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-[#C08BFF]"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="relative overflow-hidden rounded-3xl border border-[#806B88]/20 bg-[#15131B]/70 p-6 sm:p-8 lg:col-span-7">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#806B88]">
                  <span>
                    {track === "student"
                      ? "STUDENT → VERIFIED BATCH"
                      : "TUTOR → DIRECT COHORT"}
                  </span>
                  <span className="text-[#C08BFF]">{currentStage.metric}</span>
                </div>

                <div className="my-6">
                  <svg
                    viewBox="0 0 800 220"
                    className="h-auto w-full overflow-visible"
                    role="img"
                    aria-label="Interactive MentorLagbe connection blueprint"
                  >
                    <defs>
                      <linearGradient
                        id="signal-grad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#806B88"
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="50%"
                          stopColor="#A45DEB"
                          stopOpacity="0.9"
                        />
                        <stop
                          offset="100%"
                          stopColor="#C08BFF"
                          stopOpacity="1"
                        />
                      </linearGradient>
                    </defs>

                    <line
                      x1="40"
                      y1="150"
                      x2="760"
                      y2="150"
                      stroke="#806B88"
                      strokeOpacity="0.14"
                      strokeDasharray="4 6"
                    />
                    <line
                      x1="40"
                      y1="75"
                      x2="760"
                      y2="75"
                      stroke="#806B88"
                      strokeOpacity="0.14"
                      strokeDasharray="4 6"
                    />

                    <path
                      d="M 140 150 C 240 150, 290 75, 400 75 C 510 75, 560 150, 660 150"
                      fill="none"
                      stroke="url(#signal-grad)"
                      strokeWidth="2.5"
                    />

                    {stages.map((st, idx) => {
                      const isSelected = idx === activeIndex;
                      return (
                        <g
                          key={st.id}
                          onClick={() => setActiveIndex(idx)}
                          className="cursor-pointer"
                        >
                          {isSelected && (
                            <motion.circle
                              cx={st.nodeX}
                              cy={st.nodeY}
                              r="26"
                              fill="#A45DEB"
                              initial={{ opacity: 0.35, scale: 0.8 }}
                              animate={{
                                opacity: [0.15, 0.35, 0.15],
                                scale: [0.9, 1.15, 0.9],
                              }}
                              transition={{
                                duration: 2.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          )}

                          <circle
                            cx={st.nodeX}
                            cy={st.nodeY}
                            r={isSelected ? 11 : 7}
                            fill={isSelected ? "#C08BFF" : "#15131B"}
                            stroke="#C08BFF"
                            strokeWidth={isSelected ? 3 : 2}
                          />

                          <text
                            x={st.nodeX}
                            y={st.nodeY + (idx === 1 ? -24 : 34)}
                            textAnchor="middle"
                            className={`font-mono text-[11px] uppercase tracking-[0.16em] ${
                              isSelected ? "fill-[#F5F1F8]" : "fill-[#806B88]"
                            }`}
                          >
                            0{idx + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-[#806B88]/15 pt-5">
                  {stages.map((st, idx) => {
                    const isSelected = idx === activeIndex;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        className={`text-left transition-colors ${
                          isSelected
                            ? "text-[#F5F1F8]"
                            : "text-[#806B88] hover:text-[#C4C0CC]"
                        }`}
                      >
                        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#C08BFF]">
                          0{idx + 1}
                        </span>
                        <span className="mt-1 block truncate font-sans text-xs font-medium sm:text-sm">
                          {st.id === "scan"
                            ? "Audited Listings"
                            : st.id === "signal"
                              ? "Direct Request"
                              : st.id === "launch"
                                ? "Instant Start"
                                : st.id === "publish"
                                  ? "Structured Batch"
                                  : st.id === "vet"
                                    ? "Trust Layer"
                                    : "Zero Commission"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${track}-${currentStage.id}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22 }}
                    className="relative"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none select-none font-heading text-7xl font-bold leading-none text-[#C08BFF]/15 sm:text-8xl"
                    >
                      0{activeIndex + 1}
                    </span>

                    <p className="-mt-5 font-mono text-xs uppercase tracking-[0.22em] text-[#C08BFF]">
                      {currentStage.code}
                    </p>

                    <h3 className="mt-3 font-sans text-2xl font-medium leading-tight tracking-[-0.03em] text-[#F5F1F8] sm:text-3xl">
                      {currentStage.title}
                    </h3>

                    <p className="mt-4 font-sans text-sm leading-relaxed text-[#A69BAF] sm:text-base">
                      {currentStage.detail}
                    </p>

                    <div className="mt-6 border-l-2 border-[#C08BFF] pl-4">
                      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F5F1F8]">
                        {currentStage.metric}
                      </p>
                      <p className="mt-0.5 font-sans text-xs text-[#A69BAF]">
                        {currentStage.summary}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

          <section className="mt-24 border-t border-[#806B88]/20 pt-16 sm:pt-20">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#C08BFF]">
                Why It Exists
              </p>
              <h2 className="mt-3 font-sans text-3xl font-medium tracking-[-0.035em] text-[#F5F1F8] sm:text-5xl">
                Built against the{" "}
                <span className="font-heading font-normal italic text-[#C08BFF]">
                  agency model.
                </span>
              </h2>
            </div>

            <div className="mt-12 divide-y divide-[#806B88]/15 border-y border-[#806B88]/15">
              <div className="hidden grid-cols-12 gap-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#806B88] md:grid">
                <span className="col-span-4">Standard</span>
                <span className="col-span-4">Traditional Tuition Media</span>
                <span className="col-span-4 text-[#C08BFF]">MentorLagbe</span>
              </div>

              {CONTRAST_ROWS.map((row) => (
                <div
                  key={row.dimension}
                  className="grid grid-cols-1 gap-3 py-6 md:grid-cols-12 md:items-baseline md:gap-6"
                >
                  <p className="font-sans text-sm font-medium text-[#F5F1F8] md:col-span-4">
                    {row.dimension}
                  </p>
                  <p className="font-sans text-sm text-[#806B88] line-through decoration-[#806B88]/40 md:col-span-4">
                    {row.legacy}
                  </p>
                  <p className="font-sans text-sm font-medium text-[#E2DCE8] md:col-span-4">
                    {row.mentorlagbe}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Closing Editorial CTA */}
          <section className="mt-20 flex flex-col items-start justify-between gap-8 border-[#806B88]/20 pb-14 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#C08BFF]">
                Start Direct
              </p>
              <h2 className="mt-3 font-sans text-3xl font-medium tracking-[-0.035em] text-[#F5F1F8] sm:text-5xl">
                Find your batch or{" "}
                <span className="font-heading font-normal italic text-[#C08BFF]">
                  launch one.
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/tuitions"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#A45DEB] px-7 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#101014] shadow-[0_0_28px_rgba(164,93,235,0.3)] transition-colors hover:bg-[#C08BFF]"
              >
                Explore Tuitions
                <ArrowUpRight size={15} />
              </Link>

              <Link
                href="/pricing"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-[#806B88]/35 px-6 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#F5F1F8] transition-colors hover:border-[#C08BFF] hover:text-[#C08BFF]"
              >
                <Sparkles size={14} className="text-[#C08BFF]" />
                Tutor &amp; Student Pro
              </Link>
            </div>
          </section>
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
}
