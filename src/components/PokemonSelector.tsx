'use client';

// ============================================
// Pokemon Selector Modal
// For choosing a new starter Pokemon
// ============================================

import React, { useState, useMemo } from 'react';
import { UserSettings, PokemonEvolutionLine } from '@/types';
import {
  POKEMON_LINES,
  GENERATION_NAMES,
  TYPE_COLORS,
} from '@/lib/pokemon-data';
import { PokemonSprite } from './PokemonSprite';

interface PokemonSelectorProps {
  settings: UserSettings;
  onSelect: (pokemonLineId: string, nickname: string, targetAmount: number) => void;
  onCancel: () => void;
  usedPokemonIds: string[];
}

type FilterType = 'all' | 'grass' | 'fire' | 'water';
type ViewState = 'select' | 'configure';

/**
 * Modal for selecting a new Pokemon and setting up the savings account
 */
export function PokemonSelector({
  settings,
  onSelect,
  onCancel,
  usedPokemonIds,
}: PokemonSelectorProps) {
  const [viewState, setViewState] = useState<ViewState>('select');
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonEvolutionLine | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedGen, setSelectedGen] = useState<number | 'all'>('all');
  const [nickname, setNickname] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  // Filter Pokemon based on type and generation
  const filteredPokemon = useMemo(() => {
    return POKEMON_LINES.filter((line) => {
      if (filter !== 'all' && line.type !== filter) return false;
      if (selectedGen !== 'all' && line.generation !== selectedGen) return false;
      return true;
    });
  }, [filter, selectedGen]);

  // Handle Pokemon selection
  const handleSelectPokemon = (pokemon: PokemonEvolutionLine) => {
    setSelectedPokemon(pokemon);
    setNickname(pokemon.stages[0].name);
    setViewState('configure');
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedPokemon || !targetAmount) return;

    const target = parseFloat(targetAmount);
    if (isNaN(target) || target <= 0) return;

    onSelect(selectedPokemon.id, nickname.trim() || selectedPokemon.stages[0].name, target);
  };

  // Go back to selection
  const handleBack = () => {
    setViewState('select');
    setSelectedPokemon(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {viewState === 'select' ? (
          <SelectionView
            filteredPokemon={filteredPokemon}
            filter={filter}
            selectedGen={selectedGen}
            usedPokemonIds={usedPokemonIds}
            onFilterChange={setFilter}
            onGenChange={setSelectedGen}
            onSelectPokemon={handleSelectPokemon}
            onCancel={onCancel}
          />
        ) : (
          <ConfigureView
            pokemon={selectedPokemon!}
            nickname={nickname}
            targetAmount={targetAmount}
            settings={settings}
            onNicknameChange={setNickname}
            onTargetChange={setTargetAmount}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}

// ==================== Selection View ====================

interface SelectionViewProps {
  filteredPokemon: PokemonEvolutionLine[];
  filter: FilterType;
  selectedGen: number | 'all';
  usedPokemonIds: string[];
  onFilterChange: (filter: FilterType) => void;
  onGenChange: (gen: number | 'all') => void;
  onSelectPokemon: (pokemon: PokemonEvolutionLine) => void;
  onCancel: () => void;
}

function SelectionView({
  filteredPokemon,
  filter,
  selectedGen,
  usedPokemonIds,
  onFilterChange,
  onGenChange,
  onSelectPokemon,
  onCancel,
}: SelectionViewProps) {
  const filterButtons: { type: FilterType; label: string; color: string }[] = [
    { type: 'all', label: '✨ All', color: '#6b7280' },
    { type: 'grass', label: '🌿 Grass', color: TYPE_COLORS.grass.primary },
    { type: 'fire', label: '🔥 Fire', color: TYPE_COLORS.fire.primary },
    { type: 'water', label: '💧 Water', color: TYPE_COLORS.water.primary },
  ];

  return (
    <div className="flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Choose Your Starter!</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-white/80 hover:text-white text-2xl leading-none p-1"
          >
            ×
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-100 bg-gray-50 space-y-2">
        {/* Type filter */}
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.type}
              type="button"
              onClick={() => onFilterChange(btn.type)}
              className={`
                px-3 py-1.5 text-sm font-medium rounded-full transition-all
                ${filter === btn.type
                  ? 'text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200'
                }
              `}
              style={{
                backgroundColor: filter === btn.type ? btn.color : undefined,
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Generation filter */}
        <select
          value={selectedGen}
          onChange={(e) =>
            onGenChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
          }
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
        >
          <option value="all">All Generations</option>
          {Object.keys(GENERATION_NAMES).map((gen) => (
            <option key={gen} value={gen}>
              Gen {gen} - {GENERATION_NAMES[parseInt(gen)]}
            </option>
          ))}
        </select>
      </div>

      {/* Pokemon Grid - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="grid grid-cols-3 gap-3">
          {filteredPokemon.map((pokemon) => {
            const isUsed = usedPokemonIds.includes(pokemon.id);
            const typeColor = TYPE_COLORS[pokemon.type];

            return (
              <button
                key={pokemon.id}
                type="button"
                onClick={() => !isUsed && onSelectPokemon(pokemon)}
                disabled={isUsed}
                className={`
                  relative p-2 rounded-xl border-2 transition-all text-center
                  ${isUsed
                    ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-200'
                    : 'bg-white border-gray-100 hover:border-blue-400 hover:shadow-md active:scale-95'
                  }
                `}
              >
                {/* Type indicator */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                  style={{ backgroundColor: typeColor.primary }}
                />

                {/* Pokemon sprite */}
                <div className="flex justify-center py-1">
                  <PokemonSprite
                    src={pokemon.stages[0].spriteUrl}
                    alt={pokemon.stages[0].name}
                    size="sm"
                    idle={!isUsed}
                  />
                </div>

                {/* Name */}
                <p className="text-xs font-medium text-gray-800 truncate mt-1">
                  {pokemon.name}
                </p>
                <p className="text-[10px] text-gray-400">
                  Gen {pokemon.generation}
                </p>

                {/* Used indicator */}
                {isUsed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl">
                    <span className="text-[10px] font-medium text-gray-500 bg-white px-2 py-0.5 rounded-full">
                      In Party
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2.5 text-gray-600 font-medium bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ==================== Configure View ====================

interface ConfigureViewProps {
  pokemon: PokemonEvolutionLine;
  nickname: string;
  targetAmount: string;
  settings: UserSettings;
  onNicknameChange: (value: string) => void;
  onTargetChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

function ConfigureView({
  pokemon,
  nickname,
  targetAmount,
  settings,
  onNicknameChange,
  onTargetChange,
  onSubmit,
  onBack,
}: ConfigureViewProps) {
  const typeColor = TYPE_COLORS[pokemon.type];
  const isValid = targetAmount && parseFloat(targetAmount) > 0;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 rounded-t-2xl"
        style={{ background: `linear-gradient(135deg, ${typeColor.primary} 0%, ${typeColor.secondary} 100%)` }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-white/80 hover:text-white p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg font-bold text-white">
            Set Up {pokemon.stages[0].name}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Pokemon preview */}
        <div className="flex justify-center">
          <div className="text-center">
            <PokemonSprite
              src={pokemon.stages[0].spriteUrl}
              alt={pokemon.stages[0].name}
              size="xl"
              idle
            />
          </div>
        </div>

        {/* Evolution preview */}
        <div className="flex justify-center items-center gap-2 p-3 bg-gray-50 rounded-xl">
          {pokemon.stages.map((stage, i) => (
            <React.Fragment key={stage.id}>
              <div className="text-center">
                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                  <PokemonSprite
                    src={stage.spriteUrl}
                    alt={stage.name}
                    size="sm"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {i === 0 ? 'Base' : i === 1 ? 'Lv.16' : 'Lv.36'}
                </p>
              </div>
              {i < pokemon.stages.length - 1 && (
                <span className="text-gray-300">→</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Nickname input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nickname
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => onNicknameChange(e.target.value)}
            placeholder={pokemon.stages[0].name}
            className="w-full px-3 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Target amount input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Savings Goal ({settings.currency.symbol})
          </label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => onTargetChange(e.target.value)}
            placeholder="1000"
            min={1}
            step={0.01}
            className="w-full px-3 py-2.5 text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Evolution milestones */}
        {targetAmount && parseFloat(targetAmount) > 0 && (
          <div
            className="p-3 rounded-lg text-sm"
            style={{ backgroundColor: `${typeColor.light}40` }}
          >
            <p className="font-medium text-gray-700 mb-1">Evolution milestones:</p>
            <p className="text-gray-600">
              🌱 {pokemon.stages[1].name} at ~{settings.currency.symbol}{(parseFloat(targetAmount) * 0.16).toFixed(0)}
            </p>
            <p className="text-gray-600">
              ⭐ {pokemon.stages[2].name} at ~{settings.currency.symbol}{(parseFloat(targetAmount) * 0.36).toFixed(0)}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-2.5 text-gray-600 font-medium bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 py-2.5 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: isValid ? typeColor.primary : '#9CA3AF' }}
          >
            Let&apos;s Go!
          </button>
        </div>
      </div>
    </div>
  );

  function handleSubmit() {
    onSubmit();
  }
}
