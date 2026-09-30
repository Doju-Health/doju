import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * A search term kept in the URL (?search=…) so it survives refreshes and the
 * back button. `input` updates on every keystroke; `search` (and the URL)
 * follows once typing pauses, so tables don't refetch per keystroke.
 */
export function useUrlSearch(delay = 400) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [input, setInput] = useState(search);

  // Follow URL changes made elsewhere (back button, links). Compare trimmed so
  // a trailing space the user is still typing isn't stripped.
  useEffect(() => {
    setInput((current) => (current.trim() === search ? current : search));
  }, [search]);

  useEffect(() => {
    const trimmed = input.trim();
    if (trimmed === search) return;
    const timeout = setTimeout(() => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (trimmed) params.set("search", trimmed);
        else params.delete("search");
        // A new search is a new result set; start from the first page.
        params.delete("page");
        return params;
      });
    }, delay);
    return () => clearTimeout(timeout);
  }, [input, search, delay, setSearchParams]);

  return { input, setInput, search };
}
