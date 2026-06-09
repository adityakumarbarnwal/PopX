/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-5 w-full">
      {/* Floating Label sitting exactly on the border line */}
      <label
        htmlFor={id}
        id={`${id}-label`}
        className={`absolute left-3 -top-2.5 px-1.5 text-[12px] font-semibold tracking-wide bg-[#F7F8F9] select-none transition-all duration-150 z-20 ${
          isFocused ? 'text-[#6C25FF]' : 'text-[#6C25FF]/85'
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5 font-bold">*</span>}
      </label>

      {/* Input Field with subtle purple border */}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 py-3 text-[14px] font-medium text-[#1D2226] bg-transparent border rounded-[6px] outline-none transition-all duration-200 z-10 relative ${
          isFocused 
            ? 'border-[#6C25FF] shadow-[0_0_0_2.5px_rgba(108,37,255,0.08)]' 
            : 'border-[#CBC2FF] hover:border-[#6C25FF]/40'
        }`}
      />
    </div>
  );
};
