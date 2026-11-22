"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { Container } from "./Container";

const MAX_TILT_X = 5;
const MAX_TILT_Y = 7;
const SMOOTHING = 0.08;
const QUICK_SUBJECTS = ["Physics", "Math", "English", "Biology"];
const RISE = "0.5em";
const ARCH_X = 0.58;
const ARCH_Y = 0.2;

type Word = { text: string; outer: string; inner: string };

const FIND: Word = {
  text: "Find your",
  outer: "",
  inner: "font-sans font-semibold text-[#F5F1F8]",
};

const NEXT: Word = {
  text: "next",
  outer: "text-[1.08em] drop-shadow-[0_2px_16px_rgba(40,25,80,0.6)]",
  inner:
    "font-heading font-normal italic tracking-[-0.025em] text-[#E9DCFF]/35 [-webkit-text-stroke:1.5px_#FFFFFF] [text-shadow:none] sm:[-webkit-text-stroke:2px_#FFFFFF] lg:text-[#E9DCFF]/25 lg:[-webkit-text-stroke:2.5px_#FFFFFF]",
};

const CHAPTER: Word = {
  text: "chapter.",
  outer: "text-[1.18em] drop-shadow-[0_0_32px_rgba(192,139,255,0.38)]",
  inner:
    "font-heading font-normal italic tracking-[-0.025em] pr-[0.1em] bg-gradient-to-b from-[#F4EBFF] via-[#E2CCFF] to-[#C08BFF] lg:via-[#C08BFF] lg:to-[#9A55EE] bg-clip-text text-transparent [text-shadow:none]",
};

const FADE_Y =
  "linear-gradient(to bottom, transparent 0%, #000 5%, #000 80%, transparent 100%)";
const FADE_X =
  "linear-gradient(to right, transparent 0%, #000 10%, #000 90%, transparent 100%)";
