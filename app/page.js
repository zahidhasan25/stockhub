import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import AssetCard from "@/components/AssetCard";
import { sampleAssets } from "@/lib/sampleAssets";

const categories = ["Nature", "Business", "Technology", "Food", "People", "Travel", "Abstract", "Animals"];

export default function HomePage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white py-16 text-center">
        <h1 className="mx-auto max-w-2xl text-3xl font-bold text-gray-900 md:text-4xl">
          Millions of photos, videos & vectors — ready to license
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-gray-600">
          Find the perfect visual for your project, or start earning by selling your own work.
        </p>
        <div className="mt-8 px-4">
          <SearchBar />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 px-4">
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/browse?category=${cat.toLowerCase()}`}
              className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-600 hover:border-brand-500 hover:text-brand-600"
            >
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* Trending grid */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Trending this week</h2>
          <a href="/browse" className="text-sm font-medium text-brand-600 hover:underline">
            View all →
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {sampleAssets.map((asset) => (
            <AssetCard key={asset.id} {...asset} />
          ))}
        </div>
      </section>

      {/* Contributor CTA */}
      <section className="bg-brand-700 py-12 text-center text-white">
        <h2 className="text-2xl font-bold">Turn your creativity into income</h2>
        <p className="mx-auto mt-2 max-w-md text-brand-100">
          Join thousands of contributors uploading photos, videos, and vectors — earn royalties every time your work is licensed.
        </p>
        <a
          href="/upload"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          Start Contributing
        </a>
      </section>

      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} StockHub. All rights reserved.
      </footer>
    </main>
  );
}
