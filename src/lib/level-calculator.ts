// ============================================
// Level & Evolution Calculator
// ============================================
// This system scales levels and evolution thresholds
// based on the user's target savings goal.

import { AccountStats, SavingsAccount, SavingsEntry } from '@/types';

/**
 * Maximum level a Pokemon can reach
 */
export const MAX_LEVEL = 100;

/**
 * Evolution thresholds as percentage of max level
 * Stage 0 (Base): Levels 1-16 (0-16%)
 * Stage 1 (First Evolution): Levels 17-36 (17-36%)
 * Stage 2 (Final Evolution): Levels 37-100 (37-100%)
 *
 * This mirrors typical Pokemon evolution levels
 * (e.g., Charmander evolves at 16, Charmeleon at 36)
 */
export const EVOLUTION_THRESHOLDS = {
  stage1: 16, // Level at which Pokemon evolves to stage 1
  stage2: 36, // Level at which Pokemon evolves to stage 2
};

/**
 * Calculate total saved from entries
 */
export const calculateTotalSaved = (entries: SavingsEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.amount, 0);
};

/**
 * Calculate level from progress percentage
 * Uses a slightly curved progression to make early levels faster
 * and later levels require more savings (like Pokemon games!)
 *
 * Level formula: level = floor(progress^0.9 * 100)
 * This makes:
 *   - 1% progress ≈ level 1
 *   - 25% progress ≈ level 20
 *   - 50% progress ≈ level 38
 *   - 75% progress ≈ level 58
 *   - 100% progress = level 100
 */
export const calculateLevel = (
  totalSaved: number,
  targetAmount: number
): number => {
  if (targetAmount <= 0) return 1;
  if (totalSaved <= 0) return 1;

  // Calculate progress as a decimal (0 to 1+)
  const progress = totalSaved / targetAmount;

  // Cap at 100% for level calculation (can oversave but level caps at 100)
  const cappedProgress = Math.min(progress, 1);

  // Apply curve: progress^0.85 gives a nice Pokemon-like leveling feel
  // Early levels come quick, later levels take more effort
  const curvedProgress = Math.pow(cappedProgress, 0.85);

  // Calculate level (1-100)
  const level = Math.max(1, Math.floor(curvedProgress * MAX_LEVEL));

  return Math.min(level, MAX_LEVEL);
};

/**
 * Calculate EXP progress within current level
 * Returns: { currentExp, expToNextLevel, expPercentage }
 */
export const calculateExpProgress = (
  totalSaved: number,
  targetAmount: number
): { currentExp: number; expToNextLevel: number; expPercentage: number } => {
  if (targetAmount <= 0) {
    return { currentExp: 0, expToNextLevel: 100, expPercentage: 0 };
  }

  const currentLevel = calculateLevel(totalSaved, targetAmount);

  if (currentLevel >= MAX_LEVEL) {
    return { currentExp: 100, expToNextLevel: 0, expPercentage: 100 };
  }

  // Calculate the savings amount needed for current level and next level
  // Reverse the level formula: progress = (level/100)^(1/0.85)
  const progressForCurrentLevel = Math.pow(currentLevel / MAX_LEVEL, 1 / 0.85);
  const progressForNextLevel = Math.pow((currentLevel + 1) / MAX_LEVEL, 1 / 0.85);

  const savingsForCurrentLevel = progressForCurrentLevel * targetAmount;
  const savingsForNextLevel = progressForNextLevel * targetAmount;

  // EXP within this level
  const expRangeForLevel = savingsForNextLevel - savingsForCurrentLevel;
  const currentExpInLevel = totalSaved - savingsForCurrentLevel;

  // Calculate percentage (0-100)
  const expPercentage = Math.min(
    100,
    Math.max(0, (currentExpInLevel / expRangeForLevel) * 100)
  );

  return {
    currentExp: Math.max(0, Math.round(currentExpInLevel * 100) / 100),
    expToNextLevel: Math.max(0, Math.round((expRangeForLevel - currentExpInLevel) * 100) / 100),
    expPercentage: Math.round(expPercentage * 10) / 10,
  };
};

