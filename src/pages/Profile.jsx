// import React from 'react';
import React from "react";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">
          Hello, {user.name || "User"}!
        </h1>
        <p className="text-lg mb-2">
          <strong>Email:</strong> {user.email || "Not available"}
        </p>
        <p className="text-lg">
          <strong>Role:</strong> {user.role || "Not available"}
        </p>
      </div>
    </div>
  );
}

export default Profile;
