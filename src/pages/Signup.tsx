/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FloatingInput } from '../components/FloatingInput';

export const Signup: React.FC = () => {
  const { signup, error, clearError, goBack } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    companyName: '',
    isAgency: 'yes' as 'yes' | 'no',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Core field checks
  const isFormValid =
    form.fullName.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.trim().length > 0;

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    const success = await signup(
      {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        companyName: form.companyName || undefined,
        isAgency: form.isAgency,
      },
      form.password
    );
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col h-full bg-[#F7F8F9] px-6 pt-4 pb-8 overflow-y-auto no-scrollbar"
    >
      {/* Back button */}
      <div className="flex items-center gap-2 mb-4 select-none shrink-0">
        <button
          id="btn-signup-back"
          type="button"
          onClick={goBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-200/60 active:scale-95 text-[#1D2226] transition-all cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Screen Title */}
      <div className="mb-6 shrink-0">
        <h1 id="signup-title" className="text-[26px] font-extrabold text-[#1D2226] tracking-tight leading-8">
          Create your <br /> PopX account
        </h1>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-[8px] text-red-700 text-[12px] font-semibold"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p>{error}</p>
              <button
                type="button"
                onClick={clearError}
                className="mt-0.5 text-[11px] underline text-red-600 block"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signup Form */}
      <form onSubmit={handleCreateAccount} className="flex-grow flex flex-col justify-between">
        <div className="space-y-1">
          <FloatingInput
            id="register-fullname"
            label="Full Name"
            placeholder="e.g. Marry Doe"
            value={form.fullName}
            onChange={(val) => {
              if (error) clearError();
              setForm({ ...form, fullName: val });
            }}
            required
          />

          <FloatingInput
            id="register-phone"
            label="Phone number"
            placeholder="e.g. 5550199"
            value={form.phone}
            onChange={(val) => {
              if (error) clearError();
              const numericVal = val.replace(/\D/g, '');
              setForm({ ...form, phone: numericVal });
            }}
            required
          />

          <FloatingInput
            id="register-email"
            label="Email address"
            type="email"
            placeholder="e.g. Marry@gmail.com"
            value={form.email}
            onChange={(val) => {
              if (error) clearError();
              setForm({ ...form, email: val });
            }}
            required
          />

          <FloatingInput
            id="register-password"
            label="Password"
            type="password"
            placeholder="Choose password"
            value={form.password}
            onChange={(val) => {
              if (error) clearError();
              setForm({ ...form, password: val });
            }}
            required
          />

          <FloatingInput
            id="register-company"
            label="Company name"
            placeholder="Optional"
            value={form.companyName}
            onChange={(val) => setForm({ ...form, companyName: val })}
          />

          {/* Agency Choice Question Module */}
          <div className="pt-2 pb-4 select-none">
            <p className="text-[13.5px] font-semibold text-[#1D2226]">
              Are you an Agency?<span className="text-red-500 ml-0.5 font-bold">*</span>
            </p>
            <div className="flex items-center gap-6 mt-2.5">
              <label className="flex items-center gap-2 cursor-pointer text-[14px] font-semibold text-[#1D2226]/90 hover:text-[#6C25FF] transition-colors">
                <input
                  id="agency-yes"
                  type="radio"
                  name="agency"
                  value="yes"
                  checked={form.isAgency === 'yes'}
                  onChange={() => setForm({ ...form, isAgency: 'yes' })}
                  className="accent-[#6C25FF] h-4 w-4 transform scale-120 cursor-pointer"
                />
                Yes
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-[14px] font-semibold text-[#1D2226]/90 hover:text-[#6C25FF] transition-colors">
                <input
                  id="agency-no"
                  type="radio"
                  name="agency"
                  value="no"
                  checked={form.isAgency === 'no'}
                  onChange={() => setForm({ ...form, isAgency: 'no' })}
                  className="accent-[#6C25FF] h-4 w-4 transform scale-120 cursor-pointer"
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Create Account Submission button - stays sticky at bottom */}
        <button
          id="btn-signup-submit"
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full py-3.5 text-[15px] font-bold rounded-[6px] tracking-wide transition-all duration-200 select-none cursor-pointer mt-5 ${
            isFormValid
              ? 'bg-[#6C25FF] hover:bg-[#5C19FC] text-white shadow-md shadow-[#6C25FF]/10 active:scale-[0.98]'
              : 'bg-[#CBCBCB] text-white cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </motion.div>
  );
};
