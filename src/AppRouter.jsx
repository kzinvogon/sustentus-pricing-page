import React, { useState, useEffect } from 'react';
import App from './App';
import Login from './Login';

function AppRouter() {
  const [currentPage, setCurrentPage] = useState('main');

  useEffect(() => {
    // Check if we're on the login page
    if (window.location.pathname === '/login') {
      setCurrentPage('login');
    }
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    if (page === 'login') {
      window.history.pushState({}, '', '/login');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/login') {
        setCurrentPage('login');
      } else {
        setCurrentPage('main');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPage === 'login') {
    return <Login onBackToMain={() => handleNavigation('main')} />;
  }

  return <App onNavigateToLogin={() => handleNavigation('login')} />;
}

export default AppRouter;
