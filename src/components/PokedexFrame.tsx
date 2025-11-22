'use client';

// ============================================
// Pokédex Frame Component
// The main container styled like a Pokédex
// ============================================

import React from 'react';

interface PokedexFrameProps {
  children: React.ReactNode;
}

/**
 * Main Pokédex-styled frame container
 * Provides the iconic red shell with screen area
 */
export function PokedexFrame({ children }: PokedexFrameProps) {
  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Main Pokédex body */}
        <div className="pokedex-frame p-3 sm:p-4 md:p-6">
          {/* Top decorative lights */}
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            {/* Big blue light */}
            <div className="relative">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-cyan-300 via-cyan-500 to-blue-600 border-4 border-gray-800 shadow-lg">
                <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/50" />
              </div>
              {/* Pulsing glow effect */}
              <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-pulse" />
            </div>

            {/* Small indicator lights */}
            <div className="flex gap-1 sm:gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 border-2 border-gray-800 shadow-inner" />
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-400 border-2 border-gray-800 shadow-inner" />
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 border-2 border-gray-800 shadow-inner" />
            </div>

            {/* Title */}
            <div className="ml-auto">
              <h1 className="text-[8px] sm:text-xs text-white/90 font-pixel tracking-wider">
                POKéSAVINGS
              </h1>
            </div>
          </div>

          {/* Main screen area */}
          <div className="pokedex-screen p-2 sm:p-3 md:p-4 relative overflow-hidden">
            {/* Scanlines overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />
            </div>

            {/* Content */}
            <div className="relative z-10">{children}</div>
          </div>

          {/* Bottom controls decoration */}
          <div className="mt-3 sm:mt-4 flex items-center justify-between">
            {/* D-pad decoration */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 rounded-sm" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 rounded-sm" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 rounded-sm" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 rounded-sm" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 rounded-sm" />
            </div>

            {/* Speaker grille decoration */}
            <div className="flex flex-col gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 sm:w-16 h-1 bg-gray-800 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
