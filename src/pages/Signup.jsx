import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { handleError, handleSuccess } from "../utils";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    console.log(import.meta.env.VITE_API_URL);

    if (!name || !email || !password) {
      return handleError("Name, email, and password are required");
    }

    try {
      const url = `${import.meta.env.VITE_API_URL}/auth/signup`; 
      const response = await axios.post(url, signupInfo, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, message, error } = response.data;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message;
        handleError(details);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Signup</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-1">
              Name
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              placeholder="Enter your name..."
              value={signupInfo.name}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-1">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium mb-1"
            >
              Password
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={signupInfo.password}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded mt-4 hover:bg-purple-700 transition"
          >
            Signup
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
