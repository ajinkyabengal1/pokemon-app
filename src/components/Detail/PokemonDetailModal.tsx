import React from 'react';
import { usePokemonContext } from '../../context/PokemonContext';

const PokemonDetailModal: React.FC = () => {
  const { detailPokemon, setDetailPokemon, isDetailLoading, detailError } = usePokemonContext();
  if (!detailPokemon) return null;

  const getStatColor = (v: number) => v >= 100 ? 'bg-red-500' : v >= 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
      onClick={() => setDetailPokemon(null)}
    >
      
      <div
        className="w-full max-w-lg overflow-hidden shadow-2xl bg-white/90 backdrop-blur-sm rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between pb-4 mb-4 border-b">
            <h2 className="text-3xl font-extrabold capitalize">{detailPokemon.name}</h2>
            <button onClick={() => setDetailPokemon(null)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          {isDetailLoading ? (
            <div className="flex items-center justify-center h-40"><span className="w-8 h-8 border-4 border-indigo-500 rounded-full animate-spin border-t-transparent"></span></div>
          ) : detailError ? (
            <div className="p-4 text-red-500 bg-red-100 rounded">Error: {detailError}</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center">
                <img src={detailPokemon.imageUrl || `https://placehold.co/150x150?text=${detailPokemon.name}`} alt={detailPokemon.name} className="object-contain w-40 h-40 p-2 bg-gray-100 rounded-full" />
                <p className="text-sm font-medium text-gray-500">ID: #{detailPokemon.id}</p>
                <div className="flex mt-2 space-x-2">{detailPokemon.types?.map(t => <span key={t.type.name} className="px-3 py-1 text-xs text-indigo-800 capitalize bg-indigo-100 rounded-full">{t.type.name}</span>)}</div>
              </div>

              <div>
                <h3 className="mb-3 text-xl font-bold">Base Stats :</h3>
                <div className="space-y-2">
                  {detailPokemon.stats?.map(s => (
                    <div key={s.stat.name} className="flex items-center text-sm">
                      <span className="w-20 font-medium capitalize">{s.stat.name.replace('-', ' ')}:</span>
                      <span className="w-8 mr-2 font-bold text-right">{s.base_stat}</span>
                      <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                        <div className={`${getStatColor(s.base_stat)} h-2.5 rounded-full`} style={{ width: `${Math.min(s.base_stat, 150) / 1.5}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="mt-4 mb-2 text-xl font-bold">Abilities :</h3>
                <p className="text-sm text-gray-600 capitalize">{detailPokemon.abilities}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailModal;
