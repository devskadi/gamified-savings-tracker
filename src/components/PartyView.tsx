'use client';

// ============================================
// Party View Component - Classic Party Menu Style
// Shows all Pokemon/Savings accounts (max 6)
// Inspired by classic Pokemon party menu
// ============================================

import React from 'react';
import { SavingsAccount, AccountStats, PokemonEvolutionLine } from '@/types';
import { PokemonSprite } from './PokemonSprite';
import { formatCurrency } from '@/lib/utils';
import { MAX_ACCOUNTS } from '@/hooks/useSavings';
import { TYPE_COLORS } from '@/lib/pokemon-data';
import { UserSettings } from '@/types';

interface PartyViewProps {
  accounts: Array<{
    account: SavingsAccount;
    stats: AccountStats;
    pokemonLine: PokemonEvolutionLine | undefined;
  }>;
  settings: UserSettings;
  onSelectAccount: (accountId: string) => void;
  onAddNew: () => void;
  onOpenSettings: () => void;
  onOpenSuggestions: () => void;
}

/**
 * Main party view showing all Pokemon (savings accounts)
 * Classic Pokemon party menu style
 */
export function PartyView({
  accounts,
  settings,
  onSelectAccount,
  onAddNew,
  onOpenSettings,
  onOpenSuggestions,
}: PartyViewProps) {
  const emptySlots = MAX_ACCOUNTS - accounts.length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Your Party</h1>
          <p className="text-xs text-gray-500">
            {accounts.length}/{MAX_ACCOUNTS} Pokémon
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenSuggestions}
            className="w-10 h-10 bg-amber-50 hover:bg-amber-100 rounded-full border border-amber-200 transition-colors flex items-center justify-center"
            title="Suggest a Pokémon"
          >
            <span className="text-lg">💡</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors flex items-center justify-center"
            title="Settings"
          >
            <span className="text-lg">⚙️</span>
          </button>
        </div>
      </div>

      {/* Pokemon List - Classic Party Style */}
      <div className="space-y-2">
        {/* Filled slots */}
        {accounts.map(({ account, stats, pokemonLine }, index) => (
          <PartySlot
            key={account.id}
            account={account}
            stats={stats}
            pokemonLine={pokemonLine}
            settings={settings}
            isFirst={index === 0}
            onClick={() => onSelectAccount(account.id)}
          />
        ))}

        {/* Empty slots */}
        {[...Array(emptySlots)].map((_, i) => (
          <EmptySlot
            key={`empty-${i}`}
            onClick={onAddNew}
            isFirst={accounts.length === 0 && i === 0}
          />
        ))}
      </div>

      {/* Total savings summary */}
      {accounts.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-white/80 uppercase tracking-wider">
                Total Saved
              </p>
              <p className="text-xl font-bold text-white mt-1">
                {formatCurrency(
                  accounts.reduce((sum, a) => sum + a.stats.totalSaved, 0),
                  settings.currency
                )}
              </p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Party Slot - Classic Style ====================

interface PartySlotProps {
  account: SavingsAccount;
  stats: AccountStats;
  pokemonLine: PokemonEvolutionLine | undefined;
  settings: UserSettings;
  isFirst: boolean;
  onClick: () => void;
}

function PartySlot({
  account,
  stats,
  pokemonLine,
  settings,
  isFirst,
  onClick,
}: PartySlotProps) {
  if (!pokemonLine) return null;

  const currentPokemon = pokemonLine.stages[stats.evolutionStage];
  const typeColor = TYPE_COLORS[pokemonLine.type];

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
        hover:scale-[1.01] active:scale-[0.99] text-left
        ${isFirst
          ? 'bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-300'
          : 'bg-white border border-gray-200 hover:border-gray-300'
        }
        shadow-sm hover:shadow-md
      `}
    >
      {/* Pokemon Sprite */}
      <div
        className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${typeColor.light}40` }}
      >
        <PokemonSprite
          src={currentPokemon.spriteUrl}
          alt={currentPokemon.name}
          size="md"
          idle
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Name and Level */}
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-gray-800 truncate">
            {account.nickname}
          </h3>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: typeColor.primary }}
          >
            Lv.{stats.level}
          </span>
        </div>

        {/* HP/EXP style bar */}
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 w-8">EXP</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.expPercentage}%`,
                  backgroundColor: '#58D68D',
                }}
              />
            </div>
          </div>
        </div>

        {/* Savings info */}
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {formatCurrency(stats.totalSaved, settings.currency)}
          </span>
          <span className="text-xs text-gray-400">
            {stats.progressPercentage.toFixed(0)}% of goal
          </span>
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="flex-shrink-0 text-gray-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

// ==================== Empty Slot ====================

interface EmptySlotProps {
  onClick: () => void;
  isFirst: boolean;
}

function EmptySlot({ onClick, isFirst }: EmptySlotProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
        border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50
        ${isFirst ? 'py-6' : ''}
      `}
    >
      {/* Add icon */}
      <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 text-left">
        <p className="font-medium text-gray-500">
          {isFirst ? 'Choose your starter!' : 'Add Pokémon'}
        </p>
        <p className="text-xs text-gray-400">
          {isFirst ? 'Pick a Pokémon to start saving' : 'Tap to add a new savings goal'}
        </p>
      </div>
    </button>
  );
}
