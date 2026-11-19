"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { clearJWT } from "@/lib/jwt";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Menu, X, LogOut, Home, User, FileText, PlusCircle, Users, ShieldCheck, CreditCard } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as { name?: string; email?: string; role?: string; image?: string } | undefined;

  if (!user) return null; // Handled by middleware/redirects in real app

  const handleSignOut = async () => {
    await signOut();
    clearJWT();
    toast.success("Signed out");
    router.push("/");
  };

  const navItems = {
    student: [
      { href: "/dashboard/student", label: "Overview", icon: Home },
      { href: "/dashboard/student/my-applications", label: "My Applications", icon: FileText },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
    tutor: [
      { href: "/dashboard/tutor", label: "Overview", icon: Home },
      { href: "/dashboard/tutor/post-tuition", label: "Post Tuition", icon: PlusCircle },
      { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: FileText },
      { href: "/dashboard/tutor/applicants", label: "Applicants", icon: Users },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
    admin: [
      { href: "/dashboard/admin", label: "Overview", icon: Home },
      { href: "/dashboard/admin/users", label: "Users", icon: Users },
      { href: "/dashboard/admin/tuitions", label: "Approvals", icon: ShieldCheck },
      { href: "/dashboard/admin/transactions", label: "Transactions", icon: CreditCard },
      { href: "/dashboard/profile", label: "Profile", icon: User },
    ],
  };

  const currentNav = navItems[user.role as keyof typeof navItems] || [];

  return (
    <div className="flex h-screen bg-muted/10">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background border-r transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/" className="text-xl font-bold">Mentor<span className="text-primary">Lagbe</span></Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 space-y-2">
          <div className="mb-6 flex items-center gap-3 rounded-lg bg-muted p-3">
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <Badge variant="secondary" className="capitalize text-xs">{user.role}</Badge>
            </div>
          </div>
          
          <nav className="space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-destructive hover:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;