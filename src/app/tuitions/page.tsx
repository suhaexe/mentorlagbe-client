"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tuition } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const CLASSES = ["All", "Class 8", "Class 9", "Class 10", "HSC", "Admission"];
const MODES = ["All", "Online", "Offline"];

const BrowseTuitionsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialClassLevel = searchParams.get("classLevel") || "All";
  const initialMode = searchParams.get("mode") || "All";
  const initialPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [appliedSearch, setAppliedSearch] = useState(initialSearch);
  const [classLevel, setClassLevel] = useState(initialClassLevel);
  const [mode, setMode] = useState(initialMode);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const syncUrl = useCallback(
    (
      nextSearch: string,
      nextClassLevel: string,
      nextMode: string,
      nextPage: number,
    ) => {
      const params = new URLSearchParams();
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextClassLevel !== "All") params.set("classLevel", nextClassLevel);
      if (nextMode !== "All") params.set("mode", nextMode);
      params.set("page", nextPage.toString());
      params.set("limit", "8");
      router.replace(`/tuitions?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (appliedSearch.trim()) params.set("search", appliedSearch.trim());
      if (classLevel !== "All") params.set("classLevel", classLevel);
      if (mode !== "All") params.set("mode", mode);
      params.set("page", page.toString());
      params.set("limit", "8");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tuitions?${params.toString()}`,
          { cache: "no-store" },
        );
        const data = await res.json();

        if (isMounted) {
          const list: Tuition[] = Array.isArray(data.tuitions)
            ? data.tuitions
            : [];
          setTuitions(list);
          setFocusedId(list[0]?._id ?? null);
          setTotalPages(Math.max(1, Number(data.totalPages) || 1));
          syncUrl(appliedSearch, classLevel, mode, page);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setTuitions([]);
          setFocusedId(null);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [appliedSearch, classLevel, mode, page, syncUrl]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(searchInput);
    setPage(1);
  };

  const hasFilters =
    Boolean(appliedSearch.trim()) || classLevel !== "All" || mode !== "All";

  const activeTuition =
    tuitions.find((item) => item._id === focusedId) ?? tuitions[0] ?? null;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#101014] text-[#F5F1F8]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-20 -z-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[#A45DEB]/[0.07] blur-[140px]"
      />

      <Navbar />

      <main className="relative z-10 flex-1 pb-24 pt-12 sm:pt-16">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#C08BFF]">
                MentorLagbe / Directory
              </p>
              <h1 className="mt-3 font-sans text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[#F5F1F8] sm:text-6xl">
                Curated tuitions,{" "}
                <span className="font-heading font-normal italic text-[#C08BFF]">
                  ready to join.
                </span>
              </h1>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="group relative w-full max-w-md"
            >
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#806B88] transition-colors group-focus-within:text-[#C08BFF]"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search subject, topic, or mentor..."
                className="h-12 w-full rounded-full border border-[#806B88]/25 bg-[#15131B]/90 pl-11 pr-24 font-sans text-sm text-[#F5F1F8] placeholder:text-[#806B88] outline-none transition-colors focus:border-[#C08BFF]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[#A45DEB] px-4 py-2 font-sans text-xs font-semibold text-[#101014] transition-colors hover:bg-[#C08BFF]"
              >
                Find
              </button>
            </form>
          </div>

          {/* Minimal Typographic Filter Strip */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#806B88]/15 pb-5">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {CLASSES.map((item) => {
                const active = classLevel === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setClassLevel(item);
                      setPage(1);
                    }}
                    className={`font-sans text-xs tracking-wide transition-colors ${
                      active
                        ? "font-semibold text-[#C08BFF]"
                        : "text-[#A69BAF] hover:text-[#F5F1F8]"
                    }`}
                  >
                    {item === "All" ? "All Classes" : item}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              {MODES.map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      setPage(1);
                    }}
                    className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      active
                        ? "font-semibold text-[#F5F1F8]"
                        : "text-[#806B88] hover:text-[#C08BFF]"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}

              {hasFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setAppliedSearch("");
                    setClassLevel("All");
                    setMode("All");
                    setPage(1);
                  }}
                  className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C08BFF] hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Main Asymmetric Canvas: Stream Left + Live Lens Right */}
          {isLoading ? (
            <div className="mt-10 grid gap-12 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-7">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-16 w-full rounded-xl bg-[#15131B]"
                  />
                ))}
              </div>
              <div className="hidden lg:col-span-5 lg:block">
                <Skeleton className="h-[380px] w-full rounded-3xl bg-[#15131B]" />
              </div>
            </div>
          ) : tuitions.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-sans text-lg font-medium text-[#F5F1F8]">
                Nothing matched that search.
              </p>
              <p className="mt-1.5 font-sans text-sm text-[#A69BAF]">
                Try broadening your keyword or switching class filters.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
              {/* Left Typographic Stream */}
              <div className="divide-y divide-[#806B88]/15 lg:col-span-7">
                {tuitions.map((tuition, idx) => {
                  const isFocused = activeTuition?._id === tuition._id;
                  const num = String((page - 1) * 8 + idx + 1).padStart(2, "0");

                  return (
                    <div
                      key={tuition._id}
                      onMouseEnter={() => setFocusedId(tuition._id)}
                      onFocus={() => setFocusedId(tuition._id)}
                      className="py-5 first:pt-0 sm:py-6"
                    >
                      <Link
                        href={`/tuitions/${tuition._id}`}
                        className="group flex items-baseline justify-between gap-6"
                      >
                        <div className="flex min-w-0 items-baseline gap-4 sm:gap-6">
                          <span
                            className={`font-mono text-xs transition-colors ${
                              isFocused ? "text-[#C08BFF]" : "text-[#806B88]"
                            }`}
                          >
                            {num}
                          </span>

                          <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C08BFF]">
                              {tuition.subject} · {tuition.classLevel} ·{" "}
                              {tuition.mode || "Online"}
                            </p>
                            <h2
                              className={`mt-1.5 font-sans text-lg font-medium tracking-[-0.02em] transition-colors sm:text-2xl ${
                                isFocused
                                  ? "text-[#F5F1F8]"
                                  : "text-[#C4C0CC] group-hover:text-[#F5F1F8]"
                              }`}
                            >
                              {tuition.title}
                            </h2>
                            <p className="mt-1 font-sans text-xs text-[#806B88]">
                              {tuition.tutorName || "Verified Tutor"}
                              {tuition.daysPerWeek
                                ? ` · ${tuition.daysPerWeek} days/wk`
                                : ""}
                              {tuition.location ? ` · ${tuition.location}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-4">
                          <span className="font-sans text-base font-semibold text-[#F5F1F8] sm:text-lg">
                            ৳{Number(tuition.monthlyFee || 0).toLocaleString()}
                          </span>
                          <ArrowUpRight
                            size={18}
                            className={`transition-transform duration-200 ${
                              isFocused
                                ? "translate-x-0.5 -translate-y-0.5 text-[#C08BFF]"
                                : "text-[#806B88] group-hover:text-[#C08BFF]"
                            }`}
                          />
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {/* Right Active Batch Lens */}
              {activeTuition && (
                <div className="lg:sticky lg:top-24 lg:col-span-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTuition._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="relative overflow-hidden rounded-3xl border border-[#C08BFF]/25 bg-[#15131B]/90 p-7 shadow-[0_30px_90px_rgba(164,93,235,0.14)] sm:p-9"
                    >
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#A45DEB]/20 blur-3xl"
                      />

                      <div className="relative z-10">
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#C08BFF]">
                          Selected Batch · {activeTuition.subject}
                        </p>

                        <h2 className="mt-3 font-sans text-2xl font-medium leading-snug tracking-[-0.025em] text-[#F5F1F8] sm:text-3xl">
                          {activeTuition.title}
                        </h2>

                        <p className="mt-4 font-sans text-sm leading-relaxed text-[#A69BAF]">
                          {activeTuition.description ||
                            "Focused weekly mentoring built around clear fundamentals, consistent practice, and direct tutor support."}
                        </p>

                        <div className="mt-7 grid grid-cols-2 gap-y-4 border-t border-[#806B88]/20 pt-6 text-xs">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[#806B88]">
                              Mentor
                            </p>
                            <p className="mt-1 font-medium text-[#F5F1F8]">
                              {activeTuition.tutorName || "Verified Tutor"}
                            </p>
                          </div>

                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[#806B88]">
                              Monthly Fee
                            </p>
                            <p className="mt-1 text-base font-semibold text-[#C08BFF]">
                              ৳
                              {Number(
                                activeTuition.monthlyFee || 0,
                              ).toLocaleString()}
                              <span className="text-[11px] font-normal text-[#806B88]">
                                /mo
                              </span>
                            </p>
                          </div>

                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[#806B88]">
                              Format &amp; Level
                            </p>
                            <p className="mt-1 font-medium text-[#E2DCE8]">
                              {activeTuition.classLevel} ·{" "}
                              {activeTuition.mode || "Online"}
                            </p>
                          </div>

                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-wider text-[#806B88]">
                              Schedule / Place
                            </p>
                            <p className="mt-1 font-medium text-[#E2DCE8]">
                              {activeTuition.daysPerWeek
                                ? `${activeTuition.daysPerWeek}d/wk`
                                : "Flexible"}
                              {activeTuition.location
                                ? ` · ${activeTuition.location}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        <div className="mt-8">
                          <Link
                            href={`/tuitions/${activeTuition._id}`}
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#A45DEB] px-6 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[#101014] shadow-[0_0_28px_rgba(164,93,235,0.35)] transition-colors hover:bg-[#C08BFF]"
                          >
                            View Batch &amp; Apply
                            <ArrowUpRight size={15} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-14 flex items-center justify-between border-t border-[#806B88]/15 pt-6 font-mono text-xs text-[#A69BAF]">
              <button
                type="button"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="transition-colors hover:text-[#F5F1F8] disabled:opacity-30"
              >
                ← Previous
              </button>

              <span className="uppercase tracking-[0.18em]">
                {page} / {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="transition-colors hover:text-[#F5F1F8] disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </div>
        <div
          aria-hidden="true"
          className="mt-16 flex items-center gap-4 py-4 sm:mt-20"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#806B88]/25 to-[#806B88]/25" />
          <span className="h-2 w-2 rounded-full bg-[#C08BFF] shadow-[0_0_12px_rgba(192,139,255,0.75)]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#806B88]/25 to-[#806B88]/25" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default function BrowseTuitionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#101014] text-sm text-[#A69BAF]">
          Loading...
        </div>
      }
    >
      <BrowseTuitionsContent />
    </Suspense>
  );
}
