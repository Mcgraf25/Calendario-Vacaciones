
import React from 'react';

interface UserSelectorProps {
  users: string[];
  currentUser: string | null;
  onUserChange: (user: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ users, currentUser, onUserChange }) => {
  return (
    <div>
      <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-2">
        Selecciona tu nombre para editar:
      </label>
      <select
        id="user-select"
        value={currentUser || ''}
        onChange={(e) => onUserChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
      >
        {users.map(user => (
          <option key={user} value={user}>
            {user}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSelector;
