"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import ApertureMark from "@/components/ApertureMark";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const { signInWithPassword, signInWithOAuth } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setBusy(true);

    try {
      await signInWithPassword({
        email,
        password,
      });

      router.push("/");
    } catch (err) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function handleOAuth(provider) {
    setError("");
    setBusy(true);

    try {
      await signInWithOAuth(provider);
    } catch (err) {
      setError(
        err.message || `Failed to sign in with ${provider}.`
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="relative hidden overflow-hidden bg-ink md:flex md:flex-col md:justify-between md:p-10">

        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-ember-700 opacity-95" />

        <ApertureMark
          className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 text-white/5"
          spinning
        />

        {/* Logo */}
        <a
          href="/"
          className="relative flex items-center gap-2 text-paper"
        >
          <ApertureMark className="h-6 w-6 text-ember-400" />

          <span className="font-display text-lg font-semibold">
            StockHub
          </span>
        </a>

        {/* Text */}
        <div className="relative">
          <p className="max-w-sm font-display text-2xl font-medium leading-snug text-paper">
            Every asset you need, from creators around the world.
          </p>

          <p className="mt-3 max-w-sm text-sm text-paper/50">
            Sign in to license content, manage your contributions,
            and track your earnings.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-paper px-6 py-16">

        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <a
            href="/"
            className="mb-8 flex items-center gap-2 text-ink md:hidden"
          >
            <ApertureMark className="h-5 w-5 text-ember-500" />

            <span className="font-display text-lg font-semibold">
              StockHub
            </span>
          </a>

          {/* Heading */}
          <h1 className="font-display text-2xl font-semibold text-ink">
            Sign in
          </h1>

          <p className="mt-1 text-sm text-ink/50">
            New user?{" "}
            <a
              href="/signup"
              className="font-medium text-ember-600 hover:underline"
            >
              Create an account
            </a>
          </p>

          {/* Error Message */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-ink"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-ember-400"
                placeholder="you@example.com"
                disabled={busy}
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-1 flex items-center justify-between">

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-ink"
                >
                  Password
                </label>

                <a
                  href="/forgot-password"
                  className="text-xs font-medium text-ember-600 hover:underline"
                >
                  Forgot password?
                </a>

              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-ember-400"
                placeholder="Enter your password"
                disabled={busy}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-ember-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">

            <div className="h-px flex-1 bg-line" />

            <span className="text-xs text-ink/40">
              OR
            </span>

            <div className="h-px flex-1 bg-line" />

          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">

            {/* Google */}
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="font-bold text-red-500">
                G
              </span>

              Continue with Google
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleOAuth("facebook")}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="font-bold text-blue-600">
                f
              </span>

              Continue with Facebook
            </button>

          </div>

          {/* Bottom Text */}
          <p className="mt-8 text-center text-xs leading-relaxed text-ink/40">

            By signing in, you agree to our{" "}

            <a
              href="#"
              className="text-ember-600 hover:underline"
            >
              Terms of Service
            </a>{" "}

            and{" "}

            <a
              href="#"
              className="text-ember-600 hover:underline"
            >
              Privacy Policy
            </a>

            .

          </p>

        </div>
      </div>
    </div>
  );
}