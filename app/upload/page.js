"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import UploadDropzone from "@/components/UploadDropzone";
import { useAuth } from "@/lib/authContext";

const CATEGORIES = [
  "Nature", "Business", "Technology", "Food", "People", "Travel", "Abstract", "Animals",
];

let nextId = 1;

export default function UploadPage() {
  const [items, setItems] = useState([]);
  const [submittedCount, setSubmittedCount] = useState(0);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?next=/upload");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main>
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-gray-500">
          {loading ? "Loading..." : "Redirecting to login..."}
        </div>
      </main>
    );
  }

  function handleFilesAdded(files) {
    const newItems = files.map((file) => ({
      id: nextId++,
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : "photo",
      title: file.name.replace(/\.[^/.]+$/, ""),
      category: "",
      keywords: "",
    }));
    setItems((prev) => [...prev, ...newItems]);
  }

  function updateItem(id, field, value) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleSubmitAll(e) {
    e.preventDefault();
    const incomplete = items.some((item) => !item.title || !item.category);
    if (incomplete) {
      alert("Please add a title and category for every file before submitting.");
      return;
    }

    // NOTE: No backend yet — files aren't actually uploaded anywhere.
    // In a later step this will upload to storage (e.g. Supabase Storage)
    // and create a row in the database with status "pending_review".
    console.log("Submitting for review:", items);
    setSubmittedCount(items.length);
    setItems([]);
  }

  return (
    <main>
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900">Upload your work</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add photos or videos, fill in a title and category, and submit for review.
        </p>

        {submittedCount > 0 && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {submittedCount} file{submittedCount > 1 ? "s" : ""} submitted for review. You'll
            be notified once they're approved.
          </div>
        )}

        <div className="mt-6">
          <UploadDropzone onFilesAdded={handleFilesAdded} />
        </div>

        {items.length > 0 && (
          <form onSubmit={handleSubmitAll} className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row"
              >
                <div className="h-28 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:w-40">
                  {item.type === "video" ? (
                    <video src={item.previewUrl} className="h-full w-full object-cover" muted />
                  ) : (
                    <img
                      src={item.previewUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium uppercase text-gray-500">
                      {item.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, "title", e.target.value)}
                    placeholder="Title"
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-brand-500"
                  />

                  <div className="flex gap-2">
                    <select
                      value={item.category}
                      onChange={(e) => updateItem(item.id, "category", e.target.value)}
                      className="w-1/2 rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c.toLowerCase()}>{c}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={item.keywords}
                      onChange={(e) => updateItem(item.id, "keywords", e.target.value)}
                      placeholder="Keywords (comma separated)"
                      className="w-1/2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-600 py-3 text-sm font-medium text-white hover:bg-brand-700"
            >
              Submit {items.length} file{items.length > 1 ? "s" : ""} for review
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
