'use client';

// ============================================
// Settings Modal Component
// Configure currency, sound, and app settings
// ============================================

import React from 'react';
import { UserSettings, CURRENCIES, CurrencyOption } from '@/types';
import { PixelButton } from './PixelButton';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
  onClose: () => void;
  onResetData: () => void;
}

/**
 * Settings modal for configuring app preferences
 */
export function SettingsModal({
  settings,
  onUpdateSettings,
  onClose,
  onResetData,
}: SettingsModalProps) {
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const handleCurrencyChange = (code: string) => {
    const currency = CURRENCIES.find((c) => c.code === code);
    if (currency) {
      onUpdateSettings({ currency });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div
        className="w-full max-w-md border-4 border-gray-800 rounded-lg overflow-hidden"
        style={{ backgroundColor: '#E8DCC4' }}
      >
        {/* Header */}
        <div className="p-4 border-b-4 border-gray-800 bg-pokedex-red">
          <div className="flex justify-between items-center">
            <h2 className="text-[10px] sm:text-xs font-pixel text-white uppercase">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto pixel-scrollbar">
          {/* Currency setting */}
          <div>
            <label
              className="block text-[10px] font-pixel mb-2 uppercase"
              style={{ color: '#0F380F' }}
            >
              Currency
            </label>
            <select
              value={settings.currency.code}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="w-full px-3 py-2 text-[10px] font-pixel border-4 border-gray-800 rounded bg-cream-light"
              style={{ color: '#0F380F' }}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} - {currency.name} ({currency.code})
                </option>
              ))}
            </select>
            <p
              className="text-[8px] font-pixel mt-1"
              style={{ color: '#666' }}
            >
              Preview: {settings.currency.position === 'before'
                ? `${settings.currency.symbol}1,234.56`
                : `1,234.56${settings.currency.symbol}`}
            </p>
          </div>

          {/* Sound settings */}
          <div>
            <label
              className="block text-[10px] font-pixel mb-2 uppercase"
              style={{ color: '#0F380F' }}
            >
              Sound Effects
            </label>

            {/* Enable/disable toggle */}
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`
                  px-4 py-2 text-[10px] font-pixel border-4 border-gray-800 rounded
                  transition-colors
                  ${settings.soundEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-400 text-gray-700'}
                `}
              >
                {settings.soundEnabled ? '🔊 ON' : '🔇 OFF'}
              </button>
            </div>

            {/* Volume slider */}
            {settings.soundEnabled && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-pixel" style={{ color: '#666' }}>
                    Volume
                  </span>
                  <span className="text-[8px] font-pixel" style={{ color: '#0F380F' }}>
                    {settings.soundVolume}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.soundVolume}
                  onChange={(e) => onUpdateSettings({ soundVolume: parseInt(e.target.value) })}
                  className="w-full h-4 appearance-none bg-gray-800 rounded cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #78C850 0%, #78C850 ${settings.soundVolume}%, #333 ${settings.soundVolume}%, #333 100%)`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="border-2 border-gray-400" />

          {/* Danger zone */}
          <div>
            <label
              className="block text-[10px] font-pixel mb-2 uppercase"
              style={{ color: '#C41E3A' }}
            >
              Danger Zone
            </label>
            <p
              className="text-[8px] font-pixel mb-3"
              style={{ color: '#666' }}
            >
              Reset all data including all Pokemon and savings entries. This cannot be undone!
            </p>

            {!showResetConfirm ? (
              <PixelButton
                onClick={() => setShowResetConfirm(true)}
                variant="danger"
                size="sm"
              >
                Reset All Data
              </PixelButton>
            ) : (
              <div className="p-3 border-4 border-red-600 rounded bg-red-100">
                <p className="text-[8px] font-pixel mb-2 text-red-700">
                  Are you sure? Type &quot;RELEASE ALL&quot; to confirm:
                </p>
                <ResetConfirmInput
                  onConfirm={() => {
                    onResetData();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  onCancel={() => setShowResetConfirm(false)}
                />
              </div>
            )}
          </div>

          {/* App info */}
          <div className="pt-4 border-t-2 border-gray-400">
            <p
              className="text-[8px] font-pixel text-center"
              style={{ color: '#888' }}
            >
              PokéSavings v1.0.0
            </p>
            <p
              className="text-[6px] font-pixel text-center mt-1"
              style={{ color: '#aaa' }}
            >
              A retro savings tracker inspired by Pokémon
            </p>
            <p
              className="text-[6px] font-pixel text-center mt-1"
              style={{ color: '#aaa' }}
            >
              Sprites from PokéAPI • Not affiliated with Nintendo
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-4 border-gray-800 bg-cream-dark">
          <PixelButton onClick={onClose} fullWidth>
            Close
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

// ==================== Reset Confirm Input ====================

interface ResetConfirmInputProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ResetConfirmInput({ onConfirm, onCancel }: ResetConfirmInputProps) {
  const [value, setValue] = React.useState('');
  const isValid = value.toUpperCase() === 'RELEASE ALL';

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="RELEASE ALL"
        className="w-full px-2 py-1 text-[10px] font-pixel border-2 border-gray-800 rounded"
      />
      <div className="flex gap-2">
        <PixelButton onClick={onCancel} size="sm" fullWidth>
          Cancel
        </PixelButton>
        <PixelButton
          onClick={onConfirm}
          variant="danger"
          size="sm"
          fullWidth
          disabled={!isValid}
        >
          Confirm Reset
        </PixelButton>
      </div>
    </div>
  );
}
