'use client';

// ============================================
// Pixel-styled Button Component
// ============================================

import React from 'react';

interface PixelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

/**
 * Button styled with 8-bit pixel aesthetics
 */
export function PixelButton({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  className = '',
}: PixelButtonProps) {
  const variantClasses = {
    default: 'pixel-btn',
    primary: 'pixel-btn pixel-btn-primary',
    danger: 'pixel-btn pixel-btn-danger',
    success: 'pixel-btn pixel-btn-success',
  };

  const sizeClasses = {
    sm: 'text-[8px] px-2 py-1',
    md: 'text-[10px] px-4 py-2',
    lg: 'text-xs px-6 py-3',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
