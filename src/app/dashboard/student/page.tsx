"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileText,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { Application } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const StudentOverview = () => {
  const { data: session } = useSession();
  const user = session?.user as { name?: string; plan?: string } | undefined;

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      try {
        const data = await api<Application[]>("/api/applications/student");
        if (isMounted) {
          setApplications(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) setApplications([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalApplied = applications.length;
  const acceptedCount = applications.filter(
    (a) => a.status === "accepted",
  ).length;
  const pendingCount = applications.filter(
    (a) => a.status === "pending",
  ).length;
  const isPro = user?.plan === "pro";

  const recentApplications = applications.slice(0, 4);

  const stats = [
    {
      label: "Total Applied",
      value: isLoading ? "—" : String(totalApplied),
      hint: "All submitted requests",
      icon: FileText,
      accent: "text-[#C08BFF]",
    },
    {
      label: "Accepted",
      value: isLoading ? "—" : String(acceptedCount),
      hint: "Active mentor matches",
      icon: CheckCircle2,
      accent: "text-emerald-400",
    },
    {
      label: "Pending Review",
      value: isLoading ? "—" : String(pendingCount),
      hint: "Awaiting tutor response",
      icon: Clock,
      accent: "text-amber-300",
    },
    {
      label: "Membership",
      value: isPro ? "Student Pro" : "Free Tier",
      hint: isPro ? "Priority matching active" : "Standard access",
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
            Student Command
          </p>
          <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
            Welcome back,{" "}
            <span className="font-heading font-normal italic text-[#C08BFF]">
              {user?.name?.split(" ")[0] || "Student"}.
            </span>
          </h1>
        </div>

        <Link
          href="/tuitions"
          className="inline-flex h-10 items-center gap-2 self-start rounded-full bg-[#A45DEB] px-5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.28)] transition-colors hover:bg-[#C08BFF] sm:self-auto"
        >
          Explore Tuitions
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Telemetry Metric Strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[#806B88]/20 bg-[#15131B]/90 p-5 transition-colors hover:border-[#C08BFF]/35"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#806B88]">
                  {stat.label}
                </span>
                <Icon className={`h-4 w-4 ${stat.accent}`} />
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

      {/* Asymmetric Lower Deck: Recent Activity + Membership Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-3xl border border-[#806B88]/20 bg-[#15131B]/80 p-6 lg:col-span-8">
          <div className="flex items-center justify-between border-b border-[#806B88]/15 pb-4">
            <div>
              <h2 className="font-sans text-base font-medium text-[#F5F1F8]">
                Recent Applications
              </h2>
              <p className="font-sans text-xs text-[#A69BAF]">
                Live status of your latest tuition requests
              </p>
            </div>

            <Link
              href="/dashboard/student/my-applications"
              className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#C08BFF] transition-colors hover:text-[#F5F1F8]"
            >
              View All
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
          ) : recentApplications.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-sans text-sm font-medium text-[#F5F1F8]">
                No applications submitted yet
              </p>
              <p className="mt-1 font-sans text-xs text-[#A69BAF]">
                Browse verified batches and apply directly to any tutor.
              </p>
              <Link
                href="/tuitions"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#C08BFF]/40 px-4 py-2 font-sans text-xs font-medium text-[#C08BFF] transition-colors hover:bg-[#A45DEB]/15"
              >
                Browse Open Tuitions
                <ArrowUpRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#806B88]/15">
              {recentApplications.map((app) => {
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
                    className="flex flex-col justify-between gap-3 py-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-medium text-[#F5F1F8]">
                        {app.tuitionTitle}
                      </p>
                      <p className="mt-0.5 truncate font-sans text-xs text-[#806B88]">
                        {app.tutorEmail} · Applied{" "}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-4">
                      <span className="font-sans text-sm font-semibold text-[#E2DCE8]">
                        ৳{Number(app.monthlyFee || 0).toLocaleString()}
                        <span className="text-[11px] font-normal text-[#806B88]">
                          /mo
                        </span>
                      </span>

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

        {/* Plan & Quick Guidance Panel */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#C08BFF]/25 bg-[#15131B] p-6 lg:col-span-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#A45DEB]/20 blur-2xl"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#A45DEB]/15 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C08BFF]">
              <Sparkles size={11} />
              {isPro ? "Pro Active" : "Free Plan"}
            </span>

            <h2 className="mt-4 font-sans text-xl font-medium tracking-[-0.02em] text-[#F5F1F8]">
              {isPro
                ? "Priority student placement enabled."
                : "Stand out at the top of tutor queues."}
            </h2>

            <p className="mt-2 font-sans text-xs leading-relaxed text-[#A69BAF]">
              {isPro
                ? "Your applications carry a verified Pro badge and appear first when mentors review new requests."
                : "Upgrade once to highlight your profile to verified mentors and unlock unlimited batch applications."}
            </p>
          </div>

          <div className="relative z-10 mt-6 pt-4">
            <Link
              href={isPro ? "/tuitions" : "/pricing"}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#C08BFF]/40 bg-[#A45DEB]/15 px-4 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#F5F1F8] transition-colors hover:bg-[#A45DEB] hover:text-[#101014]"
            >
              {isPro ? "Browse More Batches" : "View Student Pro"}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
