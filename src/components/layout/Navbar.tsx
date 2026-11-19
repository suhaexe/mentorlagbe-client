"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { clearJWT } from "@/lib/jwt";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const publicNav = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const handleSignOut = async () => {
    await signOut();
    clearJWT();
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Mentor<span className="text-primary">Lagbe</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {publicNav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm transition-colors hover:text-primary ${
                pathname === n.href ? "font-medium text-primary" : "text-muted-foreground"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? null : !user ? (
            <>
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={buttonVariants({ size: "sm" })}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <DropdownMenu>
              {/* 1. Removed asChild from Trigger */}
              <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full border px-2 py-1 text-sm hover:bg-accent focus:outline-none">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={user.image || undefined} />
                  <AvatarFallback>{user.name?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user.name}</span>
                {user.role && (
                  <Badge variant="secondary" className="capitalize">
                    {user.role}
                  </Badge>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal text-muted-foreground">
                    {user.email}
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* 2. Removed asChild from Items, used router.push instead */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(`/dashboard/${user.role ?? "student"}`)}
                  >
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    Update Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};