// ============================================
// 8-Bit Audio System using Web Audio API
// ============================================
// Creates authentic retro Game Boy-style sounds

import { SoundType } from '@/types';

/**
 * Audio context singleton
 * Lazily initialized on first user interaction
 */
let audioContext: AudioContext | null = null;

/**
 * Initialize or get the audio context
 * Must be called after user interaction (browser requirement)
 */
const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
};

/**
 * Create a square wave oscillator (classic 8-bit sound)
 */
const createSquareOscillator = (
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  volume: number = 0.3
): void => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(volume, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

/**
 * Create a noise burst (for percussion/release sounds)
 */
const createNoise = (
  ctx: AudioContext,
  startTime: number,
  duration: number,
  volume: number = 0.2
): void => {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  noise.buffer = buffer;

  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1000, startTime);

  gainNode.gain.setValueAtTime(volume, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start(startTime);
  noise.stop(startTime + duration);
};

/**
 * Sound definitions - each sound is a sequence of tones/noises
 */
const soundDefinitions: Record<
  SoundType,
  (ctx: AudioContext, volume: number) => void
> = {
  // Button press - short blip
  button: (ctx, volume) => {
    const now = ctx.currentTime;
    createSquareOscillator(ctx, 800, now, 0.05, volume * 0.3);
  },

  // Selection made - two-tone confirm
  select: (ctx, volume) => {
    const now = ctx.currentTime;
    createSquareOscillator(ctx, 523, now, 0.08, volume * 0.3);
    createSquareOscillator(ctx, 659, now + 0.08, 0.1, volume * 0.3);
  },

  // Entry added - coin/cha-ching sound
  add: (ctx, volume) => {
    const now = ctx.currentTime;
    createSquareOscillator(ctx, 987, now, 0.1, volume * 0.3);
    createSquareOscillator(ctx, 1318, now + 0.1, 0.15, volume * 0.35);
    createSquareOscillator(ctx, 1568, now + 0.2, 0.2, volume * 0.3);
  },

  // Level up - triumphant ascending scale
  levelUp: (ctx, volume) => {
    const now = ctx.currentTime;
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
    notes.forEach((freq, i) => {
      createSquareOscillator(ctx, freq, now + i * 0.08, 0.12, volume * 0.35);
    });
  },

  // Evolution - dramatic transformation sound
  evolution: (ctx, volume) => {
    const now = ctx.currentTime;
    // Dramatic build-up
    for (let i = 0; i < 20; i++) {
      const freq = 200 + i * 50;
      createSquareOscillator(ctx, freq, now + i * 0.1, 0.15, volume * 0.25);
    }
    // Climax
    createSquareOscillator(ctx, 1200, now + 2.0, 0.3, volume * 0.4);
    createSquareOscillator(ctx, 1500, now + 2.1, 0.3, volume * 0.4);
    createSquareOscillator(ctx, 1800, now + 2.2, 0.5, volume * 0.45);
  },

  // Release - sad descending sound + noise
  release: (ctx, volume) => {
    const now = ctx.currentTime;
    createSquareOscillator(ctx, 440, now, 0.15, volume * 0.3);
    createSquareOscillator(ctx, 349, now + 0.15, 0.15, volume * 0.25);
    createSquareOscillator(ctx, 261, now + 0.3, 0.2, volume * 0.2);
    createNoise(ctx, now + 0.4, 0.3, volume * 0.15);
  },

  // Error - harsh buzz
  error: (ctx, volume) => {
    const now = ctx.currentTime;
    createSquareOscillator(ctx, 150, now, 0.1, volume * 0.4);
    createSquareOscillator(ctx, 100, now + 0.1, 0.15, volume * 0.35);
  },

  // Menu open - quick ascending
  open: (ctx, volume) => {
    const now = ctx.currentTime;
    createSquareOscillator(ctx, 400, now, 0.05, volume * 0.25);
    createSquareOscillator(ctx, 600, now + 0.05, 0.05, volume * 0.25);
    createSquareOscillator(ctx, 800, now + 0.1, 0.08, volume * 0.3);
  },

  // Menu close - quick descending
  close: (ctx, volume) => {
    const now = ctx.currentTime;
    createSquareOscillator(ctx, 800, now, 0.05, volume * 0.25);
    createSquareOscillator(ctx, 600, now + 0.05, 0.05, volume * 0.25);
    createSquareOscillator(ctx, 400, now + 0.1, 0.08, volume * 0.2);
  },
};

/**
 * Play a sound effect
 * @param sound - The type of sound to play
 * @param volume - Volume from 0 to 100
 */
export const playSound = (sound: SoundType, volume: number = 70): void => {
  // Skip if volume is 0
  if (volume <= 0) return;

  try {
    const ctx = getAudioContext();

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Convert volume from 0-100 to 0-1
    const normalizedVolume = volume / 100;

    // Play the sound
    const soundFn = soundDefinitions[sound];
    if (soundFn) {
      soundFn(ctx, normalizedVolume);
    }
  } catch (error) {
    // Silently fail - audio isn't critical
    console.warn('Audio playback failed:', error);
  }
};

/**
 * Initialize audio context on user interaction
 * Call this on first user interaction to enable audio
 */
export const initializeAudio = (): void => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  } catch (error) {
    console.warn('Audio initialization failed:', error);
  }
};

/**
 * Check if audio is available
 */
export const isAudioAvailable = (): boolean => {
  return typeof window !== 'undefined' &&
    (!!window.AudioContext ||
      !!(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
};
