'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function RiotLoginButton() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/auth/riot');
  };

  return (
    <button
      onClick={handleLogin}
      className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all"
    >
      Sign in with Riot Games
    </button>
  );
}