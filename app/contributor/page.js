"use client";

import { useEffect, useRef, useState } from "react";

/**
 * StockHub — Contributor landing page
 * Route: /contributor
 *
 * Design notes:
 * - Palette: ink #101828, paper #f7f8fb, brand-500/700 (existing tailwind
 *   theme), gold #e0a13b as the "earnings" accent.
 * - Display type: Space Grotesk. Body: Inter. Numbers: IBM Plex Mono.
 *   Add these via next/font or a <link> in your root layout — see bottom
 *   of file for the snippet.
 * - Signature element: the scrolling "royalty ticker" — leans into the
 *   Stock/ticker pun, and doesn't exist on Adobe's page.
 */

const TICKER_ITEMS = [
  { label: "Photo licensed", tag: "Editorial", amount: "+$2.40" },
  { label: "Video clip sold", tag: "4K Footage", amount: "+$18.00" },
  { label: "Illustration sold", tag: "Vector Pack", amount: "+$6.75" },
  { label: "Photo licensed", tag: "Extended", amount: "+$34.00" },
  { label: "Audio track sold", tag: "Loop", amount: "+$4.20" },
  { label: "Illustration sold", tag: "Single Use", amount: "+$1.90" },
];

const STEPS = [
  {
    n: "01",
    title: "Upload your work",
    body: "Drag in photos, footage, illustrations, or vectors. Add a title, category, and a few keywords — that's the whole form.",
  },
  {
    n: "02",
    title: "We review it",
    body: "Every submission gets checked for quality and licensing before it goes live. Most reviews clear in a few days.",
  },
  {
    n: "03",
    title: "You get paid",
    body: "Each time a buyer licenses your work, your share lands in your balance. Cash out once you hit the payout threshold.",
  },
];

const FAQS = [
  {
    q: "What can I contribute?",
    a: "Photos, video clips, illustrations, and vector graphics. If you're not sure a piece fits, submit it — review will tell you.",
  },
  {
    q: "Do I keep ownership of my work?",
    a: "Yes. You're licensing your work to buyers through StockHub, not signing it away. You can remove a submission at any time.",
  },
  {
    q: "How much do I earn per sale?",
    a: "Your share depends on the license type a buyer picks. Standard licenses pay a flat rate; extended licenses pay more.",
  },
  {
    q: "When do I get paid?",
    a: "Earnings accumulate in your contributor balance. Once you cross the payout threshold, you can withdraw on your schedule.",
  },
];

