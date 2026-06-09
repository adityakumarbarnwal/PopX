/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PhoneFrame } from './components/PhoneFrame';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { AnimatePresence } from 'motion/react';

const ScreenRenderer: React.FC = () => {
  const { currentScreen, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#F7F8F9] select-none">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-[3px] border-[#CBC2FF]/40 border-t-[#6C25FF] rounded-full animate-spin"></div>
          <div className="absolute w-5 h-5 bg-[#6C25FF] rounded-full animate-ping opacity-25"></div>
        </div>
        <p className="mt-4 text-[#6C25FF] text-[13px] font-bold uppercase tracking-widest animate-pulse">
          Loading PopX
        </p>
      </div>
    );
  }

  // Handle seamless page router displays with animated slide/fade transitions
  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        {currentScreen === 'welcome' && <Welcome key="welcome" />}
        {currentScreen === 'login' && <Login key="login" />}
        {currentScreen === 'signup' && <Signup key="signup" />}
        {currentScreen === 'profile' && <Profile key="profile" />}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PhoneFrame>
        <ScreenRenderer />
      </PhoneFrame>
    </AuthProvider>
  );
}