/**
 * Calculate evolution stage based on level
 * Returns 0, 1, or 2
 */
export const calculateEvolutionStage = (level: number): 0 | 1 | 2 => {
  if (level >= EVOLUTION_THRESHOLDS.stage2) return 2;
  if (level >= EVOLUTION_THRESHOLDS.stage1) return 1;
  return 0;
};

/**
 * Get complete account stats
 */
export const calculateAccountStats = (account: SavingsAccount): AccountStats => {
  const totalSaved = calculateTotalSaved(account.entries);
  const level = calculateLevel(totalSaved, account.targetAmount);
  const { currentExp, expToNextLevel, expPercentage } = calculateExpProgress(
    totalSaved,
    account.targetAmount
  );
  const evolutionStage = calculateEvolutionStage(level);
  const progressPercentage =
    account.targetAmount > 0
      ? Math.round((totalSaved / account.targetAmount) * 1000) / 10
      : 0;

  return {
    totalSaved,
    level,
    currentExp,
    expToNextLevel,
    expPercentage,
    evolutionStage,
    progressPercentage,
  };
};

/**
 * Check if adding an amount would trigger a level up
 */
export const wouldLevelUp = (
  account: SavingsAccount,
  addAmount: number
): boolean => {
  const currentStats = calculateAccountStats(account);
  const newTotal = calculateTotalSaved(account.entries) + addAmount;
  const newLevel = calculateLevel(newTotal, account.targetAmount);

  return newLevel > currentStats.level;
};

/**
 * Check if adding an amount would trigger an evolution
 */
export const wouldEvolve = (
  account: SavingsAccount,
  addAmount: number
): { evolves: boolean; fromStage: number; toStage: number } => {
  const currentStats = calculateAccountStats(account);
  const newTotal = calculateTotalSaved(account.entries) + addAmount;
  const newLevel = calculateLevel(newTotal, account.targetAmount);
  const newStage = calculateEvolutionStage(newLevel);

  return {
    evolves: newStage > currentStats.evolutionStage,
    fromStage: currentStats.evolutionStage,
    toStage: newStage,
  };
};

/**
 * Calculate how much more needs to be saved to reach next level
 */
export const savingsToNextLevel = (
  totalSaved: number,
  targetAmount: number
): number => {
  const { expToNextLevel } = calculateExpProgress(totalSaved, targetAmount);
  return Math.max(0, expToNextLevel);
};

/**
 * Calculate how much needs to be saved to reach a specific evolution stage
 */
export const savingsToEvolution = (
  totalSaved: number,
  targetAmount: number,
  targetStage: 1 | 2
): number => {
  const targetLevel =
    targetStage === 1 ? EVOLUTION_THRESHOLDS.stage1 : EVOLUTION_THRESHOLDS.stage2;

  // Calculate savings needed for target level
  const progressForTargetLevel = Math.pow(targetLevel / MAX_LEVEL, 1 / 0.85);
  const savingsForTargetLevel = progressForTargetLevel * targetAmount;

  return Math.max(0, savingsForTargetLevel - totalSaved);
};

/**
 * Get a text description of the current level progress
 */
export const getLevelDescription = (level: number): string => {
  if (level >= 100) return 'MAX LEVEL!';
  if (level >= 90) return 'Almost there!';
  if (level >= 75) return 'Getting strong!';
  if (level >= 50) return 'Halfway there!';
  if (level >= 36) return 'Fully evolved!';
  if (level >= 25) return 'Growing fast!';
  if (level >= 16) return 'First evolution!';
  if (level >= 10) return 'Making progress!';
  if (level >= 5) return 'Just starting!';
  return 'Brand new!';
};
