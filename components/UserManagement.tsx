import React, { useState } from 'react';

interface UserManagementProps {
  isOpen: boolean;
  onClose: () => void;
  users: string[];
  onAddUser: (name: string) => void;
  onRemoveUser: (name: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ isOpen, onClose, users, onAddUser, onRemoveUser }) => {
  const [newUserName, setNewUserName] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleAddClick = () => {
    const trimmedName = newUserName.trim();
    if (trimmedName === '') {
      alert('El nombre no puede estar vacío.');
      return;
    }
    if (users.map(u => u.toLowerCase()).includes(trimmedName.toLowerCase())) {
      alert('El usuario ya existe.');
      return;
    }
    onAddUser(trimmedName);
    setNewUserName('');
  };
  
  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddClick();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Gestionar Empleados</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="new-user-name" className="block text-sm font-medium text-gray-700">Añadir nuevo empleado</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              id="new-user-name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              onKeyPress={handleInputKeyPress}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              placeholder="Nombre Apellido"
            />
            <button
              onClick={handleAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Añadir
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Lista de Empleados</h3>
          <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200 border-t border-b border-gray-200">
            {users.length > 0 ? users.map(user => (
              <li key={user} className="py-3 flex justify-between items-center">
                <span className="text-sm text-gray-800">{user}</span>
                <button
                  onClick={() => onRemoveUser(user)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                  aria-label={`Eliminar a ${user}`}
                >
                  Eliminar
                </button>
              </li>
            )) : (
                <li className="py-3 text-center text-sm text-gray-500">No hay empleados.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
