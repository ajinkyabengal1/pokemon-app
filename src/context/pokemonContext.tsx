import React, { useReducer, useState, useEffect, useCallback, useMemo } from 'react';
import usePokemonFetcher from '../hooks/usePokemonFetch';
import useDebounce from '../hooks/useDebounce';
import useLocalStorage from '../hooks/useLocalStorage';
import { BASE_URL, TYPE_URL, LIST_LIMIT } from "../utils/constant";

/* -------------- Types -------------- */
export interface PokemonSummary {
  name: string;
  url: string;
  id: string;
  onSelect?: (id: string, isSelected: boolean) => void;
  isSelected?: boolean;
}

export interface PokemonDetail extends PokemonSummary {
  imageUrl: string;
  stats: { stat: { name: string }; base_stat: number }[];
  abilities: string;
  types: { slot: number; type: { name: string } }[];
}

export interface ListState {
  data: PokemonSummary[];
  nextUrl: string | null;
  prevUrl: string | null;
  isLoading: boolean;
  error: string | null;
  cache: Record<string, { results: PokemonSummary[]; next: string | null; count: number }>;
  hasMore: boolean;
  count: number;
}

export type ListAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { results: PokemonSummary[]; next: string | null; count: number; pageUrl: string; } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'RESET_LIST' };

/* -------------- Reducer -------------- */
const initialListState: ListState = {
  data: [],
  nextUrl: `${BASE_URL}?limit=${LIST_LIMIT}&offset=0`,
  prevUrl: null,
  isLoading: false,
  error: null,
  cache: {},
  hasMore: true,
  count: 0,
};

function listReducer(state: ListState, action: ListAction): ListState {
  console.log(' Action:', action.type, action);

  switch (action.type) {
    case 'FETCH_START':
      console.log(' -> FETCH_START');
      return { ...state, isLoading: true, error: null };

    case 'FETCH_SUCCESS': {
      const { results, next, count, pageUrl } = action.payload;
      console.log(' -> FETCH_SUCCESS:', { resultsCount: results.length, next, count, pageUrl });
      const isFirstPageOrFilter = pageUrl.includes('offset=0') || pageUrl.includes('type');
      const newData = isFirstPageOrFilter ? results : [...state.data, ...results];
      return {
        ...state,
        data: newData,
        nextUrl: next,
        count,
        isLoading: false,
        hasMore: !!next,
        cache: { ...state.cache, [pageUrl]: { results, next, count } },
      };
    }

    case 'FETCH_ERROR':
      console.error(' -> FETCH_ERROR:', action.payload);
      return { ...state, isLoading: false, error: action.payload };

    case 'RESET_LIST':
      console.log(' -> RESET_LIST');
      return { ...initialListState, cache: {} };

    default:
      console.log(' -> UNKNOWN ACTION:', action);
      return state;
  }
}

