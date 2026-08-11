"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";
import { useAuth } from "@/lib/authContext";

export default function SignupPage() {
  const [role, setRole] = useState("buyer"); // "buyer" | "contributor"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const { signUpWithPassword, signInWithOAuth } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    try {
      await signUpWithPassword({ name, email, password, role });
      setCheckEmail(true);
    } catch (err) {
      setError(err.message || "Failed to sign up.");
    } finally {
      setBusy(false);
    }
  }

  async function handleOAuth(provider) {
    setError("");
    try {
      await signInWithOAuth(provider);
    } catch (err) {
      setError(err.message || `Failed to sign up with ${provider}.`);
    }
  }

  if (checkEmail) {
    return (
      <AuthCard title="Check your email" subtitle="">
        <p className="text-center text-sm text-ink/60">
          We sent a confirmation link to <span className="font-medium">{email}</span>.
          Click it to activate your account, then log in.
        </p>
        <a
          href="/login"
          className="mt-6 block rounded-full bg-ember-500 py-2.5 text-center text-sm font-medium text-white hover:bg-ember-600"
        >
          Go to login
        </a>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create your account" subtitle="Get started for free">
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-paper-dim p-1">
        <button
          type="button"
          onClick={() => setRole("buyer")}
          className={`rounded-md py-2 text-sm font-medium transition ${
            role === "buyer" ? "bg-white text-ember-600 shadow-sm" : "text-ink/50"
          }`}
        >
          I want to buy content
        </button>
        <button
          type="button"
          onClick={() => setRole("contributor")}
          className={`rounded-md py-2 text-sm font-medium transition ${
            role === "contributor" ? "bg-white text-ember-600 shadow-sm" : "text-ink/50"
          }`}
        >
          I want to sell content
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ember-400"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ember-400"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-ember-400"
            placeholder="At least 6 characters"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-ember-500 py-2.5 text-sm font-medium text-white hover:bg-ember-600 disabled:opacity-60"
        >
          {busy ? "Creating account..." : role === "contributor" ? "Join as a Contributor" : "Sign up"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink/40">Or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <div className="space-y-3">
        <button
          onClick={() => handleOAuth("google")}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-sm font-medium text-ink hover:bg-paper-dim"
        >
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth("facebook")}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-line py-2.5 text-sm font-medium text-ink hover:bg-paper-dim"
        >
          Continue with Facebook
        </button>
      </div>

      <p className="mt-5 text-center text-sm text-ink/50">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-ember-600 hover:underline">
          Log in
        </a>
      </p>
    </AuthCard>
  );
}