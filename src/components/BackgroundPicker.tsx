'use client';

// ============================================
// Background Picker Component
// Allows users to customize Pokemon card backgrounds
// ============================================

import React, { useState } from 'react';
import { BackgroundTheme, BackgroundConfig, BACKGROUND_THEMES } from '@/types';
import { PixelButton } from './PixelButton';

interface BackgroundPickerProps {
  currentBackground?: BackgroundConfig;
  defaultTypeColor: string; // Fallback color based on Pokemon type
  onSelect: (background: BackgroundConfig) => void;
  onCancel: () => void;
}

/**
 * Modal for selecting background themes for Pokemon cards
 */
export function BackgroundPicker({
  currentBackground,
  defaultTypeColor,
  onSelect,
  onCancel,
}: BackgroundPickerProps) {
  const [selectedTheme, setSelectedTheme] = useState<BackgroundTheme>(
    currentBackground?.theme || 'default'
  );
  const [customColor, setCustomColor] = useState(
    currentBackground?.customColor || '#6366f1'
  );

  const handleConfirm = () => {
    onSelect({
      theme: selectedTheme,
      customColor: selectedTheme === 'custom' ? customColor : undefined,
    });
  };

  const themes: Array<{ id: BackgroundTheme; name: string; preview: string }> = [
    { id: 'default', name: 'Default', preview: defaultTypeColor },
    ...Object.entries(BACKGROUND_THEMES).map(([id, theme]) => ({
      id: id as BackgroundTheme,
      name: theme.name,
      preview: theme.gradient,
    })),
    { id: 'custom', name: 'Custom', preview: customColor },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div
        className="w-full max-w-md border-4 border-gray-800 rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#1a1a2e' }}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-gray-700 bg-gradient-to-r from-purple-900 to-indigo-900">
          <h2 className="text-sm font-pixel text-white text-center">
            Choose Background
          </h2>
        </div>

        {/* Theme Grid */}
        <div className="p-4 max-h-[60vh] overflow-y-auto pixel-scrollbar">
          <div className="grid grid-cols-3 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`
                  relative p-1 rounded-xl transition-all duration-200
                  ${selectedTheme === theme.id
                    ? 'ring-4 ring-yellow-400 scale-105'
                    : 'ring-2 ring-gray-600 hover:ring-gray-400'
                  }
                `}
              >
                {/* Preview */}
                <div
                  className="w-full aspect-square rounded-lg"
                  style={{
                    background: theme.preview,
                  }}
                />
                {/* Label */}
                <p className="mt-1 text-[8px] font-pixel text-gray-300 text-center truncate">
                  {theme.name}
                </p>
                {/* Selected indicator */}
                {selectedTheme === theme.id && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-gray-800">
                    <span className="text-[10px]">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Picker */}
          {selectedTheme === 'custom' && (
            <div className="mt-4 p-3 bg-gray-800 rounded-xl">
              <label className="block text-[10px] font-pixel text-gray-300 mb-2">
                Custom Color
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-600"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1 px-3 py-2 text-[10px] font-pixel bg-gray-700 text-white border-2 border-gray-600 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="mt-4 p-3 bg-gray-800 rounded-xl">
            <p className="text-[10px] font-pixel text-gray-400 mb-2">Preview</p>
            <div
              className="h-24 rounded-xl flex items-center justify-center"
              style={{
                background:
                  selectedTheme === 'default'
                    ? defaultTypeColor
                    : selectedTheme === 'custom'
                      ? customColor
                      : BACKGROUND_THEMES[selectedTheme as keyof typeof BACKGROUND_THEMES]?.gradient,
              }}
            >
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-gray-700 bg-gray-900 flex gap-3">
          <PixelButton onClick={onCancel} fullWidth>
            Cancel
          </PixelButton>
          <PixelButton onClick={handleConfirm} variant="primary" fullWidth>
            Apply
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Get background style for a Pokemon card
 */
export function getBackgroundStyle(
  background: BackgroundConfig | undefined,
  defaultTypeColor: string
): React.CSSProperties {
  if (!background || background.theme === 'default') {
    return { background: defaultTypeColor };
  }

  if (background.theme === 'custom' && background.customColor) {
    return { background: background.customColor };
  }

  const theme = BACKGROUND_THEMES[background.theme as keyof typeof BACKGROUND_THEMES];
  if (theme) {
    return { background: theme.gradient };
  }

  return { background: defaultTypeColor };
}

/**
 * Get text color for a background theme
 */
export function getTextColor(
  background: BackgroundConfig | undefined,
  defaultColor: string = '#0F380F'
): string {
  if (!background || background.theme === 'default') {
    return defaultColor;
  }

  if (background.theme === 'custom') {
    // For custom colors, determine if we need light or dark text
    return '#ffffff';
  }

  const theme = BACKGROUND_THEMES[background.theme as keyof typeof BACKGROUND_THEMES];
  return theme?.textColor || defaultColor;
}
