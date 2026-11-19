"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold text-destructive mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      <div className="flex gap-4">
        <button onClick={() => reset()} className={buttonVariants()}>
          Try Again
        </button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}