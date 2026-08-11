"use client";

import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";
import ApertureMark from "./ApertureMark";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-2 text-ink">
          <ApertureMark className="h-6 w-6 text-ember-500" />
          <span className="font-display text-lg font-semibold tracking-tight">
            Aperture&nbsp;Market
          </span>
        </a>

        <nav className="hidden gap-7 text-sm text-ink-soft md:flex">
          <a href="/browse" className="text-ink/70 hover:text-ember-500">Browse</a>
          <a href="/pricing" className="text-ink/70 hover:text-ember-500">Pricing</a>
          <a href="/upload" className="text-ink/70 hover:text-ember-500">Become a Contributor</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-ink/70">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-ink/40"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="text-sm font-medium text-ink/70 hover:text-ember-500">
                Log in
              </a>
              <a
                href="/signup"
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ember-600"
              >
                Join Free
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}