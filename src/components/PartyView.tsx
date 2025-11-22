'use client';

// ============================================
// Party View Component
// Shows all Pokemon/Savings accounts (max 6)
// ============================================

import React from 'react';
import { SavingsAccount, AccountStats, UserSettings, PokemonEvolutionLine } from '@/types';
import { PokemonSprite } from './PokemonSprite';
import { ExpBar } from './ExpBar';
import { PixelButton } from './PixelButton';
import { formatCurrency } from '@/lib/utils';
import { MAX_ACCOUNTS } from '@/hooks/useSavings';

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
}

/**
 * Main party view showing all Pokemon (savings accounts)
 * Styled like a Pokemon party menu
 */
export function PartyView({
  accounts,
  settings,
  onSelectAccount,
  onAddNew,
  onOpenSettings,
}: PartyViewProps) {
  const emptySlots = MAX_ACCOUNTS - accounts.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2
          className="text-[10px] sm:text-xs font-pixel uppercase"
          style={{ color: '#0F380F' }}
        >
          Your Party
        </h2>
        <PixelButton onClick={onOpenSettings} size="sm">
          ⚙ Settings
        </PixelButton>
      </div>

      {/* Pokemon slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      {/* Total savings summary */}
      {accounts.length > 0 && (
        <div
          className="mt-4 p-3 border-4 border-gray-800 rounded bg-cream-light"
          style={{ backgroundColor: '#E8DCC4' }}
        >
          <div className="flex justify-between items-center">
            <span
              className="text-[8px] sm:text-[10px] font-pixel uppercase"
              style={{ color: '#0F380F' }}
            >
              Total Saved:
            </span>
            <span
              className="text-[10px] sm:text-xs font-pixel"
              style={{ color: '#0F380F' }}
            >
              {formatCurrency(
                accounts.reduce((sum, a) => sum + a.stats.totalSaved, 0),
                settings.currency
              )}
            </span>
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
  const typeColors = {
    grass: { bg: '#C8E8B0', border: '#78C850' },
    fire: { bg: '#F8D8B0', border: '#F08030' },
    water: { bg: '#B8D8F8', border: '#6890F0' },
  };
  const colors = typeColors[pokemonLine.type];

  return (
    <button
      onClick={onClick}
      className="w-full p-3 border-4 border-gray-800 rounded transition-transform hover:scale-[1.02] active:scale-[0.98] text-left"
      style={{
        backgroundColor: colors.bg,
        boxShadow: `4px 4px 0 ${colors.border}`,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Pokemon sprite */}
        <div className="flex-shrink-0">
          <PokemonSprite
            src={currentPokemon.spriteUrl}
            alt={currentPokemon.name}
            size="md"
            idle
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name and level */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className="text-[8px] sm:text-[10px] font-pixel truncate"
              style={{ color: '#0F380F' }}
            >
              {account.nickname}
            </span>
            <span
              className="text-[8px] font-pixel flex-shrink-0"
              style={{ color: '#306230' }}
            >
              Lv.{stats.level}
            </span>
          </div>

          {/* EXP bar */}
          <ExpBar
            level={stats.level}
            expPercentage={stats.expPercentage}
            expToNext={stats.expToNextLevel}
            size="sm"
            showLabel={false}
          />

          {/* Savings info */}
          <div className="mt-2 flex justify-between items-center">
            <span
              className="text-[6px] sm:text-[8px] font-pixel"
              style={{ color: '#4a4a68' }}
            >
              {formatCurrency(stats.totalSaved, settings.currency)}
            </span>
            <span
              className="text-[6px] sm:text-[8px] font-pixel"
              style={{ color: '#306230' }}
            >
              {stats.progressPercentage.toFixed(0)}%
            </span>
          </div>
        </div>
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
      className="w-full p-6 border-4 border-dashed border-gray-600 rounded bg-gray-200/50 hover:bg-gray-200 transition-colors flex flex-col items-center justify-center gap-2 min-h-[100px]"
    >
      <div
        className="text-2xl"
        style={{ filter: 'grayscale(0.5)' }}
      >
        +
      </div>
      <span
        className="text-[8px] font-pixel text-center"
        style={{ color: '#4a4a68' }}
      >
        {isFirst ? 'Choose your starter!' : 'Add Pokemon'}
      </span>
    </button>
  );
}
