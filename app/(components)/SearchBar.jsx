"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

function SearchBar({ initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function search(value) {
    const ingredient = value.trim();
    const url = ingredient ? `/?ingredient=${encodeURIComponent(ingredient)}` : "/";
    startTransition(() => router.push(url, { scroll: false }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    search(query);
  }

  function handleClear() {
    setQuery("");
    search("");
  }

  return (
    <form className="recipe-search" role="search" onSubmit={handleSubmit}>
      <label className="recipe-search-label" htmlFor="recipe-search-input">
        Search by ingredient
      </label>
      <div className="recipe-search-row">
        <input
          id="recipe-search-input"
          type="search"
          name="ingredient"
          placeholder="e.g. tomato, chicken, basil…"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button className="recipe-search-clear" type="button" onClick={handleClear}>
            Clear
          </button>
        )}
        <button className="submit-recipe-button" type="submit" disabled={isPending}>
          {isPending ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
