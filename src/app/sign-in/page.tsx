"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { setJWT } from "@/lib/jwt";
import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SignInContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Please fill in all fields");
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw new Error(error.message);

      const data = await api<{ token: string; role: string }>(
        "/api/jwt/issue",
        {
          method: "POST",
        },
      );

      if (!data.token) {
        throw new Error("Backend did not return a token");
      }

      setJWT(data.token);

      toast.success("Signed in successfully!");

      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push(`/dashboard/${data.role}`);
      }
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Invalid credentials";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#101014] text-[#F5F1F8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -z-0 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-[#A45DEB]/[0.08] blur-[140px]"
      />

      <Navbar />

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="w-full max-w-md rounded-3xl border border-[#806B88]/20 bg-[#15131B]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:p-8">
          <div className="mb-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C08BFF]">
              MentorLagbe / Access
            </p>
            <h1 className="mt-2 font-sans text-2xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-3xl">
              Welcome{" "}
              <span className="font-heading font-normal italic text-[#C08BFF]">
                back.
              </span>
            </h1>
            <p className="mt-1.5 font-sans text-xs text-[#A69BAF] sm:text-sm">
              Sign in to manage your batches, applications, or profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#806B88]"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] pl-10 pr-4 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#806B88]"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] pl-10 pr-11 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#806B88] transition-colors hover:text-[#F5F1F8]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#A45DEB] px-6 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.32)] transition-colors hover:bg-[#C08BFF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="mt-6 text-center font-sans text-xs text-[#A69BAF] sm:text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-[#C08BFF] transition-colors hover:text-[#F5F1F8] hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </main>
      <div
        aria-hidden="true"
        className="mt-16 flex items-center gap-4 py-4 sm:mt-20"
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#806B88]/25 to-[#806B88]/25" />
        <span className="h-2 w-2 rounded-full bg-[#C08BFF] shadow-[0_0_12px_rgba(192,139,255,0.75)]" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#806B88]/25 to-[#806B88]/25" />
      </div>
      <Footer />
    </div>
  );
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#101014] text-[#F5F1F8]">
          Loading...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
