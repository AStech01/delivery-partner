import React, { useState, useEffect } from 'react';
import {
  FaBars,
  FaTimes,
  FaMapMarkerAlt,
  FaTruck,
  FaUserCircle,
  FaClipboardList,
  FaSignInAlt,
  FaSignOutAlt,
  FaHome,
} from 'react-icons/fa';
import { Switch } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg px-6 py-4 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
       <Link
  to="/"
  className="text-2xl font-bold text-indigo-700 flex items-center gap-2 hover:text-indigo-800 transition"
>
  <FaTruck className="text-indigo-600" /> DeliveryPartner
</Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition cursor-pointer"
          >
            <FaHome /> Home
          </button>

          <button
            onClick={() => navigate('/deliverydashboard')}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition cursor-pointer"
          >
            <FaClipboardList /> Dashboard
          </button>

          <button
            onClick={() => navigate('/LiveLocationTracker')}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition cursor-pointer"
          >
            <FaMapMarkerAlt /> Live Tracking
          </button>

          <button
            onClick={() => navigate('/deliveryorders')}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition cursor-pointer">
            <FaTruck /> Orders
          </button>

          {/* <a href="#profile" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition cursor-pointer">
            <FaUserCircle /> Profile
          </a> */}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition cursor-pointer"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
            >
              <FaSignInAlt /> Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden px-4 pt-4 space-y-3">
          <button
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
          >
            <FaHome /> Home
          </button>

          <button
            onClick={() => {
              navigate('/deliverydashboard');
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
          >
            <FaClipboardList /> Dashboard
          </button>

          <button
            onClick={() => {
              navigate('/LiveLocationTracker');
              setIsMenuOpen(false);
            }}
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
          >
            <FaMapMarkerAlt /> Live Tracking
          </button>

          <a href="#orders" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
            <FaTruck /> Orders
          </a>

          <a href="#profile" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600">
            <FaUserCircle /> Profile
          </a>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
            <Switch
              checked={isOnline}
              onChange={setIsOnline}
              className={`${
                isOnline ? 'bg-green-500' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full transition`}
            >
              <span
                className={`${
                  isOnline ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 w-full text-left"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate('/');
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 w-full text-left"
            >
              <FaSignInAlt /> Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