/* -------------- Context Type -------------- */
export interface PokemonContextType extends ListState {
  processedList: PokemonSummary[];
  fetchNextPage: (urlOverride?: string | null) => void;
  fetchPokemonDetail: (pokemon: PokemonSummary) => void;
  types: string[];
  filterType: string;
  setFilterType: (type: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortKey: 'id' | 'name';
  setSortKey: (key: 'id' | 'name') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  favorites: PokemonSummary[];
  toggleFavorite: (pokemon: PokemonSummary) => void;
  bulkRemoveFavorites: (ids: string[]) => void;
  detailPokemon: PokemonDetail | null;
  setDetailPokemon: (p: PokemonDetail | null) => void;
  isDetailLoading: boolean;
  detailError: string | null;
  activeView: 'list' | 'favorites';
  setActiveView: (v: 'list' | 'favorites') => void;
}

const PokemonContext = React.createContext<PokemonContextType | undefined>(undefined);

/* -------------- Provider -------------- */
export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listState, dispatch] = useReducer(listReducer, initialListState);
  const fetchData = usePokemonFetcher();

  const [types, setTypes] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortKey, setSortKey] = useState<'id' | 'name'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [favoritesMap, setFavoritesMap] = useLocalStorage('pokemon-favorites', {});
  const [detailPokemon, setDetailPokemon] = useState<PokemonDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'favorites'>('list');

  // fetch types once
  useEffect(() => {
    console.log(' Fetching Pokemon types...');
    (async () => {
      try {
        const res = await fetch(TYPE_URL);
        const data = await res.json();
        const typeNames = data.results.map((t: any) => t.name);
        console.log(' Types fetched:', typeNames);
        setTypes(typeNames);
      } catch (err) {
        console.error(' Failed to load types', err);
      }
    })();
  }, []);

  const fetchNextPage = useCallback((urlOverride: string | null = null) => {
    const url = urlOverride || listState.nextUrl;
    console.log(' Called with URL:', url);
    if (!url) {
      console.warn(' No URL found — skipping fetch');
      return;
    }
    if (listState.isLoading) {
      console.warn(' Already loading — skipping');
      return;
    }
    fetchData({ url, cache: listState.cache, dispatch });
  }, [listState.nextUrl, listState.isLoading, listState.cache, fetchData]);

  // filter change resets list and fetches new
  useEffect(() => {
    const url = filterType ? `${TYPE_URL}/${filterType}` : `${BASE_URL}?limit=${LIST_LIMIT}&offset=0`;
    if (!listState.isLoading) {
      console.log(' Resetting list and fetching for filter:', filterType);
      dispatch({ type: 'RESET_LIST' });
      fetchNextPage(url);
    }
  }, [filterType]);

  const fetchPokemonDetail = useCallback(async (pokemon: PokemonSummary) => {
    if (!pokemon) { setDetailPokemon(null); return; }
    setIsDetailLoading(true); setDetailError(null);
    try {
      const res = await fetch(pokemon.url);
      if (!res.ok) throw new Error('Failed to fetch detail');
      const data = await res.json();
      console.log(' Data fetched:', data);
      const detail: PokemonDetail = {
        ...pokemon,
        ...data,
        imageUrl: data.sprites?.front_default || '',
        stats: data.stats || [],
        abilities: (data.abilities || []).map((a: any) => a.ability.name).join(', '),
        types: data.types || [],
      };
      setDetailPokemon(detail);
    } catch (err: any) {
      console.error(' Error:', err.message);
      setDetailError(err.message || 'Detail fetch error');
    } finally {
      setIsDetailLoading(false);
      console.log(' Done.');
    }
  }, []);

  const toggleFavorite = useCallback((pokemon: PokemonSummary) => {
    console.log(' Toggling favorite for:', pokemon.name);
    setFavoritesMap(prev => {
      const newFavs = { ...prev };
      if (newFavs[pokemon.id]) {
        console.log(' Removing from favorites:', pokemon.id);
        delete newFavs[pokemon.id];
      } else {
        console.log(' Adding to favorites:', pokemon.id);
        newFavs[pokemon.id] = { name: pokemon.name, url: pokemon.url, id: pokemon.id };
      }
      return newFavs;
    });
  }, [setFavoritesMap]);

  const bulkRemoveFavorites = useCallback((ids: string[]) => {
    console.log(' Removing multiple favorites:', ids);
    setFavoritesMap(prev => {
      const next = { ...prev };
      ids.forEach(id => delete next[id]);
      return next;
    });
  }, [setFavoritesMap]);

  const processedList = useMemo(() => {
    let list = listState.data.slice();

    if (debouncedSearchTerm) {
      const q = debouncedSearchTerm.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
      console.log(`Filtered list by search result: "${q}" -> ${list.length}`);
    }

    list.sort((a, b) => {
      const aVal = sortKey === 'id' ? parseInt(a.id) : a.name.toLowerCase();
      const bVal = sortKey === 'id' ? parseInt(b.id) : b.name.toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    console.log('Sorted list by', sortKey, sortOrder);
    return list;
  }, [listState.data, debouncedSearchTerm, sortKey, sortOrder]);

  const ctxValue = {
    ...listState,
    processedList,
    fetchNextPage,
    fetchPokemonDetail,
    types, filterType, setFilterType,
    searchTerm, setSearchTerm,
    sortKey, setSortKey,
    sortOrder, setSortOrder,
    favorites: Object.values(favoritesMap),
    toggleFavorite,
    bulkRemoveFavorites,
    detailPokemon, setDetailPokemon,
    isDetailLoading, detailError,
    activeView, setActiveView,
  };

  console.log(' Context value ready:', {
    dataCount: listState.data.length,
    typesCount: types.length,
    favoritesCount: Object.keys(favoritesMap).length,
    filterType,
    sortKey,
    sortOrder
  });

  return <PokemonContext.Provider value={ctxValue}>{children}</PokemonContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePokemonContext = () => {
  const ctx = React.useContext(PokemonContext);
  if (!ctx) throw new Error('usePokemonContext must be used inside Provider');
  console.log("Hook used successfully");
  return ctx;
};
