"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/authContext";
import { sampleAssets } from "@/lib/sampleAssets";

// NOTE: Placeholder stats/trend data — once Supabase is connected,
// this should be replaced with real queries against your
// `downloads` / `earnings` tables, filtered by the logged-in
// contributor's id.
const trendData = [
  { week: "May 25", earnings: 0, downloads: 0 },
  { week: "Jun 1", earnings: 0, downloads: 0 },
  { week: "Jun 8", earnings: 0.8, downloads: 1 },
  { week: "Jun 15", earnings: 3.1, downloads: 3 },
  { week: "Jun 22", earnings: 1.6, downloads: 1 },
  { week: "Jun 29", earnings: 0, downloads: 0 },
  { week: "Jul 6", earnings: 1.5, downloads: 2 },
  { week: "Jul 13", earnings: 1.1, downloads: 1 },
  { week: "Jul 20", earnings: 3.4, downloads: 3 },
  { week: "Jul 27", earnings: 2.9, downloads: 4 },
  { week: "Aug 3", earnings: 2.8, downloads: 2 },
  { week: "Aug 10", earnings: 0, downloads: 0 },
];

const TABS = [
  { key: "all", label: "All" },
  { key: "photo", label: "Photos" },
  { key: "vector", label: "Vectors" },
  { key: "video", label: "Videos" },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?next=/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center text-sm text-ink/50">
          {loading ? "Loading..." : "Redirecting to login..."}
        </div>
      </main>
    );
  }

  const totalDownloads = trendData.reduce((sum, d) => sum + d.downloads, 0);
  const totalEarnings = trendData.reduce((sum, d) => sum + d.earnings, 0);

  // Placeholder: real portfolio would be assets where author === user.
  // Falling back to the shared sample dataset so the grid isn't empty.
  const portfolio = sampleAssets.filter((a) => tab === "all" || a.type === tab);

  return (
    <main>
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-semibold text-ink">
            Contributor Dashboard
          </h1>
          <a
            href="/upload"
            className="rounded-full bg-ember-500 px-5 py-2 text-sm font-medium text-white hover:bg-ember-600"
          >
            Upload
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-ink/40">Downloads</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">{totalDownloads}</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-ink/40">Earnings</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">${totalEarnings.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-ink/40">Available balance</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ember-500">${totalEarnings.toFixed(2)}</p>
          </div>
        </div>

        {/* Trend chart */}
        <div className="mt-6 rounded-xl border border-line bg-white p-4">
          <p className="mb-4 text-sm font-medium text-ink/70">12-Week Trend</p>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={trendData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4DED2" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#8B8577" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#8B8577" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#8B8577" }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #E4DED2", fontSize: 12 }}
              />
              <Bar yAxisId="left" dataKey="earnings" fill="#16181D" radius={[3, 3, 0, 0]} barSize={22} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="downloads"
                stroke="#EA5A24"
                strokeWidth={2}
                dot={{ r: 3, fill: "#EA5A24" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">My Portfolio</h2>
            <div className="flex gap-1 rounded-full border border-line bg-white p-1">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    tab === t.key ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {portfolio.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line py-16 text-center text-sm text-ink/50">
              No items in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {portfolio.map((asset) => (
                <div key={asset.id} className="overflow-hidden rounded-xl border border-line bg-white">
                  <div className="aspect-square w-full overflow-hidden bg-paper-dim">
                    <img src={asset.image} alt={asset.title} className="h-full w-full object-cover" />
                  </div>
                  <p className="truncate px-2 py-1.5 text-xs text-ink/70">{asset.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}