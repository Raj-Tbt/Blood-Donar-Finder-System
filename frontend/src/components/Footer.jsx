/**
 * Footer Component
 *
 * Displays the application footer with brand information,
 * quick navigation links, and contact details.
 */

import { Link } from 'react-router-dom';
import { FiHeart, FiGithub, FiMail, FiPhone } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-dark-bg border-t border-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-blood-500 to-blood-700 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-bold">BD</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                Blood<span className="text-blood-500">Donor</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Connecting donors with those in need. Every drop counts, every life matters.
              Join our community of life-savers today.
            </p>
            <p className="text-gray-500 text-xs mt-4 flex items-center">
              Made with <FiHeart className="w-3 h-3 text-blood-500 mx-1" /> for people of India
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/donors" className="hover:text-blood-400 transition-colors">Find Donors</Link></li>
              <li><Link to="/requests" className="hover:text-blood-400 transition-colors">Blood Requests</Link></li>
              <li><Link to="/register" className="hover:text-blood-400 transition-colors">Register</Link></li>
              <li><Link to="/login" className="hover:text-blood-400 transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Contact information */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-blood-400" />
                <span>support@blooddonor.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4 text-blood-400" />
                <span>+91 7841875444</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Blood Donor Finder System. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Vishwakarma Institute of Technology</p>
        </div>
      </div>
    </footer>
  );
}
