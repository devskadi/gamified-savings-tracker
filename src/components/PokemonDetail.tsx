'use client';

// ============================================
// Pokemon Detail View - Pokédex Style
// Shows detailed savings info for a Pokemon
// Inspired by official Pokédex app design
// ============================================

import React, { useState } from 'react';
import { SavingsAccount, AccountStats, UserSettings, SavingsEntry, PokemonEvolutionLine } from '@/types';
import { TYPE_COLORS } from '@/lib/pokemon-data';
import { PokemonSprite } from './PokemonSprite';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import { getLevelDescription, savingsToEvolution } from '@/lib/level-calculator';

interface PokemonDetailProps {
  account: SavingsAccount;
  stats: AccountStats;
  pokemonLine: PokemonEvolutionLine;
  settings: UserSettings;
  isLevelingUp: boolean;
  isEvolving: boolean;
  onAddEntry: (amount: number, note?: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onRelease: () => void;
  onBack: () => void;
  onChangeBackground: () => void;
}

/**
 * Detailed view of a single Pokemon/savings account
 * Pokédex-inspired design with red header and clean white sections
 */
export function PokemonDetail({
  account,
  stats,
  pokemonLine,
  settings,
  isLevelingUp,
  isEvolving,
  onAddEntry,
  onDeleteEntry,
  onRelease,
  onBack,
  onChangeBackground,
}: PokemonDetailProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);

  const currentPokemon = pokemonLine.stages[stats.evolutionStage];
  const typeColor = TYPE_COLORS[pokemonLine.type];

  // Type badge colors matching official Pokédex
  const typeBadgeColors = {
    grass: { bg: '#78C850', text: '#ffffff' },
    fire: { bg: '#F08030', text: '#ffffff' },
    water: { bg: '#6890F0', text: '#ffffff' },
  };

  const badgeColor = typeBadgeColors[pokemonLine.type];

