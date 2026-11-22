"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Atom,
  Calculator,
  Code2,
  Languages,
  Orbit,
  Quote,
  type LucideIcon,
} from "lucide-react";

const palette = {
  background: "#101014",
  foreground: "#F5F1F8",
  card: "#15131B",
  primary: "#A45DEB",
  primaryHighlight: "#C08BFF",
  primaryForeground: "#101014",
  muted: "#1A1722",
  mutedForeground: "#A69BAF",
  border: "rgba(192, 139, 255, 0.22)",
  secondary: "#1B1724",
};

type Subject = {
  id: string;
  number: string;
  name: string;
  description: string;
  Icon: LucideIcon;
  path: string;
};

const SUBJECTS: Subject[] = [
  {
    id: "mathematics",
    number: "01",
    name: "Mathematics",
    description:
      "Find focused guidance for the mathematics topics you want to master.",
    Icon: Calculator,
    path: "M 320 220 C 270 183, 215 145, 145 108",
  },
  {
    id: "physics",
    number: "02",
    name: "Physics",
    description:
      "Explore tuition that helps make complex concepts easier to understand.",
    Icon: Atom,
    path: "M 320 220 C 370 183, 425 145, 495 108",
  },
  {
    id: "programming",
    number: "03",
    name: "Programming",
    description:
      "Build your technical skills with guidance that fits your learning goals.",
    Icon: Code2,
    path: "M 320 220 C 270 257, 215 295, 145 332",
  },
  {
    id: "ielts",
    number: "04",
    name: "IELTS",
    description:
      "Find support for your English language and IELTS preparation journey.",
    Icon: Languages,
    path: "M 320 220 C 370 257, 425 295, 495 332",
  },
];

const STATS = [
  { value: "500+", label: "Verified tutors" },
  { value: "2,000+", label: "Happy students" },
  { value: "120+", label: "Subjects covered" },
  { value: "98%", label: "Success rate" },
];

const TESTIMONIALS = [
  {
    name: "Rahim Ahmed",
    role: "HSC Student",
    quote:
      "I found an amazing Physics tutor within a day. The application process was so smooth!",
  },
  {
    name: "Sara Khan",
    role: "University Student",
    quote:
      "As a tutor, MentorLagbe helped me manage my batches effortlessly. The Pro plan is totally worth it.",
  },
  {
    name: "Tanvir Hossain",
    role: "Parent",
    quote:
      "The verified tutor badges gave me peace of mind. Highly recommended platform for parents.",
  },
];

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em]"
      style={{ color: palette.primaryHighlight }}
    >
      {children}
    </p>
  );
}

function SubjectNode({
  subject,
  selected,
  onSelect,
  className = "",
}: {
  subject: Subject;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}) {
  const Icon = subject.Icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Explore ${subject.name}`}
      className={`group flex flex-col items-center justify-center gap-2 rounded-full border text-center transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
      style={{
        color: selected ? palette.foreground : "#C4C0CC",
        background: selected
          ? "radial-gradient(circle at 50% 35%, rgba(164, 93, 235, 0.24), rgba(21, 19, 27, 0.96) 74%)"
          : "rgba(21, 19, 27, 0.88)",
        borderColor: selected ? palette.primaryHighlight : palette.border,
        boxShadow: selected
          ? "0 0 34px rgba(164, 93, 235, 0.24)"
          : "none",
        outlineColor: palette.primaryHighlight,
      }}
    >
      <span
        className="grid size-9 place-items-center rounded-full transition duration-300"
        style={{
          color: selected ? palette.primaryHighlight : palette.mutedForeground,
          background: selected
            ? "rgba(164, 93, 235, 0.16)"
            : "transparent",
        }}
      >
        <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className="font-sans text-xs font-semibold sm:text-sm">
        {subject.name}
      </span>
      <span
        className="font-sans text-[9px] tracking-[0.16em] transition-colors"
        style={{
          color: selected ? palette.primaryHighlight : palette.mutedForeground,
        }}
      >
        {subject.number}
      </span>
    </button>
  );
}