const IMAGE_FADE: CSSProperties = {
  WebkitMaskImage: `${FADE_Y}, ${FADE_X}`,
  maskImage: `${FADE_Y}, ${FADE_X}`,
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

function Motes() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Mote = {
      x: number;
      y: number;
      vy: number;
      sway: number;
      phase: number;
      r: number;
      age: number;
      max: number;
    };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let visible = true;
    const start = performance.now();
    let last = start;

    const make = (randomAge: boolean): Mote => {
      const max = rand(6, 12);
      return {
        x: rand(0, w),
        y: rand(h * 0.25, h * 0.95),
        vy: rand(6, 18),
        sway: rand(4, 14),
        phase: rand(0, Math.PI * 2),
        r: rand(0.5, 1.6),
        max,
        age: randomAge ? rand(0, max) : 0,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      motes = Array.from({ length: w < 500 ? 28 : 46 }, () => make(true));
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const intro = Math.min(1, Math.max(0, (now - start - 1200) / 2200));

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      const ax = w * ARCH_X;
      const ay = h * ARCH_Y;

      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.age += dt;
        m.y -= m.vy * dt;
        if (m.age >= m.max || m.y < 0) {
          motes[i] = make(false);
          continue;
        }

        const fade = Math.sin(Math.PI * (m.age / m.max));
        const x = m.x + Math.sin(m.phase + m.age * 0.6) * m.sway;
        const dist = Math.hypot(x - ax, (m.y - ay) * 0.8) / (w * 0.75);
        const nearArch = Math.max(0.18, 1 - dist);
        const a = fade * nearArch * 0.75 * intro;
        if (a < 0.01) continue;

        ctx.fillStyle = `rgba(214,184,255,${a})`;
        ctx.beginPath();
        ctx.arc(x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(164,93,235,${a * 0.22})`;
        ctx.beginPath();
        ctx.arc(x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen"
    />
  );
}

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const doorwayY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const artworkOpacity = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    [1, 0.92, 0.18],
  );
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.65, 0.95, 1],
  );
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.style.setProperty("--rx", "0");
      stage.style.setProperty("--ry", "0");
      return;
    }

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;
    let sway = 0;

    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      target.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      target.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      if (!finePointer) {
        sway += 0.008;
        target.x = Math.sin(sway) * 0.35;
        target.y = Math.cos(sway * 0.7) * 0.25;
      }

      current.x += (target.x - current.x) * SMOOTHING;
      current.y += (target.y - current.y) * SMOOTHING;

      stage.style.setProperty("--rx", current.x.toFixed(4));
      stage.style.setProperty("--ry", current.y.toFixed(4));

      frame = requestAnimationFrame(tick);
    };

    if (finePointer) {
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerleave", onLeave);
    }

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const renderWord = (word: Word, order: number) => (
    <span key={word.text} className={`block ${word.outer}`}>
      <motion.span
        className={`block ${word.inner}`}
        initial={
          reduceMotion ? false : { opacity: 0, y: 56, filter: "blur(12px)" }
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.9,
          delay: 0.15 + order * 0.14,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      >
        {word.text}{" "}
      </motion.span>
    </span>
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-10 min-h-[100dvh] w-full overflow-x-clip bg-[#101014] text-[#F5F1F8]"
    >
      <div
        ref={stageRef}
        className="relative flex min-h-[100dvh] w-full flex-col pb-36 pt-20 sm:pb-40 sm:pt-24"
        style={
          {
            perspective: "1300px",
            touchAction: "pan-y",
            "--rx": 0,
            "--ry": 0,
          } as CSSProperties
        }
      >
        {/* Silver-Gray Studio Sweep Starting High Into Navbar & Fading at Bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(180deg, #16161C 0%, #7C7A86 6%, #A6A4B1 22%, #B4B2BE 44%, #A5A3B0 60%, #4A4854 76%, #18171E 90%, #101014 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
          style={{
            background:
              "radial-gradient(ellipse 80% 52% at 54% 44%, rgba(245, 243, 255, 0.26) 0%, rgba(192, 139, 255, 0.11) 48%, transparent 78%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, #16161C 0%, #2E2D38 8%, #4B4A58 22%, #5A5868 42%, #4C4A59 58%, #2B2A34 74%, #17161C 88%, #101014 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 lg:hidden"
          style={{
            background:
              "radial-gradient(ellipse 90% 40% at 50% 64%, rgba(192, 139, 255, 0.2) 0%, rgba(150, 120, 230, 0.08) 52%, transparent 78%)",
          }}
        />

        {/* Centerpiece Artwork Stage */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center overflow-hidden px-3 pb-24 pt-20 sm:px-8 sm:pb-28 lg:items-center lg:px-14 lg:pb-24 lg:pt-16"
        >
          <motion.div
            style={{
              y: doorwayY,
              opacity: artworkOpacity,
            }}
            className="relative h-full max-h-[52dvh] w-full max-w-[1280px] will-change-transform sm:max-h-[58dvh] lg:max-h-[78dvh]"
          >
            <div
              className="relative mx-auto aspect-[4/5] h-full will-change-transform"
              style={{
                transform: `rotateX(calc(var(--ry) * -${MAX_TILT_X}deg)) rotateY(calc(var(--rx) * ${MAX_TILT_Y}deg))`,
              }}
            >
              <div className="absolute -bottom-[2%] left-1/2 h-[10%] w-[105%] -translate-x-1/2 rounded-[50%] bg-[#A45DEB]/35 blur-3xl" />

              <div className="relative h-full w-full max-lg:[-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_9%,#000_80%,transparent_100%)] max-lg:[mask-image:linear-gradient(to_bottom,transparent_0%,#000_9%,#000_80%,transparent_100%)]">
                <div className="relative h-full w-full" style={IMAGE_FADE}>
                  <Image
                    src="/images/hero.png"
                    alt="A monumental staircase rising toward an illuminated violet archway"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 640px"
                    className="object-contain object-center brightness-75 contrast-115 drop-shadow-[0_0_65px_rgba(164,93,235,0.45)]"
                  />

                  <motion.div
                    style={{ opacity: glowOpacity }}
                    className="pointer-events-none absolute inset-0 mix-blend-screen will-change-opacity"
                  >
                    <motion.div
                      className="h-full w-full"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 1.8,
                        delay: 0.7,
                        ease: "easeOut",
                      }}
                    >
                      <motion.div
                        className="h-full w-full"
                        animate={
                          reduceMotion ? undefined : { opacity: [1, 0.75, 1] }
                        }
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2.5,
                        }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "radial-gradient(ellipse 65% 80% at 60% 35%, rgba(255,255,255,0.28) 0%, rgba(192,139,255,0.14) 42%, transparent 80%)",
                            transform:
                              "translate3d(calc(var(--rx) * -18px), calc(var(--ry) * -18px), 0)",
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  <Motes />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Editorial Headline & Subcopy */}
        <Container className="relative z-20 flex flex-1 flex-col justify-start pt-4 sm:pt-6 lg:justify-center lg:pt-8">
          <motion.div style={{ y: headlineY, opacity: headlineOpacity }}>
            <h1
              className="flex flex-col items-start text-[clamp(3.25rem,14.5vw,4rem)] leading-[0.95] tracking-[-0.055em] [text-shadow:0_0_48px_rgba(16,16,20,0.85)] sm:text-[clamp(4.25rem,8.5vw,5.75rem)] lg:flex-row lg:items-end lg:justify-between lg:text-[clamp(3.25rem,6.6vw,7.25rem)]"
              style={{ "--rise": RISE } as CSSProperties}
            >
              {renderWord(FIND, 0)}

              <span className="relative flex flex-col items-start lg:items-end lg:[transform:translateY(calc(var(--rise)*-1))]">
                {renderWord(NEXT, 1)}
                {renderWord(CHAPTER, 2)}

                <span
                  aria-hidden="true"
                  className="absolute right-1 top-full mt-5 hidden items-center gap-3 whitespace-nowrap font-mono text-[11px] font-normal not-italic uppercase leading-none tracking-[0.22em] text-white [text-shadow:0_1px_12px_rgba(16,16,20,0.95)] lg:flex"
                >
                  <span className="h-px w-14 bg-[#9E99AD]/70" />
                  Subject · Class · Area
                </span>
              </span>
            </h1>

            <p className="mt-4 max-w-[280px] text-balance font-sans text-sm leading-relaxed text-[#ECE8F4] [text-shadow:0_1px_14px_rgba(16,16,20,0.95)] sm:mt-6 sm:max-w-[440px] sm:text-base sm:text-[#E2DEEA] lg:mt-8 lg:max-w-[420px] lg:text-[#C4C0CC]">
              <span className="sm:hidden">
                Explore tuition opportunities and find the support that fits
                your goals.
              </span>
              <span className="hidden sm:inline">
                The right guidance can make all the difference. Explore tuition
                opportunities and find the support that fits your goals.
              </span>
            </p>
          </motion.div>
        </Container>

        {/* Scroll Indicator Rail */}
        <motion.div
          aria-hidden="true"
          style={{
            opacity: headlineOpacity,
            right: "max(2.5rem, calc((100% - 1200px) / 2))",
          }}
          className="pointer-events-none absolute bottom-14 z-20 hidden flex-col items-center gap-4 lg:flex"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#A69BAF] [writing-mode:vertical-rl]">
            Scroll
          </span>
          <span className="h-14 w-px animate-pulse bg-gradient-to-b from-[#C08BFF] to-transparent" />
        </motion.div>

        <div className="absolute inset-x-0 bottom-5 z-30 mx-auto w-[calc(100%-2rem)] max-w-[640px] sm:bottom-6 sm:w-[calc(100%-3rem)]">
          <div className="mb-2.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {QUICK_SUBJECTS.map((subject) => (
              <Link
                key={subject}
                href={`/tuitions?search=${encodeURIComponent(subject)}`}
                className="rounded-full border border-[#806B88]/25 bg-[#15131B]/75 px-3 py-1.5 font-sans text-xs text-[#C4C0CC] backdrop-blur-md transition-colors hover:border-[#C08BFF]/60 hover:text-[#F5F1F8] sm:px-3.5"
              >
                {subject}
              </Link>
            ))}

            <Link
              href="/tuitions"
              className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs text-[#C08BFF] transition-colors hover:text-[#F5F1F8]"
            >
              Browse all
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <form
            action="/tuitions"
            method="GET"
            className="flex items-center gap-2 rounded-full border border-[#C08BFF]/35 bg-[#15131B]/85 p-1.5 shadow-[0_8px_32px_rgba(164,93,235,0.25)] backdrop-blur-xl sm:p-2"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search by subject or tuition title
            </label>

            <div className="flex min-h-10 min-w-0 flex-1 items-center gap-3 px-3.5 sm:min-h-11 sm:px-4">
              <Search
                size={18}
                className="shrink-0 text-[#C08BFF]"
                aria-hidden="true"
              />

              <input
                id="hero-search"
                type="search"
                name="search"
                placeholder="Subject, class or area"
                className="h-full w-full min-w-0 bg-transparent font-sans text-sm text-[#F5F1F8] text-ellipsis outline-none placeholder:text-[#A69BAF]"
              />
            </div>

            <button
              type="submit"
              className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[#A45DEB] px-5 font-sans text-sm font-semibold text-[#101014] transition-colors hover:bg-[#C08BFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C08BFF] sm:min-h-11 sm:px-6"
            >
              Search
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
