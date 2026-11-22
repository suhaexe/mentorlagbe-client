"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Laptop,
  MapPin,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Subject = "Physics" | "Mathematics" | "Chemistry";
type ClassLevel = "HSC" | "Class 9" | "Class 10";
type TuitionMode = "Online" | "Offline";
type Stage = "discover" | "apply" | "sending" | "complete";

const SUBJECTS: Subject[] = ["Physics", "Mathematics", "Chemistry"];
const CLASS_LEVELS: ClassLevel[] = ["HSC", "Class 9", "Class 10"];
const EASE = [0.22, 1, 0.36, 1] as const;

const palette = {
  background: "#101014",
  foreground: "#F5F1F8",
  card: "#15131B",
  muted: "#1A1722",
  mutedForeground: "#A69BAF",
  primary: "#A45DEB",
  primaryHighlight: "#C08BFF",
  primaryForeground: "#101014",
  secondary: "#1B1724",
  border: "rgba(192, 139, 255, 0.22)",
};

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em]"
      style={{ color: palette.primaryHighlight }}
    >
      {children}
    </span>
  );
}

function Choice({
  children,
  selected,
  onClick,
}: {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="min-h-10 rounded-full border px-4 py-2 font-sans text-xs font-medium transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{
        color: selected ? palette.primaryForeground : "#D2CEDA",
        background: selected ? palette.primary : "rgba(21, 19, 27, 0.75)",
        borderColor: selected ? palette.primaryHighlight : palette.border,
        outlineColor: palette.primaryHighlight,
      }}
    >
      {children}
    </button>
  );
}

