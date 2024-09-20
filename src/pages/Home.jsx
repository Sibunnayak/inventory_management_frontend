import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet, Navigate } from 'react-router-dom';

function Home({ isAuthenticated, userRole }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  if (!isAuthenticated) {

    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <Header toggleSidebar={toggleSidebar} />
      <div className="content">
        <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} userRole={userRole} />
        <main className="main">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

export default Home;
