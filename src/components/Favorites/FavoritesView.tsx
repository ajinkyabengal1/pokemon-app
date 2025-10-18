import React, { useState, useCallback } from 'react';
import { usePokemonContext } from '../../context/PokemonContext';
import PokemonCard from '../List/PokemonCard';
import ConfirmationModal from './ConfirmationModal';

const FavoritesView: React.FC = () => {
  const { favorites, bulkRemoveFavorites } = usePokemonContext();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const toggleSelect = useCallback((id: string, isSelected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (isSelected) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const handleBulkRemove = () => setIsConfirmOpen(true);
  const handleConfirmRemove = () => { bulkRemoveFavorites(Array.from(selectedIds)); setSelectedIds(new Set()); setIsConfirmOpen(false); };

  if (favorites.length === 0) return <div className="p-10 text-center">You have no favorite Pokémon yet.</div>;

  const selectable = favorites.map(f => ({ ...f, isSelected: selectedIds.has(f.id), onSelect: toggleSelect }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl">
        <label className="flex items-center">
          <input type="checkbox" className="w-5 h-5" checked={selectedIds.size === favorites.length && favorites.length > 0} onChange={() => {
            if (selectedIds.size === favorites.length) setSelectedIds(new Set());
            else setSelectedIds(new Set(favorites.map(f => f.id)));
          }} />
          <span className="ml-2 font-semibold">Select All ({selectedIds.size})</span>
        </label>

        <button onClick={handleBulkRemove} disabled={selectedIds.size === 0} className={`px-6 py-2 rounded-lg ${selectedIds.size ? 'bg-red-500 text-white' : 'bg-gray-300'}`}>Bulk Remove ({selectedIds.size})</button>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {selectable.map(p => <PokemonCard key={p.id} pokemon={p} />)}
      </div>

      <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmRemove} count={selectedIds.size} />
    </div>
  );
};

export default FavoritesView;

/* ConfirmationModal is defined below or move to its own file for reuse */