function StageProgress({
  stage,
  onNavigate,
}: {
  stage: Stage;
  onNavigate: (next: "discover" | "apply") => void;
}) {
  const activeIndex =
    stage === "discover" ? 0 : stage === "apply" || stage === "sending" ? 1 : 2;
  const steps = [
    { id: "discover" as const, number: "01", label: "Discover" },
    { id: "apply" as const, number: "02", label: "Apply" },
    { id: "complete" as const, number: "03", label: "Connect" },
  ];

  return (
    <nav aria-label="Application journey progress" className="grid grid-cols-3">
      {steps.map((step, index) => {
        const isActive = activeIndex === index;
        const isComplete = activeIndex > index;
        const isEnabled = index < 2 && index <= activeIndex;
        const content = (
          <>
            <span
              className="grid size-8 shrink-0 place-items-center rounded-full border font-sans text-[10px] font-semibold transition-colors sm:size-9"
              style={{
                color:
                  isActive || isComplete
                    ? palette.primaryForeground
                    : palette.mutedForeground,
                background:
                  isActive || isComplete
                    ? palette.primary
                    : "rgba(21, 19, 27, 0.8)",
                borderColor:
                  isActive || isComplete
                    ? palette.primaryHighlight
                    : palette.border,
              }}
            >
              {isComplete ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                step.number
              )}
            </span>
            <span
              className="mt-2 font-sans text-[10px] font-semibold sm:text-xs"
              style={{
                color: isActive ? palette.foreground : palette.mutedForeground,
              }}
            >
              {step.label}
            </span>
          </>
        );

        return (
          <div
            key={step.number}
            className="relative flex min-w-0 flex-col items-center text-center"
          >
            {index < 2 && (
              <span
                aria-hidden="true"
                className="absolute left-[calc(50%+20px)] right-[-50%] top-4 h-px sm:left-[calc(50%+23px)] sm:top-[18px]"
                style={{
                  background: isComplete
                    ? palette.primaryHighlight
                    : palette.border,
                }}
              />
            )}
            {isEnabled ? (
              <button
                type="button"
                onClick={() => {
                  if (step.id !== "complete") onNavigate(step.id);
                }}
                className="relative z-[1] flex flex-col items-center rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ outlineColor: palette.primaryHighlight }}
              >
                {content}
              </button>
            ) : (
              <div
                aria-current={isActive ? "step" : undefined}
                aria-disabled="true"
                className="relative z-[1] flex flex-col items-center"
              >
                {content}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function ListingArtifact({
  subject,
  classLevel,
  mode,
}: {
  subject: Subject;
  classLevel: ClassLevel;
  mode: TuitionMode;
}) {
  return (
    <motion.div
      key="listing-artifact"
      initial={{ opacity: 0, y: 14, rotate: 0.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="relative mx-auto w-full max-w-[590px]"
    >
      <article
        className="relative overflow-hidden rounded-2xl border p-5 shadow-2xl sm:p-7"
        style={{
          background: palette.card,
          borderColor: palette.border,
          boxShadow: "0 24px 64px rgba(10, 10, 14, 0.55)",
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"
          style={{ borderColor: palette.border }}
        >
          <div className="flex items-center gap-2">
            <span
              className="grid size-8 place-items-center rounded-lg"
              style={{
                color: palette.primaryHighlight,
                background: "rgba(164, 93, 235, 0.16)",
              }}
            >
              <GraduationCap size={17} aria-hidden="true" />
            </span>
            <div>
              <p
                className="font-sans text-xs font-semibold"
                style={{ color: palette.foreground }}
              >
                Tuition listing
              </p>
              <p
                className="mt-0.5 font-sans text-[10px]"
                style={{ color: palette.mutedForeground }}
              >
                A sample opportunity
              </p>
            </div>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-[10px] font-semibold"
            style={{
              color: palette.primaryHighlight,
              background: "rgba(164, 93, 235, 0.14)",
              borderColor: "rgba(192, 139, 255, 0.3)",
            }}
          >
            <ShieldCheck size={12} aria-hidden="true" /> Verified listing
          </span>
        </div>

        <div className="py-6 sm:py-8">
          <p
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: palette.primaryHighlight }}
          >
            Featured opportunity
          </p>
          <h4
            className="mt-3 font-heading text-2xl font-semibold leading-tight tracking-[-0.045em] sm:text-3xl"
            style={{ color: palette.foreground }}
          >
            {subject} tuition for {classLevel}
          </h4>
          <p
            className="mt-2 max-w-md font-sans text-sm leading-6"
            style={{ color: "#C4C0CC" }}
          >
            A verified tutor is looking for a student who wants to build
            confidence and make steady progress.
          </p>
        </div>

        <div
          className="grid grid-cols-2 gap-3 border-y py-4 sm:grid-cols-3"
          style={{ borderColor: palette.border }}
        >
          <div>
            <p
              className="font-sans text-[10px]"
              style={{ color: palette.mutedForeground }}
            >
              Tutor
            </p>
            <p
              className="mt-1 font-sans text-xs font-semibold"
              style={{ color: palette.foreground }}
            >
              Verified educator
            </p>
          </div>
          <div>
            <p
              className="font-sans text-[10px]"
              style={{ color: palette.mutedForeground }}
            >
              Learning mode
            </p>
            <p
              className="mt-1 inline-flex items-center gap-1.5 font-sans text-xs font-semibold"
              style={{ color: palette.foreground }}
            >
              {mode === "Online" ? (
                <Laptop size={13} style={{ color: palette.primaryHighlight }} />
              ) : (
                <MapPin size={13} style={{ color: palette.primaryHighlight }} />
              )}
              {mode}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p
              className="font-sans text-[10px]"
              style={{ color: palette.mutedForeground }}
            >
              Monthly fee
            </p>
            <p
              className="mt-1 font-sans text-xs font-semibold"
              style={{ color: palette.foreground }}
            >
              Discuss with tutor
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap gap-2">
            {[subject, classLevel, mode].map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 font-sans text-[10px]"
                style={{
                  borderColor: palette.border,
                  background: "rgba(16, 16, 20, 0.55)",
                  color: "#D2CEDA",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            className="inline-flex items-center gap-1.5 font-sans text-[10px] font-semibold"
            style={{ color: palette.primaryHighlight }}
          >
            Selected for you <CheckCircle2 size={12} aria-hidden="true" />
          </span>
        </div>
      </article>
    </motion.div>
  );
}

function ApplicationArtifact({
  subject,
  classLevel,
  mode,
  schedule,
  setSchedule,
  note,
  setNote,
}: {
  subject: Subject;
  classLevel: ClassLevel;
  mode: TuitionMode;
  schedule: string;
  setSchedule: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
}) {
  return (
    <motion.div
      key="application-artifact"
      initial={{ opacity: 0, y: 14, rotate: -0.4 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="relative mx-auto w-full max-w-[590px]"
    >
      <article
        className="relative rounded-2xl border p-5 shadow-2xl sm:p-7"
        style={{
          background: palette.card,
          borderColor: palette.border,
          boxShadow: "0 24px 64px rgba(10, 10, 14, 0.55)",
        }}
      >
        <div
          className="flex items-center justify-between gap-3 border-b pb-4"
          style={{ borderColor: palette.border }}
        >
          <div>
            <p
              className="font-sans text-xs font-semibold"
              style={{ color: palette.foreground }}
            >
              Your application
            </p>
            <p
              className="mt-0.5 font-sans text-[10px]"
              style={{ color: palette.mutedForeground }}
            >
              A few details before you connect
            </p>
          </div>
          <span
            className="rounded-full border px-3 py-1.5 font-sans text-[10px] font-semibold"
            style={{
              color: palette.primaryHighlight,
              background: "rgba(164, 93, 235, 0.14)",
              borderColor: "rgba(192, 139, 255, 0.3)",
            }}
          >
            Draft
          </span>
        </div>
        <div className="py-5">
          <p
            className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: palette.primaryHighlight }}
          >
            Applying for
          </p>
          <h4
            className="mt-2 font-heading text-2xl font-semibold tracking-[-0.04em]"
            style={{ color: palette.foreground }}
          >
            {subject} · {classLevel}
          </h4>
          <p
            className="mt-1 font-sans text-xs"
            style={{ color: palette.mutedForeground }}
          >
            {mode} tuition · Verified listing
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span
              className="mb-2 block font-sans text-[10px] font-semibold uppercase tracking-[0.13em]"
              style={{ color: palette.mutedForeground }}
            >
              Preferred schedule
            </span>
            <select
              value={schedule}
              onChange={(event) => setSchedule(event.target.value)}
              className="min-h-11 w-full rounded-lg border px-3 font-sans text-xs outline-none transition focus:ring-2"
              style={{
                background: palette.background,
                color: palette.foreground,
                borderColor: palette.border,
                outlineColor: palette.primaryHighlight,
              }}
            >
              <option>Evenings · Sun, Tue, Thu</option>
              <option>Mornings · Sat, Mon, Wed</option>
              <option>Afternoons · Flexible days</option>
            </select>
          </label>
          <label className="block">
            <span
              className="mb-2 block font-sans text-[10px] font-semibold uppercase tracking-[0.13em]"
              style={{ color: palette.mutedForeground }}
            >
              A note to the tutor
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              maxLength={180}
              className="w-full resize-none rounded-lg border px-3 py-3 font-sans text-xs leading-5 outline-none transition focus:ring-2"
              style={{
                background: palette.background,
                color: palette.foreground,
                borderColor: palette.border,
                outlineColor: palette.primaryHighlight,
              }}
            />
          </label>
        </div>
        <div
          className="mt-4 flex items-center justify-between gap-3 border-t pt-4"
          style={{ borderColor: palette.border }}
        >
          <span
            className="font-sans text-[10px]"
            style={{ color: palette.mutedForeground }}
          >
            Your details stay in your application.
          </span>
          <span
            className="font-sans text-[10px] font-semibold"
            style={{ color: palette.primaryHighlight }}
          >
            Ready to send
          </span>
        </div>
      </article>
    </motion.div>
  );
}

function ConfirmationArtifact({
  subject,
  classLevel,
  mode,
}: {
  subject: Subject;
  classLevel: ClassLevel;
  mode: TuitionMode;
}) {
  return (
    <motion.div
      key="confirmation-artifact"
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="relative mx-auto w-full max-w-[590px]"
    >
      <article
        className="relative overflow-hidden rounded-2xl border p-5 shadow-2xl sm:p-7"
        style={{
          background: palette.card,
          borderColor: palette.border,
          boxShadow: "0 24px 64px rgba(10, 10, 14, 0.55)",
        }}
      >
        <div
          className="flex items-center justify-between gap-3 border-b pb-4"
          style={{ borderColor: palette.border }}
        >
          <div>
            <p
              className="font-sans text-xs font-semibold"
              style={{ color: palette.foreground }}
            >
              Application status
            </p>
            <p
              className="mt-0.5 font-sans text-[10px]"
              style={{ color: palette.mutedForeground }}
            >
              A sample response from the tutor
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-[10px] font-semibold"
            style={{
              color: palette.primaryHighlight,
              background: "rgba(164, 93, 235, 0.14)",
              borderColor: "rgba(192, 139, 255, 0.3)",
            }}
          >
            <CheckCircle2 size={12} /> Accepted
          </span>
        </div>

        <div className="py-8 text-center sm:py-10">
          <motion.div
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
              delay: 0.08,
            }}
            className="mx-auto grid size-16 place-items-center rounded-full"
            style={{
              color: palette.primaryHighlight,
              background: "rgba(164, 93, 235, 0.18)",
              boxShadow: "0 0 0 10px rgba(164, 93, 235, 0.06)",
            }}
          >
            <Check size={28} strokeWidth={2.2} aria-hidden="true" />
          </motion.div>
          <h4
            className="mt-6 font-heading text-2xl font-semibold tracking-[-0.045em] sm:text-3xl"
            style={{ color: palette.foreground }}
          >
            You&apos;re connected.
          </h4>
          <p
            className="mx-auto mt-2 max-w-sm font-sans text-sm leading-6"
            style={{ color: "#C4C0CC" }}
          >
            The tutor has accepted your {subject} tuition request. Your next
            step is to confirm the first class.
          </p>
        </div>

        <div
          className="rounded-xl border p-4"
          style={{
            borderColor: palette.border,
            background: palette.background,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <p
              className="font-sans text-xs font-semibold"
              style={{ color: palette.foreground }}
            >
              Your connection
            </p>
            <span
              className="font-sans text-[10px]"
              style={{ color: palette.mutedForeground }}
            >
              Sample confirmation
            </span>
          </div>
          <div
            className="mt-3 flex flex-wrap items-center gap-2 font-sans text-xs"
            style={{ color: "#C4C0CC" }}
          >
            <span>{subject}</span>
            <span aria-hidden="true">·</span>
            <span>{classLevel}</span>
            <span aria-hidden="true">·</span>
            <span>{mode}</span>
          </div>
          <div
            className="mt-4 flex items-center gap-2 font-sans text-[10px]"
            style={{ color: palette.primaryHighlight }}
          >
            <Sparkles size={13} aria-hidden="true" /> Your learning journey can
            begin.
          </div>
        </div>
      </article>
    </motion.div>
  );
}

export function HowItWorks() {
  const [subject, setSubject] = useState<Subject>("Physics");
  const [classLevel, setClassLevel] = useState<ClassLevel>("HSC");
  const [mode, setMode] = useState<TuitionMode>("Offline");
  const [schedule, setSchedule] = useState("Evenings · Sun, Tue, Thu");
  const [note, setNote] = useState(
    "I'm interested in this tuition. Please let me know the next steps.",
  );
  const [stage, setStage] = useState<Stage>("discover");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (stage !== "sending") return;
    const timeout = window.setTimeout(
      () => setStage("complete"),
      reduceMotion ? 0 : 850,
    );
    return () => window.clearTimeout(timeout);
  }, [stage, reduceMotion]);

  const isReduced = Boolean(reduceMotion);
  const currentStep =
    stage === "discover" ? 0 : stage === "apply" || stage === "sending" ? 1 : 2;

  const changeStage = (next: "discover" | "apply") => {
    if (next === "discover" || currentStep >= 1) setStage(next);
  };

  const contentTransition = isReduced
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.28, ease: EASE },
      };

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="relative isolate scroll-mt-24 overflow-hidden bg-transparent px-4 py-20 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
      style={{ color: palette.foreground }}
    >
      <div className="relative mx-auto w-full max-w-[1240px]">
        <motion.div
          initial={isReduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -70px 0px" }}
          transition={{ duration: 0.65, ease: EASE }}
          className="grid gap-7 lg:grid-cols-[1.15fr_0.65fr] lg:items-end lg:gap-16"
        >
          <div className="max-w-[780px]">
            <div className="mb-5 flex items-center gap-3 sm:mb-7">
              <span
                className="h-px w-10"
                style={{ background: palette.primaryHighlight }}
              />
              <Eyebrow>MentorLagbe / How it works</Eyebrow>
            </div>
            <h2
              id="how-it-works-heading"
              className="font-heading text-[clamp(2.65rem,6vw,5.7rem)] font-semibold leading-[0.98] tracking-[-0.06em]"
            >
              One opportunity.
              <span
                className="block"
                style={{ color: palette.primaryHighlight }}
              >
                A new connection.
              </span>
            </h2>
          </div>
          <div className="max-w-[430px] lg:justify-self-end lg:pb-2">
            <p
              className="font-sans text-sm leading-7 sm:text-base sm:leading-8"
              style={{ color: "#C4C0CC" }}
            >
              Find a verified tuition, send a direct application, and hear back
              from the tutor. Explore the journey through one application, from
              its first detail to its final response.
            </p>
            <p
              className="mt-4 font-sans text-[10px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: palette.primaryHighlight }}
            >
              An interactive preview · Three simple steps
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={isReduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="relative mt-12 overflow-hidden rounded-[1.5rem] border sm:mt-16 lg:mt-20"
          style={{
            background: "rgba(21, 19, 27, 0.88)",
            borderColor: palette.border,
          }}
        >
          <div
            className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 sm:px-7"
            style={{ borderColor: palette.border }}
          >
            <div className="flex items-center gap-3">
              <span
                className="grid size-9 place-items-center rounded-xl"
                style={{
                  color: palette.primaryHighlight,
                  background: "rgba(164, 93, 235, 0.16)",
                }}
              >
                <GraduationCap size={18} aria-hidden="true" />
              </span>
              <div>
                <p
                  className="font-sans text-xs font-semibold"
                  style={{ color: palette.foreground }}
                >
                  Your application journey
                </p>
                <p
                  className="mt-0.5 font-sans text-[10px]"
                  style={{ color: palette.mutedForeground }}
                >
                  A guided look at the student experience
                </p>
              </div>
            </div>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-sans text-[10px] font-medium"
              style={{
                color: "#D2CEDA",
                background: "rgba(16, 16, 20, 0.65)",
                borderColor: palette.border,
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{
                  background:
                    stage === "sending" || stage === "complete"
                      ? palette.primaryHighlight
                      : palette.mutedForeground,
                }}
              />
              {stage === "discover"
                ? "Explore a tuition"
                : stage === "apply"
                  ? "Application draft"
                  : stage === "sending"
                    ? "Sending preview"
                    : "Sample response"}
            </span>
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <StageProgress stage={stage} onNavigate={changeStage} />

            <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-12 xl:gap-16">
              <div className="order-2 lg:order-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={stage === "sending" ? "apply" : stage}
                    {...contentTransition}
                  >
                    {stage === "discover" && (
                      <div>
                        <Eyebrow>01 / Discover</Eyebrow>
                        <h3
                          className="mt-3 max-w-sm font-heading text-3xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-4xl"
                          style={{ color: palette.foreground }}
                        >
                          Start with the right tuition.
                        </h3>
                        <p
                          className="mt-4 max-w-md font-sans text-sm leading-7"
                          style={{ color: "#C4C0CC" }}
                        >
                          Explore verified opportunities and narrow the list to
                          what suits your learning goals.
                        </p>

                        <div className="mt-7 space-y-5">
                          <fieldset>
                            <legend
                              className="mb-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em]"
                              style={{ color: palette.mutedForeground }}
                            >
                              Choose a subject
                            </legend>
                            <div className="flex flex-wrap gap-2">
                              {SUBJECTS.map((item) => (
                                <Choice
                                  key={item}
                                  selected={subject === item}
                                  onClick={() => setSubject(item)}
                                >
                                  {item}
                                </Choice>
                              ))}
                            </div>
                          </fieldset>
                          <fieldset>
                            <legend
                              className="mb-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em]"
                              style={{ color: palette.mutedForeground }}
                            >
                              Class level
                            </legend>
                            <div className="flex flex-wrap gap-2">
                              {CLASS_LEVELS.map((item) => (
                                <Choice
                                  key={item}
                                  selected={classLevel === item}
                                  onClick={() => setClassLevel(item)}
                                >
                                  {item}
                                </Choice>
                              ))}
                            </div>
                          </fieldset>
                          <fieldset>
                            <legend
                              className="mb-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em]"
                              style={{ color: palette.mutedForeground }}
                            >
                              Learning mode
                            </legend>
                            <div className="flex flex-wrap gap-2">
                              <Choice
                                selected={mode === "Online"}
                                onClick={() => setMode("Online")}
                              >
                                <span className="inline-flex items-center gap-2">
                                  <Laptop size={13} />
                                  Online
                                </span>
                              </Choice>
                              <Choice
                                selected={mode === "Offline"}
                                onClick={() => setMode("Offline")}
                              >
                                <span className="inline-flex items-center gap-2">
                                  <MapPin size={13} />
                                  Offline
                                </span>
                              </Choice>
                            </div>
                          </fieldset>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStage("apply")}
                          className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 font-sans text-xs font-semibold transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto sm:min-w-52"
                          style={{
                            background: palette.primary,
                            color: palette.primaryForeground,
                            outlineColor: palette.primaryHighlight,
                          }}
                        >
                          Continue to application{" "}
                          <ArrowRight size={15} aria-hidden="true" />
                        </button>
                      </div>
                    )}
                    {(stage === "apply" || stage === "sending") && (
                      <div>
                        <Eyebrow>02 / Apply</Eyebrow>
                        <h3
                          className="mt-3 max-w-sm font-heading text-3xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-4xl"
                          style={{ color: palette.foreground }}
                        >
                          Make the first move.
                        </h3>
                        <p
                          className="mt-4 max-w-md font-sans text-sm leading-7"
                          style={{ color: "#C4C0CC" }}
                        >
                          Your chosen tuition becomes an application. Add a
                          preferred schedule and a short note before sending it
                          directly to the tutor.
                        </p>
                        <div
                          className="mt-6 flex items-start gap-3 rounded-xl border p-4"
                          style={{
                            background: "rgba(16, 16, 20, 0.7)",
                            borderColor: palette.border,
                          }}
                        >
                          <span
                            className="mt-0.5"
                            style={{ color: palette.primaryHighlight }}
                          >
                            <ShieldCheck size={17} aria-hidden="true" />
                          </span>
                          <p
                            className="font-sans text-xs leading-5"
                            style={{ color: "#C4C0CC" }}
                          >
                            Your application goes to the tutor who posted the
                            verified tuition. No middleman.
                          </p>
                        </div>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="button"
                            onClick={() => setStage("sending")}
                            disabled={stage === "sending"}
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-sans text-xs font-semibold transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-70"
                            style={{
                              background: palette.primary,
                              color: palette.primaryForeground,
                              outlineColor: palette.primaryHighlight,
                            }}
                          >
                            {stage === "sending"
                              ? "Sending preview…"
                              : "Send application"}
                            {stage === "sending" ? (
                              <Clock3 size={14} className="animate-pulse" />
                            ) : (
                              <Send size={14} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setStage("discover")}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 font-sans text-xs font-medium transition hover:opacity-75 focus-visible:outline-none focus-visible:ring-2"
                            style={{
                              color: palette.mutedForeground,
                              outlineColor: palette.primaryHighlight,
                            }}
                          >
                            <ArrowLeft size={14} /> Back to tuition
                          </button>
                        </div>
                      </div>
                    )}

                    {stage === "complete" && (
                      <div>
                        <Eyebrow>03 / Connect</Eyebrow>
                        <h3
                          className="mt-3 max-w-sm font-heading text-3xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-4xl"
                          style={{ color: palette.foreground }}
                        >
                          A new connection begins.
                        </h3>
                        <p
                          className="mt-4 max-w-md font-sans text-sm leading-7"
                          style={{ color: "#C4C0CC" }}
                        >
                          The tutor reviews the application and responds. When
                          they accept, you can coordinate your first class and
                          get started.
                        </p>
                        <div
                          className="mt-6 flex items-center gap-3 rounded-xl border p-4"
                          style={{
                            background: "rgba(16, 16, 20, 0.7)",
                            borderColor: palette.border,
                          }}
                        >
                          <span
                            className="grid size-9 shrink-0 place-items-center rounded-full"
                            style={{
                              background: "rgba(164, 93, 235, 0.18)",
                              color: palette.primaryHighlight,
                            }}
                          >
                            <CheckCircle2 size={18} />
                          </span>
                          <div>
                            <p
                              className="font-sans text-xs font-semibold"
                              style={{ color: palette.foreground }}
                            >
                              Sample tutor response
                            </p>
                            <p
                              className="mt-0.5 font-sans text-[10px]"
                              style={{ color: palette.mutedForeground }}
                            >
                              Your application has been accepted.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setStage("discover")}
                          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border px-5 font-sans text-xs font-semibold transition hover:opacity-75 focus-visible:outline-none focus-visible:ring-2"
                          style={{
                            color: palette.foreground,
                            background: "rgba(16, 16, 20, 0.7)",
                            borderColor: palette.border,
                            outlineColor: palette.primaryHighlight,
                          }}
                        >
                          <RotateCcw size={14} /> Explore the journey again
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="order-1 min-w-0 lg:order-2">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Eyebrow>
                    {stage === "discover"
                      ? "Selected tuition"
                      : stage === "apply" || stage === "sending"
                        ? "Application document"
                        : "Tutor response"}
                  </Eyebrow>
                  <span
                    className="font-sans text-[9px] font-semibold uppercase tracking-[0.14em]"
                    style={{ color: palette.mutedForeground }}
                  >
                    Live preview
                  </span>
                </div>
                <div
                  className="relative min-h-[330px] overflow-hidden rounded-[1.35rem] border p-3 sm:min-h-[380px] sm:p-5"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(27, 23, 36, 0.85), rgba(16, 16, 20, 0.9))",
                    borderColor: palette.border,
                  }}
                >
                  <div className="relative flex min-h-[300px] items-center justify-center sm:min-h-[340px]">
                    <AnimatePresence mode="wait" initial={false}>
                      {stage === "discover" && (
                        <ListingArtifact
                          subject={subject}
                          classLevel={classLevel}
                          mode={mode}
                        />
                      )}
                      {(stage === "apply" || stage === "sending") && (
                        <ApplicationArtifact
                          subject={subject}
                          classLevel={classLevel}
                          mode={mode}
                          schedule={schedule}
                          setSchedule={setSchedule}
                          note={note}
                          setNote={setNote}
                        />
                      )}
                      {stage === "complete" && (
                        <ConfirmationArtifact
                          subject={subject}
                          classLevel={classLevel}
                          mode={mode}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                <p
                  className="mt-3 flex items-start gap-2 font-sans text-[10px] leading-5"
                  style={{ color: palette.mutedForeground }}
                >
                  <Sparkles
                    size={12}
                    className="mt-0.5 shrink-0"
                    style={{ color: palette.primaryHighlight }}
                    aria-hidden="true"
                  />
                  This is an interactive demonstration. It does not send a real
                  application or contact a tutor.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={isReduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
          className="mt-10 flex flex-col gap-5 pt-2 sm:mt-12 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="max-w-xl">
            <Eyebrow>For tutors</Eyebrow>
            <h3
              className="mt-2 font-heading text-2xl font-semibold tracking-[-0.04em] sm:text-3xl"
              style={{ color: palette.foreground }}
            >
              Ready to be on the other side?
            </h3>
            <p
              className="mt-2 font-sans text-sm leading-6"
              style={{ color: "#C4C0CC" }}
            >
              Publish your tuition batches, reach students looking for your
              expertise, and start teaching with MentorLagbe Pro.
            </p>
          </div>
          <Link
            href="/pricing"
            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 font-sans text-xs font-semibold transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: palette.primary,
              color: palette.primaryForeground,
              outlineColor: palette.primaryHighlight,
            }}
          >
            Explore the Pro plan{" "}
            <ArrowDownRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
