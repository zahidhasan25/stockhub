"use client";

import { useState, useRef } from "react";

export default function UploadDropzone({ onFilesAdded }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const files = Array.from(fileList).filter((f) =>
      /^(image|video)\//.test(f.type)
    );
    if (files.length > 0) onFilesAdded(files);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-center transition ${
        isDragging
          ? "border-brand-500 bg-brand-50"
          : "border-gray-300 bg-white hover:border-brand-400"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <svg
        className="mb-3 h-10 w-10 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 8.25L12 3.75m0 0L7.5 8.25M12 3.75v13.5"
        />
      </svg>
      <p className="text-sm font-medium text-gray-700">
        Drag & drop photos or videos here
      </p>
      <p className="mt-1 text-xs text-gray-400">
        or click to browse — JPG, PNG, MP4 supported
      </p>
    </div>
  );
}
