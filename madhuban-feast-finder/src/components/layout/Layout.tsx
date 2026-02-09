import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn) {
      sessionStorage.removeItem('justLoggedIn');
      setAnimateIn(true);
      const id = window.setTimeout(() => setAnimateIn(false), 700);
      return () => window.clearTimeout(id);
    }
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${animateIn ? 'page-enter' : ''}`}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
