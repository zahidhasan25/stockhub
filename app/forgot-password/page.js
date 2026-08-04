"use client";

import { useState } from "react";
import AuthCard from "@/components/AuthCard";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    // NOTE: No backend yet — this will call Supabase's password-reset
    // email flow once auth is connected.
    console.log("Password reset requested for:", email);
    setSent(true);
  }

  if (sent) {
    return (
      <AuthCard title="Check your email" subtitle="">
        <p className="text-center text-sm text-gray-600">
          If an account exists for <span className="font-medium">{email}</span>,
          a password reset link will be sent there.
        </p>
        <p className="mt-2 text-center text-xs text-gray-400">
          (No email is actually sent yet — this will work once the backend is connected.)
        </p>
        <a
          href="/login"
          className="mt-6 block rounded-lg bg-brand-600 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-700"
        >
          Back to log in
        </a>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
            placeholder="you@example.com"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          Send reset link
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Remembered your password?{" "}
        <a href="/login" className="font-medium text-brand-600 hover:underline">
          Log in
        </a>
      </p>
    </AuthCard>
  );
}
