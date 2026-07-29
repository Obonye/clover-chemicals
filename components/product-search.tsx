"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchIcon = () => (
  <svg
    className="shrink-0 text-muted"
    fill="none"
    height={18}
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    width={18}
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
  </svg>
);

export const ProductSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = query.trim();

    router.push(
      trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products",
    );
  }

  return (
    <form
      className="flex w-full items-stretch overflow-hidden rounded-lg border border-separator bg-surface transition-colors focus-within:border-accent"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-1 items-center gap-3 pl-4">
        <SearchIcon />
        <input
          className="w-full min-w-0 bg-transparent py-3.5 pr-2 text-sm text-foreground placeholder:text-muted outline-none"
          placeholder="Search 400+ products — pine gel, sanitiser, X-ray film, herbicide..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        className="shrink-0 border-l border-separator px-6 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-surface-secondary"
        type="submit"
      >
        Search
      </button>
    </form>
  );
};
