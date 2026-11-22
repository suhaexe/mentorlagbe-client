"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  User,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { setJWT } from "@/lib/jwt";
import { api } from "@/lib/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return toast.error("Please fill in all fields");
    }
    if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    setIsLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        requestedRole: role,
      } as Parameters<typeof authClient.signUp.email>[0];

      const { error: signUpError } = await authClient.signUp.email(payload);

      if (signUpError) throw new Error(signUpError.message);

      const { error: signInError } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw new Error(signInError.message);

      const data = await api<{ token: string; role: string }>(
        "/api/jwt/issue",
        {
          method: "POST",
        },
      );

      setJWT(data.token);

      toast.success("Account created successfully!");
      router.push(`/dashboard/${data.role}`);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
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
              MentorLagbe / Join
            </p>
            <h1 className="mt-2 font-sans text-2xl font-medium tracking-[-0.03em] text-[#F5F1F8] sm:text-3xl">
              Create your{" "}
              <span className="font-heading font-normal italic text-[#C08BFF]">
                account.
              </span>
            </h1>
            <p className="mt-1.5 font-sans text-xs text-[#A69BAF] sm:text-sm">
              Join directly as a student looking for guidance or a tutor leading
              batches.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector Tiles */}
            <div className="space-y-2">
              <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]">
                I want to join as a
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 font-sans text-xs font-medium transition-all sm:text-sm ${
                    role === "student"
                      ? "border-[#C08BFF] bg-[#A45DEB]/20 text-[#F5F1F8] shadow-[0_0_20px_rgba(164,93,235,0.2)]"
                      : "border-[#806B88]/20 bg-[#101014] text-[#A69BAF] hover:border-[#806B88]/40 hover:text-[#F5F1F8]"
                  }`}
                >
                  <GraduationCap
                    size={16}
                    className={
                      role === "student" ? "text-[#C08BFF]" : "text-[#806B88]"
                    }
                  />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("tutor")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-3.5 py-2.5 font-sans text-xs font-medium transition-all sm:text-sm ${
                    role === "tutor"
                      ? "border-[#C08BFF] bg-[#A45DEB]/20 text-[#F5F1F8] shadow-[0_0_20px_rgba(164,93,235,0.2)]"
                      : "border-[#806B88]/20 bg-[#101014] text-[#A69BAF] hover:border-[#806B88]/40 hover:text-[#F5F1F8]"
                  }`}
                >
                  <Users
                    size={16}
                    className={
                      role === "tutor" ? "text-[#C08BFF]" : "text-[#806B88]"
                    }
                  />
                  <span>Tutor</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[#C4C0CC]"
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#806B88]"
                />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-11 w-full rounded-xl border border-[#806B88]/25 bg-[#101014] pl-10 pr-4 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
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
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
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
              {isLoading ? "Creating account..." : "Create Account"}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="mt-6 text-center font-sans text-xs text-[#A69BAF] sm:text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-[#C08BFF] transition-colors hover:text-[#F5F1F8] hover:underline"
            >
              Sign In
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

export default SignUpPage;
