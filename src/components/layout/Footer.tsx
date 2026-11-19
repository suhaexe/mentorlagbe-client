"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">
            Mentor<span className="text-primary">Lagbe</span>
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Smart tuition & mentorship platform connecting verified tutors with eager students.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/tuitions">Browse Tuitions</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>support@mentorlagbe.com</li>
            <li>+880 1700 000000</li>
            <li>Dhaka, Bangladesh</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Follow Us</h4>
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Hardcoded year — no errors, renders perfectly */}
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2024 MentorLagbe. All rights reserved.
      </div>
    </footer>
  );
}