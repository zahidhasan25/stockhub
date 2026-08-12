"use client";

import { useAuth } from "@/lib/authContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-3 text-[#172033]"
        >
          <img
            src="/logo.png"
            alt="StockHub"
            className="h-11 w-11 rounded-lg object-cover"
          />

          <span className="text-xl font-bold tracking-tight">
            StockHub
          </span>
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">

          <a
            href="/browse"
            className={`text-sm font-medium transition ${
              isActive("/browse")
                ? "text-[#2563eb]"
                : "text-gray-600 hover:text-[#2563eb]"
            }`}
          >
            Browse
          </a>

          <a
            href="/pricing"
            className={`text-sm font-medium transition ${
              isActive("/pricing")
                ? "text-[#2563eb]"
                : "text-gray-600 hover:text-[#2563eb]"
            }`}
          >
            Pricing
          </a>

          {user && (
            <>
              <a
                href="/dashboard"
                className={`text-sm font-medium transition ${
                  isActive("/dashboard")
                    ? "text-[#2563eb]"
                    : "text-gray-600 hover:text-[#2563eb]"
                }`}
              >
                Dashboard
              </a>

              <a
                href="/upload"
                className={`text-sm font-medium transition ${
                  isActive("/upload")
                    ? "text-[#2563eb]"
                    : "text-gray-600 hover:text-[#2563eb]"
                }`}
              >
                Upload
              </a>

              <a
                href="/portfolio"
                className={`text-sm font-medium transition ${
                  isActive("/portfolio")
                    ? "text-[#2563eb]"
                    : "text-gray-600 hover:text-[#2563eb]"
                }`}
              >
                Portfolio
              </a>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {user ? (
            <>
              {/* User */}
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="hidden lg:block">
                  <p className="text-xs text-gray-400">
                    Contributor
                  </p>

                  <p className="max-w-[140px] truncate text-sm font-medium text-gray-800">
                    {user.name}
                  </p>
                </div>
              </div>

              {/* Upload Button */}
              <a
                href="/upload"
                className="hidden rounded-lg bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] sm:block"
              >
                Upload
              </a>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <a
                href="/login"
                className="text-sm font-medium text-gray-600 transition hover:text-[#2563eb]"
              >
                Log in
              </a>

              {/* Join */}
              <a
                href="/signup"
                className="rounded-lg bg-[#172033] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2563eb]"
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