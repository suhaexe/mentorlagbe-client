"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Payment } from "@/types";
import { Loader2, DollarSign } from "lucide-react";

const AdminTransactionsPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await api<Payment[]>("/api/payments/admin/all");
        if (isMounted) setPayments(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) toast.error("Failed to load transactions");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalAmount = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0,
  );

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
            Stripe Ledger
          </p>
          <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
            Subscription{" "}
            <span className="font-heading font-normal italic text-[#C08BFF]">
              transactions.
            </span>
          </h1>
        </div>

        <div className="self-start rounded-2xl border border-[#806B88]/20 bg-[#15131B] px-4 py-2.5 sm:self-auto">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#806B88]">
            Gross Recorded
          </span>
          <span className="font-sans text-base font-semibold text-emerald-400">
            ${totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-hidden rounded-3xl border border-[#806B88]/20 bg-[#15131B]/85">
        {payments.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-sans text-base font-medium text-[#F5F1F8]">
              No transactions found.
            </p>
            <p className="mt-1 font-sans text-xs text-[#A69BAF]">
              Completed Stripe Pro plan checkouts will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#806B88]/15 font-mono text-[10px] uppercase tracking-[0.18em] text-[#806B88]">
                  <th className="px-4 py-3.5 font-medium sm:px-6 sm:py-4">
                    User
                  </th>
                  <th className="px-4 py-3.5 font-medium sm:px-6 sm:py-4">
                    Role
                  </th>
                  <th className="px-4 py-3.5 font-medium sm:px-6 sm:py-4">
                    Plan
                  </th>
                  <th className="px-4 py-3.5 font-medium sm:px-6 sm:py-4">
                    Amount
                  </th>
                  <th className="px-4 py-3.5 font-medium sm:px-6 sm:py-4">
                    Date
                  </th>
                  <th className="px-4 py-3.5 font-medium sm:px-6 sm:py-4">
                    Transaction ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#806B88]/15 text-sm">
                {payments.map((p) => (
                  <tr
                    key={p._id}
                    className="transition-colors hover:bg-[#1B1724]/70"
                  >
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                      <p className="font-medium text-[#F5F1F8]">{p.userName}</p>
                      <p className="font-sans text-xs text-[#A69BAF]">
                        {p.userEmail}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                      <span className="inline-flex rounded-full border border-[#806B88]/25 bg-[#101014] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#C4C0CC]">
                        {p.userRole}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-sans text-xs font-medium capitalize text-[#C08BFF] sm:px-6 sm:py-4 sm:text-sm">
                      {p.planName}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-emerald-400 sm:px-6 sm:py-4">
                      <span className="inline-flex items-center gap-0.5 whitespace-nowrap">
                        <DollarSign className="h-3.5 w-3.5" />
                        {Number(p.amount || 0).toLocaleString()}{" "}
                        <span className="ml-1 font-mono text-[11px] uppercase text-[#A69BAF]">
                          {p.currency || "USD"}
                        </span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-[#806B88] sm:px-6 sm:py-4">
                      {new Date(p.paidAt).toLocaleDateString()}
                    </td>
                    <td
                      className="max-w-[160px] truncate px-4 py-3.5 font-mono text-xs text-[#A69BAF] sm:max-w-[210px] sm:px-6 sm:py-4"
                      title={p.transactionId}
                    >
                      {p.transactionId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactionsPage;