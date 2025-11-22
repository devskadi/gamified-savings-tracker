'use client';

// ============================================
// Level Up & Evolution Overlay Components
// Dramatic animations for milestone events
// ============================================

import React, { useEffect, useState } from 'react';
import { PokemonSprite } from './PokemonSprite';

// ==================== Level Up Overlay ====================

interface LevelUpOverlayProps {
  pokemonName: string;
  spriteUrl: string;
  oldLevel: number;
  newLevel: number;
  onComplete: () => void;
}

/**
 * Full-screen overlay for level up celebration
 */
export function LevelUpOverlay({
  pokemonName,
  spriteUrl,
  oldLevel,
  newLevel,
  onComplete,
}: LevelUpOverlayProps) {
  const [phase, setPhase] = useState<'flash' | 'show' | 'done'>('flash');

  useEffect(() => {
    // Phase 1: Flash effect (500ms)
    const flashTimer = setTimeout(() => setPhase('show'), 500);

    // Phase 2: Show message (2000ms)
    const showTimer = setTimeout(() => setPhase('done'), 2500);

    // Phase 3: Complete (3000ms)
    const completeTimer = setTimeout(onComplete, 3000);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(showTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      {/* Flash effect */}
      {phase === 'flash' && (
        <div className="absolute inset-0 bg-white animate-pulse" />
      )}

      {/* Content */}
      <div
        className={`text-center transition-all duration-300 ${
          phase === 'flash' ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        }`}
      >
        {/* Pokemon with sparkles */}
        <div className="relative mb-4">
          <PokemonSprite
            src={spriteUrl}
            alt={pokemonName}
            size="xl"
            levelingUp
          />

          {/* Floating level numbers */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-bounce">
            <span className="text-2xl font-pixel text-yellow-400 text-shadow-pixel">
              +{newLevel - oldLevel}
            </span>
          </div>
        </div>

        {/* Message box */}
        <div
          className="px-6 py-4 border-4 border-gray-800 rounded-lg inline-block"
          style={{ backgroundColor: '#E8DCC4' }}
        >
          <p className="text-xs sm:text-sm font-pixel text-center" style={{ color: '#0F380F' }}>
            {pokemonName} grew to
          </p>
          <p className="text-lg sm:text-xl font-pixel text-center mt-2" style={{ color: '#0F380F' }}>
            Lv. {newLevel}!
          </p>
        </div>

        {/* Sparkle decorations */}
        <Sparkles />
      </div>
    </div>
  );
}

// ==================== Evolution Overlay ====================

interface EvolutionOverlayProps {
  pokemonName: string;
  oldSpriteUrl: string;
  newSpriteUrl: string;
  oldPokemonName: string;
  newPokemonName: string;
  onComplete: () => void;
}

/**
 * Full-screen overlay for evolution celebration
 */
export function EvolutionOverlay({
  pokemonName,
  oldSpriteUrl,
  newSpriteUrl,
  oldPokemonName,
  newPokemonName,
  onComplete,
}: EvolutionOverlayProps) {
  const [phase, setPhase] = useState<'start' | 'evolving' | 'evolved' | 'done'>('start');

  useEffect(() => {
    // Phase 1: Start message (1500ms)
    const startTimer = setTimeout(() => setPhase('evolving'), 1500);

    // Phase 2: Evolution glow (3000ms)
    const evolvingTimer = setTimeout(() => setPhase('evolved'), 4500);

    // Phase 3: Evolved message (2500ms)
    const evolvedTimer = setTimeout(() => setPhase('done'), 7000);

    // Phase 4: Complete (7500ms)
    const completeTimer = setTimeout(onComplete, 7500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(evolvingTimer);
      clearTimeout(evolvedTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Radial glow during evolution */}
      {phase === 'evolving' && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(0,0,0,1) 70%)',
          }}
        />
      )}

      {/* Content */}
      <div className="text-center relative z-10">
        {/* Starting message */}
        {phase === 'start' && (
          <div className="animate-pulse">
            <p className="text-sm font-pixel text-white mb-4">What?</p>
            <p className="text-sm font-pixel text-white">
              {pokemonName} is evolving!
            </p>
          </div>
        )}

        {/* Evolving animation */}
        {phase === 'evolving' && (
          <div className="relative">
            {/* Old Pokemon fading out */}
            <div className="absolute inset-0 flex items-center justify-center">
              <PokemonSprite
                src={oldSpriteUrl}
                alt={oldPokemonName}
                size="xl"
                evolving
                className="opacity-50"
              />
            </div>
            {/* New Pokemon fading in */}
            <PokemonSprite
              src={newSpriteUrl}
              alt={newPokemonName}
              size="xl"
              evolving
            />
          </div>
        )}

        {/* Evolved message */}
        {(phase === 'evolved' || phase === 'done') && (
          <div className="fade-in">
            <PokemonSprite
              src={newSpriteUrl}
              alt={newPokemonName}
              size="xl"
              idle
            />

            <div
              className="mt-4 px-6 py-4 border-4 border-gray-800 rounded-lg inline-block"
              style={{ backgroundColor: '#E8DCC4' }}
            >
              <p className="text-xs font-pixel" style={{ color: '#0F380F' }}>
                Congratulations!
              </p>
              <p className="text-sm font-pixel mt-2" style={{ color: '#0F380F' }}>
                {pokemonName} evolved into
              </p>
              <p className="text-lg font-pixel mt-1 text-green-700">
                {newPokemonName}!
              </p>
            </div>

            <Sparkles />
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Sparkles Effect ====================

function Sparkles() {
  const sparkles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    size: 8 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            animationDelay: sparkle.delay,
            width: sparkle.size,
            height: sparkle.size,
          }}
        >
          <svg viewBox="0 0 24 24" fill="#FFD700">
            <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" />
          </svg>
        </div>
      ))}
    </div>
  );
}
