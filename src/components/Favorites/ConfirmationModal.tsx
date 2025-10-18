import React from 'react';

const ConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; count: number; }> = ({ isOpen, onClose, onConfirm, count }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl">
        <h3 className="mb-4 text-xl font-bold text-red-600">Confirm Removal</h3>
        <p className="mb-6 text-gray-700">Are you sure you want to remove <strong>{count}</strong> favorite Pokémon? This cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 text-white bg-red-600 rounded">Remove ({count})</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
