"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import UploadDropzone from "@/components/UploadDropzone";
import { useAuth } from "@/lib/authContext";

const CATEGORIES = [
  "Nature",
  "Business",
  "Technology",
  "Food",
  "People",
  "Travel",
  "Abstract",
  "Animals",
  "Lifestyle",
  "Sports",
  "Education",
  "Fashion",
];

let nextId = 1;

function getExtension(fileName) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function getFileType(file) {
  const ext = getExtension(file.name);

  if (
    ["jpg", "jpeg", "png", "webp", "gif", "bmp"].includes(ext)
  ) {
    return "image";
  }

  if (ext === "svg") {
    return "svg";
  }

  if (
    ["mp4", "webm", "mov", "avi", "mkv"].includes(ext)
  ) {
    return "video";
  }

  if (ext === "pdf") {
    return "pdf";
  }

  if (["ai", "eps"].includes(ext)) {
    return "vector";
  }

  return "file";
}

export default function UploadPage() {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

  const inputRef = useRef(null);

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
          {loading
            ? "Loading..."
            : "Redirecting to login..."}
        </div>
      </main>
    );
  }

  /* ================================
     ADD FILES
  ================================= */

 async function handleFilesAdded(files) {
  const newItems = await Promise.all(
    files.map(async (file) => {
      const extension = getExtension(file.name).toLowerCase();
      const type = getFileType(file);

      let previewUrl;

      // EPS হলে Ghostscript server দিয়ে PNG preview তৈরি হবে
      if (extension === "eps") {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:3000/convert", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("EPS conversion failed:", errorText);

          // Conversion fail হলে original preview
          previewUrl = URL.createObjectURL(file);
        } else {
          const blob = await response.blob();
          previewUrl = URL.createObjectURL(blob);
        }
      } else {
        // অন্য file আগের মতোই preview হবে
        previewUrl = URL.createObjectURL(file);
      }

      return {
        id: nextId++,
        file,
        extension,
        type,

        previewUrl,

        title: file.name.replace(/\.[^/.]+$/, ""),

        category: "",

        keywords: "",
      };
    })
  );

  setItems((prev) => {
    const updated = [...prev, ...newItems];

    if (newItems.length > 0) {
      setSelectedId((current) =>
        current || newItems[0].id
      );
    }

    return updated;
  });
}

  /* ================================
     UPDATE
  ================================= */

  function updateItem(id, field, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  /* ================================
     REMOVE
  ================================= */

  function removeItem(id) {
    const item = items.find((x) => x.id === id);

    if (item?.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
    }

    setItems((prev) => {
      const updated = prev.filter(
        (x) => x.id !== id
      );

      if (selectedId === id) {
        setSelectedId(
          updated.length > 0
            ? updated[0].id
            : null
        );
      }

      return updated;
    });
  }

  /* ================================
     SUBMIT
  ================================= */

  function handleSubmitAll(e) {
    e.preventDefault();

    const incomplete = items.some(
      (item) =>
        !item.title.trim() ||
        !item.category
    );

    if (incomplete) {
      alert(
        "Please add a title and category for every file before submitting."
      );
      return;
    }

    console.log(
      "Submitting for review:",
      items
    );

    setSubmittedCount(items.length);

    items.forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(
          item.previewUrl
        );
      }
    });

    setItems([]);
    setSelectedId(null);
  }

  /* ================================
     OPEN FILE PICKER
  ================================= */

  function openFilePicker() {
    inputRef.current?.click();
  }

  const selectedItem = items.find(
    (item) => item.id === selectedId
  );

  return (
    <main className="min-h-screen bg-white">

      {/* =================================
          MAIN NAVBAR
      ================================= */}

      <Navbar />

      {/* =================================
          UPLOAD NAVIGATION
      ================================= */}

      <div className="border-b border-gray-200 bg-white">

        <div className="flex items-center justify-between px-6">

          <div className="flex items-center gap-10">

            <a
              href="/upload"
              className="border-b-2 border-blue-600 px-1 py-5 text-sm font-semibold text-gray-900"
            >
              New
            </a>

            <a
              href="#"
              className="py-5 text-sm text-gray-600 hover:text-gray-900"
            >
              In review
            </a>

            <a
              href="#"
              className="py-5 text-sm text-gray-600 hover:text-gray-900"
            >
              Reminder
            </a>

            <a
              href="#"
              className="py-5 text-sm text-gray-600 hover:text-gray-900"
            >
              Not accepted
            </a>

            <a
              href="#"
              className="py-5 text-sm text-gray-600 hover:text-gray-900"
            >
              Upload issues
            </a>

            <a
              href="#"
              className="py-5 text-sm text-gray-600 hover:text-gray-900"
            >
              Releases
            </a>

          </div>

          <button
            type="button"
            onClick={openFilePicker}
            className="my-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            ☁ Upload
          </button>

        </div>
      </div>

      {/* =================================
          HIDDEN FILE INPUT
      ================================= */}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="
          .jpg,
          .jpeg,
          .png,
          .webp,
          .gif,
          .bmp,
          .svg,
          .ai,
          .eps,
          .pdf,
          .mp4,
          .webm,
          .mov,
          .avi,
          .mkv
        "
        className="hidden"
        onChange={(e) => {
          handleFilesAdded(
            Array.from(
              e.target.files || []
            )
          );

          e.target.value = "";
        }}
      />

      {/* =================================
          INFORMATION BAR
      ================================= */}

      {showInfo && (
        <div className="mx-4 mt-5 rounded-md bg-blue-50 px-5 py-4 text-sm text-blue-800">

          <div className="flex items-center justify-between">

            <span>
              AI and EPS file uploads are currently available.
              Upload your files to start selling on StockHub.
            </span>

            <button
              type="button"
              onClick={() =>
                setShowInfo(false)
              }
              className="text-blue-600 hover:text-blue-900"
            >
              ×
            </button>

          </div>

        </div>
      )}

      {/* =================================
          NO FILE
      ================================= */}

      {items.length === 0 ? (

        <div className="px-6 py-10">

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_330px]">

            <div className="flex min-h-[520px] items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-8">

              <div className="w-full max-w-md">

                <UploadDropzone
                  onFilesAdded={
                    handleFilesAdded
                  }
                />

              </div>

            </div>

            <UploadHelp />

          </div>

        </div>

      ) : (

        /* =================================
           FILE UPLOADED
        ================================= */

        <form
          onSubmit={handleSubmitAll}
        >

          <div className="grid min-h-[650px] grid-cols-[255px_1fr_380px] border-b border-gray-200">

            {/* =================================
                LEFT
            ================================= */}

            <aside className="border-r border-gray-200 bg-gray-50 p-5">

              <div className="mb-5">

                <h2 className="text-base font-semibold text-gray-900">
                  Files
                </h2>

                <p className="text-sm text-gray-500">
                  {items.length} uploaded
                </p>

              </div>

              <div className="space-y-4">

                {items.map((item) => (

                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      setSelectedId(
                        item.id
                      )
                    }
                    className={`w-full overflow-hidden rounded-xl border-2 bg-white text-left transition ${
                      selectedId === item.id
                        ? "border-blue-600"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >

                    <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gray-100">

                      {item.type ===
                        "image" ||
                      item.type ===
                        "svg" ? (

                        <img
                          src={
                            item.previewUrl
                          }
                          alt={
                            item.title
                          }
                          className="h-full w-full object-contain"
                        />

                      ) : item.type ===
                        "video" ? (

                        <video
                          src={
                            item.previewUrl
                          }
                          className="h-full w-full object-cover"
                          muted
                        />

                      ) : item.type ===
                        "pdf" ? (

                        <iframe
                          src={
                            item.previewUrl
                          }
                          title={
                            item.title
                          }
                          className="pointer-events-none h-full w-full"
                        />

                      ) : item.type ===
                        "vector" ? (

                        /*
                         EPS / AI
                        */

                        <div className="flex h-full w-full flex-col items-center justify-center bg-white">

                          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-50">

                            <span className="text-2xl font-bold uppercase text-blue-600">
                              {
                                item.extension
                              }
                            </span>

                          </div>

                          <p className="mt-3 max-w-[180px] truncate text-xs text-gray-500">
                            {
                              item.file.name
                            }
                          </p>

                        </div>

                      ) : (

                        <div className="text-4xl">
                          📄
                        </div>

                      )}

                    </div>

                    <div className="border-t border-gray-100 p-3">

                      <p className="truncate text-sm font-medium text-gray-800">
                        {
                          item.title
                        }
                      </p>

                      <p className="mt-1 text-xs uppercase text-gray-400">
                        {
                          item.extension
                        }
                      </p>

                    </div>

                  </button>

                ))}

              </div>

              <button
                type="button"
                onClick={openFilePicker}
                className="mt-5 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                + Add more
              </button>

            </aside>

            {/* =================================
                CENTER PREVIEW
            ================================= */}

            <section className="flex min-h-[650px] items-center justify-center bg-white p-10">

              {selectedItem && (

                <div className="flex w-full flex-col items-center justify-center">

                  {/* IMAGE */}

                  {(selectedItem.type ===
                    "image" ||
                    selectedItem.type ===
                      "svg") && (

                    <img
                      src={
                        selectedItem.previewUrl
                      }
                      alt={
                        selectedItem.title
                      }
                      className="max-h-[520px] max-w-full object-contain"
                    />

                  )}

                  {/* VIDEO */}

                  {selectedItem.type ===
                    "video" && (

                    <video
                      src={
                        selectedItem.previewUrl
                      }
                      controls
                      className="max-h-[520px] max-w-full rounded-lg"
                    />

                  )}

                  {/* PDF */}

                  {selectedItem.type ===
                    "pdf" && (

                    <iframe
                      src={
                        selectedItem.previewUrl
                      }
                      title={
                        selectedItem.title
                      }
                      className="h-[520px] w-full max-w-3xl rounded-lg border border-gray-200"
                    />

                  )}

                  {/* =================================
                      EPS / AI
                  ================================= */}

                  {selectedItem.type ===
                    "vector" && (

                    <div className="flex flex-col items-center justify-center">

                      <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-blue-50">

                        <span className="text-6xl font-bold uppercase text-blue-600">
                          {
                            selectedItem.extension
                          }
                        </span>

                      </div>

                      <p className="mt-6 max-w-3xl text-center text-xl font-semibold text-gray-800">
                        {
                          selectedItem.file.name
                        }
                      </p>

                      <p className="mt-2 text-sm text-gray-400">
                        Vector file
                      </p>

                    </div>

                  )}

                  {/* UNKNOWN */}

                  {selectedItem.type ===
                    "file" && (

                    <div className="flex flex-col items-center">

                      <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-gray-100 text-6xl">
                        📄
                      </div>

                      <p className="mt-5 text-lg font-medium text-gray-800">
                        {
                          selectedItem.file.name
                        }
                      </p>

                    </div>

                  )}

                </div>

              )}

            </section>

            {/* =================================
                RIGHT METADATA
            ================================= */}

            {selectedItem && (

              <aside className="overflow-y-auto border-l border-gray-200 bg-white p-6">

                {/* TITLE */}

                <div className="mb-6">

                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Content title
                  </label>

                  <textarea
                    value={
                      selectedItem.title
                    }
                    onChange={(e) =>
                      updateItem(
                        selectedItem.id,
                        "title",
                        e.target.value
                      )
                    }
                    maxLength={200}
                    rows={4}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    max 200 characters
                  </p>

                </div>

                {/* KEYWORDS */}

                <div className="mb-6">

                  <div className="flex items-center justify-between">

                    <label className="text-sm font-semibold text-gray-800">
                      KEYWORDS
                    </label>

                    <span className="text-xs text-gray-400">
                      max 49
                    </span>

                  </div>

                  <textarea
                    value={
                      selectedItem.keywords
                    }
                    onChange={(e) =>
                      updateItem(
                        selectedItem.id,
                        "keywords",
                        e.target.value
                      )
                    }
                    rows={6}
                    placeholder="Enter keywords separated by commas..."
                    className="mt-2 w-full resize-none rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Separate keywords with commas
                  </p>

                </div>

                {/* CATEGORY */}

                <div className="mb-6">

                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Category
                  </label>

                  <select
                    value={
                      selectedItem.category
                    }
                    onChange={(e) =>
                      updateItem(
                        selectedItem.id,
                        "category",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                  >

                    <option value="">
                      Select category
                    </option>

                    {CATEGORIES.map(
                      (category) => (

                        <option
                          key={
                            category
                          }
                          value={category.toLowerCase()}
                        >
                          {category}
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* FILE INFO */}

                <div className="border-t border-gray-200 pt-5">

                  <p className="text-xs text-gray-400">
                    File name
                  </p>

                  <p className="mt-1 break-all text-sm text-gray-700">
                    {
                      selectedItem.file.name
                    }
                  </p>

                  <p className="mt-4 text-xs text-gray-400">
                    File type
                  </p>

                  <p className="mt-1 text-sm font-medium uppercase text-gray-700">
                    {
                      selectedItem.extension
                    }
                  </p>

                </div>

                {/* REMOVE */}

                <button
                  type="button"
                  onClick={() =>
                    removeItem(
                      selectedItem.id
                    )
                  }
                  className="mt-8 w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50"
                >
                  Remove file
                </button>

              </aside>

            )}

          </div>

          {/* =================================
              SUBMIT
          ================================= */}

          <div className="border-t border-gray-200 bg-white px-6 py-5">

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Submit {items.length} file
              {items.length > 1
                ? "s"
                : ""}{" "}
              for review
            </button>

          </div>

        </form>

      )}

      {/* =================================
          SUCCESS
      ================================= */}

      {submittedCount > 0 && (

        <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700 shadow-lg">

          {submittedCount} file
          {submittedCount > 1
            ? "s"
            : ""}{" "}
          submitted for review.

        </div>

      )}

    </main>
  );
}

/* ==========================================
   UPLOAD HELP
========================================== */

function UploadHelp() {
  return (
    <aside className="h-fit overflow-hidden rounded-xl bg-gray-100">

      <details
        open
        className="border-b border-white"
      >

        <summary className="cursor-pointer px-6 py-5 text-base font-semibold text-gray-800">
          Transparent PNG
        </summary>

        <div className="px-6 pb-5 text-sm leading-6 text-gray-600">
          Upload transparent PNG files with clean
          edges and high-quality resolution.
        </div>

      </details>

      <details className="border-b border-white">

        <summary className="cursor-pointer px-6 py-5 text-base font-semibold text-gray-800">
          Images (JPEG files)
        </summary>

        <div className="px-6 pb-5 text-sm leading-6 text-gray-600">
          Upload high-quality JPEG images suitable
          for stock photography.
        </div>

      </details>

      <details className="border-b border-white">

        <summary className="cursor-pointer px-6 py-5 text-base font-semibold text-gray-800">
          Vectors (AI, EPS, SVG)
        </summary>

        <div className="px-6 pb-5 text-sm leading-6 text-gray-600">
          Upload AI, EPS and SVG vector files.
        </div>

      </details>

      <details>

        <summary className="cursor-pointer px-6 py-5 text-base font-semibold text-gray-800">
          Videos
        </summary>

        <div className="px-6 pb-5 text-sm leading-6 text-gray-600">
          Upload MP4, MOV, WebM and other supported
          video files.
        </div>

      </details>

    </aside>
  );
}