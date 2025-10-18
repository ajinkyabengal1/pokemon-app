import React from 'react';
import { usePokemonContext } from '../../context/pokemonContext';
import type { PokemonSummary } from '../../context/pokemonContext';

const PokemonCard: React.FC<{ pokemon: PokemonSummary }> = React.memo(({ pokemon }) => {
  const { toggleFavorite, favorites, fetchPokemonDetail, activeView } = usePokemonContext();
  const isFavorite = !!favorites.find(f => f.id === pokemon.id);

  const getImageUrl = (id: string) => {
    const imageId = id.toString().padStart(3, '0');
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${imageId}.png`;
  };

  return (
    <div className="flex flex-col overflow-hidden border shadow-lg cursor-pointer bg-white/90 rounded-xl">
      <div className="flex flex-col items-center justify-center flex-grow p-4" onClick={() => fetchPokemonDetail(pokemon)}>
        <img src={getImageUrl(pokemon.id)} alt={pokemon.name} className="object-contain w-24 h-24 mb-2" onError={(e:any) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://placehold.co/96x96/4C51BF/ffffff?text=${pokemon.id}` }} />
        <p className="text-xs font-medium text-indigo-500 uppercase">#{pokemon.id}</p>
        <h3 className="text-lg font-bold text-gray-800 capitalize">{pokemon.name}</h3>
      </div>

      <button onClick={() => toggleFavorite(pokemon)} className={`w-full py-2 text-sm font-semibold ${isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
        {isFavorite ? 'Unfavorite' : 'Favorite'}
      </button>

      {activeView === 'favorites' && pokemon.onSelect && (
        <label className="flex items-center justify-center p-2 text-indigo-800 bg-indigo-100">
          <input type="checkbox" className="w-4 h-4" onChange={(e) => pokemon.onSelect?.(pokemon.id, e.target.checked)} checked={pokemon.isSelected}/>
          <span className="ml-2 text-xs">Select to remove</span>
        </label>
      )}
    </div>
  );
});

export default PokemonCard;
