'use client';

// ============================================
// Savings State Management Hook
// ============================================

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  SavingsAccount,
  SavingsEntry,
  UserSettings,
  DEFAULT_SETTINGS,
  LevelUpEvent,
} from '@/types';
import {
  calculateAccountStats,
  calculateLevel,
  calculateEvolutionStage,
  calculateTotalSaved,
} from '@/lib/level-calculator';
import { getPokemonLine } from '@/lib/pokemon-data';

// localStorage keys
const ACCOUNTS_KEY = 'pokemon-savings-accounts';
const SETTINGS_KEY = 'pokemon-savings-settings';

// Maximum number of accounts (like a Pokemon party!)
export const MAX_ACCOUNTS = 6;

/**
 * Generate a unique ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Main hook for managing savings accounts and settings
 */
export function useSavings() {
  // Persisted state
  const [accounts, setAccounts, clearAccounts] = useLocalStorage<
    SavingsAccount[]
  >(ACCOUNTS_KEY, []);
  const [settings, setSettings] = useLocalStorage<UserSettings>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS
  );

  // ==================== ACCOUNT OPERATIONS ====================

  /**
   * Create a new savings account (catch a new Pokemon!)
   */
  const createAccount = useCallback(
    (
      pokemonLineId: string,
      nickname: string,
      targetAmount: number
    ): SavingsAccount | null => {
      // Check if we're at max capacity
      if (accounts.length >= MAX_ACCOUNTS) {
        return null;
      }

      // Verify Pokemon exists
      const pokemonLine = getPokemonLine(pokemonLineId);
      if (!pokemonLine) {
        return null;
      }

      const newAccount: SavingsAccount = {
        id: generateId(),
        nickname: nickname.trim() || pokemonLine.stages[0].name,
        pokemonLineId,
        targetAmount,
        entries: [],
        createdAt: new Date().toISOString(),
      };

      setAccounts((prev) => [...prev, newAccount]);
      return newAccount;
    },
    [accounts.length, setAccounts]
  );

  /**
   * Delete an account (release into the wild)
   */
  const deleteAccount = useCallback(
    (accountId: string): boolean => {
      const exists = accounts.some((a) => a.id === accountId);
      if (!exists) return false;

      setAccounts((prev) => prev.filter((a) => a.id !== accountId));
      return true;
    },
    [accounts, setAccounts]
  );

  /**
   * Get an account by ID
   */
  const getAccount = useCallback(
    (accountId: string): SavingsAccount | undefined => {
      return accounts.find((a) => a.id === accountId);
    },
    [accounts]
  );

  // ==================== ENTRY OPERATIONS ====================

  /**
   * Add a savings entry to an account
   * Returns level up event if one occurred
   */
  const addEntry = useCallback(
    (
      accountId: string,
      amount: number,
      note?: string
    ): LevelUpEvent | null => {
      const account = accounts.find((a) => a.id === accountId);
      if (!account) return null;

      // Calculate current stats before adding
      const oldStats = calculateAccountStats(account);

      // Create new entry
      const newEntry: SavingsEntry = {
        id: generateId(),
        amount,
        note: note?.trim(),
        createdAt: new Date().toISOString(),
      };

      // Calculate new stats after adding
      const newTotal = calculateTotalSaved(account.entries) + amount;
      const newLevel = calculateLevel(newTotal, account.targetAmount);
      const newStage = calculateEvolutionStage(newLevel);

      // Update the account
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === accountId ? { ...a, entries: [...a.entries, newEntry] } : a
        )
      );

      // Check for level up or evolution
      if (newLevel > oldStats.level || newStage > oldStats.evolutionStage) {
        return {
          accountId,
          oldLevel: oldStats.level,
          newLevel,
          evolved: newStage > oldStats.evolutionStage,
          oldStage: oldStats.evolutionStage,
          newStage,
        };
      }

      return null;
    },
    [accounts, setAccounts]
  );

  /**
   * Delete an entry from an account
   */
  const deleteEntry = useCallback(
    (accountId: string, entryId: string): boolean => {
      const account = accounts.find((a) => a.id === accountId);
      if (!account) return false;

      const entryExists = account.entries.some((e) => e.id === entryId);
      if (!entryExists) return false;

      setAccounts((prev) =>
        prev.map((a) =>
          a.id === accountId
            ? { ...a, entries: a.entries.filter((e) => e.id !== entryId) }
            : a
        )
      );

      return true;
    },
    [accounts, setAccounts]
  );

  // ==================== SETTINGS OPERATIONS ====================

  /**
   * Update user settings
   */
  const updateSettings = useCallback(
    (updates: Partial<UserSettings>): void => {
      setSettings((prev) => ({ ...prev, ...updates }));
    },
    [setSettings]
  );

  /**
   * Reset settings to defaults
   */
  const resetSettings = useCallback((): void => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  // ==================== COMPUTED VALUES ====================

  /**
   * Get all accounts with their calculated stats
   */
  const accountsWithStats = useMemo(() => {
    return accounts.map((account) => ({
      account,
      stats: calculateAccountStats(account),
      pokemonLine: getPokemonLine(account.pokemonLineId),
    }));
  }, [accounts]);

  /**
   * Calculate total saved across all accounts
   */
  const totalSavedAllAccounts = useMemo(() => {
    return accounts.reduce(
      (sum, account) => sum + calculateTotalSaved(account.entries),
      0
    );
  }, [accounts]);

  /**
   * Check if can add more accounts
   */
  const canAddAccount = accounts.length < MAX_ACCOUNTS;

  /**
   * Get number of available slots
   */
  const availableSlots = MAX_ACCOUNTS - accounts.length;

  return {
    // State
    accounts,
    settings,
    accountsWithStats,

    // Account operations
    createAccount,
    deleteAccount,
    getAccount,
    canAddAccount,
    availableSlots,

    // Entry operations
    addEntry,
    deleteEntry,

    // Settings operations
    updateSettings,
    resetSettings,

    // Computed
    totalSavedAllAccounts,

    // Clear all data (for debugging/reset)
    clearAllData: clearAccounts,
  };
}
