import React from 'react';
import ControlPanel from './components/controls/ControlPanel';
import PokemonListView from './components/List/PokemonListView';
import FavoritesView from './components/Favorites/FavoritesView';
import PokemonDetailModal from './components/Detail/PokemonDetailModal';
import { usePokemonContext } from './context/PokemonContext';

const App: React.FC = () => {
  const { activeView } = usePokemonContext();
  return (
    <div className="p-4 mx-auto sm:p-8 max-w-7xl">
      <h1 className="mb-4 text-4xl font-bold text-center text-gray-600">Pokemon App </h1>
      <p className="mb-2 text-center text-gray-600">Welcome to the Pokemon Universe!</p>
      <ControlPanel />
      {activeView === 'list' ? <PokemonListView /> : <FavoritesView />}
      <PokemonDetailModal />
    </div>
  );
};

export default App;
