import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[#0E0D12] px-5 py-12 text-[#F5F1F8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A45DEB]/15 blur-[110px] sm:h-[440px] sm:w-[440px]"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-[160px] font-bold leading-none tracking-[-0.06em] text-[#F5F1F8]/[0.025] sm:text-[260px]"
      >
        404
      </span>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[#806B88]/25 bg-[#15131B]/80 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-md sm:p-11">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#C08BFF]/25 bg-[#A45DEB]/10 px-3.5 py-1">
          <span className="size-1.5 rounded-full bg-[#C08BFF]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C08BFF]">
            Error 404
          </span>
        </div>

        <h1 className="mt-5 font-sans text-3xl font-medium tracking-[-0.025em] text-[#F5F1F8] sm:text-4xl">
          This page{" "}
          <span className="font-heading font-normal italic text-[#C08BFF]">
            doesn&apos;t exist.
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-sm font-sans text-sm leading-6 text-[#A69BAF]">
          The link you followed may be broken, or the page has been moved to a
          new chapter.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#A45DEB] px-6 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#101014] shadow-[0_0_28px_rgba(164,93,235,0.32)] transition-colors hover:bg-[#C08BFF] sm:w-auto"
          >
            Back to Home
          </Link>

          <Link
            href="/tuitions"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#806B88]/30 bg-[#1B1823] px-6 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#F5F1F8] transition-colors hover:border-[#C08BFF]/50 hover:text-[#C08BFF] sm:w-auto"
          >
            Browse Tuitions
          </Link>
        </div>
      </div>
    </main>
  );
}