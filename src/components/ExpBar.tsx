'use client';

// ============================================
// EXP Bar Component
// Shows level progress with pixel styling
// ============================================

import React from 'react';

interface ExpBarProps {
  level: number;
  expPercentage: number;
  expToNext: number;
  isLeveling?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Experience bar styled like Pokemon games
 */
export function ExpBar({
  level,
  expPercentage,
  expToNext,
  isLeveling = false,
  showLabel = true,
  size = 'md',
}: ExpBarProps) {
  const sizeClasses = {
    sm: 'h-3',
    md: 'h-5',
    lg: 'h-7',
  };

  const textSizes = {
    sm: 'text-[6px]',
    md: 'text-[8px]',
    lg: 'text-[10px]',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span
            className={`${textSizes[size]} text-screen-dark font-pixel uppercase`}
            style={{ color: '#0F380F' }}
          >
            Lv.{level}
          </span>
          <span
            className={`${textSizes[size]} font-pixel`}
            style={{ color: '#306230' }}
          >
            {level >= 100 ? 'MAX!' : `${Math.round(expPercentage)}%`}
          </span>
        </div>
      )}

      <div
        className={`exp-bar-container ${sizeClasses[size]} relative overflow-hidden`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)',
            }}
          />
        </div>

        {/* EXP fill */}
        <div
          className={`exp-bar-fill ${isLeveling ? 'leveling' : ''}`}
          style={{
            width: `${Math.min(100, expPercentage)}%`,
          }}
        >
          {/* Shine effect */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 50%)',
            }}
          />
        </div>

        {/* Level markers */}
        {size !== 'sm' && (
          <>
            <div
              className="absolute top-0 bottom-0 w-px bg-black/30"
              style={{ left: '16%' }}
              title="Evolution 1"
            />
            <div
              className="absolute top-0 bottom-0 w-px bg-black/30"
              style={{ left: '36%' }}
              title="Evolution 2"
            />
          </>
        )}
      </div>

      {/* EXP to next level */}
      {showLabel && level < 100 && (
        <div className="mt-1 text-right">
          <span
            className={`${textSizes[size]} font-pixel`}
            style={{ color: '#4a4a68' }}
          >
            NEXT: {expToNext.toFixed(0)}
          </span>
        </div>
      )}
    </div>
  );
}
