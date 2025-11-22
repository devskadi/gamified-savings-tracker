'use client';

// ============================================
// Pokédex Frame Component - Modern Style
// The main container with Pokédex aesthetics
// ============================================

import React from 'react';

interface PokedexFrameProps {
  children: React.ReactNode;
}

/**
 * Main Pokédex-styled frame container
 * Clean modern design inspired by official Pokédex app
 */
export function PokedexFrame({ children }: PokedexFrameProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header bar with Pokédex branding */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Pokéball icon */}
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-red-500 to-red-600" style={{ clipPath: 'inset(0 0 50% 0)' }} />
              <div className="absolute inset-0 rounded-full bg-white" style={{ clipPath: 'inset(50% 0 0 0)' }} />
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -translate-y-1/2" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-800" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight">
                PokéSavings
              </h1>
              <p className="text-[10px] text-gray-400 -mt-0.5">
                Track your savings goals
              </p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-400">Online</span>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom safe area for mobile */}
      <div className="h-6" />
    </div>
  );
}
