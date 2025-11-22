'use client';

// ============================================
// Pokemon Detail View
// Shows detailed savings info for a Pokemon
// ============================================

import React, { useState } from 'react';
import { SavingsAccount, AccountStats, UserSettings, SavingsEntry, PokemonEvolutionLine } from '@/types';
import { TYPE_COLORS } from '@/lib/pokemon-data';
import { PokemonSprite } from './PokemonSprite';
import { ExpBar } from './ExpBar';
import { PixelButton } from './PixelButton';
import { PixelInput, PixelTextarea } from './PixelInput';
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
}

/**
 * Detailed view of a single Pokemon/savings account
 * Styled like a Pokédex entry with info panels
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
}: PokemonDetailProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showReleaseConfirm, setShowReleaseConfirm] = useState(false);

  const currentPokemon = pokemonLine.stages[stats.evolutionStage];
  const colors = TYPE_COLORS[pokemonLine.type];

  return (
    <div className="space-y-4">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-[10px] font-pixel flex items-center gap-1 hover:opacity-80"
          style={{ color: '#0F380F' }}
        >
          ← Party
        </button>
        <div
          className="px-2 py-1 rounded text-[8px] font-pixel text-white"
          style={{ backgroundColor: colors.primary }}
        >
          {pokemonLine.type.toUpperCase()}
        </div>
      </div>

      {/* Main content - Pokédex layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left panel - Pokemon display */}
        <div
          className="p-4 border-4 border-gray-800 rounded"
          style={{ backgroundColor: colors.light }}
        >
          {/* Pokemon name and level */}
          <div className="text-center mb-2">
            <h2
              className="text-xs sm:text-sm font-pixel"
              style={{ color: '#0F380F' }}
            >
              {account.nickname}
            </h2>
            <p className="text-[8px] font-pixel" style={{ color: '#666' }}>
              {currentPokemon.name}
            </p>
          </div>

          {/* Pokemon sprite */}
          <div className="flex justify-center my-4">
            <PokemonSprite
              src={currentPokemon.spriteUrl}
              alt={currentPokemon.name}
              size="xl"
              idle={!isLevelingUp && !isEvolving}
              levelingUp={isLevelingUp}
              evolving={isEvolving}
            />
          </div>

          {/* Level and EXP */}
          <div className="mt-4">
            <ExpBar
              level={stats.level}
              expPercentage={stats.expPercentage}
              expToNext={stats.expToNextLevel}
              isLeveling={isLevelingUp}
              size="lg"
            />
            <p
              className="text-[8px] font-pixel text-center mt-2"
              style={{ color: '#666' }}
            >
              {getLevelDescription(stats.level)}
            </p>
          </div>

          {/* Evolution line preview */}
          <div className="mt-4 flex justify-center gap-2">
            {pokemonLine.stages.map((stage, i) => (
              <div
                key={stage.id}
                className={`p-1 border-2 rounded ${
                  i === stats.evolutionStage
                    ? 'border-gray-800 bg-white/50'
                    : 'border-gray-400 opacity-50'
                }`}
              >
                <PokemonSprite
                  src={stage.spriteUrl}
                  alt={stage.name}
                  size="sm"
                  idle={i === stats.evolutionStage}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - Stats and actions */}
        <div className="space-y-3">
          {/* Savings stats */}
          <div
            className="p-3 border-4 border-gray-800 rounded"
            style={{ backgroundColor: '#F5F5DC' }}
          >
            <h3
              className="text-[10px] font-pixel mb-3 uppercase"
              style={{ color: '#0F380F' }}
            >
              Savings Stats
            </h3>

            <div className="space-y-2">
              <StatRow
                label="Saved"
                value={formatCurrency(stats.totalSaved, settings.currency)}
                highlight
              />
              <StatRow
                label="Goal"
                value={formatCurrency(account.targetAmount, settings.currency)}
              />
              <StatRow
                label="Progress"
                value={`${stats.progressPercentage.toFixed(1)}%`}
              />
              <StatRow label="Entries" value={account.entries.length.toString()} />

              {/* Next evolution info */}
              {stats.evolutionStage < 2 && (
                <div className="pt-2 border-t-2 border-gray-400">
                  <StatRow
                    label={`To ${pokemonLine.stages[stats.evolutionStage + 1].name}`}
                    value={formatCurrency(
                      savingsToEvolution(
                        stats.totalSaved,
                        account.targetAmount,
                        stats.evolutionStage === 0 ? 1 : 2
                      ),
                      settings.currency
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <PixelButton
              onClick={() => setShowAddForm(true)}
              variant="success"
              fullWidth
            >
              + Add Savings
            </PixelButton>

            <PixelButton
              onClick={() => setShowHistory(!showHistory)}
              fullWidth
            >
              {showHistory ? '▼ Hide History' : '▶ View History'}
            </PixelButton>

            <PixelButton
              onClick={() => setShowReleaseConfirm(true)}
              variant="danger"
              fullWidth
              size="sm"
            >
              Release...
            </PixelButton>
          </div>
        </div>
      </div>

      {/* Entry history (collapsible) */}
      {showHistory && (
        <EntryHistory
          entries={account.entries}
          settings={settings}
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

// ==================== Stat Row ====================

interface StatRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function StatRow({ label, value, highlight = false }: StatRowProps) {
  return (
    <div className="flex justify-between items-center">
      <span
        className="text-[8px] font-pixel uppercase"
        style={{ color: '#666' }}
      >
        {label}
      </span>
      <span
        className={`text-[8px] sm:text-[10px] font-pixel ${
          highlight ? 'text-green-700' : ''
        }`}
        style={{ color: highlight ? undefined : '#0F380F' }}
      >
        {value}
      </span>
    </div>
  );
}

// ==================== Entry History ====================

interface EntryHistoryProps {
  entries: SavingsEntry[];
  settings: UserSettings;
  onDelete: (entryId: string) => void;
}

function EntryHistory({ entries, settings, onDelete }: EntryHistoryProps) {
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div
      className="p-3 border-4 border-gray-800 rounded max-h-60 overflow-y-auto pixel-scrollbar"
      style={{ backgroundColor: '#F5F5DC' }}
    >
      <h3
        className="text-[10px] font-pixel mb-3 uppercase"
        style={{ color: '#0F380F' }}
      >
        Entry History
      </h3>

      {sortedEntries.length === 0 ? (
        <p className="text-[8px] font-pixel text-center py-4" style={{ color: '#666' }}>
          No entries yet!
        </p>
      ) : (
        <div className="space-y-2">
          {sortedEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-2 border-2 border-gray-400 rounded bg-white/50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-pixel ${
                      entry.amount >= 0 ? 'text-green-700' : 'text-red-600'
                    }`}
                  >
                    {entry.amount >= 0 ? '+' : ''}
                    {formatCurrency(entry.amount, settings.currency)}
                  </span>
                  <span className="text-[6px] font-pixel" style={{ color: '#888' }}>
                    {formatRelativeTime(entry.createdAt)}
                  </span>
                </div>
                {entry.note && (
                  <p
                    className="text-[7px] font-pixel mt-1 truncate"
                    style={{ color: '#666' }}
                  >
                    {entry.note}
                  </p>
                )}
              </div>
              <button
                onClick={() => onDelete(entry.id)}
                className="ml-2 text-red-500 hover:text-red-700 text-xs"
                title="Delete entry"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div
        className="w-full max-w-sm border-4 border-gray-800 rounded-lg p-4"
        style={{ backgroundColor: '#E8DCC4' }}
      >
        <h3
          className="text-[10px] font-pixel mb-4 uppercase text-center"
          style={{ color: '#0F380F' }}
        >
          {isWithdraw ? 'Withdraw Savings' : 'Add Savings'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsWithdraw(false)}
              className={`flex-1 py-2 text-[8px] font-pixel border-2 border-gray-800 rounded ${
                !isWithdraw ? 'bg-green-500 text-white' : 'bg-gray-200'
              }`}
            >
              + Deposit
            </button>
            <button
              type="button"
              onClick={() => setIsWithdraw(true)}
              className={`flex-1 py-2 text-[8px] font-pixel border-2 border-gray-800 rounded ${
                isWithdraw ? 'bg-red-500 text-white' : 'bg-gray-200'
              }`}
            >
              - Withdraw
            </button>
          </div>

          <PixelInput
            type="number"
            label={`Amount (${settings.currency.symbol})`}
            value={amount}
            onChange={setAmount}
            placeholder="0.00"
            min={0.01}
            step={0.01}
            required
          />

          <PixelTextarea
            label="Note (optional)"
            value={note}
            onChange={setNote}
            placeholder="What's this for?"
            rows={2}
          />

          <div className="flex gap-2">
            <PixelButton onClick={onCancel} fullWidth>
              Cancel
            </PixelButton>
            <PixelButton
              type="submit"
              variant={isWithdraw ? 'danger' : 'success'}
              fullWidth
              disabled={!amount || parseFloat(amount) <= 0}
            >
              {isWithdraw ? 'Withdraw' : 'Add'}
            </PixelButton>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div
        className="w-full max-w-sm border-4 border-gray-800 rounded-lg p-4 text-center"
        style={{ backgroundColor: '#E8DCC4' }}
      >
        <h3
          className="text-[10px] font-pixel mb-4 uppercase"
          style={{ color: '#C41E3A' }}
        >
          Release {pokemonName}?
        </h3>

        <p
          className="text-[8px] font-pixel mb-4"
          style={{ color: '#0F380F' }}
        >
          This will delete all savings data for this Pokemon. This cannot be
          undone!
        </p>

        <div
          className="text-4xl mb-4"
          style={{ filter: 'grayscale(0.5)' }}
        >
          👋
        </div>

        <p
          className="text-[8px] font-pixel mb-4 italic"
          style={{ color: '#666' }}
        >
          &quot;Bye bye, {pokemonName}!&quot;
        </p>

        <div className="flex gap-2">
          <PixelButton onClick={onCancel} fullWidth>
            Keep
          </PixelButton>
          <PixelButton onClick={onConfirm} variant="danger" fullWidth>
            Release
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
