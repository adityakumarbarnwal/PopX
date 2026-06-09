/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export const Welcome: React.FC = () => {
  const { navigateTo } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col justify-end h-full px-6 pb-10 bg-[#F7F8F9] relative"
    >
      {/* Decorative Brand Accent Icon */}
      <div className="absolute top-16 left-6 flex flex-col gap-1 select-none">
        <div className="flex gap-1.5 items-center">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-tr from-[#6C25FF] to-[#5C19FC] flex items-center justify-center shadow-md shadow-[#6C25FF]/20">
            <span className="text-white text-base font-extrabold tracking-tighter">P</span>
          </div>
          <span className="text-[14px] font-extrabold tracking-widest text-[#1D2226] uppercase">PopX App</span>
        </div>
      </div>

      {/* Main Copy Typography */}
      <div className="mb-10">
        <h1 id="welcome-title" className="text-[28px] font-extrabold text-[#1D2226] tracking-tight leading-9">
          Welcome to PopX
        </h1>
        <p id="welcome-subtitle" className="mt-3 text-[15px] text-[#6A6A6A] leading-[22px] font-medium max-w-[280px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        </p>
      </div>

      {/* Interactive Actions Grid */}
      <div className="flex flex-col gap-3.5">
        <button
          id="btn-create-account"
          type="button"
          onClick={() => navigateTo('signup')}
          className="w-full py-3.5 bg-[#6C25FF] hover:bg-[#5C19FC] active:scale-[0.98] text-white text-[15px] font-bold rounded-[6px] tracking-wide transition-all duration-150 shadow-md shadow-[#6C25FF]/10 cursor-pointer"
        >
          Create Account
        </button>

        <button
          id="btn-goto-login"
          type="button"
          onClick={() => navigateTo('login')}
          className="w-full py-3.5 bg-[#CBC2FF] hover:bg-[#b0a5f0] active:scale-[0.98] text-[#1D2226] text-[15px] font-bold rounded-[6px] tracking-wide transition-all duration-150 cursor-pointer"
        >
          Already Registered? Login
        </button>
      </div>
    </motion.div>
  );
};
