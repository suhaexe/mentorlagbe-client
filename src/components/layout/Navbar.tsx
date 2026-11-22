"use client";

import { useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { clearJWT } from "@/lib/jwt";
import { toast } from "sonner";
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

const subscribeToScroll = (callback: () => void) => {
  window.addEventListener("scroll", callback, { passive: true });
  return () => {
    window.removeEventListener("scroll", callback);
  };
};

const getScrollSnapshot = () => window.scrollY > 48;
const getServerScrollSnapshot = () => false;

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const isScrolled = useSyncExternalStore(
    subscribeToScroll,
    getScrollSnapshot,
    getServerScrollSnapshot,
  );

  const isHomePage = pathname === "/";
  const isTransparent = isHomePage && !isScrolled;

  const user = session?.user as
    | { name?: string; email?: string; image?: string; role?: string }
    | undefined;

  const isRouteActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navigateTo = (href: string) => {
    router.push(href);
  };

  const handleSignOut = async () => {
    await signOut();
    clearJWT();
    toast.success("Signed out");
    router.push("/");
  };

  const handleDashboard = () => {
    router.push(`/dashboard/${user?.role ?? "student"}`);
  };

  const handleProfile = () => {
    router.push("/dashboard/profile");
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 w-full transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out ${
          isTransparent
            ? "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
            : "border-b border-[#806B88]/20 bg-[#101014]/85 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => navigateTo("/")}
            aria-label="MentorLagbe Home"
            className="group inline-flex cursor-pointer items-center font-heading text-xl font-extrabold tracking-tight text-[#F5F1F8]"
          >
            MENTORLAGBE
            <span className="text-[#C08BFF] transition-transform duration-300 group-hover:scale-125">
              .
            </span>
          </button>

          {/* Center Pill Navigation */}
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 rounded-full border border-[#806B88]/20 bg-transparent p-1 md:flex"
          >
            {publicNav.map((item) => {
              const active = isRouteActive(item.href);
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => navigateTo(item.href)}
                  className={`relative cursor-pointer rounded-full px-4 py-1.5 font-sans text-xs font-medium transition-colors duration-300 ${
                    active
                      ? "text-[#F5F1F8]"
                      : "text-[#A69BAF] hover:text-[#F5F1F8]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-full border border-[#C08BFF]/35 bg-[#A45DEB]/20 shadow-[0_0_20px_rgba(164,93,235,0.22)]"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            {isPending ? (
              <div className="hidden h-9 w-28 animate-pulse rounded-full bg-transparent sm:block" />
            ) : !user ? (
              <div className="hidden items-center gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => navigateTo("/sign-in")}
                  className="inline-flex h-9 cursor-pointer items-center justify-center rounded-full border border-[#806B88]/35 bg-transparent px-4 font-sans text-xs font-medium text-[#E2DCE8] transition-colors duration-300 hover:border-[#C08BFF]/60 hover:text-[#F5F1F8]"
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => navigateTo("/sign-up")}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#A45DEB] px-4 font-sans text-xs font-semibold text-[#101014] shadow-[0_0_20px_rgba(164,93,235,0.3)] transition-colors duration-300 hover:bg-[#C08BFF]"
                >
                  Sign Up
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2.5 rounded-full border border-[#806B88]/30 bg-transparent py-1 pl-1.5 pr-3 text-sm text-[#F5F1F8] transition-[border-color,background-color] duration-300 hover:border-[#C08BFF]/55 hover:bg-transparent focus-visible:outline-2 focus-visible:outline-[#C08BFF]">
                    <Avatar className="h-7 w-7 rounded-full border border-[#C08BFF]/30">
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback className="rounded-full bg-transparent font-sans text-xs font-semibold text-[#C08BFF]">
                        {user.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>

                    <span className="hidden max-w-24 truncate font-sans text-xs font-medium text-[#F5F1F8] lg:inline">
                      {user.name}
                    </span>

                    {user.role && (
                      <span className="rounded-full border border-[#C08BFF]/30 bg-transparent px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#C08BFF]">
                        {user.role}
                      </span>
                    )}

                    <ChevronDown size={13} className="text-[#A69BAF]" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-56 rounded-2xl border border-[#806B88]/30 bg-[#15131B] p-1.5 text-[#F5F1F8] shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-2.5 py-2">
                        <p className="truncate font-sans text-xs font-semibold text-[#F5F1F8]">
                          {user.name || "Account"}
                        </p>
                        <p className="truncate font-mono text-[11px] font-normal text-[#806B88]">
                          {user.email}
                        </p>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-[#806B88]/20" />

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        className="cursor-pointer gap-2 rounded-xl px-2.5 py-2 font-sans text-xs text-[#E2DCE8] focus:bg-[#A45DEB]/20 focus:text-[#F5F1F8]"
                        onClick={handleDashboard}
                      >
                        <LayoutDashboard size={14} className="text-[#C08BFF]" />
                        Dashboard
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer gap-2 rounded-xl px-2.5 py-2 font-sans text-xs text-[#E2DCE8] focus:bg-[#A45DEB]/20 focus:text-[#F5F1F8]"
                        onClick={handleProfile}
                      >
                        <UserCog size={14} className="text-[#C08BFF]" />
                        Update Profile
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-[#806B88]/20" />

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer gap-2 rounded-xl px-2.5 py-2 font-sans text-xs text-rose-400 focus:bg-rose-500/15 focus:text-rose-300"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Hamburger Dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Open menu"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#806B88]/30 bg-transparent text-[#F5F1F8] transition-colors duration-300 hover:border-[#C08BFF]/60 focus-visible:outline-2 focus-visible:outline-[#C08BFF]"
                >
                  <Menu size={18} />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-60 rounded-2xl border border-[#806B88]/30 bg-[#15131B] p-1.5 text-[#F5F1F8] shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
                >
                  {user && (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="flex items-center gap-2.5 px-2.5 py-2">
                          <Avatar className="h-8 w-8 rounded-full border border-[#C08BFF]/30">
                            <AvatarImage src={user.image || undefined} />
                            <AvatarFallback className="rounded-full bg-transparent font-sans text-xs font-semibold text-[#C08BFF]">
                              {user.name?.[0]?.toUpperCase() ?? "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-sans text-xs font-semibold text-[#F5F1F8]">
                              {user.name || "Account"}
                            </p>
                            {user.role && (
                              <p className="font-mono text-[10px] uppercase tracking-wider text-[#C08BFF]">
                                {user.role}
                              </p>
                            )}
                          </div>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-[#806B88]/20" />
                    </>
                  )}

                  <DropdownMenuGroup>
                    {publicNav.map((item) => {
                      const active = isRouteActive(item.href);
                      return (
                        <DropdownMenuItem
                          key={item.href}
                          onClick={() => navigateTo(item.href)}
                          className={`cursor-pointer rounded-xl px-2.5 py-2 font-sans text-xs focus:bg-[#A45DEB]/20 focus:text-[#F5F1F8] ${
                            active
                              ? "font-semibold text-[#C08BFF]"
                              : "text-[#E2DCE8]"
                          }`}
                        >
                          {item.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuGroup>

                  {!isPending && (
                    <>
                      <DropdownMenuSeparator className="bg-[#806B88]/20" />
                      {!user ? (
                        <DropdownMenuGroup className="flex flex-col gap-1 p-1">
                          <DropdownMenuItem
                            onClick={() => navigateTo("/sign-in")}
                            className="cursor-pointer justify-center rounded-xl border border-[#806B88]/35 py-2 font-sans text-xs font-medium text-[#E2DCE8] focus:bg-[#A45DEB]/20 focus:text-[#F5F1F8]"
                          >
                            Sign In
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigateTo("/sign-up")}
                            className="cursor-pointer justify-center rounded-xl bg-[#A45DEB] py-2 font-sans text-xs font-semibold text-[#101014] focus:bg-[#C08BFF] focus:text-[#101014]"
                          >
                            Sign Up
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      ) : (
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="cursor-pointer gap-2 rounded-xl px-2.5 py-2 font-sans text-xs text-[#E2DCE8] focus:bg-[#A45DEB]/20 focus:text-[#F5F1F8]"
                            onClick={handleDashboard}
                          >
                            <LayoutDashboard
                              size={14}
                              className="text-[#C08BFF]"
                            />
                            Dashboard
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer gap-2 rounded-xl px-2.5 py-2 font-sans text-xs text-[#E2DCE8] focus:bg-[#A45DEB]/20 focus:text-[#F5F1F8]"
                            onClick={handleProfile}
                          >
                            <UserCog size={14} className="text-[#C08BFF]" />
                            Update Profile
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-[#806B88]/20" />

                          <DropdownMenuItem
                            onClick={handleSignOut}
                            className="cursor-pointer gap-2 rounded-xl px-2.5 py-2 font-sans text-xs text-rose-400 focus:bg-rose-500/15 focus:text-rose-300"
                          >
                            <LogOut size={14} />
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      {!isHomePage && <div aria-hidden="true" className="h-16 shrink-0" />}
    </>
  );
};