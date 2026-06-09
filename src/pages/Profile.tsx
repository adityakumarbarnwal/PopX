/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { LogOut, Camera, Landmark, Phone, Mail, Building2, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [avatar, setAvatar] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col h-full bg-[#F7F8F9] select-none overflow-y-auto no-scrollbar"
    >
      {/* Pristine Screen Header */}
      <div className="bg-white px-6 py-4.5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-30 shrink-0 shadow-sm shadow-slate-100/40">
        <h2 id="profile-header-title" className="text-[17px] font-extrabold text-[#1D2226] tracking-tight">
          Account Settings
        </h2>
        {/* Sign Out Action Button */}
        <button
          id="btn-logout"
          onClick={logout}
          type="button"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-red-50 text-[#1D2226] hover:text-red-500 font-bold text-[12px] transition-colors shrink-0 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="flex-grow p-6 space-y-7">
        {/* User Identity Section */}
        <div className="flex items-center gap-4.5">
          {/* Circular Interactive Avatar Frame */}
          <div className="relative group shrink-0">
            <div
              onClick={handleAvatarClick}
              className="w-[82px] h-[82px] rounded-full overflow-hidden border-2 border-[#CBC2FF] hover:border-[#6C25FF] bg-slate-100 relative cursor-pointer shadow-md shadow-[#6C25FF]/5 transition-all duration-200"
            >
              <img
                id="user-avatar"
                src={avatar}
                alt="Profile Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={() => {
                  // Fallback avatar if unsplash is unreachable
                  setAvatar('https://i.imgur.com/8Km9tLL.png');
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </div>
            </div>

            {/* Hidden Input reference for file uploads */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Simulated camera upload circular pill overlay */}
            <button
              onClick={handleAvatarClick}
              type="button"
              className="absolute -bottom-1 -right-1 p-2 bg-white hover:bg-[#F7F8F9] text-[#6C25FF] rounded-full shadow-md border border-[#CBC2FF] active:scale-90 transition-transform cursor-pointer"
              aria-label="Upload photo"
            >
              <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* User names and emails */}
          <div className="min-w-0 flex-1">
            <h4
              id="profile-user-fullname"
              className="text-[18.5px] font-extrabold text-[#1D2226] leading-tight truncate tracking-tight"
            >
              {user?.fullName || 'Marry Doe'}
            </h4>
            <p
              id="profile-user-email"
              className="text-[13px] font-semibold text-[#6A6A6A] leading-normal truncate mt-0.5"
            >
              {user?.email || 'Marry@Gmail.Com'}
            </p>
          </div>
        </div>

        {/* Text Bio block exactly following image format */}
        <div className="space-y-1">
          <p
            id="profile-user-bio"
            className="text-[14px] font-medium leading-[22px] text-[#6A6A6A] tracking-normal"
          >
            Lorem Ipsum Dolor Sit Amet, Consetetur Sadipscing Elitr, Sed Diam Nonumy Eirmod Tempor
            Invidunt Ut Labore Et Dolore Magna Aliquyam Erat, Sed Diam
          </p>
        </div>

        {/* Dashed Line Separator sitting before client database fields */}
        <div className="border-t-[1.5px] border-dashed border-[#CBC2FF]" />

        {/* Live Database Data breakdown */}
        <div className="space-y-4">
          <h5 className="text-[12px] font-bold uppercase tracking-wider text-[#6C25FF]">
            Verified Account Details
          </h5>
          
          <div className="bg-white rounded-[12px] p-4.5 border border-[#CBC2FF]/30 space-y-3.5 shadow-sm shadow-[#6C25FF]/2">
            {/* Phone Info Row */}
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="flex items-center gap-2 font-medium text-[#6A6A6A]">
                <Phone className="w-4 h-4 text-[#6C25FF]/70" />
                <span>Phone number</span>
              </span>
              <span id="profile-info-phone" className="font-bold text-[#1D2226]">
                {user?.phone || '+1 (555) 019-9238'}
              </span>
            </div>

            {/* Company Info Row */}
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="flex items-center gap-2 font-medium text-[#6A6A6A]">
                <Building2 className="w-4 h-4 text-[#6C25FF]/70" />
                <span>Company name</span>
              </span>
              <span id="profile-info-company" className="font-bold text-[#1D2226]">
                {user?.companyName || 'Not Provided'}
              </span>
            </div>

            {/* Agency Tier Info Row */}
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="flex items-center gap-2 font-medium text-[#6A6A6A]">
                <Landmark className="w-4 h-4 text-[#6C25FF]/70" />
                <span>Agency member</span>
              </span>
              <span
                id="profile-info-agency"
                className={`flex items-center gap-1 px-2 py-0.5 rounded-[5px] text-[11px] font-bold uppercase ${
                  user?.isAgency === 'yes'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>{user?.isAgency === 'yes' ? 'Yes' : 'No'}</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
