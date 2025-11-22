'use client';

// ============================================
// Pixel-styled Input Component
// ============================================

import React from 'react';

interface PixelInputProps {
  type?: 'text' | 'number';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

/**
 * Input field styled with 8-bit pixel aesthetics
 */
export function PixelInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  min,
  max,
  step,
  disabled = false,
  className = '',
  required = false,
}: PixelInputProps) {
  return (
    <div className={`${className}`}>
      {label && (
        <label
          className="block text-[8px] sm:text-[10px] font-pixel mb-2 uppercase"
          style={{ color: '#0F380F' }}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        required={required}
        className={`
          pixel-input
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
    </div>
  );
}

/**
 * Textarea styled with 8-bit pixel aesthetics
 */
interface PixelTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  disabled?: boolean;
  className?: string;
}

export function PixelTextarea({
  value,
  onChange,
  placeholder,
  label,
  rows = 3,
  disabled = false,
  className = '',
}: PixelTextareaProps) {
  return (
    <div className={`${className}`}>
      {label && (
        <label
          className="block text-[8px] sm:text-[10px] font-pixel mb-2 uppercase"
          style={{ color: '#0F380F' }}
        >
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`
          pixel-input resize-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
    </div>
  );
}
