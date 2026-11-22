"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Application } from "@/types";
import {
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  X,
  XCircle,
} from "lucide-react";

type ApplicantFilter = "all" | "pending" | "accepted" | "rejected";

const ApplicantsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicantFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await api<Application[]>("/api/applications/tutor");
        if (isMounted) setApplications(Array.isArray(data) ? data : []);
      } catch (error: unknown) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load applicants";
          toast.error(message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    setUpdatingId(id);
    try {
      const updated = await api<Application>(`/api/applications/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setApplications((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, ...updated, status: updated.status || status } : a,
        ),
      );
      toast.success(`Application ${status}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update status";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  const counts = {
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#C08BFF]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header + Filter Pills */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#806B88]/15 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C08BFF]">
            Enrollment Queue
          </p>
          <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
            Manage{" "}
            <span className="font-heading font-normal italic text-[#C08BFF]">
              applicants.
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "pending", "accepted", "rejected"] as ApplicantFilter[]).map(
            (tab) => {
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`min-h-9 rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
                    active
                      ? "bg-[#A45DEB] font-semibold text-[#101014]"
                      : "bg-[#15131B] text-[#A69BAF] hover:text-[#F5F1F8]"
                  }`}
                >
                  {tab} ({counts[tab]})
                </button>
              );
            },
          )}
        </div>
      </div>

      {/* Applicants Ledger */}
      <div className="overflow-hidden rounded-3xl border border-[#806B88]/20 bg-[#15131B]/85">
        {filteredApplications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-sans text-base font-medium text-[#F5F1F8]">
              {applications.length === 0
                ? "No applicants yet."
                : `No ${filter} applicants right now.`}
            </p>
            <p className="mt-1 font-sans text-xs text-[#A69BAF]">
              Students who apply to your approved tuition batches will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Stacked Cards */}
            <div className="divide-y divide-[#806B88]/15 sm:hidden">
              {filteredApplications.map((a) => {
                const statusStyle =
                  a.status === "accepted"
                    ? {
                        label: "Accepted",
                        classes:
                          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                        icon: CheckCircle2,
                      }
                    : a.status === "rejected"
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

                const StatusIcon = statusStyle.icon;
                const isBusy = updatingId === a._id;

                return (
                  <div key={a._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-[#F5F1F8]">
                          {a.studentName}
                        </p>
                        <p className="mt-0.5 truncate font-sans text-xs text-[#A69BAF]">
                          {a.studentEmail}
                        </p>
                        {a.studentPhone ? (
                          <p className="font-mono text-[11px] text-[#806B88]">
                            {a.studentPhone}
                          </p>
                        ) : null}
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${statusStyle.classes}`}
                      >
                        <StatusIcon size={11} />
                        {statusStyle.label}
                      </span>
                    </div>

                    <p className="font-sans text-xs font-medium text-[#E2DCE8]">
                      {a.tuitionTitle}
                    </p>

                    <div className="space-y-1 rounded-2xl border border-[#806B88]/15 bg-[#101014]/70 p-3">
                      <p className="font-sans text-xs font-medium text-[#C08BFF]">
                        {a.preferredSchedule}
                      </p>
                      <p className="font-sans text-xs text-[#A69BAF]">
                        {a.studentNote || "No note attached"}
                      </p>
                    </div>

                    {a.status === "pending" ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => updateStatus(a._id, "accepted")}
                          className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-sans text-xs font-medium text-emerald-300 transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/20 disabled:opacity-40"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Accept
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => updateStatus(a._id, "rejected")}
                          className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-sans text-xs font-medium text-rose-300 transition-colors hover:border-rose-400/60 hover:bg-rose-500/20 disabled:opacity-40"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <p className="font-mono text-[11px] text-[#806B88]">
                        Decided
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <table className="hidden w-full border-collapse text-left sm:table">
              <thead>
                <tr className="border-b border-[#806B88]/15 font-mono text-[10px] uppercase tracking-[0.18em] text-[#806B88]">
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Tuition Batch</th>
                  <th className="px-6 py-4 font-medium">Schedule &amp; Note</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#806B88]/15 text-sm">
                {filteredApplications.map((a) => {
                  const statusStyle =
                    a.status === "accepted"
                      ? {
                          label: "Accepted",
                          classes:
                            "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                          icon: CheckCircle2,
                        }
                      : a.status === "rejected"
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

                  const StatusIcon = statusStyle.icon;
                  const isBusy = updatingId === a._id;

                  return (
                    <tr
                      key={a._id}
                      className="transition-colors hover:bg-[#1B1724]/70"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#F5F1F8]">
                          {a.studentName}
                        </p>
                        <p className="mt-0.5 font-sans text-xs text-[#A69BAF]">
                          {a.studentEmail}
                        </p>
                        <p className="font-mono text-[11px] text-[#806B88]">
                          {a.studentPhone}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#E2DCE8]">
                        {a.tuitionTitle}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-sans text-xs font-medium text-[#C08BFF]">
                          {a.preferredSchedule}
                        </p>
                        <p
                          className="mt-0.5 max-w-[220px] truncate font-sans text-xs text-[#A69BAF]"
                          title={a.studentNote}
                        >
                          {a.studentNote || "No note attached"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${statusStyle.classes}`}
                        >
                          <StatusIcon size={11} />
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        {a.status === "pending" ? (
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => updateStatus(a._id, "accepted")}
                              className="inline-flex min-h-8 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-sans text-xs font-medium text-emerald-300 transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/20 disabled:opacity-40"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Accept
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => updateStatus(a._id, "rejected")}
                              className="inline-flex min-h-8 items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-sans text-xs font-medium text-rose-300 transition-colors hover:border-rose-400/60 hover:bg-rose-500/20 disabled:opacity-40"
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] text-[#806B88]">
                            Decided
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicantsPage;
