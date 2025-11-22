'use client';

// ============================================
// Pokemon Sprite Component
// Displays Pokemon sprites with animations
// ============================================

import React, { useState } from 'react';

interface PokemonSpriteProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  idle?: boolean;
  evolving?: boolean;
  levelingUp?: boolean;
  className?: string;
}

/**
 * Pokemon sprite with pixel-perfect rendering and animations
 */
export function PokemonSprite({
  src,
  alt,
  size = 'md',
  idle = true,
  evolving = false,
  levelingUp = false,
  className = '',
}: PokemonSpriteProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  // Animation classes
  const animationClass = evolving
    ? 'evolving'
    : levelingUp
      ? 'level-up-flash'
      : idle
        ? 'idle'
        : '';

  // Fallback pokeball icon for errors
  const FallbackIcon = () => (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center bg-gray-200 rounded-lg border-4 border-gray-800`}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-1/2 h-1/2 text-gray-400"
        fill="currentColor"
      >
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    </div>
  );

  if (hasError) {
    return <FallbackIcon />;
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 ${sizeClasses[size]} bg-gray-200 rounded animate-pulse`}
        />
      )}

      {/* Sprite image */}
      <img
        src={src}
        alt={alt}
        className={`
          pokemon-sprite
          ${animationClass}
          ${sizeClasses[size]}
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-200
          object-contain
        `}
        style={{
          imageRendering: 'pixelated',
        }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        draggable={false}
      />

      {/* Evolution glow effect */}
      {evolving && (
        <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-50" />
      )}

      {/* Level up sparkles */}
      {levelingUp && <Sparkles />}
    </div>
  );
}

/**
 * Sparkle effects for level up
 */
function Sparkles() {
  const sparklePositions = [
    { top: '10%', left: '10%', delay: '0s' },
    { top: '20%', right: '15%', delay: '0.1s' },
    { bottom: '15%', left: '20%', delay: '0.2s' },
    { bottom: '25%', right: '10%', delay: '0.15s' },
    { top: '50%', left: '5%', delay: '0.25s' },
    { top: '40%', right: '5%', delay: '0.3s' },
  ];

  return (
    <>
      {sparklePositions.map((pos, i) => (
        <div
          key={i}
          className="sparkle"
          style={{
            ...pos,
            animationDelay: pos.delay,
          }}
        />
      ))}
    </>
  );
}
