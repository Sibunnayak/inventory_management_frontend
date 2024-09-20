import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isSidebarOpen, closeSidebar, userRole }) {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <nav className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <button
        onClick={closeSidebar}
        className="lg:hidden absolute top-4 right-4 text-2xl"
      >
        &times;
      </button>
      <ul className="flex flex-col space-y-4 p-4">
        {userRole === "user" && (
          <>
            <li>
              <Link
                to="/home/user-dashboard"
                className={`block px-4 py-2 rounded-md ${
                  activePath === "/home/user-dashboard"
                    ? "bg-black"
                    : "hover:bg-gray-600"
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/home/scan-qrcode"
                className={`block px-4 py-2 rounded-md ${
                  activePath === "/home/scan-qrcode"
                    ? "bg-black"
                    : "hover:bg-gray-600"
                }`}
              >
                Scan QR Code
              </Link>
            </li>
          </>
        )}
        {userRole === "admin" && (
          <>
            <li>
              <Link
                to="/home/dashboard"
                className={`block px-4 py-2 rounded-md ${
                  activePath === "/home/dashboard"
                    ? "bg-black"
                    : "hover:bg-gray-600"
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/home/generate-scanner"
                className={`block px-4 py-2 rounded-md ${
                  activePath === "/home/generate-scanner"
                    ? "bg-black"
                    : "hover:bg-gray-600"
                }`}
              >
                Generate Scanner
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Sidebar;
