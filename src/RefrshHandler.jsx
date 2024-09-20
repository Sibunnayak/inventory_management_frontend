import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode }from "jwt-decode"; 

function RefrshHandler({ setIsAuthenticated, setUserRole }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            setIsAuthenticated(true);
            const decoded = jwtDecode(token);
            setUserRole(decoded.role);

            if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup') {
                navigate(decoded.role === 'admin' ? '/home/dashboard' : '/home/user-dashboard', { replace: true });
            }
        }
    }, [location, navigate, setIsAuthenticated, setUserRole]);

    return null;
}

export default RefrshHandler;
