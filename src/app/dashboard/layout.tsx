"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { clearJWT } from "@/lib/jwt";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  X,
  LogOut,
  Home,
  User,
  FileText,
  PlusCircle,
  Users,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as
    | { name?: string; email?: string; role?: string; image?: string }
    | undefined;

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    clearJWT();
    toast.success("Signed out");
    router.push("/");
  };

  const navItems = {
    student: [
      { href: "/dashboard/student", label: "Overview", icon: Home },
      {
        href: "/dashboard/student/my-applications",
        label: "My Applications",
        icon: FileText,
      },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
    tutor: [
      { href: "/dashboard/tutor", label: "Overview", icon: Home },
      {
        href: "/dashboard/tutor/post-tuition",
        label: "Post Tuition",
        icon: PlusCircle,
      },
      {
        href: "/dashboard/tutor/my-tuitions",
        label: "My Tuitions",
        icon: FileText,
      },
      {
        href: "/dashboard/tutor/applicants",
        label: "Applicants",
        icon: Users,
      },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Overview", icon: Home },
      { href: "/dashboard/admin/users", label: "Users", icon: Users },
      {
        href: "/dashboard/admin/tuitions",
        label: "Approvals",
        icon: ShieldCheck,
      },
      {
        href: "/dashboard/admin/transactions",
        label: "Transactions",
        icon: CreditCard,
      },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
  };

  const currentNav = navItems[user.role as keyof typeof navItems] || [];
  const activeNavItem = currentNav.find((item) => pathname === item.href);

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#101014] text-[#F5F1F8]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-32 left-1/2 -z-0 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-[#A45DEB]/[0.07] blur-[140px]"
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#806B88]/15 bg-[#15131B]/95 backdrop-blur-md transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#806B88]/15 px-5">
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-[-0.04em] text-[#F5F1F8]"
          >
            Mentor<span className="text-[#C08BFF]">Lagbe</span>
            <span className="text-[#C08BFF]">.</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-[#A69BAF] hover:bg-[#1E1A28] hover:text-[#F5F1F8] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4">
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-2xl border border-[#806B88]/20 bg-[#101014]/80 p-3.5">
              <Avatar className="h-10 w-10 border border-[#C08BFF]/30">
                <AvatarImage src={user.image} alt={user.name || "User"} />
                <AvatarFallback className="bg-[#A45DEB]/20 font-sans text-sm font-semibold text-[#C08BFF]">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-sm font-medium text-[#F5F1F8]">
                  {user.name || "Account"}
                </p>
                <span className="mt-1 inline-flex items-center rounded-full bg-[#A45DEB]/15 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#C08BFF]">
                  {user.role || "member"}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-1.5">
              <p className="px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#806B88]">
                Workspace
              </p>
              <nav aria-label="Dashboard navigation" className="space-y-1">
                {currentNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-sans text-sm transition-all ${
                        isActive
                          ? "bg-[#A45DEB] font-semibold text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.28)]"
                          : "text-[#A69BAF] hover:bg-[#1E1A28] hover:text-[#F5F1F8]"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-[#101014]" : "text-[#806B88]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Bottom Quick Link */}
          <div className="border-t border-[#806B88]/15 pt-4">
            <Link
              href="/tuitions"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-between rounded-xl border border-[#806B88]/20 bg-[#101014]/60 px-3.5 py-2.5 font-sans text-xs font-medium text-[#C4C0CC] transition-colors hover:border-[#C08BFF]/40 hover:text-[#F5F1F8]"
            >
              <span>Browse Tuitions</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#C08BFF]" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-[#806B88]/15 bg-[#101014]/80 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#A69BAF] hover:bg-[#15131B] hover:text-[#F5F1F8] lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#806B88]">
              {user.role ? `${user.role} / ` : ""}
              <span className="text-[#C4C0CC]">
                {activeNavItem?.label || "Dashboard"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="rounded-full border border-[#806B88]/20 bg-[#15131B] px-4 font-sans text-xs font-medium text-[#C4C0CC] transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;