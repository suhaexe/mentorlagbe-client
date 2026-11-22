"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Application } from "@/types";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  Trash2,
  XCircle,
} from "lucide-react";

type StatusFilter = "all" | "pending" | "accepted" | "rejected";

const MyApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await api<Application[]>("/api/applications/student");
        if (isMounted) setApplications(Array.isArray(data) ? data : []);
      } catch (error: unknown) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load applications";
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

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this application?")) return;
    setCancellingId(id);
    try {
      await api(`/api/applications/${id}`, { method: "DELETE" });
      toast.success("Application cancelled");
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to cancel application";
      toast.error(message);
    } finally {
      setCancellingId(null);
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
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#806B88]/15 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C08BFF]">
            Application Tracker
          </p>
          <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
            My{" "}
            <span className="font-heading font-normal italic text-[#C08BFF]">
              applications.
            </span>
          </h1>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "pending", "accepted", "rejected"] as StatusFilter[]).map(
            (tab) => {
              const active = filter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all ${
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

      {/* Applications Ledger */}
      <div className="overflow-hidden rounded-3xl border border-[#806B88]/20 bg-[#15131B]/85">
        {filteredApplications.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-sans text-base font-medium text-[#F5F1F8]">
              {applications.length === 0
                ? "You haven't applied to any tuitions yet."
                : `No ${filter} applications right now.`}
            </p>
            <p className="mt-1 font-sans text-xs text-[#A69BAF]">
              {applications.length === 0
                ? "Explore verified batches and send your first application."
                : "Switch status tabs above to view your other submissions."}
            </p>
            {applications.length === 0 && (
              <Link
                href="/tuitions"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-[#A45DEB] px-5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#101014] transition-colors hover:bg-[#C08BFF]"
              >
                Browse Tuitions
                <ArrowUpRight size={14} />
              </Link>
            )}
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

                return (
                  <div key={a._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-sans text-sm font-medium text-[#F5F1F8]">
                        {a.tuitionTitle}
                      </p>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${statusStyle.classes}`}
                      >
                        <StatusIcon size={11} />
                        {statusStyle.label}
                      </span>
                    </div>

                    <p className="truncate font-sans text-xs text-[#A69BAF]">
                      {a.tutorEmail}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
                      <span className="font-semibold text-[#E2DCE8]">
                        ৳{Number(a.monthlyFee || 0).toLocaleString()}
                      </span>
                      <span className="font-mono text-[#806B88]">
                        {new Date(a.appliedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {a.status === "pending" && (
                      <div className="pt-1">
                        <button
                          type="button"
                          disabled={cancellingId === a._id}
                          onClick={() => handleCancel(a._id)}
                          className="inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 font-sans text-xs font-medium text-rose-300 transition-colors hover:border-rose-400/50 hover:bg-rose-500/20 disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {cancellingId === a._id ? "Cancelling..." : "Cancel"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <table className="hidden w-full border-collapse text-left sm:table">
              <thead>
                <tr className="border-b border-[#806B88]/15 font-mono text-[10px] uppercase tracking-[0.18em] text-[#806B88]">
                  <th className="px-6 py-4 font-medium">Tuition Batch</th>
                  <th className="px-6 py-4 font-medium">Mentor Contact</th>
                  <th className="px-6 py-4 font-medium">Monthly Fee</th>
                  <th className="px-6 py-4 font-medium">Applied On</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Action</th>
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

                  return (
                    <tr
                      key={a._id}
                      className="transition-colors hover:bg-[#1B1724]/70"
                    >
                      <td className="px-6 py-4 font-medium text-[#F5F1F8]">
                        {a.tuitionTitle}
                      </td>
                      <td className="px-6 py-4 font-sans text-xs text-[#A69BAF]">
                        {a.tutorEmail}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#E2DCE8]">
                        ৳{Number(a.monthlyFee || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-[#806B88]">
                        {new Date(a.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${statusStyle.classes}`}
                        >
                          <StatusIcon size={11} />
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {a.status === "pending" ? (
                          <button
                            type="button"
                            disabled={cancellingId === a._id}
                            onClick={() => handleCancel(a._id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1.5 font-sans text-xs font-medium text-rose-300 transition-colors hover:border-rose-400/50 hover:bg-rose-500/20 disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {cancellingId === a._id
                              ? "Cancelling..."
                              : "Cancel"}
                          </button>
                        ) : (
                          <span className="font-mono text-[11px] text-[#806B88]">
                            —
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

export default MyApplicationsPage;
