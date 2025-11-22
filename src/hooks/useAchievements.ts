'use client';

// ============================================
// Achievements Hook
// Tracks and manages user achievements
// ============================================

import { useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import {
  AchievementId,
  AchievementProgress,
  Achievement,
  ACHIEVEMENTS,
  SavingsAccount,
  AccountStats,
  ActivityLogEntry,
} from '@/types';
import { MAX_ACCOUNTS } from './useSavings';

// localStorage keys
const ACHIEVEMENTS_KEY = 'pokemon-savings-achievements';
const ACTIVITY_LOG_KEY = 'pokemon-savings-activity';

// Maximum activity log entries to keep
const MAX_ACTIVITY_ENTRIES = 50;

/**
 * Generate a unique ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Hook for managing achievements and activity log
 */
export function useAchievements(
  accounts: SavingsAccount[],
  accountsStats: AccountStats[],
  totalSaved: number
) {
  // Persisted state
  const [achievementProgress, setAchievementProgress] = useLocalStorage<
    Record<AchievementId, AchievementProgress>
  >(ACHIEVEMENTS_KEY, {} as Record<AchievementId, AchievementProgress>);

  const [activityLog, setActivityLog] = useLocalStorage<ActivityLogEntry[]>(
    ACTIVITY_LOG_KEY,
    []
  );

  // ==================== ACHIEVEMENT CHECKING ====================

  /**
   * Check if an achievement should be unlocked
   */
  const checkAchievementCondition = useCallback(
    (id: AchievementId): boolean => {
      switch (id) {
        case 'first_steps':
          return accounts.length >= 1;

        case 'first_evolution':
          return accountsStats.some((stats) => stats.evolutionStage >= 1);

        case 'full_party':
          return accounts.length >= MAX_ACCOUNTS;

        case 'level_50':
          return accountsStats.some((stats) => stats.level >= 50);

        case 'master_trainer':
          return accountsStats.some((stats) => stats.level >= 100);

        case 'final_form':
          return accountsStats.some((stats) => stats.evolutionStage >= 2);

        case 'goal_crusher':
          return accountsStats.some((stats) => stats.progressPercentage >= 100);

        case 'big_saver':
          return totalSaved >= 1000;

        case 'dedicated': {
          const totalDeposits = accounts.reduce(
            (sum, acc) => sum + acc.entries.filter((e) => e.amount > 0).length,
            0
          );
          return totalDeposits >= 10;
        }

        case 'collector': {
          const fullyEvolved = accountsStats.filter(
            (stats) => stats.evolutionStage >= 2
          ).length;
          return fullyEvolved >= 3;
        }

        default:
          return false;
      }
    },
    [accounts, accountsStats, totalSaved]
  );

  /**
   * Get progress for achievements with numeric progress
   */
  const getAchievementProgress = useCallback(
    (id: AchievementId): { current: number; target: number } | null => {
      switch (id) {
        case 'full_party':
          return { current: accounts.length, target: MAX_ACCOUNTS };

        case 'level_50':
          return {
            current: Math.min(
              Math.max(...accountsStats.map((s) => s.level), 0),
              50
            ),
            target: 50,
          };

        case 'master_trainer':
          return {
            current: Math.max(...accountsStats.map((s) => s.level), 0),
            target: 100,
          };

        case 'big_saver':
          return { current: Math.min(totalSaved, 1000), target: 1000 };

        case 'dedicated': {
          const totalDeposits = accounts.reduce(
            (sum, acc) => sum + acc.entries.filter((e) => e.amount > 0).length,
            0
          );
          return { current: Math.min(totalDeposits, 10), target: 10 };
        }

        case 'collector': {
          const fullyEvolved = accountsStats.filter(
            (stats) => stats.evolutionStage >= 2
          ).length;
          return { current: Math.min(fullyEvolved, 3), target: 3 };
        }

        default:
          return null;
      }
    },
    [accounts, accountsStats, totalSaved]
  );

  // ==================== ACHIEVEMENT OPERATIONS ====================

  /**
   * Unlock an achievement
   */
  const unlockAchievement = useCallback(
    (id: AchievementId): boolean => {
      // Already unlocked
      if (achievementProgress[id]?.unlockedAt) {
        return false;
      }

      setAchievementProgress((prev) => ({
        ...prev,
        [id]: {
          unlockedAt: new Date().toISOString(),
        },
      }));

      // Add to activity log
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (achievement) {
        addActivityEntry({
          type: 'achievement',
          achievementId: id,
        });
      }

      return true;
    },
    [achievementProgress, setAchievementProgress]
  );

  /**
   * Check and unlock any achievements that should be unlocked
   */
  const checkAndUnlockAchievements = useCallback((): AchievementId[] => {
    const newlyUnlocked: AchievementId[] = [];

    ACHIEVEMENTS.forEach((achievement) => {
      if (!achievementProgress[achievement.id]?.unlockedAt) {
        if (checkAchievementCondition(achievement.id)) {
          if (unlockAchievement(achievement.id)) {
            newlyUnlocked.push(achievement.id);
          }
        }
      }
    });

    return newlyUnlocked;
  }, [achievementProgress, checkAchievementCondition, unlockAchievement]);

  // Auto-check achievements when data changes
  useEffect(() => {
    checkAndUnlockAchievements();
  }, [accounts.length, totalSaved, JSON.stringify(accountsStats)]);

  // ==================== ACTIVITY LOG OPERATIONS ====================

  /**
   * Add an entry to the activity log
   */
  const addActivityEntry = useCallback(
    (
      entry: Omit<ActivityLogEntry, 'id' | 'createdAt'>
    ): void => {
      const newEntry: ActivityLogEntry = {
        ...entry,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };

      setActivityLog((prev) => {
        const updated = [newEntry, ...prev];
        // Keep only the most recent entries
        return updated.slice(0, MAX_ACTIVITY_ENTRIES);
      });
    },
    [setActivityLog]
  );

  /**
   * Clear activity log
   */
  const clearActivityLog = useCallback((): void => {
    setActivityLog([]);
  }, [setActivityLog]);

  // ==================== COMPUTED VALUES ====================

  /**
   * Get all achievements with their unlock status
   */
  const achievementsWithStatus = useMemo(() => {
    return ACHIEVEMENTS.map((achievement) => {
      const progress = achievementProgress[achievement.id];
      const numericProgress = getAchievementProgress(achievement.id);

      return {
        ...achievement,
        isUnlocked: !!progress?.unlockedAt,
        unlockedAt: progress?.unlockedAt || null,
        progress: numericProgress,
      };
    });
  }, [achievementProgress, getAchievementProgress]);

  /**
   * Count of unlocked achievements
   */
  const unlockedCount = useMemo(() => {
    return achievementsWithStatus.filter((a) => a.isUnlocked).length;
  }, [achievementsWithStatus]);

  /**
   * Percentage of achievements unlocked
   */
  const completionPercentage = useMemo(() => {
    return (unlockedCount / ACHIEVEMENTS.length) * 100;
  }, [unlockedCount]);

  /**
   * Recently unlocked achievements (last 3)
   */
  const recentlyUnlocked = useMemo(() => {
    return achievementsWithStatus
      .filter((a) => a.isUnlocked)
      .sort(
        (a, b) =>
          new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime()
      )
      .slice(0, 3);
  }, [achievementsWithStatus]);

  return {
    // Achievements
    achievements: achievementsWithStatus,
    unlockedCount,
    totalAchievements: ACHIEVEMENTS.length,
    completionPercentage,
    recentlyUnlocked,

    // Operations
    unlockAchievement,
    checkAndUnlockAchievements,

    // Activity log
    activityLog,
    addActivityEntry,
    clearActivityLog,
  };
}
