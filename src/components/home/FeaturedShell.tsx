import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

export const FeaturedShell = ({ children }: { children: ReactNode }) => (
  <section
    id="featured-tuitions"
    className="relative overflow-x-clip bg-[#101014] pb-20 pt-16 text-[#F5F1F8] sm:pb-24 sm:pt-20 lg:pb-28"
  >
    <Container className="relative">
      <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[640px]">
          <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.055em]">
            <span className="block font-sans font-semibold text-[#F5F1F8]">
              Freshly
            </span>
            <span className="mt-1 block bg-gradient-to-b from-[#F4EBFF] via-[#C08BFF] to-[#9A55EE] bg-clip-text pr-[0.1em] font-heading font-normal italic tracking-[-0.025em] text-transparent">
              verified.
            </span>
          </h2>
          <p className="mt-6 max-w-[460px] text-balance font-sans text-base leading-8 text-[#C4C0CC] sm:text-lg">
            The newest tuitions our admins have approved. Open one, check the
            details, and apply.
          </p>
        </div>

        <Link
          href="/tuitions"
          className="group inline-flex shrink-0 items-center gap-2 self-start font-sans text-sm text-[#C08BFF] transition-colors hover:text-[#F5F1F8] md:self-auto"
        >
          Browse all tuitions
          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </Reveal>

      <div className="mt-14 lg:mt-16">{children}</div>
    </Container>
  </section>
);

export const FeaturedEmpty = () => (
  <div className="rounded-2xl border border-dashed border-[#806B88]/40 p-10 text-center">
    <p className="font-heading text-3xl italic">No tuitions to show yet.</p>
    <p className="mx-auto mt-3 max-w-[420px] text-balance font-sans text-sm leading-7 text-[#A69BAF]">
      New listings appear here as soon as an admin approves them. Check back
      soon, or browse everything that is live.
    </p>
    <Link
      href="/tuitions"
      className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#A45DEB] px-6 font-sans text-sm font-semibold text-[#101014] transition-colors hover:bg-[#C08BFF]"
    >
      Browse all tuitions
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  </div>
);
