"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileText,
  PlusCircle,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Application, Tuition } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const TutorOverview = () => {
  const { data: session } = useSession();
  const user = session?.user as { name?: string; plan?: string } | undefined;

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadWorkspace = async () => {
      try {
        const [tuitionList, applicantList] = await Promise.all([
          api<Tuition[]>("/api/tuitions/my-tuitions/list"),
          api<Application[]>("/api/applications/tutor"),
        ]);
        if (isMounted) {
          setTuitions(Array.isArray(tuitionList) ? tuitionList : []);
          setApplications(Array.isArray(applicantList) ? applicantList : []);
        }
      } catch {
        if (isMounted) {
          setTuitions([]);
          setApplications([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadWorkspace();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalTuitions = tuitions.length;
  const activeTuitions = tuitions.filter(
    (t) => t.approvalStatus === "approved" && t.isActive,
  ).length;
  const totalApplicants = applications.length;
  const isPro = user?.plan === "pro";

  const recentApplicants = applications.slice(0, 4);

  const stats = [
    {
      label: "Total Tuitions",
      value: isLoading ? "—" : String(totalTuitions),
      hint: isPro
        ? "Unlimited batch quota"
        : `${Math.max(0, 2 - totalTuitions)} free slot${2 - totalTuitions === 1 ? "" : "s"} left`,
      icon: FileText,
      accent: "text-[#C08BFF]",
    },
    {
      label: "Active Batches",
      value: isLoading ? "—" : String(activeTuitions),
      hint: "Approved & accepting students",
      icon: CheckCircle2,
      accent: "text-emerald-400",
    },
    {
      label: "Total Applicants",
      value: isLoading ? "—" : String(totalApplicants),
      hint: "Across all posted batches",
      icon: Users,
      accent: "text-amber-300",
    },
    {
      label: "Current Plan",
      value: isPro ? "Tutor Pro" : "Free Tier",
      hint: isPro
        ? "Verified badge & unlimited posts"
        : "Up to 2 tuition listings",
      icon: Sparkles,
      accent: "text-[#C08BFF]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#806B88]/15 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C08BFF]">
            Mentor Command
          </p>
          <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
            Welcome back,{" "}
            <span className="font-heading font-normal italic text-[#C08BFF]">
              {user?.name?.split(" ")[0] || "Tutor"}.
            </span>
          </h1>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex min-h-10 items-center gap-2 self-start rounded-full bg-[#A45DEB] px-5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.28)] transition-colors hover:bg-[#C08BFF] sm:self-auto"
        >
          <PlusCircle size={15} />
          Post New Tuition
        </Link>
      </div>

      {/* Telemetry Metric Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#806B88]/20 bg-[#15131B]/90 p-5 transition-colors hover:border-[#C08BFF]/35"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#806B88]">
                  {stat.label}
                </span>
                <Icon className={`h-4 w-4 shrink-0 ${stat.accent}`} />
              </div>

              <div className="mt-4 font-sans text-2xl font-semibold tracking-[-0.02em] text-[#F5F1F8] sm:text-3xl">
                {stat.value}
              </div>

              <p className="mt-1 font-sans text-xs text-[#A69BAF]">
                {stat.hint}
              </p>
            </div>
          );
        })}
      </div>

      {/* Asymmetric Lower Deck: Recent Applicants + Tutor Plan Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border border-[#806B88]/20 bg-[#15131B]/80 p-5 sm:p-6 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-[#806B88]/15 pb-4">
            <div>
              <h2 className="font-sans text-base font-medium text-[#F5F1F8]">
                Incoming Applicants
              </h2>
              <p className="font-sans text-xs text-[#A69BAF]">
                Latest students requesting enrollment in your batches
              </p>
            </div>

            <Link
              href="/dashboard/tutor/applicants"
              className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#C08BFF] transition-colors hover:text-[#F5F1F8]"
            >
              Manage All
              <ArrowUpRight size={13} />
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-14 w-full rounded-xl bg-[#101014]"
                />
              ))}
            </div>
          ) : recentApplicants.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-sans text-sm font-medium text-[#F5F1F8]">
                No student applications yet
              </p>
              <p className="mt-1 font-sans text-xs text-[#A69BAF]">
                Once your tuition listings are approved, student requests will
                appear here.
              </p>
              <Link
                href="/dashboard/tutor/my-tuitions"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#C08BFF]/40 px-4 py-2 font-sans text-xs font-medium text-[#C08BFF] transition-colors hover:bg-[#A45DEB]/15"
              >
                Check My Tuitions
                <ArrowUpRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#806B88]/15">
              {recentApplicants.map((app) => {
                const statusConfig =
                  app.status === "accepted"
                    ? {
                        label: "Accepted",
                        classes:
                          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                        icon: CheckCircle2,
                      }
                    : app.status === "rejected"
                      ? {
                          label: "Rejected",
                          classes:
                            "border-rose-500/30 bg-rose-500/10 text-rose-300",
                          icon: XCircle,
                        }
                      : {
                          label: "Pending",
                          classes:
                            "border-amber-400/30 bg-amber-400/10 text-amber-200",
                          icon: Clock,
                        };

                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={app._id}
                    className="flex flex-col justify-between gap-2.5 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-medium text-[#F5F1F8]">
                        {app.studentName}{" "}
                        <span className="font-normal text-[#806B88]">
                          → {app.tuitionTitle}
                        </span>
                      </p>
                      <p className="mt-0.5 truncate font-sans text-xs text-[#A69BAF]">
                        {app.preferredSchedule} · {app.studentPhone}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${statusConfig.classes}`}
                      >
                        <StatusIcon size={11} />
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tutor Plan & Capacity Panel */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#C08BFF]/25 bg-[#15131B] p-6 lg:col-span-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#A45DEB]/20 blur-2xl"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A45DEB]/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C08BFF]">
              <Sparkles size={11} />
              {isPro ? "Tutor Pro" : "Free Tier"}
            </span>

            <h2 className="mt-4 font-sans text-xl font-medium tracking-[-0.02em] text-[#F5F1F8]">
              {isPro
                ? "Unlimited tuition batches unlocked."
                : "Scale beyond 2 tuition listings."}
            </h2>

            <p className="mt-2 font-sans text-xs leading-relaxed text-[#A69BAF]">
              {isPro
                ? "Your mentor profile carries the verified Pro badge and has zero listing limits."
                : "Free accounts can publish up to 2 tuition posts. Upgrade once to unlock unlimited batches and higher visibility."}
            </p>
          </div>

          <div className="relative z-10 mt-6 pt-4">
            <Link
              href={isPro ? "/dashboard/tutor/post-tuition" : "/pricing"}
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-[#C08BFF]/40 bg-[#A45DEB]/15 px-4 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#F5F1F8] transition-colors hover:bg-[#A45DEB] hover:text-[#101014]"
            >
              {isPro ? "Create New Batch" : "Upgrade to Tutor Pro"}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorOverview;
