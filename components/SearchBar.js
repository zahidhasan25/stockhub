"use client";

import { useState } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/browse?q=${encodeURIComponent(query)}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-2xl overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search photos, videos, vectors..."
        className="flex-1 px-4 py-3 text-sm outline-none"
      />
      <button
        type="submit"
        className="bg-brand-600 px-6 text-sm font-medium text-white hover:bg-brand-700"
      >
        Search
      </button>
    </form>
  );
}
