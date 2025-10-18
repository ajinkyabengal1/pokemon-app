import { useRef, useCallback } from "react";
import { TYPE_URL } from "../utils/constant";
import type { PokemonSummary } from "../context/PokemonContext";
import type { ListState, ListAction } from "../context/PokemonContext";

export default function usePokemonFetcher() {
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async ({
      url,
      cache,
      dispatch,
    }: {
      url: string;
      cache: ListState["cache"];
      dispatch: React.Dispatch<ListAction>;
    }) => {
      if (!url) return;
      if (cache[url]) {
        const { results, next, count } = cache[url];
        dispatch({
          type: "FETCH_SUCCESS",
          payload: { results, next, count, pageUrl: url },
        });
        return;
      }

      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      dispatch({ type: "FETCH_START" });

      try {
        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        let results: PokemonSummary[] = [];
        let next: string | null = data.next || null;
        const count = data.count || (data.pokemon ? data.pokemon.length : 0);

        if (url.includes(TYPE_URL) && data.pokemon) {
          results = data.pokemon.map((p: any) => ({
            name: p.pokemon.name,
            url: p.pokemon.url,
            id: p.pokemon.url.split("/").slice(-2, -1)[0] || "0",
          }));
          next = null;
        } else {
          results = data.results.map((p: any) => ({
            name: p.name,
            url: p.url,
            id: p.url.split("/").slice(-2, -1)[0] || "0",
          }));
        }

        dispatch({
          type: "FETCH_SUCCESS",
          payload: { results, next, count, pageUrl: url },
        });
      } catch (err: any) {
        if (err.name === "AbortError") return;
        dispatch({
          type: "FETCH_ERROR",
          payload: err.message || "Fetch error",
        });
      }
    },
    []
  );

  return fetchData;
}
