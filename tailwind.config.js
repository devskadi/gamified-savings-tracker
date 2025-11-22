/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // FireRed/LeafGreen inspired color palette
      colors: {
        // Primary reds (Pokédex body)
        pokedex: {
          red: '#C41E3A',
          darkRed: '#8B0000',
          lightRed: '#DC143C',
        },
        // Cream/beige tones (screen backgrounds)
        cream: {
          light: '#F5F5DC',
          DEFAULT: '#E8DCC4',
          dark: '#D4C4A8',
        },
        // GBA screen colors
        gba: {
          screen: '#9BBC0F',
          screenLight: '#8BAC0F',
          screenDark: '#0F380F',
          screenBg: '#306230',
        },
        // Accent colors
        pixel: {
          black: '#1a1a2e',
          white: '#FAFAFA',
          gray: '#4a4a68',
          lightGray: '#8888A8',
          gold: '#FFD700',
          blue: '#3B82F6',
        },
      },
      // Pixel-perfect font family
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      // Pixel-art friendly spacing
      spacing: {
        'pixel': '4px',
        'pixel-2': '8px',
        'pixel-3': '12px',
        'pixel-4': '16px',
      },
      // Chunky borders
      borderWidth: {
        'pixel': '4px',
        'pixel-thick': '8px',
      },
      // Box shadows for 3D pixel effect
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.8)',
        'pixel-inset': 'inset 4px 4px 0px 0px rgba(0,0,0,0.3)',
        'pixel-light': '4px 4px 0px 0px rgba(0,0,0,0.4)',
      },
      // Keyframes for animations
      keyframes: {
        'bounce-pixel': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'idle-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'flash': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'level-up': {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '25%': { transform: 'scale(1.2)', filter: 'brightness(2)' },
          '50%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '75%': { transform: 'scale(1.1)', filter: 'brightness(1.5)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        'evolution': {
          '0%': { filter: 'brightness(1) blur(0px)' },
          '30%': { filter: 'brightness(3) blur(4px)' },
          '60%': { filter: 'brightness(5) blur(8px)' },
          '80%': { filter: 'brightness(3) blur(4px)' },
          '100%': { filter: 'brightness(1) blur(0px)' },
        },
        'sparkle': {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '50%': { opacity: '1', transform: 'scale(1) rotate(180deg)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        'exp-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--exp-width)' },
        },
      },
      animation: {
        'bounce-pixel': 'bounce-pixel 0.5s ease-in-out',
        'idle-bob': 'idle-bob 2s ease-in-out infinite',
        'flash': 'flash 0.1s ease-in-out 3',
        'level-up': 'level-up 1s ease-in-out',
        'evolution': 'evolution 3s ease-in-out',
        'sparkle': 'sparkle 0.6s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-in',
        'exp-fill': 'exp-fill 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
