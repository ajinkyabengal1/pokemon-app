import { useCallback, useState } from "react";
import type { PokemonSummary } from "../context/PokemonContext";

export default function useLocalStorage(
  key: string,
  initialValue: Record<string, PokemonSummary>
) {
  const [storedValue, setStoredValue] = useState<
    Record<string, PokemonSummary>
  >(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (
      value:
        | Record<string, PokemonSummary>
        | ((
            prev: Record<string, PokemonSummary>
          ) => Record<string, PokemonSummary>)
    ) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("localStorage write error", error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue] as const;
}
