"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const STATUS_COLORS = {
  approved: "#22c55e",
  pending: "#e0a13b",
  rejected: "#ef4444",
};

function formatCurrency(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function monthLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className="mt-1 text-2xl font-semibold"
        style={{ color: accent || "#101828" }}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
        styles[status] || "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assets, setAssets] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setDataLoading(true);
      setFetchError("");

      const { data: assetData, error: assetError } = await supabase
        .from("assets")
        .select("*")
        .eq("contributor_id", user.id)
        .order("created_at", { ascending: false });

      const { data: purchaseData, error: purchaseError } = await supabase
        .from("purchases")
        .select("amount, created_at, assets!inner(title, contributor_id)")
        .eq("assets.contributor_id", user.id)
        .order("created_at", { ascending: true });

      if (assetError || purchaseError) {
        setFetchError(
          (assetError || purchaseError).message || "Could not load your data."
        );
      } else {
        setAssets(assetData || []);
        setPurchases(purchaseData || []);
      }
      setDataLoading(false);
    }

    fetchData();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  const totalAssets = assets.length;
  const approvedCount = assets.filter((a) => a.status === "approved").length;
  const pendingCount = assets.filter((a) => a.status === "pending").length;
  const rejectedCount = assets.filter((a) => a.status === "rejected").length;
  const totalEarnings = purchases.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

  // Group earnings by month for the line chart
  const earningsByMonth = {};
  purchases.forEach((p) => {
    const label = monthLabel(p.created_at);
    earningsByMonth[label] = (earningsByMonth[label] || 0) + Number(p.amount);
  });
  const chartData = Object.entries(earningsByMonth).map(([month, amount]) => ({
    month,
    amount: Number(amount.toFixed(2)),
  }));

  const statusData = [
    { name: "Approved", value: approvedCount, key: "approved" },
    { name: "Pending", value: pendingCount, key: "pending" },
    { name: "Rejected", value: rejectedCount, key: "rejected" },
  ].filter((s) => s.value > 0);

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold text-[#101828]">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's how your contributions are doing.
        </p>

        {fetchError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {fetchError}
          </p>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total assets" value={totalAssets} />
          <StatCard
            label="Approved"
            value={approvedCount}
            accent="#22c55e"
          />
          <StatCard label="Pending review" value={pendingCount} accent="#e0a13b" />
          <StatCard
            label="Total earnings"
            value={formatCurrency(totalEarnings)}
            accent="#3b6fe0"
          />
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
            <h2 className="text-sm font-medium text-gray-700">
              Earnings over time
            </h2>
            <div className="mt-4 h-64">
              {chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  No sales yet — earnings will appear here once your work sells.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
                    <XAxis dataKey="month" fontSize={12} stroke="#98a2b3" />
                    <YAxis fontSize={12} stroke="#98a2b3" />
                    <Tooltip
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ fontSize: 13, borderRadius: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#3b6fe0"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-medium text-gray-700">
              Submission status
            </h2>
            <div className="mt-4 h-64">
              {statusData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  No submissions yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                    >
                      {statusData.map((entry) => (
                        <Cell
                          key={entry.key}
                          fill={STATUS_COLORS[entry.key]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={30}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Assets table */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-medium text-gray-700">Your submissions</h2>

          {dataLoading ? (
            <p className="mt-4 text-sm text-gray-400">Loading your assets...</p>
          ) : assets.length === 0 ? (
            <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
              You haven't uploaded anything yet.{" "}
              <a href="/upload" className="font-medium text-brand-600 hover:underline">
                Upload your first piece
              </a>
              .
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500">
                    <th className="pb-2 pr-4 font-medium">Title</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 pr-4 font-medium">Price</th>
                    <th className="pb-2 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id} className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-[#101828]">{asset.title}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={asset.status} />
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {formatCurrency(asset.price)}
                      </td>
                      <td className="py-3 text-gray-500">
                        {new Date(asset.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}