import React from 'react';
import { Link } from 'react-router-dom';

function ProfileDropdown({ handleLogout }) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-lg z-20">
      <ul>
        <li>
          <Link to="/home/profile" className="block px-4 py-2 hover:bg-gray-200">Profile</Link>
        </li>
        <li>
          <button 
            onClick={handleLogout} 
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ProfileDropdown;

