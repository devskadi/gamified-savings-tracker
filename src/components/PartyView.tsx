'use client';

// ============================================
// Party View Component
// Shows all Pokemon/Savings accounts (max 6)
// Modern design with Pokedex aesthetics
// ============================================

import React from 'react';
import { SavingsAccount, AccountStats, UserSettings, PokemonEvolutionLine, BACKGROUND_THEMES } from '@/types';
import { PokemonSprite } from './PokemonSprite';
import { ExpBar } from './ExpBar';
import { PixelButton } from './PixelButton';
import { getBackgroundStyle, getTextColor } from './BackgroundPicker';
import { formatCurrency } from '@/lib/utils';
import { MAX_ACCOUNTS } from '@/hooks/useSavings';
import { TYPE_COLORS } from '@/lib/pokemon-data';

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
 * Modern design with Pokedex aesthetics
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-pixel text-gray-800">
            Your Party
          </h2>
          <p className="text-[8px] font-pixel text-gray-500 mt-1">
            {accounts.length}/{MAX_ACCOUNTS} Pokémon
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onOpenSuggestions}
            className="p-2 bg-amber-100 hover:bg-amber-200 rounded-lg border-2 border-amber-300 transition-colors"
            title="Suggest a Pokémon"
          >
            <span className="text-sm">💡</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg border-2 border-gray-300 transition-colors"
            title="Settings"
          >
            <span className="text-sm">⚙️</span>
          </button>
        </div>
      </div>

      {/* Pokemon slots - Modern grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Filled slots */}
        {accounts.map(({ account, stats, pokemonLine }) => (
          <PartySlot
            key={account.id}
            account={account}
            stats={stats}
            pokemonLine={pokemonLine}
            settings={settings}
            onClick={() => onSelectAccount(account.id)}
          />
        ))}

        {/* Empty slots */}
        {[...Array(emptySlots)].map((_, i) => (
          <EmptySlot key={`empty-${i}`} onClick={onAddNew} isFirst={accounts.length === 0 && i === 0} />
        ))}
      </div>

      {/* Total savings summary - Modern card */}
      {accounts.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-pixel text-white/80 uppercase tracking-wider">
                Total Saved
              </span>
              <p className="text-lg font-pixel text-white mt-1">
                {formatCurrency(
                  accounts.reduce((sum, a) => sum + a.stats.totalSaved, 0),
                  settings.currency
                )}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Party Slot ====================

interface PartySlotProps {
  account: SavingsAccount;
  stats: AccountStats;
  pokemonLine: PokemonEvolutionLine | undefined;
  settings: UserSettings;
  onClick: () => void;
}

function PartySlot({
  account,
  stats,
  pokemonLine,
  settings,
  onClick,
}: PartySlotProps) {
  if (!pokemonLine) return null;

  const currentPokemon = pokemonLine.stages[stats.evolutionStage];
  const typeColor = TYPE_COLORS[pokemonLine.type];

  // Get background style (custom or default type-based)
  const defaultGradient = `linear-gradient(135deg, ${typeColor.light} 0%, ${typeColor.primary} 100%)`;
  const bgStyle = getBackgroundStyle(account.background, defaultGradient);
  const textColor = getTextColor(account.background, '#ffffff');

  return (
    <button
      onClick={onClick}
      className="group w-full p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] text-left relative overflow-hidden"
      style={{
        ...bgStyle,
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />

      <div className="relative flex items-center gap-4">
        {/* Pokemon sprite with glow */}
        <div className="flex-shrink-0 relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
          <PokemonSprite
            src={currentPokemon.spriteUrl}
            animatedSrc={currentPokemon.animatedSpriteUrl}
            alt={currentPokemon.name}
            size="lg"
            useAnimated={true}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name and level */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3
              className="text-sm font-pixel truncate"
              style={{ color: textColor }}
            >
              {account.nickname}
            </h3>
            <span
              className="text-[10px] font-pixel px-2 py-1 bg-black/20 rounded-full"
              style={{ color: textColor }}
            >
              Lv.{stats.level}
            </span>
          </div>

          {/* EXP bar */}
          <div className="mb-2">
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-500"
                style={{ width: `${stats.expPercentage}%` }}
              />
            </div>
          </div>

          {/* Savings info */}
          <div className="flex justify-between items-center">
            <span
              className="text-[10px] font-pixel"
              style={{ color: textColor, opacity: 0.9 }}
            >
              {formatCurrency(stats.totalSaved, settings.currency)}
            </span>
            <span
              className="text-[10px] font-pixel px-2 py-0.5 bg-white/20 rounded-full"
              style={{ color: textColor }}
            >
              {stats.progressPercentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs" style={{ color: textColor }}>→</span>
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
      className="group w-full p-6 border-3 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 hover:border-gray-400 transition-all duration-300 flex flex-col items-center justify-center gap-3 min-h-[140px]"
    >
      <div className="w-12 h-12 bg-gray-200 group-hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
        <span className="text-2xl text-gray-400 group-hover:text-gray-600">+</span>
      </div>
      <span className="text-[10px] font-pixel text-gray-500 group-hover:text-gray-700 text-center transition-colors">
        {isFirst ? 'Choose your starter!' : 'Add Pokémon'}
      </span>
    </button>
  );
}
