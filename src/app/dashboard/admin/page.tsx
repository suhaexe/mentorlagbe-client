"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  DollarSign,
  FileText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { Payment } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const AdminOverview = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    pendingTuitions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [paymentsData, statsData] = await Promise.all([
          api<Payment[]>("/api/payments/admin/all").catch(() => []),
          api<{
            totalUsers: number;
            totalTutors: number;
            pendingTuitions: number;
          }>("/api/users/stats").catch(() => ({
            totalUsers: 0,
            totalTutors: 0,
            pendingTuitions: 0,
          })),
        ]);

        if (isMounted) {
          setPayments(Array.isArray(paymentsData) ? paymentsData : []);
          setUserStats(statsData);
        }
      } catch {
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalRevenue = payments.reduce((sum, item) => {
    const isPaid = !item.paymentStatus || item.paymentStatus === "paid";
    return isPaid ? sum + Number(item.amount || 0) : sum;
  }, 0);

  const stats = [
    {
      label: "Total Users",
      value: isLoading ? "—" : userStats.totalUsers.toString(), // 👈 Dynamic
      hint: "Registered platform accounts",
      icon: Users,
      accent: "text-[#C08BFF]",
    },
    {
      label: "Total Tutors",
      value: isLoading ? "—" : userStats.totalTutors.toString(), // 👈 Dynamic
      hint: "Active mentor profiles",
      icon: CheckCircle2,
      accent: "text-emerald-400",
    },
    {
      label: "Pending Tuitions",
      value: isLoading ? "—" : userStats.pendingTuitions.toString(), // 👈 Dynamic
      hint: "Awaiting listing approval",
      icon: FileText,
      accent: "text-amber-300",
    },
    {
      label: "Total Revenue",
      value: isLoading ? "—" : `$${totalRevenue.toLocaleString()}`,
      hint:
        payments.length > 0
          ? `${payments.length} recorded Stripe payment${payments.length === 1 ? "" : "s"}`
          : "Stripe Pro subscriptions",
      icon: DollarSign,
      accent: "text-emerald-400",
    },
  ];

  const quickActions = [
    {
      title: "Review Tuition Approvals",
      description:
        "Approve or reject pending tuition batches before they go live on Browse Tuitions.",
      href: "/dashboard/admin/tuitions",
      cta: "Open Approvals",
      icon: ShieldCheck,
    },
    {
      title: "Manage Users & Roles",
      description:
        "Inspect registered accounts and update user roles across students, tutors, and admins.",
      href: "/dashboard/admin/users",
      cta: "Manage Users",
      icon: Users,
    },
    {
      title: "Inspect Stripe Transactions",
      description:
        "Audit subscription payment records, transaction IDs, plans, and amounts.",
      href: "/dashboard/admin/transactions",
      cta: "View Ledger",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#806B88]/15 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C08BFF]">
            Admin Control
          </p>
          <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
            Platform{" "}
            <span className="font-heading font-normal italic text-[#C08BFF]">
              overview.
            </span>
          </h1>
        </div>

        <Link
          href="/dashboard/admin/tuitions"
          className="inline-flex min-h-10 items-center gap-2 self-start rounded-full bg-[#A45DEB] px-5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.28)] transition-colors hover:bg-[#C08BFF] sm:self-auto"
        >
          Moderate Tuitions
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Telemetry Cards */}
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

      {/* Moderation & Operations Shortcuts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-base font-medium text-[#F5F1F8]">
            Operations & Moderation
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#806B88]">
            Quick Routes
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-40 w-full rounded-3xl bg-[#15131B]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {quickActions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.href}
                  className="flex flex-col justify-between rounded-3xl border border-[#806B88]/20 bg-[#15131B]/80 p-6 transition-colors hover:border-[#C08BFF]/35"
                >
                  <div>
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#806B88]/20 bg-[#101014] text-[#C08BFF]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="mt-4 font-sans text-base font-medium text-[#F5F1F8]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-[#A69BAF]">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#C08BFF] transition-colors hover:text-[#F5F1F8]"
                  >
                    {item.cta}
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
