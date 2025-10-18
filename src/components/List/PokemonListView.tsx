import React, { useRef, useEffect } from 'react';
import { usePokemonContext } from '../../context/PokemonContext';
import PokemonCard from './PokemonCard';

const PokemonListView: React.FC = () => {
  const { processedList, isLoading, error, hasMore, fetchNextPage } = usePokemonContext();
  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        fetchNextPage();
      }
    }, { threshold: 0.1 });

    observer.observe(target);
    return () => observer.disconnect();
  }, [isLoading, hasMore, fetchNextPage]);

  if (error) return <div className="p-6 text-red-600 rounded bg-red-50">Error: {error}</div>;
  if (!isLoading && processedList.length === 0) return <div className="p-10 text-center">No Pokémon found.</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {processedList.map(el => <PokemonCard key={el.id} pokemon={el} />)}
      </div>

      <div ref={observerTarget} className="h-1"></div>

      {isLoading && <div className="flex items-center justify-center py-8"><span className="w-8 h-8 mr-3 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></span><span>Loading more Pokemon.</span></div>}
      {!hasMore && !isLoading && processedList.length > 0 && <div className="py-6 text-center text-gray-500">You've reached the end of the list!</div>}
    </div>
  );
};

export default PokemonListView;