function DesktopConstellation({
  activeSubject,
  onSelect,
  reduceMotion,
}: {
  activeSubject: string;
  onSelect: (id: string) => void;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="relative mx-auto hidden aspect-[1.45] w-full max-w-[660px] md:block">
      <svg
        aria-hidden="true"
        viewBox="0 0 640 440"
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
        fill="none"
      >
        <defs>
          <radialGradient id="constellation-hub-glow">
            <stop
              offset="0%"
              stopColor={palette.primaryHighlight}
              stopOpacity="0.22"
            />
            <stop
              offset="100%"
              stopColor={palette.primary}
              stopOpacity="0"
            />
          </radialGradient>
        </defs>
        <circle cx="320" cy="220" r="125" fill="url(#constellation-hub-glow)" />
        <circle
          cx="320"
          cy="220"
          r="91"
          stroke={palette.primaryHighlight}
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="2 8"
        />
        {SUBJECTS.map((subject, index) => {
          const selected = subject.id === activeSubject;
          return (
            <motion.path
              key={subject.id}
              d={subject.path}
              stroke={
                selected ? palette.primaryHighlight : palette.primary
              }
              strokeWidth={selected ? 1.8 : 1.1}
              strokeOpacity={selected ? 0.9 : 0.34}
              strokeLinecap="round"
              strokeDasharray="4 8"
              initial={
                reduceMotion ? false : { pathLength: 0, opacity: 0.14 }
              }
              whileInView={{
                pathLength: 1,
                opacity: selected ? 0.9 : 0.45,
              }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.9,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          );
        })}
        <circle
          cx="145"
          cy="108"
          r="3"
          fill={palette.primaryHighlight}
          fillOpacity="0.75"
        />
        <circle
          cx="495"
          cy="108"
          r="3"
          fill={palette.primaryHighlight}
          fillOpacity="0.75"
        />
        <circle
          cx="145"
          cy="332"
          r="3"
          fill={palette.primaryHighlight}
          fillOpacity="0.75"
        />
        <circle
          cx="495"
          cy="332"
          r="3"
          fill={palette.primaryHighlight}
          fillOpacity="0.75"
        />
      </svg>

      <SubjectNode
        subject={SUBJECTS[0]}
        selected={activeSubject === SUBJECTS[0].id}
        onSelect={() => onSelect(SUBJECTS[0].id)}
        className="absolute left-[22.7%] top-[24.5%] z-10 size-[116px] -translate-x-1/2 -translate-y-1/2 sm:size-[128px]"
      />
      <SubjectNode
        subject={SUBJECTS[1]}
        selected={activeSubject === SUBJECTS[1].id}
        onSelect={() => onSelect(SUBJECTS[1].id)}
        className="absolute left-[77.3%] top-[24.5%] z-10 size-[116px] -translate-x-1/2 -translate-y-1/2 sm:size-[128px]"
      />
      <SubjectNode
        subject={SUBJECTS[2]}
        selected={activeSubject === SUBJECTS[2].id}
        onSelect={() => onSelect(SUBJECTS[2].id)}
        className="absolute left-[22.7%] top-[75.5%] z-10 size-[116px] -translate-x-1/2 -translate-y-1/2 sm:size-[128px]"
      />
      <SubjectNode
        subject={SUBJECTS[3]}
        selected={activeSubject === SUBJECTS[3].id}
        onSelect={() => onSelect(SUBJECTS[3].id)}
        className="absolute left-[77.3%] top-[75.5%] z-10 size-[116px] -translate-x-1/2 -translate-y-1/2 sm:size-[128px]"
      />

      <div
        className="absolute left-1/2 top-1/2 z-10 flex size-[112px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border text-center"
        style={{
          borderColor: "rgba(192, 139, 255, 0.36)",
          background:
            "radial-gradient(circle at 50% 40%, rgba(164, 93, 235, 0.2), rgba(16, 16, 20, 0.96) 76%)",
          boxShadow: "0 0 45px rgba(164, 93, 235, 0.18)",
        }}
      >
        <Orbit
          size={23}
          strokeWidth={1.25}
          style={{ color: palette.primaryHighlight }}
        />
        <span
          className="mt-2 font-sans text-[8px] font-semibold uppercase tracking-[0.15em]"
          style={{ color: palette.foreground }}
        >
          Learning
        </span>
        <span
          className="font-sans text-[8px] uppercase tracking-[0.15em]"
          style={{ color: palette.mutedForeground }}
        >
          network
        </span>
      </div>
    </div>
  );
}

function MobileConstellation({
  activeSubject,
  onSelect,
}: {
  activeSubject: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="relative md:hidden">
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-[19px] top-8 w-px"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(192, 139, 255, 0.55), transparent)",
        }}
      />
      <div className="space-y-2">
        {SUBJECTS.map((subject) => {
          const selected = activeSubject === subject.id;
          const Icon = subject.Icon;
          return (
            <button
              key={subject.id}
              type="button"
              onClick={() => onSelect(subject.id)}
              aria-pressed={selected}
              className="relative flex w-full items-center gap-4 rounded-xl py-3 pl-1 pr-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                background: selected
                  ? "rgba(164, 93, 235, 0.1)"
                  : "transparent",
                outlineColor: palette.primaryHighlight,
              }}
            >
              <span
                className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border"
                style={{
                  color: selected
                    ? palette.primaryHighlight
                    : palette.mutedForeground,
                  background: palette.background,
                  borderColor: selected
                    ? palette.primaryHighlight
                    : palette.border,
                  boxShadow: selected
                    ? "0 0 22px rgba(164, 93, 235, 0.24)"
                    : "none",
                }}
              >
                <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <span className="min-w-0">
                  <span
                    className="block font-sans text-sm font-semibold"
                    style={{
                      color: selected
                        ? palette.foreground
                        : palette.mutedForeground,
                    }}
                  >
                    {subject.name}
                  </span>
                  <span
                    className="mt-0.5 block font-sans text-[10px] tracking-[0.14em]"
                    style={{ color: palette.mutedForeground }}
                  >
                    SUBJECT {subject.number}
                  </span>
                </span>
                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                  style={{
                    color: selected
                      ? palette.primaryHighlight
                      : palette.mutedForeground,
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function StatsAndTestimonials() {
  const [activeSubject, setActiveSubject] = useState(SUBJECTS[0].id);
  const reduceMotion = useReducedMotion();
  const currentSubject =
    SUBJECTS.find((subject) => subject.id === activeSubject) ?? SUBJECTS[0];

  return (
    <section
      aria-labelledby="subjects-heading"
      className="relative isolate w-full overflow-hidden bg-transparent pb-8 pt-10 sm:pb-10 sm:pt-12 lg:pb-12 lg:pt-14"
      style={{ color: palette.foreground }}
    >
      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[470px]"
          >
            <Eyebrow>01 / Subject constellation</Eyebrow>
            <h2
              id="subjects-heading"
              className="mt-4 font-heading text-[clamp(2.6rem,5.2vw,4.8rem)] font-semibold leading-[0.98] tracking-[-0.055em]"
            >
              Find your
              <span
                className="block"
                style={{ color: palette.primaryHighlight }}
              >
                field.
              </span>
            </h2>
            <p
              className="mt-5 max-w-[390px] font-sans text-sm leading-7 sm:text-base"
              style={{ color: "#C4C0CC" }}
            >
              Every subject opens a new direction. Explore the fields students
              are learning across MentorLagbe and find guidance that fits your
              goals.
            </p>

            <div className="mt-7 hidden md:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSubject.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <p
                    className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: palette.primaryHighlight }}
                  >
                    {currentSubject.number} / {currentSubject.name}
                  </p>
                  <p
                    className="mt-2 max-w-[350px] font-sans text-sm leading-6"
                    style={{ color: palette.mutedForeground }}
                  >
                    {currentSubject.description}
                  </p>
                  <Link
                    href="/tuitions"
                    className="group mt-4 inline-flex min-h-10 items-center gap-2 font-sans text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{
                      color: palette.primaryHighlight,
                      outlineColor: palette.primaryHighlight,
                    }}
                  >
                    Explore tuitions
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          <div>
            <DesktopConstellation
              activeSubject={activeSubject}
              onSelect={setActiveSubject}
              reduceMotion={reduceMotion}
            />
            <MobileConstellation
              activeSubject={activeSubject}
              onSelect={setActiveSubject}
            />

            <p
              className="mt-2 text-center font-sans text-[10px] uppercase tracking-[0.16em]"
              style={{ color: palette.mutedForeground }}
            >
              Select a node to preview subject focus
            </p>

            <div className="mt-6 md:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSubject.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
                  transition={{ duration: 0.18 }}
                  className="border-l-2 pl-4"
                  style={{ borderColor: palette.primaryHighlight }}
                >
                  <p className="font-sans text-sm font-semibold">
                    {currentSubject.name}
                  </p>
                  <p
                    className="mt-1 font-sans text-xs leading-6"
                    style={{ color: palette.mutedForeground }}
                  >
                    {currentSubject.description}
                  </p>
                  <Link
                    href="/tuitions"
                    className="mt-3 inline-flex min-h-9 items-center gap-2 font-sans text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{
                      color: palette.primaryHighlight,
                      outlineColor: palette.primaryHighlight,
                    }}
                  >
                    Explore tuitions{" "}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.65,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 rounded-2xl py-6 sm:mt-12 sm:py-7"
          style={{
            background: "rgba(21, 19, 27, 0.72)",
          }}
          aria-label="MentorLagbe platform statistics"
        >
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-y-0">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-4 sm:px-6 ${index > 0 ? "sm:border-l" : ""}`}
                style={{ borderColor: palette.border }}
              >
                <p
                  className="font-heading text-3xl font-semibold leading-none tracking-[-0.045em] tabular-nums sm:text-4xl lg:text-[2.65rem]"
                  style={{ color: palette.foreground }}
                >
                  {stat.value}
                </p>
                <p
                  className="mt-2 font-sans text-[10px] font-medium uppercase tracking-[0.13em] sm:text-[11px]"
                  style={{ color: palette.primaryHighlight }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-12 sm:mt-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>02 / Real experiences</Eyebrow>
              <h2 className="mt-3 font-heading text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-[1.02] tracking-[-0.045em]">
                Beyond the numbers.
                <span
                  className="block"
                  style={{ color: palette.primaryHighlight }}
                >
                  Real experiences.
                </span>
              </h2>
            </div>
            <p
              className="max-w-[300px] font-sans text-xs leading-6 sm:text-sm"
              style={{ color: palette.mutedForeground }}
            >
              A few words from the people who make the MentorLagbe community.
            </p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => (
              <article
                key={testimonial.name}
                className="flex flex-col rounded-2xl p-6"
                style={{ background: "rgba(21, 19, 27, 0.78)" }}
              >
                <Quote
                  size={19}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  style={{ color: palette.primaryHighlight }}
                />
                <blockquote
                  className={`mt-4 flex-1 font-sans leading-7 ${
                    index === 0 ? "text-base" : "text-sm"
                  }`}
                  style={{ color: "#E2DCE8" }}
                >
                  “{testimonial.quote}”
                </blockquote>
                <footer className="mt-6">
                  <p
                    className="font-sans text-sm font-semibold"
                    style={{ color: palette.foreground }}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className="mt-1 font-sans text-[10px] uppercase tracking-[0.15em]"
                    style={{ color: palette.primaryHighlight }}
                  >
                    {testimonial.role}
                  </p>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}