'use client';

// ============================================
// Pokemon Suggestion Box Component
// Allows users to suggest new Pokemon to add
// ============================================

import React, { useState } from 'react';
import { PokemonSuggestion } from '@/types';
import { PixelButton } from './PixelButton';
import { PixelInput, PixelTextarea } from './PixelInput';
import { formatRelativeTime } from '@/lib/utils';

interface SuggestionBoxProps {
  suggestions: PokemonSuggestion[];
  onAddSuggestion: (pokemonName: string, reason?: string) => void;
  onDeleteSuggestion: (id: string) => void;
  onClose: () => void;
}

/**
 * Modal for suggesting new Pokemon to be added to the app
 */
export function SuggestionBox({
  suggestions,
  onAddSuggestion,
  onDeleteSuggestion,
  onClose,
}: SuggestionBoxProps) {
  const [pokemonName, setPokemonName] = useState('');
  const [reason, setReason] = useState('');
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pokemonName.trim()) return;

    onAddSuggestion(pokemonName.trim(), reason.trim() || undefined);
    setPokemonName('');
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div
        className="w-full max-w-lg border-4 border-gray-800 rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: '#1a1a2e' }}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-gray-700 bg-gradient-to-r from-amber-600 to-orange-600">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-pixel text-white flex items-center gap-2">
              <span>💡</span>
              Suggest a Pokémon
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto pixel-scrollbar">
          {/* Info */}
          <div className="mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
            <p className="text-[10px] font-pixel text-gray-300 leading-relaxed">
              Want to see more Pokémon as starters? Suggest any Pokémon you&apos;d
              like to use for tracking your savings goals!
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowForm(true)}
              className={`flex-1 py-2 text-[10px] font-pixel rounded-lg transition-all ${
                showForm
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              New Suggestion
            </button>
            <button
              onClick={() => setShowForm(false)}
              className={`flex-1 py-2 text-[10px] font-pixel rounded-lg transition-all ${
                !showForm
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              My Suggestions ({suggestions.length})
            </button>
          </div>

          {showForm ? (
            /* Suggestion Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-pixel text-gray-300 mb-2">
                  Pokémon Name *
                </label>
                <input
                  type="text"
                  value={pokemonName}
                  onChange={(e) => setPokemonName(e.target.value)}
                  placeholder="e.g., Eevee, Pikachu, Lucario..."
                  className="w-full px-4 py-3 text-sm font-pixel bg-gray-800 text-white border-2 border-gray-600 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-pixel text-gray-300 mb-2">
                  Why this Pokémon? (Optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="It's my favorite! / Great evolution line / Would be perfect for tracking..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm font-pixel bg-gray-800 text-white border-2 border-gray-600 rounded-xl focus:border-amber-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <PixelButton type="submit" variant="success" fullWidth disabled={!pokemonName.trim()}>
                Submit Suggestion
              </PixelButton>
            </form>
          ) : (
            /* Suggestions List */
            <div className="space-y-3">
              {suggestions.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-3 block">📝</span>
                  <p className="text-[10px] font-pixel text-gray-400">
                    No suggestions yet. Be the first!
                  </p>
                </div>
              ) : (
                suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-3 bg-gray-800 rounded-xl border border-gray-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-pixel text-amber-400">
                          {suggestion.pokemonName}
                        </h4>
                        {suggestion.reason && (
                          <p className="text-[10px] font-pixel text-gray-400 mt-1">
                            {suggestion.reason}
                          </p>
                        )}
                        <p className="text-[8px] font-pixel text-gray-500 mt-2">
                          {formatRelativeTime(suggestion.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeleteSuggestion(suggestion.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete suggestion"
                      >
                        <span className="text-sm">×</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-gray-700 bg-gray-900">
          <p className="text-[8px] font-pixel text-gray-500 text-center">
            Suggestions are stored locally on your device
          </p>
        </div>
      </div>
    </div>
  );
}
