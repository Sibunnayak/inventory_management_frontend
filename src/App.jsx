import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import DashboardAdmin from './pages/DashboardAdmin';
import GenerateScanner from './pages/GenerateScanner';
import ScanScanner from './pages/ScanScanner';
import RefrshHandler from './RefrshHandler';
import Profile from './pages/Profile';
import DashboardUser from './pages/dashboarduser';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const PrivateRoute = ({ children, roles }) => {
    return isAuthenticated && roles.includes(userRole) ? children : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={
          <PrivateRoute roles={['user', 'admin']}>
            <Home isAuthenticated={isAuthenticated} userRole={userRole} />
          </PrivateRoute>
        }>
          <Route path="dashboard" element={
            <PrivateRoute roles={['admin']}>
              <DashboardAdmin />
            </PrivateRoute>
          } />
          <Route path="generate-scanner" element={
            <PrivateRoute roles={['admin']}>
              <GenerateScanner />
            </PrivateRoute>
          } />
          <Route path="user-dashboard" element={
            <PrivateRoute roles={['user']}>
              <DashboardUser />
            </PrivateRoute>
          } />
          <Route path="scan-qrcode" element={
            <PrivateRoute roles={['user']}>
              <ScanScanner />
            </PrivateRoute>
          } />
          <Route path="profile" element={
            <PrivateRoute roles={['user', 'admin']}>
              <Profile />
            </PrivateRoute>
          } />
          <Route index element={<Navigate to={userRole === 'admin' ? 'dashboard' : 'user-dashboard'} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
