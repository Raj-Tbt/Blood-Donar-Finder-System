/**
 * Navbar Component
 *
 * Responsive navigation bar with scroll-aware styling, role-based
 * navigation links, user profile display, and mobile menu support.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiUser, FiHome, FiSearch, FiList, FiGrid, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import DarkModeToggle from './DarkModeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Track scroll position to toggle background opacity */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  /* Build navigation links based on user role */
  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/donors', label: 'Find Donors', icon: FiSearch },
    { to: '/requests', label: 'Requests', icon: FiList },
  ];

  if (user?.role === 'hospital') {
    navLinks.push({ to: '/dashboard', label: 'Dashboard', icon: FiGrid });
  }
  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin', icon: FiShield });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-dark-bg/90 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand logo and name */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-blood-500 to-blood-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-sm font-bold">BD</span>
            </div>
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white">
              Blood<span className="text-blood-500">Donor</span>
            </span>
          </Link>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-blood-500 text-white shadow-lg shadow-blood-500/30'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blood-500 dark:hover:text-blood-400 hover:bg-blood-50 dark:hover:bg-dark-surface'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop right-side actions */}
          <div className="hidden md:flex items-center space-x-3">
            <DarkModeToggle />
            {user && <NotificationBell />}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={user.role === 'donor' ? `/donors/${user.donor?.id || ''}` : '/dashboard'}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blood-500 to-blood-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.name?.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-blood-500 hover:bg-blood-50 dark:hover:bg-dark-surface rounded-xl transition-all"
                  title="Logout"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="btn-ghost text-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            {user && <NotificationBell />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-dark-bg border-t border-gray-100 dark:border-gray-800"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-blood-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              <hr className="border-gray-200 dark:border-gray-700" />
              {user ? (
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-dark-surface w-full"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link to="/login" className="block px-4 py-3 rounded-xl text-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-surface">
                    Log In
                  </Link>
                  <Link to="/register" className="block btn-primary text-center text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
