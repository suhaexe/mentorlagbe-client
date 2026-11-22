import Link from "next/link";

export function StayConnected() {
  return (
    <section
      aria-labelledby="stay-connected-heading"
      className="relative w-full overflow-hidden bg-[#101014] text-[#F5F1F8]"
    >

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-4 pt-12 sm:px-8 sm:pt-14 lg:px-10">
        <div className="grid gap-7 pb-8 sm:pb-9 lg:grid-cols-[minmax(0,1fr)_minmax(230px,0.42fr)] lg:items-end lg:gap-12">
          <div className="max-w-2xl">
            <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C08BFF]">
              MentorLagbe / Stay connected
            </p>

            <h2
              id="stay-connected-heading"
              className="font-heading text-[clamp(2.35rem,5vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]"
            >
              Every journey
              <span className="block text-[#C08BFF]">leads somewhere.</span>
            </h2>

            <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-[#A69BAF] sm:mt-5 sm:text-base sm:leading-7">
              Connecting students with verified tutors and meaningful learning
              opportunities, one step at a time.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end lg:pb-1">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A69BAF]">
              Ready to find your next step?
            </p>
            <Link
              href="/tuitions"
              className="group inline-flex min-h-11 items-center gap-3 border-b border-[#C08BFF]/55 pb-2 font-sans text-sm font-semibold text-[#F5F1F8] transition-colors hover:text-[#C08BFF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08BFF]"
            >
              Explore tuitions
              <span
                aria-hidden="true"
                className="grid size-7 place-items-center rounded-full border border-[#806B88]/30 text-[#C08BFF] transition duration-200 group-hover:translate-x-1 group-hover:border-[#C08BFF] group-hover:bg-[#A45DEB]/15"
              >
                ↗
              </span>
            </Link>
          </div>
        </div>

        <div className="py-4 sm:py-6" aria-hidden="true">
          <svg
            viewBox="0 0 1200 64"
            preserveAspectRatio="none"
            className="h-9 w-full sm:h-11"
            fill="none"
          >
            <path
              d="M0 48H1200"
              stroke="#C08BFF"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
            <path
              d="M28 48C250 48 350 12 600 12S950 48 1172 48"
              stroke="#C08BFF"
              strokeOpacity="0.58"
              strokeWidth="1.35"
            />
            <path
              d="M210 48V34M390 48V21M600 48V12M810 48V21M990 48V34"
              stroke="#C08BFF"
              strokeOpacity="0.28"
              strokeWidth="1"
            />
            <circle cx="28" cy="48" r="2.5" fill="#C08BFF" />
            <circle cx="600" cy="12" r="3" fill="#C08BFF" />
            <circle cx="1172" cy="48" r="2.5" fill="#C08BFF" />
          </svg>
        </div>
      </div>
    </section>
  );
}