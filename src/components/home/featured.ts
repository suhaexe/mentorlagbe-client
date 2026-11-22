export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location?: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

export type FeaturedTuition = Tuition & { isNew: boolean };

const NEW_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function isPrerenderAbort(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { name?: string; digest?: string };
  return (
    err.name === "AbortError" ||
    err.name === "TimeoutError" ||
    err.digest === "HANGING_PROMISE_REJECTION"
  );
}

export const getFeaturedTuitions = async (): Promise<FeaturedTuition[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tuitions/featured`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      },
    );

    if (!res.ok) {
      console.error(
        `Featured tuitions request failed with status ${res.status}`,
      );
      return [];
    }

    const data: Tuition[] = await res.json();
    const now = Date.now();

    return data.map((tuition) => ({
      ...tuition,
      isNew: now - new Date(tuition.createdAt).getTime() < NEW_WINDOW_MS,
    }));
  } catch (error) {
    if (!isPrerenderAbort(error)) {
      console.error("Featured tuitions request failed:", error);
    }
    return [];
  }
};