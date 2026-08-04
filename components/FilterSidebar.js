"use client";

const TYPES = [
  { value: "photo", label: "Photo" },
  { value: "vector", label: "Vector" },
  { value: "video", label: "Video" },
];

const CATEGORIES = [
  "Nature", "Business", "Technology", "Food", "People", "Travel", "Abstract", "Animals",
];

export default function FilterSidebar({ filters, onChange }) {
  function toggleType(type) {
    const next = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: next });
  }

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-800">Content Type</h3>
        <div className="space-y-2">
          {TYPES.map((t) => (
            <label key={t.value} className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={filters.types.includes(t.value)}
                onChange={() => toggleType(t.value)}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-800">Category</h3>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c.toLowerCase()}>{c}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-800">License</h3>
        <div className="space-y-2">
          {["free", "standard", "extended"].map((lic) => (
            <label key={lic} className="flex items-center gap-2 text-sm capitalize text-gray-600">
              <input
                type="radio"
                name="license"
                checked={filters.license === lic}
                onChange={() => onChange({ ...filters, license: lic })}
                className="border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              {lic}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name="license"
              checked={filters.license === ""}
              onChange={() => onChange({ ...filters, license: "" })}
              className="border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            All
          </label>
        </div>
      </div>

      <button
        onClick={() => onChange({ types: [], category: "", license: "" })}
        className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
      >
        Reset filters
      </button>
    </aside>
  );
}
