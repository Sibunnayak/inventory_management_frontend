import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { HiMenuAlt3 } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function Header({ toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove user info and token from localStorage
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token"); // Add this line if you're storing the token
    
    setIsDropdownOpen(false); 
    // Optionally, you could set any user state to null here if using context/state management
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <header className="header">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="lg:hidden">
          <HiMenuAlt3 size={24} />
        </button>
        <Link to="/" className="text-2xl font-bold">
          Logo
        </Link>
      </div>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2"
        >
          <img
            src="profile-icon.png"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </button>
        {isDropdownOpen && <ProfileDropdown handleLogout={handleLogout} />}
      </div>
    </header>
  );
}

export default Header;
