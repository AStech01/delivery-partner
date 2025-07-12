// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { FaShippingFast, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import left_bg_img from '../../assets/dl-05.avif';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On component mount, load user from localStorage if exists
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.id]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',
        signupData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Signup successful! Please login.');
      setIsSignupOpen(false);
      setSignupData({ name: '', email: '', password: '', location: '' });
      setIsLoginOpen(true);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Signup failed');
      } else {
        setError('Signup failed due to network/server error.');
      }
    }
  };

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/login',
      loginData,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    alert('Welcome to Delivery Partner');

    const data = response.data;

    // ✅ Store token
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    // ✅ Store user info (main part)
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user)); // <- THIS is what you're asking about
      setUser(data.user); // update React state
    } else {
      // Fallback in case server only returns email
      localStorage.setItem('user', JSON.stringify({ name: loginData.email }));
      setUser({ name: loginData.email });
    }

    // ✅ Clear form and redirect
    setIsLoginOpen(false);
    setLoginData({ email: '', password: '' });
    navigate('/'); // Go to homepage or tracking page
  } catch (err) {
    if (err.response) {
      setError(err.response.data.message || 'Login failed');
    } else {
      setError('Login failed due to network/server error.');
    }
  }
};


  // Logout function (optional)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative">
      <Navbar />

      {/* Main content */}
      <div className="flex justify-center items-center flex-grow bg-gray-100 p-6">
        <motion.div
          className="w-full max-w-7xl md:h-[700px] h-[600px] rounded-2xl shadow-xl overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            backgroundImage: `url(${left_bg_img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-opacity-40 rounded-2xl "></div>

          <motion.div
            className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-12 md:px-16 lg:px-24 max-w-4xl text-black space-y-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
              Join over 34,000+ riders in delivering orders everyday
            </h1>
            <p className="text-lg md:text-xl drop-shadow-md">
              We offer payments every week, and you work at your flexibility
            </p>

            {user ? (
              <div className="flex items-center gap-4">
                <motion.button
                  // onClick={() => navigate('/track')} // Replace with your tracking route
                  className="flex items-center gap-2 bg-white text-[#d33c3c] w-48 justify-center py-3 rounded-full font-semibold shadow-md hover:bg-red-100 transition transform hover:scale-105"
                  whileTap={{ scale: 0.95 }}
                >
                  <FaMapMarkerAlt className="text-xl" />
                  Welcome, Track Me
                </motion.button>

                {/* <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gray-300 text-gray-800 w-24 justify-center py-3 rounded-full font-semibold shadow-md hover:bg-gray-400 transition transform hover:scale-105"
                  whileTap={{ scale: 0.95 }}
                  title="Logout"
                >
                  <FaSignOutAlt />
                  Logout
                </motion.button> */}
              </div>
            ) : (
              <motion.button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 bg-white text-[#d33c3c] w-40 justify-center py-3 rounded-full font-semibold shadow-md hover:bg-red-100 transition transform hover:scale-105"
                whileTap={{ scale: 0.95 }}
              >
                <FaShippingFast className="text-xl" />
                Login Now
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Signup Modal */}
      <AnimatePresence>
        {isSignupOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-opacity-40 flex items-center justify-center backdrop-blur-sm bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsSignupOpen(false);
              setError('');
            }}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-xl p-6 sm:p-8 shadow-xl border border-white border-opacity-20 bg-white/90 backdrop-blur-md text-gray-800"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
                <h2 className="text-2xl font-semibold text-[#d33c3c]">Sign Up</h2>
                <button
                  className="text-black cursor-pointer hover:text-[#d33c3c] text-xl font-bold"
                  onClick={() => {
                    setIsSignupOpen(false);
                    setError('');
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Error message */}
              {error && (
                <p className="mb-4 text-red-600 font-semibold">{error}</p>
              )}

              {/* Form */}
              <motion.form
                className="space-y-6 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                onSubmit={handleSignupSubmit}
              >
                {['name', 'email', 'password', 'location'].map((field, index) => {
                  const label =
                    field.charAt(0).toUpperCase() + field.slice(1);
                  const type =
                    field === 'email'
                      ? 'email'
                      : field === 'password'
                      ? 'password'
                      : 'text';
                  return (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <label
                        htmlFor={field}
                        className="block text-sm font-semibold text-black mb-1"
                      >
                        {label}
                      </label>
                      <input
                        type={type}
                        id={field}
                        value={signupData[field]}
                        onChange={handleSignupChange}
                        className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f5c5c] shadow-sm"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                        required
                      />
                    </motion.div>
                  );
                })}

                <motion.button
                  type="submit"
                  className="w-full py-3 bg-[#d33c3c] text-white font-semibold rounded-md shadow-md hover:bg-red-600 hover:shadow-lg transition transform hover:-translate-y-0.5 active:scale-95"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                >
                  Submit
                </motion.button>
              </motion.form>

              {/* Footer */}
              <motion.div
                className="pt-3 text-sm text-black text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Already have an account?{' '}
                <span
                  onClick={() => {
                    setIsSignupOpen(false);
                    setError('');
                    setIsLoginOpen(true);
                  }}
                  className="text-[#d33c3c] underline cursor-pointer hover:text-red-400 transition"
                >
                  Login
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-opacity-40 flex items-center justify-center backdrop-blur-sm bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsLoginOpen(false);
              setError('');
            }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-xl p-6 sm:p-8 shadow-xl border border-white border-opacity-20 bg-white/90 backdrop-blur-md text-gray-800"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-4">
                <h2 className="text-2xl font-semibold text-[#d33c3c]">Login</h2>
                <button
                  className="text-black cursor-pointer hover:text-[#d33c3c] text-xl font-bold"
                  onClick={() => {
                    setIsLoginOpen(false);
                    setError('');
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Error message */}
              {error && (
                <p className="mb-4 text-red-600 font-semibold">{error}</p>
              )}

              {/* Form */}
              <motion.form
                className="space-y-6 mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                onSubmit={handleLoginSubmit}
              >
                {['email', 'password'].map((field, index) => {
                  const label = field.charAt(0).toUpperCase() + field.slice(1);
                  const type = field === 'email' ? 'email' : 'password';
                  return (
                    <motion.div
                      key={field}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <label
                        htmlFor={field}
                        className="block text-sm font-semibold text-black mb-1"
                      >
                        {label}
                      </label>
                      <input
                        type={type}
                        id={field}
                        value={loginData[field]}
                        onChange={handleLoginChange}
                        className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f5c5c] shadow-sm"
                        placeholder={`Enter your ${label.toLowerCase()}`}
                        required
                      />
                    </motion.div>
                  );
                })}

                <motion.button
                  type="submit"
                  className="w-full py-3 bg-[#d33c3c] text-white font-semibold rounded-md shadow-md hover:bg-red-600 hover:shadow-lg transition transform hover:-translate-y-0.5 active:scale-95"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                >
                  Login
                </motion.button>
              </motion.form>

              {/* Footer */}
              <motion.div
                className="pt-3 text-sm text-black text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Don't have an account?{' '}
                <span
                  onClick={() => {
                    setIsLoginOpen(false);
                    setError('');
                    setIsSignupOpen(true);
                  }}
                  className="text-[#d33c3c] underline cursor-pointer hover:text-red-400 transition"
                >
                  Sign Up
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
