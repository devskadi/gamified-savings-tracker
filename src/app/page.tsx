'use client';

// ============================================
// PokéSavings - Main Application Page
// ============================================
// A modern savings tracker with Pokédex aesthetics
// inspired by Pokémon FireRed/LeafGreen

import React, { useState, useCallback } from 'react';
import {
  PokedexFrame,
  PartyView,
  PokemonSelector,
  PokemonDetail,
  SettingsModal,
  LevelUpOverlay,
  EvolutionOverlay,
  SuggestionBox,
  BackgroundPicker,
} from '@/components';
import { useSavings } from '@/hooks/useSavings';
import { useAudio } from '@/hooks/useAudio';
import { getPokemonLine, TYPE_COLORS } from '@/lib/pokemon-data';
import { calculateAccountStats } from '@/lib/level-calculator';
import { LevelUpEvent, AppView, BackgroundConfig } from '@/types';

/**
 * Main application component
 * Manages all views and state for the savings tracker
 */
export default function HomePage() {
  // ==================== STATE ====================

  // Core savings state from localStorage
  const {
    accounts,
    settings,
    suggestions,
    accountsWithStats,
    createAccount,
    deleteAccount,
    getAccount,
    addEntry,
    deleteEntry,
    updateAccountBackground,
    addSuggestion,
    deleteSuggestion,
    updateSettings,
    clearAllData,
    canAddAccount,
  } = useSavings();

  // Audio system
  const { play } = useAudio(settings);

  // UI state
  const [currentView, setCurrentView] = useState<AppView>('party');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);

  // Animation state
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);

  // ==================== HANDLERS ====================

  /**
   * Navigate to a Pokemon's detail view
   */
  const handleSelectAccount = useCallback(
    (accountId: string) => {
      play('select');
      setSelectedAccountId(accountId);
      setCurrentView('pokemon-detail');
    },
    [play]
  );

  /**
   * Navigate back to party view
   */
  const handleBackToParty = useCallback(() => {
    play('close');
    setSelectedAccountId(null);
    setCurrentView('party');
  }, [play]);

  /**
   * Open Pokemon selector
   */
  const handleOpenSelector = useCallback(() => {
    if (!canAddAccount) {
      play('error');
      return;
    }
    play('open');
    setShowPokemonSelector(true);
  }, [canAddAccount, play]);

  /**
   * Create a new Pokemon/savings account
   */
  const handleCreateAccount = useCallback(
    (pokemonLineId: string, nickname: string, targetAmount: number) => {
      const newAccount = createAccount(pokemonLineId, nickname, targetAmount);
      if (newAccount) {
        play('select');
        setShowPokemonSelector(false);
        // Auto-select the new Pokemon
        handleSelectAccount(newAccount.id);
      } else {
        play('error');
      }
    },
    [createAccount, play, handleSelectAccount]
  );

  /**
   * Release a Pokemon (delete account)
   */
  const handleRelease = useCallback(
    (accountId: string) => {
      play('release');
      deleteAccount(accountId);
      handleBackToParty();
    },
    [deleteAccount, play, handleBackToParty]
  );

  /**
   * Add a savings entry
   */
  const handleAddEntry = useCallback(
    (accountId: string, amount: number, note?: string) => {
      const event = addEntry(accountId, amount, note);

      if (event) {
        // Level up or evolution occurred!
        setLevelUpEvent(event);

        if (event.evolved) {
          setIsEvolving(true);
          play('evolution');
        } else {
          setIsLevelingUp(true);
          play('levelUp');
        }
      } else {
        play('add');
      }
    },
    [addEntry, play]
  );

  /**
   * Delete a savings entry
   */
  const handleDeleteEntry = useCallback(
    (accountId: string, entryId: string) => {
      play('button');
      deleteEntry(accountId, entryId);
    },
    [deleteEntry, play]
  );

  /**
   * Handle level up animation complete
   */
  const handleLevelUpComplete = useCallback(() => {
    setIsLevelingUp(false);
    setLevelUpEvent(null);
  }, []);

  /**
   * Handle evolution animation complete
   */
  const handleEvolutionComplete = useCallback(() => {
    setIsEvolving(false);
    setLevelUpEvent(null);
  }, []);

  /**
   * Open settings
   */
  const handleOpenSettings = useCallback(() => {
    play('open');
    setShowSettings(true);
  }, [play]);

  /**
   * Close settings
   */
  const handleCloseSettings = useCallback(() => {
    play('close');
    setShowSettings(false);
  }, [play]);

  /**
   * Reset all data
   */
  const handleResetData = useCallback(() => {
    play('release');
    clearAllData();
    setSelectedAccountId(null);
    setCurrentView('party');
  }, [clearAllData, play]);

  /**
   * Handle background change
   */
  const handleBackgroundChange = useCallback(
    (background: BackgroundConfig) => {
      if (selectedAccountId) {
        updateAccountBackground(selectedAccountId, background);
        play('select');
      }
      setShowBackgroundPicker(false);
    },
    [selectedAccountId, updateAccountBackground, play]
  );

  // ==================== COMPUTED VALUES ====================

  // Get current account data if viewing detail
  const currentAccount = selectedAccountId ? getAccount(selectedAccountId) : null;
  const currentAccountStats = currentAccount
    ? calculateAccountStats(currentAccount)
    : null;
  const currentPokemonLine = currentAccount
    ? getPokemonLine(currentAccount.pokemonLineId)
    : null;

  // Get level up event Pokemon data
  const levelUpAccount = levelUpEvent
    ? getAccount(levelUpEvent.accountId)
    : null;
  const levelUpPokemonLine = levelUpAccount
    ? getPokemonLine(levelUpAccount.pokemonLineId)
    : null;

  // Get list of Pokemon IDs already in use
  const usedPokemonIds = accounts.map((a) => a.pokemonLineId);

  // Get default type color for background picker
  const defaultTypeColor = currentPokemonLine
    ? `linear-gradient(135deg, ${TYPE_COLORS[currentPokemonLine.type].light} 0%, ${TYPE_COLORS[currentPokemonLine.type].primary} 100%)`
    : '#6366f1';

  // ==================== RENDER ====================

  return (
    <PokedexFrame>
      {/* Party View */}
      {currentView === 'party' && (
        <PartyView
          accounts={accountsWithStats}
          settings={settings}
          onSelectAccount={handleSelectAccount}
          onAddNew={handleOpenSelector}
          onOpenSettings={handleOpenSettings}
          onOpenSuggestions={() => {
            play('open');
            setShowSuggestions(true);
          }}
        />
      )}

      {/* Pokemon Detail View */}
      {currentView === 'pokemon-detail' &&
        currentAccount &&
        currentAccountStats &&
        currentPokemonLine && (
          <PokemonDetail
            account={currentAccount}
            stats={currentAccountStats}
            pokemonLine={currentPokemonLine}
            settings={settings}
            isLevelingUp={isLevelingUp && levelUpEvent?.accountId === currentAccount.id}
            isEvolving={isEvolving && levelUpEvent?.accountId === currentAccount.id}
            onAddEntry={(amount, note) => handleAddEntry(currentAccount.id, amount, note)}
            onDeleteEntry={(entryId) => handleDeleteEntry(currentAccount.id, entryId)}
            onRelease={() => handleRelease(currentAccount.id)}
            onBack={handleBackToParty}
            onChangeBackground={() => {
              play('open');
              setShowBackgroundPicker(true);
            }}
          />
        )}

      {/* Pokemon Selector Modal */}
      {showPokemonSelector && (
        <PokemonSelector
          settings={settings}
          onSelect={handleCreateAccount}
          onCancel={() => {
            play('close');
            setShowPokemonSelector(false);
          }}
          usedPokemonIds={usedPokemonIds}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={handleCloseSettings}
          onResetData={handleResetData}
        />
      )}

      {/* Suggestions Modal */}
      {showSuggestions && (
        <SuggestionBox
          suggestions={suggestions}
          onAddSuggestion={addSuggestion}
          onDeleteSuggestion={deleteSuggestion}
          onClose={() => {
            play('close');
            setShowSuggestions(false);
          }}
        />
      )}

      {/* Background Picker Modal */}
      {showBackgroundPicker && currentAccount && (
        <BackgroundPicker
          currentBackground={currentAccount.background}
          defaultTypeColor={defaultTypeColor}
          onSelect={handleBackgroundChange}
          onCancel={() => {
            play('close');
            setShowBackgroundPicker(false);
          }}
        />
      )}

      {/* Level Up Overlay */}
      {isLevelingUp &&
        !isEvolving &&
        levelUpEvent &&
        levelUpAccount &&
        levelUpPokemonLine && (
          <LevelUpOverlay
            pokemonName={levelUpAccount.nickname}
            spriteUrl={
              levelUpPokemonLine.stages[
                levelUpEvent.newStage ?? calculateAccountStats(levelUpAccount).evolutionStage
              ].spriteUrl
            }
            oldLevel={levelUpEvent.oldLevel}
            newLevel={levelUpEvent.newLevel}
            onComplete={handleLevelUpComplete}
          />
        )}

      {/* Evolution Overlay */}
      {isEvolving &&
        levelUpEvent &&
        levelUpAccount &&
        levelUpPokemonLine &&
        levelUpEvent.oldStage !== undefined &&
        levelUpEvent.newStage !== undefined && (
          <EvolutionOverlay
            pokemonName={levelUpAccount.nickname}
            oldSpriteUrl={levelUpPokemonLine.stages[levelUpEvent.oldStage].spriteUrl}
            newSpriteUrl={levelUpPokemonLine.stages[levelUpEvent.newStage].spriteUrl}
            oldPokemonName={levelUpPokemonLine.stages[levelUpEvent.oldStage].name}
            newPokemonName={levelUpPokemonLine.stages[levelUpEvent.newStage].name}
            onComplete={handleEvolutionComplete}
          />
        )}
    </PokedexFrame>
  );
}
