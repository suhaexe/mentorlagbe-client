"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Tuition } from "@/types";
import { Check, CheckCircle2, Clock, Loader2, X, XCircle } from "lucide-react";

type ApprovalFilter = "all" | "pending" | "approved" | "rejected";

const AdminTuitionsPage = () => {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<ApprovalFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await api<Tuition[]>("/api/tuitions/admin/all");
        if (isMounted) setTuitions(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) toast.error("Failed to load tuitions");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdatingId(id);
    try {
      const updated = await api<Tuition>(`/api/tuitions/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setTuitions((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                ...updated,
                approvalStatus: updated.approvalStatus || status,
              }
            : t,
        ),
      );
      toast.success(`Tuition ${status}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredTuitions =
    filter === "all"
      ? tuitions
      : tuitions.filter((t) => t.approvalStatus === filter);

  const counts = {
    all: tuitions.length,
    pending: tuitions.filter((t) => t.approvalStatus === "pending").length,
    approved: tuitions.filter((t) => t.approvalStatus === "approved").length,
    rejected: tuitions.filter((t) => t.approvalStatus === "rejected").length,
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
      <div className="flex flex-col justify-between gap-4 border-b border-[#806B88]/15 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C08BFF]">
            Listing Moderation
          </p>
          <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
            Tuition{" "}
            <span className="font-heading font-normal italic text-[#C08BFF]">
              approvals.
            </span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "pending", "approved", "rejected"] as ApprovalFilter[]).map(
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

      {/* Mobile Cards + Desktop Table */}
      <div className="overflow-hidden rounded-3xl border border-[#806B88]/20 bg-[#15131B]/85">
        {filteredTuitions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-sans text-base font-medium text-[#F5F1F8]">
              No {filter === "all" ? "" : filter} tuitions found.
            </p>
            <p className="mt-1 font-sans text-xs text-[#A69BAF]">
              Submitted tutor batches will appear here for review.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Stacked Cards */}
            <div className="divide-y divide-[#806B88]/15 sm:hidden">
              {filteredTuitions.map((t) => {
                const statusStyle =
                  t.approvalStatus === "approved"
                    ? {
                        label: "Approved",
                        classes:
                          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                        icon: CheckCircle2,
                      }
                    : t.approvalStatus === "rejected"
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
                const isBusy = updatingId === t._id;

                return (
                  <div key={t._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-[#F5F1F8]">
                          {t.title}
                        </p>
                        <p className="mt-0.5 font-sans text-xs text-[#A69BAF]">
                          {t.subject} • {t.classLevel}
                        </p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${statusStyle.classes}`}
                      >
                        <StatusIcon size={11} />
                        {statusStyle.label}
                      </span>
                    </div>

                    <p className="truncate font-sans text-xs text-[#C4C0CC]">
                      {t.tutorEmail}
                    </p>

                    {t.approvalStatus === "pending" ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => updateStatus(t._id, "approved")}
                          className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-sans text-xs font-medium text-emerald-300 transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/20 disabled:opacity-40"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => updateStatus(t._id, "rejected")}
                          className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-sans text-xs font-medium text-rose-300 transition-colors hover:border-rose-400/60 hover:bg-rose-500/20 disabled:opacity-40"
                        >
                          <X className="h-3.5 w-3.5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <p className="font-mono text-[11px] text-[#806B88]">
                        Reviewed
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
                  <th className="px-6 py-4 font-medium">Tuition</th>
                  <th className="px-6 py-4 font-medium">Tutor</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#806B88]/15 text-sm">
                {filteredTuitions.map((t) => {
                  const statusStyle =
                    t.approvalStatus === "approved"
                      ? {
                          label: "Approved",
                          classes:
                            "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                          icon: CheckCircle2,
                        }
                      : t.approvalStatus === "rejected"
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
                  const isBusy = updatingId === t._id;

                  return (
                    <tr
                      key={t._id}
                      className="transition-colors hover:bg-[#1B1724]/70"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#F5F1F8]">{t.title}</p>
                        <p className="mt-0.5 font-sans text-xs text-[#A69BAF]">
                          {t.subject} • {t.classLevel}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-sans text-sm text-[#C4C0CC]">
                        {t.tutorEmail}
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
                        {t.approvalStatus === "pending" ? (
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => updateStatus(t._id, "approved")}
                              className="inline-flex min-h-8 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-sans text-xs font-medium text-emerald-300 transition-colors hover:border-emerald-400/60 hover:bg-emerald-500/20 disabled:opacity-40"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => updateStatus(t._id, "rejected")}
                              className="inline-flex min-h-8 items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-sans text-xs font-medium text-rose-300 transition-colors hover:border-rose-400/60 hover:bg-rose-500/20 disabled:opacity-40"
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] text-[#806B88]">
                            Reviewed
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

export default AdminTuitionsPage;
