'use client';

// ============================================
// Audio Hook for 8-bit Sound Effects
// ============================================

import { useCallback, useEffect, useRef } from 'react';
import { playSound, initializeAudio, isAudioAvailable } from '@/lib/audio';
import { SoundType, UserSettings } from '@/types';

/**
 * Hook for playing 8-bit sound effects
 * Respects user's sound settings
 *
 * @param settings - User settings containing sound preferences
 * @returns play function to trigger sounds
 */
export function useAudio(settings: UserSettings) {
  const isInitialized = useRef(false);

  // Initialize audio on first user interaction
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized.current) return;

    const handleInteraction = () => {
      if (!isInitialized.current) {
        initializeAudio();
        isInitialized.current = true;
      }
    };

    // Listen for first interaction
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Play sound function
  const play = useCallback(
    (sound: SoundType) => {
      if (!settings.soundEnabled) return;
      if (!isAudioAvailable()) return;

      playSound(sound, settings.soundVolume);
    },
    [settings.soundEnabled, settings.soundVolume]
  );

  return { play, isAvailable: isAudioAvailable() };
}
