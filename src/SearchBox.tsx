import { useEffect, useState } from "react";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query) return;
    fetch("/api/search?q=" + query)
      .then((r) => r.json())
      .then(setResults);
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search…"
      />
      <ul>
        {results.map((r) => (
          <li>
            <a href={r.url} dangerouslySetInnerHTML={{ __html: r.title }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
