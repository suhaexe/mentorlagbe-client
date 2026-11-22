import { getFeaturedTuitions } from "./featured";
import { TuitionIndex } from "./TuitionIndex";
import { Reveal } from "./Reveal";
import { FeaturedEmpty, FeaturedShell } from "./FeaturedShell";

export async function FeaturedTuitions() {
  const tuitions = await getFeaturedTuitions();

  if (tuitions.length === 0) {
    return (
      <FeaturedShell>
        <FeaturedEmpty />
      </FeaturedShell>
    );
  }

  return (
    <FeaturedShell>
      <Reveal>
        <TuitionIndex tuitions={tuitions} />
      </Reveal>
    </FeaturedShell>
  );
}

export function FeaturedTuitionsSkeleton() {
  return (
    <FeaturedShell>
      <div
        className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12"
        aria-hidden="true"
      >
        <ul className="divide-y divide-white/10 border-y border-white/10 lg:col-span-7">
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className="animate-pulse py-6">
              <div className="flex items-center justify-between gap-8">
                <div className="space-y-3">
                  <div className="h-6 w-64 max-w-full rounded-full bg-white/[0.07]" />
                  <div className="h-3 w-40 rounded-full bg-white/[0.05]" />
                </div>
                <div className="h-8 w-20 rounded-full bg-white/[0.05]" />
              </div>
            </li>
          ))}
        </ul>
        <div className="hidden animate-pulse rounded-t-full rounded-b-3xl border border-white/10 bg-white/[0.03] lg:col-span-5 lg:block lg:min-h-[640px]" />
      </div>
    </FeaturedShell>
  );
}
