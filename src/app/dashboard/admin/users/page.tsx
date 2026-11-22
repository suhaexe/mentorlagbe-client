"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { User } from "@/types";
import { Loader2 } from "lucide-react";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const data = await api<User[]>("/api/users");
        if (isMounted) setUsers(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) toast.error("Failed to load users");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    if (!newRole) return;
    setUpdatingId(id);
    try {
      const updated = await api<User>(`/api/users/${id}/role`, {
        method: "PATCH",
        body: { role: newRole },
      });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, ...updated, role: updated.role || newRole } : u,
        ),
      );
      toast.success("User role updated");
    } catch {
      toast.error("Failed to update role");
    } finally {
      setUpdatingId(null);
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
            Access Directory
          </p>
          <h1 className="mt-1.5 font-sans text-3xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-4xl">
            User{" "}
            <span className="font-heading font-normal italic text-[#C08BFF]">
              management.
            </span>
          </h1>
        </div>

        <div className="self-start rounded-2xl border border-[#806B88]/20 bg-[#15131B] px-4 py-2.5 sm:self-auto">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[#806B88]">
            Registered Accounts
          </span>
          <span className="font-sans text-base font-semibold text-[#F5F1F8]">
            {users.length}
          </span>
        </div>
      </div>

      {/* Mobile Cards + Desktop Table */}
      <div className="overflow-hidden rounded-3xl border border-[#806B88]/20 bg-[#15131B]/85">
        {users.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-sans text-base font-medium text-[#F5F1F8]">
              No users found.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Stacked Cards */}
            <div className="divide-y divide-[#806B88]/15 sm:hidden">
              {users.map((u) => {
                const isPro = u.plan === "pro";
                return (
                  <div key={u._id} className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-sans text-sm font-medium text-[#F5F1F8]">
                        {u.name}
                      </p>
                      <span
                        className={`inline-flex shrink-0 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                          isPro
                            ? "border-[#C08BFF]/40 bg-[#A45DEB]/15 text-[#C08BFF]"
                            : "border-[#806B88]/25 bg-[#101014] text-[#A69BAF]"
                        }`}
                      >
                        {u.plan || "free"}
                      </span>
                    </div>

                    <p className="truncate font-sans text-xs text-[#A69BAF]">
                      {u.email}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#806B88]">
                        Role
                      </span>
                      <select
                        aria-label={`Role for ${u.name}`}
                        value={u.role}
                        disabled={updatingId === u._id}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="h-9 rounded-xl border border-[#806B88]/25 bg-[#101014] px-3 font-mono text-xs uppercase tracking-wider text-[#F5F1F8] outline-none transition-colors focus:border-[#C08BFF] disabled:opacity-50"
                      >
                        <option value="student">Student</option>
                        <option value="tutor">Tutor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <table className="hidden w-full border-collapse text-left sm:table">
              <thead>
                <tr className="border-b border-[#806B88]/15 font-mono text-[10px] uppercase tracking-[0.18em] text-[#806B88]">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 text-right font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#806B88]/15 text-sm">
                {users.map((u) => {
                  const isPro = u.plan === "pro";
                  return (
                    <tr
                      key={u._id}
                      className="transition-colors hover:bg-[#1B1724]/70"
                    >
                      <td className="px-6 py-4 font-medium text-[#F5F1F8]">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 font-sans text-sm text-[#A69BAF]">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                            isPro
                              ? "border-[#C08BFF]/40 bg-[#A45DEB]/15 text-[#C08BFF]"
                              : "border-[#806B88]/25 bg-[#101014] text-[#A69BAF]"
                          }`}
                        >
                          {u.plan || "free"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <select
                          aria-label={`Role for ${u.name}`}
                          value={u.role}
                          disabled={updatingId === u._id}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="h-9 rounded-xl border border-[#806B88]/25 bg-[#101014] px-3 font-mono text-xs uppercase tracking-wider text-[#F5F1F8] outline-none transition-colors focus:border-[#C08BFF] disabled:opacity-50"
                        >
                          <option value="student">Student</option>
                          <option value="tutor">Tutor</option>
                          <option value="admin">Admin</option>
                        </select>
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

export default AdminUsersPage;