'use client';

// ============================================
// Pokemon Sprite Component
// Displays Pokemon sprites with animations
// Supports both static and animated (GIF) sprites
// ============================================

import React, { useState, useEffect } from 'react';

interface PokemonSpriteProps {
  src: string;
  animatedSrc?: string; // Animated sprite URL (GIF)
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  idle?: boolean;
  evolving?: boolean;
  levelingUp?: boolean;
  useAnimated?: boolean; // Whether to prefer animated sprite
  className?: string;
}

/**
 * Pokemon sprite with pixel-perfect rendering and animations
 * Supports both static PNG and animated GIF sprites
 */
export function PokemonSprite({
  src,
  animatedSrc,
  alt,
  size = 'md',
  idle = true,
  evolving = false,
  levelingUp = false,
  useAnimated = true,
  className = '',
}: PokemonSpriteProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useStaticFallback, setUseStaticFallback] = useState(false);

  // Determine which sprite to use
  const currentSrc = useAnimated && animatedSrc && !useStaticFallback
    ? animatedSrc
    : src;

  // Reset states when src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setUseStaticFallback(false);
  }, [src, animatedSrc]);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
    '2xl': 'w-64 h-64',
  };

  const sizePx = {
    sm: 48,
    md: 80,
    lg: 128,
    xl: 192,
    '2xl': 256,
  };

  // Animation classes - don't apply CSS animations to animated GIFs
  const isAnimatedGif = currentSrc.endsWith('.gif');
  const animationClass = evolving
    ? 'evolving'
    : levelingUp
      ? 'level-up-flash'
      : idle && !isAnimatedGif
        ? 'idle'
        : '';

  // Handle image load error - fall back to static sprite
  const handleError = () => {
    if (useAnimated && animatedSrc && !useStaticFallback) {
      // Try static sprite as fallback
      setUseStaticFallback(true);
      setIsLoaded(false);
    } else {
      setHasError(true);
    }
  };

  // Fallback pokeball icon for errors
  const FallbackIcon = () => (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl border-4 border-gray-400 shadow-inner`}
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
      {/* Loading placeholder with shimmer */}
      {!isLoaded && !hasError && (
        <div
          className={`absolute inset-0 ${sizeClasses[size]} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl animate-pulse`}
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
          }}
        />
      )}

      {/* Sprite image */}
      <img
        src={currentSrc}
        alt={alt}
        width={sizePx[size]}
        height={sizePx[size]}
        className={`
          pokemon-sprite
          ${animationClass}
          ${sizeClasses[size]}
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300
          object-contain
        `}
        style={{
          imageRendering: 'auto', // Smooth rendering for HOME sprites
        }}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
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