  return (
    <div className="space-y-4">
      {/* Header with back button - Pokédex style */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Pokédex</span>
        </button>
        <span className="text-sm text-gray-400 font-medium">
          N° {String(currentPokemon.id).padStart(3, '0')}
        </span>
      </div>

      {/* Main Pokemon Display - Red header style */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
        {/* Red Header with Pokemon */}
        <div
          className="relative h-48 sm:h-56"
          style={{
            background: `linear-gradient(135deg, ${typeColor.primary} 0%, ${typeColor.secondary} 100%)`,
          }}
        >
          {/* Decorative Pokéball */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border-[24px] border-white/10" />
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full border-t-[24px] border-white/20" style={{ clipPath: 'inset(50% 0 0 0)' }} />

          {/* Background change button */}
          <button
            onClick={onChangeBackground}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10 backdrop-blur-sm"
            title="Change background"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>

          {/* Pokemon Sprite - Large and centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="drop-shadow-2xl">
              <PokemonSprite
                src={currentPokemon.spriteUrl}
                animatedSrc={currentPokemon.animatedSpriteUrl}
                alt={currentPokemon.name}
                size="2xl"
                idle={!isLevelingUp && !isEvolving}
                levelingUp={isLevelingUp}
                evolving={isEvolving}
                useAnimated={false}
              />
            </div>
          </div>
        </div>

        {/* White Content Area */}
        <div className="p-6">
          {/* Pokemon Name */}
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            {account.nickname}
          </h1>
          <p className="text-sm text-gray-400 text-center mt-1">
            {currentPokemon.name}
          </p>

          {/* Type Badge */}
          <div className="flex justify-center mt-3">
            <span
              className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: badgeColor.bg, color: badgeColor.text }}
            >
              {pokemonLine.type}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Level</p>
              <p className="text-xl font-bold text-gray-800 mt-1">{stats.level}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Saved</p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {formatCurrency(stats.totalSaved, settings.currency)}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Goal</p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {stats.progressPercentage.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>EXP</span>
              <span>{stats.expPercentage.toFixed(0)}% to next level</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${stats.expPercentage}%`,
                  backgroundColor: typeColor.primary,
                }}
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              {getLevelDescription(stats.level)}
            </p>
          </div>

          {/* Evolution Chain */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-[10px] text-gray-400 uppercase tracking-wider font-medium text-center mb-3">
              Evolution
            </h3>
            <div className="flex items-center justify-center gap-2">
              {pokemonLine.stages.map((stage, i) => (
                <React.Fragment key={stage.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`p-2 rounded-xl transition-all ${
                        i === stats.evolutionStage
                          ? 'bg-white shadow-md ring-2 ring-offset-2'
                          : i < stats.evolutionStage
                            ? 'bg-white/80'
                            : 'bg-gray-200/50 opacity-50'
                      }`}
                      style={{
                        ringColor: i === stats.evolutionStage ? typeColor.primary : undefined,
                      }}
                    >
                      <PokemonSprite
                        src={stage.spriteUrl}
                        alt={stage.name}
                        size="md"
                        idle={i === stats.evolutionStage}
                      />
                    </div>
                    <span className="text-[9px] text-gray-500 mt-1 font-medium">
                      {stage.name.replace('H-', '')}
                    </span>
                    {i < pokemonLine.stages.length - 1 && (
                      <span className="text-[8px] text-gray-400">
                        Lv.{i === 0 ? 16 : 36}
                      </span>
                    )}
                  </div>
                  {i < pokemonLine.stages.length - 1 && (
                    <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </div>
            {stats.evolutionStage < 2 && (
              <p className="text-[10px] text-gray-400 text-center mt-3">
                {formatCurrency(
                  savingsToEvolution(
                    stats.totalSaved,
                    account.targetAmount,
                    stats.evolutionStage === 0 ? 1 : 2
                  ),
                  settings.currency
                )} to {pokemonLine.stages[stats.evolutionStage + 1].name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowAddForm(true)}
          className="py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          + Add Savings
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="py-3 px-4 bg-white text-gray-700 font-medium rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.98]"
        >
          {showHistory ? 'Hide History' : 'View History'}
        </button>
      </div>

      {/* Release Button */}
      <button
        onClick={() => setShowReleaseConfirm(true)}
        className="w-full py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
      >
        Release {account.nickname}...
      </button>

      {/* Entry history */}
      {showHistory && (
        <EntryHistory
          entries={account.entries}
          settings={settings}
          typeColor={typeColor.primary}
          onDelete={onDeleteEntry}
        />
      )}

      {/* Add entry modal */}
      {showAddForm && (
        <AddEntryModal
          settings={settings}
          onAdd={(amount, note) => {
            onAddEntry(amount, note);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Release confirmation modal */}
      {showReleaseConfirm && (
        <ReleaseConfirmModal
          pokemonName={account.nickname}
          onConfirm={onRelease}
          onCancel={() => setShowReleaseConfirm(false)}
        />
      )}
    </div>
  );
}

// ==================== Entry History ====================

interface EntryHistoryProps {
  entries: SavingsEntry[];
  settings: UserSettings;
  typeColor: string;
  onDelete: (entryId: string) => void;
}

function EntryHistory({ entries, settings, typeColor, onDelete }: EntryHistoryProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100" style={{ backgroundColor: typeColor }}>
        <h3 className="text-sm font-medium text-white">Entry History</h3>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {sortedEntries.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No entries yet. Start saving!
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-base font-bold ${
                        entry.amount >= 0 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {entry.amount >= 0 ? '+' : ''}
                      {formatCurrency(entry.amount, settings.currency)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(entry.createdAt)}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {entry.note}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="ml-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete entry"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Add Entry Modal ====================

interface AddEntryModalProps {
  settings: UserSettings;
  onAdd: (amount: number, note?: string) => void;
  onCancel: () => void;
}

function AddEntryModal({ settings, onAdd, onCancel }: AddEntryModalProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isWithdraw, setIsWithdraw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onAdd(isWithdraw ? -numAmount : numAmount, note || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className={`px-6 py-4 ${isWithdraw ? 'bg-red-500' : 'bg-green-500'}`}>
          <h3 className="text-lg font-bold text-white text-center">
            {isWithdraw ? 'Withdraw Savings' : 'Add Savings'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              type="button"
              onClick={() => setIsWithdraw(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isWithdraw ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              + Deposit
            </button>
            <button
              type="button"
              onClick={() => setIsWithdraw(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isWithdraw ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500'
              }`}
            >
              - Withdraw
            </button>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              Amount ({settings.currency.symbol})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min={0.01}
              step={0.01}
              required
              className="w-full px-4 py-3 text-lg font-medium bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's this for?"
              rows={2}
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 text-gray-600 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className={`flex-1 py-3 text-white font-medium rounded-xl transition-all disabled:opacity-50 ${
                isWithdraw
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isWithdraw ? 'Withdraw' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== Release Confirm Modal ====================

interface ReleaseConfirmModalProps {
  pokemonName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ReleaseConfirmModal({
  pokemonName,
  onConfirm,
  onCancel,
}: ReleaseConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-500 px-6 py-4">
          <h3 className="text-lg font-bold text-white text-center">
            Release {pokemonName}?
          </h3>
        </div>

        <div className="p-6 text-center">
          <div className="text-5xl mb-4">👋</div>
          <p className="text-sm text-gray-600 mb-2">
            This will delete all savings data for this Pokémon.
          </p>
          <p className="text-xs text-gray-400 italic">
            &quot;Bye bye, {pokemonName}!&quot;
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 py-3 text-gray-600 font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Keep
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 text-white font-medium bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
            >
              Release
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
