/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, KeyRound, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FloatingInput } from '../components/FloatingInput';

export const Login: React.FC = () => {
  const { login, error, clearError, goBack } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col h-full bg-[#F7F8F9] px-6 pt-4 pb-8"
    >
      {/* Top Header Row with ArrowBack Navigation */}
      <div className="flex items-center gap-2 mb-6 select-none shrink-0">
        <button
          id="btn-login-back"
          type="button"
          onClick={goBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-200/60 active:scale-95 text-[#1D2226] transition-all cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Hero Typography */}
      <div className="mb-8 shrink-0">
        <h1 id="login-title" className="text-[28px] font-extrabold text-[#1D2226] tracking-tight leading-9">
          Signin to your <br /> PopX account
        </h1>
        <p id="login-subtitle" className="mt-3 text-[15px] text-[#6A6A6A] leading-[22px] font-medium">
          Lorem ipsum dolor sit amet, <br />consectetur adipiscing elit,
        </p>
      </div>

      {/* Error Announcement Badge */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-5 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-[8px] text-red-700 text-[12.5px] font-semibold"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{error}</p>
              <button
                type="button"
                onClick={clearError}
                className="mt-1 text-[11px] underline text-red-600 block hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Login Form Layout */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <FloatingInput
            id="login-email"
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(val) => {
              if (error) clearError();
              setEmail(val);
            }}
            required
          />

          <div className="relative w-full">
            <FloatingInput
              id="login-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(val) => {
                if (error) clearError();
                setPassword(val);
              }}
              required
            />
            
            {/* Show / Hide Toggle Button */}
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[15px] text-slate-400 hover:text-[#6C25FF] p-1 rounded-md transition-colors z-30"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Interactive Login Button */}
        <button
          id="btn-login-submit"
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-3.5 text-[15px] font-bold rounded-[6px] tracking-wide transition-all duration-200 select-none cursor-pointer mt-6 ${
            isFormValid
              ? 'bg-[#6C25FF] hover:bg-[#5C19FC] text-white shadow-md shadow-[#6C25FF]/10 active:scale-[0.98]'
              : 'bg-[#CBCBCB] text-white cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </motion.div>
  );
};
