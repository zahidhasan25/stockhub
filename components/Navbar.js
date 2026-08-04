"use client";

import { useAuth } from "@/lib/authContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="/" className="text-xl font-bold text-brand-700">
          StockHub
        </a>

        <nav className="hidden gap-6 text-sm font-medium text-gray-600 md:flex">
          <a href="/browse" className="hover:text-brand-600">Browse</a>
          <a href="/pricing" className="hover:text-brand-600">Pricing</a>
          <a href="/upload" className="hover:text-brand-600">Become a Contributor</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-brand-600"
              >
                Log in
              </a>
              <a
                href="/signup"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
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
