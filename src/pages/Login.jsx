// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import axios from 'axios';
// import { handleError, handleSuccess } from '../utils';

// function Login() {
//     const [loginInfo, setLoginInfo] = useState({
//         email: '',
//         password: ''
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setLoginInfo(prevState => ({ ...prevState, [name]: value }));
//     }

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         const { email, password } = loginInfo;
//         if (!email || !password) {
//             return handleError('Email and password are required');
//         }
//         try {
//             const url = `${import.meta.env.VITE_API_URL}/auth/login`;
//             const response = await axios.post(url, loginInfo, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//             const { success, message, jwtToken, name, error, role } = response.data;
//             if (success) {
//                 handleSuccess(message);
//                 localStorage.setItem('token', jwtToken);
//                 localStorage.setItem('loggedInUser', name);
//                 localStorage.setItem('role', role);
//                 localStorage.setItem('email', email);
//                 setTimeout(() => {
//                     navigate('/home');
//                 }, 1000);
//             } else if (error) {
//                 const details = error?.details[0]?.message;
//                 handleError(details);
//             } else {
//                 handleError(message);
//             }
//         } catch (err) {
//             handleError(err.response?.data?.message || err.message);
//         }
//     }

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100">
//             <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//                 <h1 className="text-2xl font-bold mb-6">Login</h1>
//                 <form onSubmit={handleLogin} className="space-y-4">
//                     <div>
//                         <label htmlFor="email" className="block text-lg font-medium mb-1">Email</label>
//                         <input
//                             onChange={handleChange}
//                             type="email"
//                             name="email"
//                             placeholder="Enter your email..."
//                             value={loginInfo.email}
//                             className="w-full p-2 border border-gray-300 rounded"
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="password" className="block text-lg font-medium mb-1">Password</label>
//                         <input
//                             onChange={handleChange}
//                             type="password"
//                             name="password"
//                             placeholder="Enter your password..."
//                             value={loginInfo.password}
//                             className="w-full p-2 border border-gray-300 rounded"
//                         />
//                     </div>
//                     <button
//                         type="submit"
//                         className="w-full bg-purple-600 text-white py-2 rounded mt-4 hover:bg-purple-700 transition"
//                     >
//                         Login
//                     </button>
//                     <p className="text-center text-gray-600 mt-4">
//                         Doesn't have an account? <Link to="/signup" className="text-purple-600 hover:underline">Signup</Link>
//                     </p>
//                 </form>
//                 <ToastContainer />
//             </div>
//         </div>
//     );
// }

// export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import { handleError, handleSuccess } from "../utils";
import { jwtDecode } from "jwt-decode";

function Login({ setIsAuthenticated, setUserRole }) {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
        return handleError('Email and password are required');
    }

    try {
        const url = `${import.meta.env.VITE_API_URL}/auth/login`; 
        const response = await axios.post(url, loginInfo, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { success, message, jwtToken } = response.data;

        if (success) {
            handleSuccess(message);
            localStorage.setItem('token', jwtToken);
            const decoded = jwtDecode(jwtToken); // Decode the token
            setUserRole(decoded.role); // Set user role in state
            setIsAuthenticated(true); // Set authentication state
            setTimeout(() => {
                navigate('/home');
            }, 1000);
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
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-1">
              Email
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={loginInfo.email}
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
              value={loginInfo.password}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded mt-4 hover:bg-purple-700 transition"
          >
            Login
          </button>
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 hover:underline">
              Signup
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
