'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar: React.FC = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/profile', label: 'นักกีฬา' },
    { href: '/lobby', label: 'ห้องแข่ง (Lobby)' },
    { href: '/match', label: 'แมตช์' },
    { href: '/leaderboard', label: 'Rankings' },
  ];

  return (
    <nav className="flex items-center justify-between px-8 h-14 bg-[#0D0E1A]/95 border-b border-[#E8B429]/15 sticky top-0 z-40 backdrop-blur-md">
      {/* Brand Logo */}
      <Link href="/profile" className="flex items-center gap-2.5 group">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="group-hover:scale-105 transition-transform">
          <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#E8B429" strokeWidth="1.5" />
          <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="rgba(232,180,41,0.12)" stroke="#E8B429" strokeWidth="1" />
          <circle cx="14" cy="14" r="3" fill="#E8B429" />
        </svg>
        <span className="font-bold tracking-widest text-[#E8B429] text-lg uppercase drop-shadow-[0_0_12px_rgba(232,180,41,0.3)]">
          ZODIAC ARENA
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6 text-xs font-semibold tracking-wider">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors py-1 relative ${
                isActive
                  ? 'text-[#E8B429] font-bold'
                  : 'text-neutral-400 hover:text-[#E8B429]'
              }`}
            >
              {link.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8B429] shadow-[0_0_8px_#E8B429]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
