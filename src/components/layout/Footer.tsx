import Link from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

const CURRENT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="relative z-10 w-full overflow-x-clip bg-transparent text-[#F5F1F8]">
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-7 pt-6 sm:px-8 sm:pt-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 border-b border-[#806B88]/20 pb-8 md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-10 lg:gap-8">
          {/* Brand */}
          <div className="mx-auto flex max-w-xs flex-col items-center text-center md:mx-0 md:items-start md:text-left">
            <Link
              href="/"
              aria-label="MentorLagbe home"
              className="inline-block font-heading text-2xl font-bold tracking-[-0.06em] text-[#F5F1F8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08BFF]"
            >
              Mentor<span className="text-[#C08BFF]">Lagbe</span>
              <span className="text-[#C08BFF]">.</span>
            </Link>

            <p className="mt-3 hidden font-sans text-sm leading-6 text-[#A69BAF] sm:block">
              A smarter way to find the right tutor and take your next step in
              learning.
            </p>

            <div className="mt-4 sm:mt-5">
              <p className="mb-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A69BAF]">
                Follow MentorLagbe
              </p>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MentorLagbe on X"
                className="inline-flex size-9 items-center justify-center rounded-xl border border-[#806B88]/30 bg-[#15131B] text-[#F5F1F8] transition-colors hover:border-[#C08BFF] hover:bg-[#A45DEB]/15 hover:text-[#C08BFF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08BFF]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 2 columns on mobile; 3-column layout from md up */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:contents lg:justify-center">
            <nav
              aria-label="Footer navigation"
              className="md:justify-self-center"
            >
              <h3 className="mb-3.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#F5F1F8] md:text-center lg:text-center">
                Explore
              </h3>
              <ul className="space-y-2.5 text-left md:text-center lg:text-center">
                {footerLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-sans text-sm text-[#A69BAF] transition-colors hover:text-[#C08BFF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08BFF]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="md:justify-self-end lg:text-right justify-self-end text-right">
              <h3 className="mb-3.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#F5F1F8] md:text-right">
                Get in touch
              </h3>
              <address className="not-italic">
                <ul className="space-y-2.5 text-right font-sans text-xs text-[#A69BAF] sm:text-sm md:text-right">
                  <li>
                    <a
                      href="mailto:support@mentorlagbe.com"
                      className="transition-colors hover:text-[#C08BFF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08BFF]"
                    >
                      support@mentorlagbe.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+8801700000000"
                      className="transition-colors hover:text-[#C08BFF] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C08BFF]"
                    >
                      +880 1700 000000
                    </a>
                  </li>
                  <li>Dhaka, Bangladesh</li>
                </ul>
              </address>
            </div>
          </div>
        </div>

        {/* MENTORLAGBE watermark + centered bottom copyright */}
        <div className="pt-6">
          <div
            aria-hidden="true"
            className="pointer-events-none select-none overflow-hidden"
          >
            <svg
              viewBox="0 0 1200 128"
              className="block h-auto w-full"
              role="presentation"
            >
              <text
                x="0"
                y="104"
                textLength="1200"
                lengthAdjust="spacingAndGlyphs"
                className="fill-[#F5F1F8]/[0.035] font-heading text-[128px] font-bold uppercase"
              >
                MENTORLAGBE
              </text>
            </svg>
          </div>

          <div className="mt-4 flex flex-col items-center gap-1 border-t border-[#806B88]/20 pt-4 text-center text-xs text-[#A69BAF] sm:flex-row sm:justify-between sm:text-left">
            <p>© {CURRENT_YEAR} MentorLagbe. All rights reserved.</p>
            <p>Built to make finding the right guidance easier.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
