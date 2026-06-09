/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  const [time, setTime] = useState<string>('12:00');

  // Update clock time to display a real live status bar
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // convert to 12 hour
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="phone-layout" className="flex items-center justify-center min-h-screen w-full bg-[#EBF0F6] p-4 font-sans selection:bg-[#CBC2FF] selection:text-[#1D2226]">
      {/* Decorative desktop ambient circles to elevate the aesthetics */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#CBC2FF]/20 rounded-full blur-3xl pointer-events-none hidden lg:block" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#6C25FF]/10 rounded-full blur-3xl pointer-events-none hidden lg:block" />

      {/* Main outer smartphone frame */}
      <div className="relative w-full max-w-[375px] h-[97vh] bg-white rounded-[44px] shadow-[0_25px_60px_-15px_rgba(108,37,255,0.15)] ring-12 ring-slate-900/10 flex flex-col overflow-hidden transition-all duration-300 md:scale-100 scale-95 origin-center">
        
        {/* Dynamic Island / Speaker Notch Wrapper */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[110px] h-[24px] bg-[#1D2226] rounded-b-[18px] z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-[#2D3236] rounded-full absolute top-[6px] opacity-40"></div>
          <div className="w-[8px] h-[8px] bg-[#1a1b1d] rounded-full absolute right-[18px] top-[7px] border border-gray-800"></div>
        </div>

        {/* Status Bar simulation */}
        <div className="h-[40px] px-6 pt-3 flex items-center justify-between text-[#1D2226] bg-[#F7F8F9] select-none text-[12px] font-semibold z-40 shrink-0">
          <div>{time}</div>
          <div className="flex items-center gap-1.5 opacity-80">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="relative flex items-center">
              <Battery className="w-4 h-4 text-[#1D2226]" />
              <div className="absolute right-[4px] w-[5px] h-[6px] bg-[#1D2226] rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Screen canvas */}
        <div className="flex-1 w-full bg-[#F7F8F9] overflow-y-auto relative flex flex-col no-scrollbar">
          {children}
        </div>

        {/* iOS Home Indicator Bar mockup */}
        <div className="h-[24px] w-full bg-[#F7F8F9] flex items-center justify-center select-none shrink-0 z-40">
          <div className="w-[110px] h-[4px] bg-[#1D2226] rounded-full opacity-35 hover:opacity-100 transition-opacity"></div>
        </div>

      </div>
    </div>
  );
};
