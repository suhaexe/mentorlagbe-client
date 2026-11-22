"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, ChevronDown, MapPin } from "lucide-react";
import type { FeaturedTuition } from "./featured";

const formatFee = (tuition: FeaturedTuition) =>
  `৳${tuition.monthlyFee.toLocaleString("en-US")}`;

const placeOf = (tuition: FeaturedTuition) =>
  tuition.mode === "Online" ? "Online class" : tuition.location || "Location on request";

const Duotone = ({ tuition, sizes }: { tuition: FeaturedTuition; sizes: string }) => (
  <>
    {tuition.bannerImage ? (
      <Image
        src={tuition.bannerImage}
        alt=""
        fill
        sizes={sizes}
        className="object-cover grayscale contrast-110"
      />
    ) : null}
    <span aria-hidden="true" className="absolute inset-0 bg-[#7c3aed]/65 mix-blend-color" />
  </>
);

export const TuitionIndex = ({ tuitions }: { tuitions: FeaturedTuition[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  const active = tuitions[activeIndex] ?? tuitions[0];
  if (!active) return null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <ul className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7">
        {tuitions.map((tuition, i) => {
          const isActive = i === activeIndex;
          const isOpen = openId === tuition._id;
          const online = tuition.mode === "Online";

          return (
            <li
              key={tuition._id}
              onMouseEnter={() => setActiveIndex(i)}
              className="relative py-5 sm:py-6"
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1/2 hidden h-10 w-1 -translate-y-1/2 rounded-full bg-[#C08BFF] transition-opacity duration-300 lg:block ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />

              <Link
                href={`/tuitions/${tuition._id}`}
                onFocus={() => setActiveIndex(i)}
                className="group flex flex-col gap-3.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#C08BFF] sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-x-6 sm:gap-y-0 lg:pl-6"
              >
                {/* Top row on mobile: index + mode/new badge + arrow */}
                <div className="flex items-center justify-between gap-3 sm:contents">
                  <span
                    className={`font-mono text-xs tracking-[0.2em] transition-colors ${
                      isActive ? "text-[#C08BFF]" : "text-[#806B88]"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-2 sm:hidden">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A69BAF]">
                      <span
                        className={`size-1.5 rounded-full ${online ? "bg-[#5bc49a]" : "bg-[#C08BFF]"}`}
                        aria-hidden="true"
                      />
                      {tuition.mode}
                    </span>
                    {tuition.isNew ? (
                      <span className="rounded-full bg-[#A45DEB] px-2 py-0.5 font-sans text-[10px] font-semibold text-[#101014]">
                        New
                      </span>
                    ) : null}
                  </div>

                  <span
                    aria-hidden="true"
                    className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-300 sm:order-3 sm:size-10 ${
                      isActive
                        ? "border-[#C08BFF] bg-[#A45DEB] text-[#101014] shadow-[0_0_24px_rgba(164,93,235,0.5)]"
                        : "border-[#806B88]/35 text-[#A69BAF] group-hover:border-[#C08BFF]/60 group-hover:text-[#F5F1F8]"
                    }`}
                  >
                    <ArrowUpRight size={17} />
                  </span>
                </div>

                {/* Title + subject/class metadata */}
                <span className="block min-w-0 sm:order-1">
                  <h3
                    className={`font-sans text-lg font-medium leading-snug tracking-[-0.02em] transition-colors sm:text-2xl ${
                      isActive ? "text-[#F5F1F8]" : "text-[#A69BAF] group-hover:text-[#F5F1F8]"
                    }`}
                  >
                    {tuition.title}
                  </h3>

                  <span className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A69BAF]">
                    <span>{tuition.subject}</span>
                    <span>·</span>
                    <span>{tuition.classLevel}</span>
                    <span className="hidden items-center gap-1.5 sm:inline-flex">
                      <span>·</span>
                      <span
                        className={`size-1.5 rounded-full ${online ? "bg-[#5bc49a]" : "bg-[#C08BFF]"}`}
                        aria-hidden="true"
                      />
                      {tuition.mode}
                    </span>
                    {tuition.isNew ? (
                      <span className="hidden rounded-full bg-[#A45DEB] px-2 py-0.5 font-sans text-[10px] font-semibold normal-case tracking-normal text-[#101014] sm:inline-block">
                        New
                      </span>
                    ) : null}
                  </span>
                </span>

                {/* Fee + schedule */}
                <span className="flex items-baseline justify-between border-t border-white/5 pt-3 font-sans sm:order-2 sm:block sm:border-t-0 sm:pt-0 sm:text-right">
                  <span
                    className={`text-lg font-semibold tracking-tight transition-colors sm:block sm:text-xl ${
                      isActive ? "text-[#F5F1F8]" : "text-[#C4C0CC]"
                    }`}
                  >
                    {formatFee(tuition)}
                  </span>
                  <span className="text-xs text-[#A69BAF] sm:block sm:text-[11px]">
                    / month · {tuition.daysPerWeek}d/wk
                  </span>
                </span>
              </Link>

              <div className="mt-3 flex items-center justify-between lg:hidden">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : tuition._id)}
                  className="inline-flex items-center gap-1 font-sans text-xs text-[#C08BFF]"
                >
                  {isOpen ? "Hide details" : "Show details"}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {isOpen ? (
                <div className="mt-3 space-y-3 rounded-xl border border-[#806B88]/25 bg-[#15131B] p-4 font-sans text-sm text-[#C4C0CC] lg:hidden">
                  <p className="line-clamp-3 leading-6">{tuition.description}</p>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex items-center gap-2">
                      <span
                        className="grid size-5 place-items-center rounded-full bg-[#A45DEB]/20 text-[10px] font-semibold text-[#C08BFF]"
                        aria-hidden="true"
                      >
                        {tuition.tutorName.charAt(0)}
                      </span>
                      {tuition.tutorName}
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin size={13} className="text-[#A69BAF]" aria-hidden="true" />
                      {placeOf(tuition)}
                    </li>
                    <li className="flex items-center gap-2">
                      <CalendarDays size={13} className="text-[#A69BAF]" aria-hidden="true" />
                      {tuition.daysPerWeek} days a week
                    </li>
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="hidden lg:col-span-5 lg:block">
        <div className="relative mx-auto flex min-h-[640px] max-w-[460px] flex-col overflow-hidden rounded-t-full rounded-b-3xl border border-[#C08BFF]/30 bg-[#15131B] shadow-[0_25px_80px_rgba(164,93,235,0.18)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex min-h-[640px] flex-1 flex-col"
            >
              <div className="relative h-[300px] shrink-0 bg-[#1c1230]">
                <Duotone tuition={active} sizes="460px" />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#15131B] via-[#15131B]/30 to-transparent"
                />

                <span className="absolute inset-x-8 bottom-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#101014]/60 px-3 py-1 font-sans text-xs text-[#F5F1F8] backdrop-blur-md">
                    <span
                      className={`size-1.5 rounded-full ${
                        active.mode === "Online" ? "bg-[#5bc49a]" : "bg-[#C08BFF]"
                      }`}
                      aria-hidden="true"
                    />
                    {active.mode}
                  </span>
                  {active.isNew ? (
                    <span className="rounded-full bg-[#A45DEB] px-3 py-1 font-sans text-xs font-semibold text-[#101014]">
                      New
                    </span>
                  ) : null}
                </span>
              </div>

              <div className="flex flex-1 flex-col px-8 pb-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C08BFF]">
                  {active.subject} · {active.classLevel}
                </p>

                <h3 className="mt-3 line-clamp-2 font-sans text-2xl font-medium leading-snug tracking-[-0.025em] text-[#F5F1F8]">
                  {active.title}
                </h3>

                <p className="mt-3 line-clamp-3 font-sans text-sm leading-6 text-[#A69BAF]">
                  {active.description}
                </p>

                <ul className="mt-5 space-y-2 font-sans text-sm text-[#C4C0CC]">
                  <li className="flex items-center gap-2.5">
                    <span
                      className="grid size-5 place-items-center rounded-full bg-[#A45DEB]/20 text-[10px] font-semibold text-[#C08BFF]"
                      aria-hidden="true"
                    >
                      {active.tutorName.charAt(0)}
                    </span>
                    {active.tutorName}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-[#A69BAF]" aria-hidden="true" />
                    {placeOf(active)}
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CalendarDays size={14} className="text-[#A69BAF]" aria-hidden="true" />
                    {active.daysPerWeek} days a week
                  </li>
                </ul>

                <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <p className="font-sans">
                    <span className="text-2xl font-semibold tracking-[-0.02em] text-[#F5F1F8]">
                      {formatFee(active)}
                    </span>
                    <span className="ml-1 text-xs text-[#A69BAF]">/ month</span>
                  </p>

                  <Link
                    href={`/tuitions/${active._id}`}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#A45DEB] px-5 font-sans text-sm font-semibold text-[#101014] transition-colors hover:bg-[#C08BFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F1E6FF]"
                  >
                    View &amp; apply
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};