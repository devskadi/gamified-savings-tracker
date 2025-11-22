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
import { PixelButton } from './PixelButton';
import { PixelInput } from './PixelInput';

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

  // Group Pokemon by generation
  const generations = useMemo(() => {
    const gens: Record<number, PokemonEvolutionLine[]> = {};
    POKEMON_LINES.forEach((line) => {
      if (!gens[line.generation]) {
        gens[line.generation] = [];
      }
      gens[line.generation].push(line);
    });
    return gens;
  }, []);

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden border-4 border-gray-800 rounded-lg"
        style={{ backgroundColor: '#E8DCC4' }}
      >
        {viewState === 'select' ? (
          <SelectionView
            generations={generations}
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
  generations: Record<number, PokemonEvolutionLine[]>;
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
    { type: 'all', label: 'All', color: '#888' },
    { type: 'grass', label: '🌿', color: TYPE_COLORS.grass.primary },
    { type: 'fire', label: '🔥', color: TYPE_COLORS.fire.primary },
    { type: 'water', label: '💧', color: TYPE_COLORS.water.primary },
  ];

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b-4 border-gray-800 bg-pokedex-red">
        <div className="flex justify-between items-center">
          <h2 className="text-[10px] sm:text-xs font-pixel text-white uppercase">
            Choose Your Starter!
          </h2>
          <button
            onClick={onCancel}
            className="text-white hover:text-gray-200 text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b-4 border-gray-800 bg-cream-dark flex flex-wrap gap-2">
        {/* Type filter */}
        <div className="flex gap-1">
          {filterButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => onFilterChange(btn.type)}
              className={`
                px-2 py-1 text-[8px] font-pixel border-2 border-gray-800 rounded
                transition-all
                ${filter === btn.type ? 'scale-110' : 'opacity-70 hover:opacity-100'}
              `}
              style={{
                backgroundColor: filter === btn.type ? btn.color : '#ccc',
                color: filter === btn.type ? 'white' : '#333',
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
          className="px-2 py-1 text-[8px] font-pixel border-2 border-gray-800 rounded bg-white"
        >
          <option value="all">All Gens</option>
          {Object.keys(GENERATION_NAMES).map((gen) => (
            <option key={gen} value={gen}>
              Gen {gen} - {GENERATION_NAMES[parseInt(gen)]}
            </option>
          ))}
        </select>
      </div>

      {/* Pokemon Grid */}
      <div className="p-3 overflow-y-auto max-h-[50vh] pixel-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredPokemon.map((pokemon) => {
            const isUsed = usedPokemonIds.includes(pokemon.id);
            const colors = TYPE_COLORS[pokemon.type];

            return (
              <button
                key={pokemon.id}
                onClick={() => !isUsed && onSelectPokemon(pokemon)}
                disabled={isUsed}
                className={`
                  p-2 border-4 border-gray-800 rounded text-center
                  transition-transform
                  ${isUsed ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                `}
                style={{
                  backgroundColor: isUsed ? '#ccc' : colors.light,
                }}
              >
                <PokemonSprite
                  src={pokemon.stages[0].spriteUrl}
                  alt={pokemon.stages[0].name}
                  size="sm"
                  idle={!isUsed}
                  className="mx-auto"
                />
                <div
                  className="mt-1 text-[6px] sm:text-[8px] font-pixel truncate"
                  style={{ color: '#0F380F' }}
                >
                  {pokemon.name}
                </div>
                <div className="text-[6px] font-pixel" style={{ color: '#666' }}>
                  Gen {pokemon.generation}
                  {pokemon.isHisuian && ' (H)'}
                </div>
                {isUsed && (
                  <div className="text-[6px] font-pixel text-red-600 mt-1">
                    IN PARTY
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t-4 border-gray-800 bg-cream-dark">
        <PixelButton onClick={onCancel} fullWidth>
          Cancel
        </PixelButton>
      </div>
    </>
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
  onSubmit: (e: React.FormEvent) => void;
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
  const colors = TYPE_COLORS[pokemon.type];
  const isValid = targetAmount && parseFloat(targetAmount) > 0;

  return (
    <>
      {/* Header */}
      <div
        className="p-4 border-b-4 border-gray-800"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-[10px] sm:text-xs font-pixel text-white uppercase">
            Set Up Your {pokemon.stages[0].name}
          </h2>
          <button
            onClick={onBack}
            className="text-white hover:text-gray-200 text-sm font-pixel"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Content */}
      <form onSubmit={onSubmit} className="p-4">
        {/* Pokemon preview */}
        <div className="flex justify-center mb-4">
          <div className="text-center">
            <PokemonSprite
              src={pokemon.stages[0].spriteUrl}
              alt={pokemon.stages[0].name}
              size="lg"
              idle
            />
            <p
              className="text-[8px] font-pixel mt-2"
              style={{ color: '#666' }}
            >
              {pokemon.stages.map((s) => s.name).join(' → ')}
            </p>
          </div>
        </div>

        {/* Evolution preview */}
        <div className="flex justify-center gap-2 mb-4">
          {pokemon.stages.map((stage, i) => (
            <div
              key={stage.id}
              className="text-center p-2 border-2 border-gray-600 rounded"
              style={{ backgroundColor: colors.light }}
            >
              <PokemonSprite
                src={stage.spriteUrl}
                alt={stage.name}
                size="sm"
                idle={false}
              />
              <div className="text-[6px] font-pixel mt-1" style={{ color: '#333' }}>
                {i === 0 ? 'Base' : i === 1 ? 'Lv.16' : 'Lv.36'}
              </div>
            </div>
          ))}
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <PixelInput
            label="Nickname"
            value={nickname}
            onChange={onNicknameChange}
            placeholder={pokemon.stages[0].name}
          />

          <PixelInput
            type="number"
            label={`Savings Goal (${settings.currency.symbol})`}
            value={targetAmount}
            onChange={onTargetChange}
            placeholder="1000"
            min={1}
            step={0.01}
            required
          />

          {targetAmount && parseFloat(targetAmount) > 0 && (
            <div
              className="p-3 border-2 border-gray-600 rounded text-[8px] font-pixel"
              style={{ backgroundColor: colors.light, color: '#333' }}
            >
              <p className="mb-1">Evolution milestones:</p>
              <p>🌱 {pokemon.stages[1].name} at ~{(parseFloat(targetAmount) * 0.16).toFixed(0)} {settings.currency.symbol}</p>
              <p>⭐ {pokemon.stages[2].name} at ~{(parseFloat(targetAmount) * 0.36).toFixed(0)} {settings.currency.symbol}</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="mt-6 flex gap-2">
          <PixelButton onClick={onBack} fullWidth>
            Back
          </PixelButton>
          <PixelButton
            type="submit"
            variant="success"
            fullWidth
            disabled={!isValid}
          >
            Let&apos;s Go!
          </PixelButton>
        </div>
      </form>
    </>
  );
}
