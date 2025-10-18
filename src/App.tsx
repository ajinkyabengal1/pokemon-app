
import './App.css'
import ControlPanel from './components/controls/ControlPanel'



function App() {


  return (
    <>
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Pokemon </h1>
      <p className="text-center text-gray-600">Welcome to the Pokemon Universe! Start your adventure by searching for your favorite Pokémon.</p>
    </div>
   <ControlPanel />
    </>
  )
}

export default App
