// src/pages/Login.js
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="relative w-full max-w-md rounded-xl p-6 sm:p-8 shadow-xl border border-white border-opacity-20 bg-white/30 backdrop-blur-md text-gray-800"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/30 pb-4 mb-4">
          <h2 className="text-2xl font-semibold text-[#d33c3c]">Login</h2>
          <button
            className="text-black cursor-pointer hover:text-white text-xl font-bold"
            onClick={() => navigate(-1)}
          >
            &times;
          </button>
        </div>

        {/* Login Form */}
        <motion.form
          className="space-y-6 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-md bg-white/60 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f5c5c] shadow-sm"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-black mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-md bg-white/60 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f5c5c] shadow-sm"
              placeholder="Enter your password"
            />
          </div>

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
          className="border-t border-white/30 pt-4 text-sm text-white text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Don’t have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-[#d33c3c] underline cursor-pointer hover:text-red-300 transition"
          >
            Sign Up
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
