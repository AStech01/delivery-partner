// src/pages/Signup.js
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <motion.div
        className="relative w-full max-w-2xl rounded-xl p-6 sm:p-8 shadow-xl border border-white border-opacity-20 bg-white/30 backdrop-blur-md text-gray-800"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/30 pb-4 mb-4">
          <h2 className="text-2xl font-semibold text-[#d33c3c]">Sign Up</h2>
          <button
            className="text-black cursor-pointer hover:text-white text-xl font-bold"
            onClick={() => navigate(-1)}
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <motion.form
          className="space-y-6 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {['Full Name', 'Email', 'Phone', 'Location'].map((label, index) => {
            const type = label === 'Email' ? 'email' : label === 'Phone' ? 'tel' : 'text';
            const id = label.toLowerCase().replace(/\s+/g, '-');

            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <label htmlFor={id} className="block text-sm font-semibold text-black mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  id={id}
                  className="w-full px-4 py-2 rounded-md bg-white/60 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5f5c5c] shadow-sm"
                  placeholder={`Enter your ${label.toLowerCase()}`}
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
          className="border-t border-white/30 pt-4 text-sm text-black text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-[#000000] underline cursor-pointer hover:text-red-400 transition"
          >
            Login
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
