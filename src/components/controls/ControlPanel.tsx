
import React from 'react';

const controlPanel: React.FC = () => {

    const isListActive = true;

    // toggle sort function
    const toggleSortOrder = ()=>{
        console.log("toggled");
    }

  return <div className='bg-white p-4 shadow-lg rounded-xl mb-6'>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* search feild */}
         <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Search :</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 p-2.5" placeholder="Search by name..." />
        </div>

        {/* filter by types */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Type Filter</label>
          <select  className="mt-1 block w-full rounded-md border-gray-300 p-2.5" disabled={!isListActive}>
            <option value="">All Types</option>
            <option value="">1</option>
          </select>
        </div>

        {/* sorting filed */}
        <div className="flex space-x-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <select  className="mt-1 block rounded-md border-gray-300 p-2.5" disabled={!isListActive}>
              <option value="id">Pokedex ID</option>
              <option value="name">Name</option>
            </select>
          </div>
          <button onClick={toggleSortOrder} className="mt-6 p-2.5 rounded-md ${sortOrder === 'asc' ? 'bg-indigo-500 text-white' : 'bg-gray-200'}" disabled={false}>
            {'Desc'}
          </button>
        </div>
    </div>


        {/* Buttons */}
<div className="mt-4 flex space-x-4 border-t pt-4">
        <button  className={`px-4 py-2 rounded-lg ${isListActive ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>Explore List</button>
        <button  className={`px-4 py-2 rounded-lg ${!isListActive ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>Favorites <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-white text-red-600 rounded-full border">123</span></button>
      </div>
  </div>;
}

export default controlPanel;