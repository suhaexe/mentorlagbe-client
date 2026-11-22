"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Tuition } from "@/types";
import {
  CheckCircle2,
  Clock,
  Loader2,
  PlusCircle,
  Power,
  Trash2,
  XCircle,
  Pencil,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MyTuitionsPage = () => {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [editingTuition, setEditingTuition] = useState<Tuition | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const data = await api<Tuition[]>("/api/tuitions/my-tuitions/list");
        if (isMounted) setTuitions(Array.isArray(data) ? data : []);
      } catch (error: unknown) {
        if (isMounted) {
          const message =
            error instanceof Error ? error.message : "Failed to load tuitions";
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tuition?")) return;
    setBusyId(id);
    try {
      await api(`/api/tuitions/${id}`, { method: "DELETE" });
      toast.success("Tuition deleted");
      setTuitions((prev) => prev.filter((t) => t._id !== id));
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete tuition";
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggle = async (id: string) => {
    setBusyId(id);
    try {
      const updated = await api<Tuition>(`/api/tuitions/${id}/toggle`, {
        method: "PATCH",
      });
      setTuitions((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, ...updated, isActive: updated.isActive } : t,
        ),
      );
      toast.success(`Tuition ${updated.isActive ? "activated" : "closed"}`);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to toggle status";
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTuition) return;

    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      monthlyFee: Number(formData.get("monthlyFee")),
      description: formData.get("description"),
    };

    try {
      const updated = await api<Tuition>(
        `/api/tuitions/${editingTuition._id}`,
        {
          method: "PUT",
          body: data,
        },
      );
      setTuitions((prev) =>
        prev.map((t) => (t._id === updated._id ? { ...t, ...updated } : t)),
      );
      toast.success("Tuition updated successfully");
      setEditingTuition(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update tuition";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
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
            Batch Inventory
          </p>
          <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
            My{" "}
            <span className="font-heading font-normal italic text-[#C08BFF]">
              tuitions.
            </span>
          </h1>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex min-h-10 items-center gap-2 self-start rounded-full bg-[#A45DEB] px-5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.28)] transition-colors hover:bg-[#C08BFF] sm:self-auto"
        >
          <PlusCircle size={15} />
          Post Tuition
        </Link>
      </div>

      {/* Batch Ledger */}
      <div className="overflow-hidden rounded-3xl border border-[#806B88]/20 bg-[#15131B]/85">
        {tuitions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-sans text-base font-medium text-[#F5F1F8]">
              No tuitions posted yet.
            </p>
            <p className="mt-1 font-sans text-xs text-[#A69BAF]">
              Create your first tuition listing to start receiving student
              applications.
            </p>
            <Link
              href="/dashboard/tutor/post-tuition"
              className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#A45DEB] px-5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#101014] transition-colors hover:bg-[#C08BFF]"
            >
              <PlusCircle size={14} />
              Post First Tuition
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Stacked Cards */}
            <div className="divide-y divide-[#806B88]/15 sm:hidden">
              {tuitions.map((t) => {
                const approvalStyle =
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

                const ApprovalIcon = approvalStyle.icon;
                const isBusy = busyId === t._id;

                return (
                  <div key={t._id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-[#F5F1F8]">
                          {t.title}
                        </p>
                        {(t.subject || t.classLevel) && (
                          <p className="mt-0.5 font-sans text-xs text-[#A69BAF]">
                            {t.subject}
                            {t.classLevel ? ` • ${t.classLevel}` : ""}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 font-sans text-sm font-semibold text-[#E2DCE8]">
                        ৳{Number(t.monthlyFee || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${approvalStyle.classes}`}
                      >
                        <ApprovalIcon size={11} />
                        {approvalStyle.label}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${
                          t.isActive
                            ? "border-[#C08BFF]/35 bg-[#A45DEB]/15 text-[#C08BFF]"
                            : "border-[#806B88]/25 bg-[#101014] text-[#806B88]"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            t.isActive ? "bg-[#C08BFF]" : "bg-[#806B88]"
                          }`}
                        />
                        {t.isActive ? "Active" : "Closed"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => setEditingTuition(t)}
                        className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#806B88]/25 bg-[#101014] px-3 py-1 font-sans text-xs font-medium text-[#C4C0CC] transition-colors hover:border-[#C08BFF]/40 hover:text-[#F5F1F8] disabled:opacity-40"
                      >
                        <Pencil className="h-3.5 w-3.5 text-blue-400" />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleToggle(t._id)}
                        className="inline-flex min-h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#806B88]/25 bg-[#101014] px-3 py-1 font-sans text-xs font-medium text-[#C4C0CC] transition-colors hover:border-[#C08BFF]/40 hover:text-[#F5F1F8] disabled:opacity-40"
                      >
                        <Power
                          className={`h-3.5 w-3.5 ${
                            t.isActive ? "text-emerald-400" : "text-[#806B88]"
                          }`}
                        />
                        {t.isActive ? "Close" : "Activate"}
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleDelete(t._id)}
                        className="inline-flex min-h-9 flex-1 items-center justify-center gap-1 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 font-sans text-xs font-medium text-rose-300 transition-colors hover:border-rose-400/50 hover:bg-rose-500/20 disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <table className="hidden w-full border-collapse text-left sm:table">
              <thead>
                <tr className="border-b border-[#806B88]/15 font-mono text-[10px] uppercase tracking-[0.18em] text-[#806B88]">
                  <th className="px-6 py-4 font-medium">Tuition Batch</th>
                  <th className="px-6 py-4 font-medium">Monthly Fee</th>
                  <th className="px-6 py-4 font-medium">Admin Approval</th>
                  <th className="px-6 py-4 font-medium">Visibility</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#806B88]/15 text-sm">
                {tuitions.map((t) => {
                  const approvalStyle =
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

                  const ApprovalIcon = approvalStyle.icon;
                  const isBusy = busyId === t._id;

                  return (
                    <tr
                      key={t._id}
                      className="transition-colors hover:bg-[#1B1724]/70"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-[#F5F1F8]">{t.title}</p>
                        {(t.subject || t.classLevel) && (
                          <p className="mt-0.5 font-sans text-xs text-[#A69BAF]">
                            {t.subject}
                            {t.classLevel ? ` • ${t.classLevel}` : ""}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-[#E2DCE8]">
                        ৳{Number(t.monthlyFee || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${approvalStyle.classes}`}
                        >
                          <ApprovalIcon size={11} />
                          {approvalStyle.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${
                            t.isActive
                              ? "border-[#C08BFF]/35 bg-[#A45DEB]/15 text-[#C08BFF]"
                              : "border-[#806B88]/25 bg-[#101014] text-[#806B88]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              t.isActive ? "bg-[#C08BFF]" : "bg-[#806B88]"
                            }`}
                          />
                          {t.isActive ? "Active" : "Closed"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => setEditingTuition(t)}
                            title="Edit tuition"
                            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#806B88]/25 bg-[#101014] px-3 py-1 font-sans text-xs font-medium text-[#C4C0CC] transition-colors hover:border-[#C08BFF]/40 hover:text-[#F5F1F8] disabled:opacity-40"
                          >
                            <Pencil className="h-3.5 w-3.5 text-blue-400" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleToggle(t._id)}
                            title={
                              t.isActive ? "Close batch" : "Activate batch"
                            }
                            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#806B88]/25 bg-[#101014] px-3 py-1 font-sans text-xs font-medium text-[#C4C0CC] transition-colors hover:border-[#C08BFF]/40 hover:text-[#F5F1F8] disabled:opacity-40"
                          >
                            <Power
                              className={`h-3.5 w-3.5 ${
                                t.isActive
                                  ? "text-emerald-400"
                                  : "text-[#806B88]"
                              }`}
                            />
                            <span className="hidden sm:inline">
                              {t.isActive ? "Close" : "Activate"}
                            </span>
                          </button>

                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleDelete(t._id)}
                            title="Delete tuition"
                            className="inline-flex min-h-8 items-center gap-1 rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 font-sans text-xs font-medium text-rose-300 transition-colors hover:border-rose-400/50 hover:bg-rose-500/20 disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Dialog
        open={!!editingTuition}
        onOpenChange={(open) => !open && setEditingTuition(null)}
      >
        <DialogContent className="border-[#806B88]/20 bg-[#15131B] text-[#F5F1F8]">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">
              Edit Tuition
            </DialogTitle>
            <DialogDescription className="text-[#A69BAF]">
              Make changes to your tuition post here. Click save when
              you&rsquo;re done.
            </DialogDescription>
          </DialogHeader>
          {editingTuition && (
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-[#F5F1F8]">Title</Label>
                <Input
                  name="title"
                  defaultValue={editingTuition.title}
                  required
                  className="border-[#806B88]/30 bg-[#101014] text-[#F5F1F8]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#F5F1F8]">Monthly Fee (৳)</Label>
                <Input
                  name="monthlyFee"
                  type="number"
                  defaultValue={editingTuition.monthlyFee}
                  required
                  className="border-[#806B88]/30 bg-[#101014] text-[#F5F1F8]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#F5F1F8]">Description</Label>
                <Textarea
                  name="description"
                  defaultValue={editingTuition.description}
                  required
                  className="min-h-[100px] border-[#806B88]/30 bg-[#101014] text-[#F5F1F8]"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="mt-2 inline-flex w-full min-h-10 items-center justify-center rounded-full bg-[#A45DEB] px-5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.28)] transition-colors hover:bg-[#C08BFF] disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTuitionsPage;
