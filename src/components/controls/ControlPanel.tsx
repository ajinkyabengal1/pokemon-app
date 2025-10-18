import React from 'react';
import { usePokemonContext } from "../../context/PokemonContext";

const ControlPanel: React.FC = () => {
  const {
    types, filterType, setFilterType, searchTerm, setSearchTerm,
    sortKey, setSortKey, sortOrder, setSortOrder, activeView, setActiveView, favorites
  } = usePokemonContext();

  const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  const isListActive = activeView === 'list';

  return (
    <div className="bg-white p-4 shadow-lg rounded-xl mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Global Search (Debounced)</label>
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2.5" placeholder="Search by name..." disabled={!isListActive}/>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type Filter</label>
          <select value={filterType} onChange={(e)=> setFilterType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2.5" disabled={!isListActive}>
            <option value="">All Types</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex space-x-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <select value={sortKey} onChange={(e)=> setSortKey(e.target.value as 'id'|'name')} className="mt-1 block rounded-md border-gray-300 p-2.5" disabled={!isListActive}>
              <option value="id">Pokedex ID</option>
              <option value="name">Name</option>
            </select>
          </div>
          <button onClick={toggleSortOrder} className={`mt-6 p-2.5 rounded-md ${sortOrder === 'asc' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`} disabled={!isListActive}>
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      <div className="mt-4 flex space-x-4 border-t pt-4">
        <button onClick={() => setActiveView('list')} className={`px-4 py-2 rounded-lg ${isListActive ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Explore List</button>
        <button onClick={() => setActiveView('favorites')} className={`px-4 py-2 rounded-lg ${!isListActive ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Favorites <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-white text-red-600 rounded-full border">{favorites.length}</span></button>
      </div>
    </div>
  );
};

export default ControlPanel;