function RoyaltyTicker() {
  const trackRef = useRef(null);
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1526]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0d1526] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0d1526] to-transparent z-10" />
      <div
        ref={trackRef}
        className="flex w-max animate-[ticker_28s_linear_infinite] gap-6 py-4 px-6"
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-3 whitespace-nowrap"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e0a13b]" />
            <span className="font-[Inter] text-sm text-white/70">
              {item.label}
            </span>
            <span className="font-[Inter] text-xs uppercase tracking-wide text-white/35">
              {item.tag}
            </span>
            <span className="font-[IBM_Plex_Mono] text-sm font-medium text-[#e0a13b]">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          div[class*="animate-"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-[#101828]/10">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-[Space_Grotesk] text-base font-medium text-[#101828]">
          {q}
        </span>
        <span
          className={`shrink-0 text-xl text-[#3b6fe0] transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-200 ease-out ${
          open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <p className="max-w-2xl font-[Inter] text-sm leading-relaxed text-[#101828]/65">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ContributorPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-[#101828]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0d1526]">
        <div
          className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #3b6fe0 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
          <span className="inline-block rounded-full border border-white/15 px-3 py-1 font-[Inter] text-xs uppercase tracking-widest text-white/60">
            Become a contributor
          </span>
          <h1
            className={`mt-6 max-w-3xl font-[Space_Grotesk] text-4xl font-medium leading-[1.08] text-white sm:text-6xl transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            Your work, on shelves buyers actually browse.
          </h1>
          <p className="mt-6 max-w-xl font-[Inter] text-base leading-relaxed text-white/60 sm:text-lg">
            Upload photos, footage, illustrations, or vectors once. Every
            license sold after that pays into your balance — no extra work
            from you.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="/signup"
              className="rounded-full bg-[#3b6fe0] px-7 py-3 font-[Inter] text-sm font-medium text-white transition-colors hover:bg-[#2e58c4]"
            >
              Start contributing
            </a>
            <a
              href="#how-it-works"
              className="font-[Inter] text-sm font-medium text-white/70 underline decoration-white/25 underline-offset-4 hover:text-white"
            >
              See how it works
            </a>
          </div>

          <div className="mt-14">
            <p className="mb-3 font-[Inter] text-xs uppercase tracking-widest text-white/35">
              Recent contributor earnings
            </p>
            <RoyaltyTicker />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — a real sequence, so numbering is justified */}
      <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <h2 className="font-[Space_Grotesk] text-2xl font-medium text-[#101828] sm:text-3xl">
          Three steps, then it runs on its own
        </h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className={`relative pl-0 ${i > 0 ? "sm:pt-8" : ""}`}
              style={{ marginTop: i === 1 ? "1.5rem" : i === 2 ? "3rem" : 0 }}
            >
              <span className="font-[IBM_Plex_Mono] text-sm text-[#3b6fe0]">
                {step.n}
              </span>
              <h3 className="mt-3 font-[Space_Grotesk] text-lg font-medium text-[#101828]">
                {step.title}
              </h3>
              <p className="mt-2 font-[Inter] text-sm leading-relaxed text-[#101828]/60">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* EARNINGS TRANSPARENCY STRIP */}
      <section className="border-y border-[#101828]/10 bg-white">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 sm:grid-cols-3">
          <div>
            <p className="font-[IBM_Plex_Mono] text-3xl font-medium text-[#101828]">
              Free
            </p>
            <p className="mt-1 font-[Inter] text-sm text-[#101828]/55">
              to join and submit — no upfront cost
            </p>
          </div>
          <div>
            <p className="font-[IBM_Plex_Mono] text-3xl font-medium text-[#101828]">
              Recurring
            </p>
            <p className="mt-1 font-[Inter] text-sm text-[#101828]/55">
              one upload, licensed to buyers repeatedly
            </p>
          </div>
          <div>
            <p className="font-[IBM_Plex_Mono] text-3xl font-medium text-[#101828]">
              Your choice
            </p>
            <p className="mt-1 font-[Inter] text-sm text-[#101828]/55">
              remove a submission from sale anytime
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <h2 className="font-[Space_Grotesk] text-2xl font-medium text-[#101828] sm:text-3xl">
          Questions, answered
        </h2>
        <div className="mt-8">
          {FAQS.map((item, i) => (
            <FaqItem
              key={item.q}
              q={item.q}
              a={item.a}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-[#0d1526]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
          <h2 className="font-[Space_Grotesk] text-3xl font-medium text-white sm:text-4xl">
            Put your work where buyers are looking.
          </h2>
          <a
            href="/signup"
            className="mt-8 inline-block rounded-full bg-[#3b6fe0] px-8 py-3 font-[Inter] text-sm font-medium text-white transition-colors hover:bg-[#2e58c4]"
          >
            Start contributing
          </a>
        </div>
      </section>
    </main>
  );
}

/*
  FONT SETUP — add to app/layout.js so Space Grotesk / Inter / IBM Plex Mono
  are available. Example using next/font:

  import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";

  const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
  const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
  const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-plex-mono" });

  Then apply the variables to <html className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}>
  and swap the font-[Space_Grotesk] etc. bracket classes for font-[family-name:var(--font-space-grotesk)]
  if you want the exact next/font optimization — or just keep the bracket
  classes above and add the three Google Fonts <link> tags in <head> for a
  quicker setup.
*/
