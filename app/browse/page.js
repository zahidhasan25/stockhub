"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import AssetCard from "@/components/AssetCard";
import FilterSidebar from "@/components/FilterSidebar";
import { sampleAssets } from "@/lib/sampleAssets";

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ types: [], category: "", license: "" });
  const [sort, setSort] = useState("relevant");

  const results = useMemo(() => {
    let list = sampleAssets.filter((asset) => {
      const matchesQuery =
        !query.trim() ||
        asset.title.toLowerCase().includes(query.toLowerCase()) ||
        asset.category.includes(query.toLowerCase());
      const matchesType = filters.types.length === 0 || filters.types.includes(asset.type);
      const matchesCategory = !filters.category || asset.category === filters.category;
      const matchesLicense = !filters.license || asset.license === filters.license;
      return matchesQuery && matchesType && matchesCategory && matchesLicense;
    });

    if (sort === "newest") {
      list = [...list].sort((a, b) => b.id - a.id);
    } else if (sort === "az") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [query, filters, sort]);

  return (
    <main>
      <Navbar />

      <div className="border-b border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-6xl px-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search photos, videos, vectors..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row">
        <FilterSidebar filters={filters} onChange={setFilters} />

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">{results.length} results</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
            >
              <option value="relevant">Relevant</option>
              <option value="newest">Newest</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center text-sm text-gray-500">
              No results found — try adjusting your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {results.map((asset) => (
                <AssetCard key={asset.id} {...asset} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
