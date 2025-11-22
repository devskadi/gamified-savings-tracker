'use client';

// ============================================
// Dashboard View Component
// Shows stats, activity, achievements, insights
// ============================================

import React, { useMemo } from 'react';
import {
  SavingsAccount,
  AccountStats,
  PokemonEvolutionLine,
  UserSettings,
  ActivityLogEntry,
  ACHIEVEMENTS,
  RARITY_COLORS,
} from '@/types';
import { PokemonSprite } from './PokemonSprite';
import { formatCurrency } from '@/lib/utils';
import { POKEMON_LINES } from '@/lib/pokemon-data';

interface DashboardViewProps {
  accounts: Array<{
    account: SavingsAccount;
    stats: AccountStats;
    pokemonLine: PokemonEvolutionLine | undefined;
  }>;
  settings: UserSettings;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    isUnlocked: boolean;
    unlockedAt: string | null;
    progress: { current: number; target: number } | null;
  }>;
  activityLog: ActivityLogEntry[];
  totalSaved: number;
  onViewAchievements: () => void;
  onOpenSettings: () => void;
}

/**
 * Dashboard view with stats, activity, and achievements
 */
export function DashboardView({
  accounts,
  settings,
  achievements,
  activityLog,
  totalSaved,
  onViewAchievements,
  onOpenSettings,
}: DashboardViewProps) {
  // Calculate insights
  const insights = useMemo(() => {
    const totalDeposits = accounts.reduce(
      (sum, { account }) =>
        sum + account.entries.filter((e) => e.amount > 0).length,
      0
    );

    const averageLevel =
      accounts.length > 0
        ? accounts.reduce((sum, { stats }) => sum + stats.level, 0) /
          accounts.length
        : 0;

    const highestLevel = accounts.length > 0
      ? Math.max(...accounts.map(({ stats }) => stats.level))
      : 0;

    const fullyEvolved = accounts.filter(
      ({ stats }) => stats.evolutionStage >= 2
    ).length;

    const closestToGoal = accounts.length > 0
      ? accounts.reduce((closest, current) =>
          current.stats.progressPercentage > closest.stats.progressPercentage
            ? current
            : closest
        )
      : null;

    // Weekly savings (entries from last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySavings = accounts.reduce((sum, { account }) => {
      return (
        sum +
        account.entries
          .filter(
            (e) => e.amount > 0 && new Date(e.createdAt) >= weekAgo
          )
          .reduce((s, e) => s + e.amount, 0)
      );
    }, 0);

    return {
      totalDeposits,
      averageLevel: Math.round(averageLevel),
      highestLevel,
      fullyEvolved,
      closestToGoal,
      weeklySavings,
    };
  }, [accounts]);

  // Pokedex completion
  const pokedexStats = useMemo(() => {
    const usedPokemonIds = new Set(accounts.map(({ account }) => account.pokemonLineId));
    const totalAvailable = POKEMON_LINES.length;
    const collected = usedPokemonIds.size;
    const percentage = (collected / totalAvailable) * 100;

    return { collected, totalAvailable, percentage };
  }, [accounts]);

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>
          <p className="text-xs text-gray-500">Your savings overview</p>
        </div>
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors flex items-center justify-center"
          title="Settings"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Overview Stats Panel */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg">
        <h2 className="text-sm font-medium text-white/80 mb-3">Total Savings</h2>
        <p className="text-3xl font-bold mb-4">
          {formatCurrency(totalSaved, settings.currency)}
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{accounts.length}</p>
            <p className="text-xs text-white/80">Pokemon</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{insights.highestLevel}</p>
            <p className="text-xs text-white/80">Max Level</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold">{insights.fullyEvolved}</p>
            <p className="text-xs text-white/80">Evolved</p>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      {insights.weeklySavings > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                +{formatCurrency(insights.weeklySavings, settings.currency)} this week
              </p>
              <p className="text-xs text-green-600">Keep up the great work!</p>
            </div>
          </div>
        </div>
      )}

      {/* Pokedex Completion */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">Pokedex Progress</h3>
          <span className="text-sm text-gray-500">
            {pokedexStats.collected}/{pokedexStats.totalAvailable}
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
            style={{ width: `${pokedexStats.percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500">
          {pokedexStats.percentage.toFixed(1)}% of starter Pokemon collected
        </p>
      </div>

      {/* Achievements Preview */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800">Achievements</h3>
          <button
            onClick={onViewAchievements}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{
                width: `${(unlockedAchievements.length / achievements.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {unlockedAchievements.length}/{achievements.length}
          </span>
        </div>

        {/* Recent achievements */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {unlockedAchievements.slice(0, 5).map((achievement) => (
            <div
              key={achievement.id}
              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{
                backgroundColor: RARITY_COLORS[achievement.rarity].bg,
                border: `2px solid ${RARITY_COLORS[achievement.rarity].border}`,
              }}
              title={achievement.name}
            >
              {achievement.icon}
            </div>
          ))}
          {unlockedAchievements.length === 0 && (
            <p className="text-sm text-gray-400 py-2">
              No achievements unlocked yet. Keep saving!
            </p>
          )}
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Insights</h3>
        <div className="space-y-3">
          {insights.closestToGoal && (
            <InsightCard
              icon="🎯"
              title="Closest to Goal"
              value={`${insights.closestToGoal.account.nickname} - ${insights.closestToGoal.stats.progressPercentage.toFixed(0)}%`}
              color="blue"
            />
          )}
          <InsightCard
            icon="💵"
            title="Total Deposits"
            value={`${insights.totalDeposits} deposits made`}
            color="green"
          />
          <InsightCard
            icon="⭐"
            title="Average Level"
            value={`Level ${insights.averageLevel}`}
            color="purple"
          />
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Recent Activity</h3>
        {activityLog.length > 0 ? (
          <div className="space-y-2">
            {activityLog.slice(0, 5).map((entry) => (
              <ActivityItem
                key={entry.id}
                entry={entry}
                settings={settings}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 py-4 text-center">
            No recent activity. Start saving to see your progress here!
          </p>
        )}
      </div>

      {/* Pokemon Showcase */}
      {accounts.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3">Your Team</h3>
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {accounts.map(({ account, stats, pokemonLine }) => {
              if (!pokemonLine) return null;
              const currentPokemon = pokemonLine.stages[stats.evolutionStage];
              return (
                <div key={account.id} className="flex-shrink-0 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center">
                    <PokemonSprite
                      src={currentPokemon.spriteUrl}
                      alt={currentPokemon.name}
                      size="sm"
                      idle
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 truncate max-w-16">
                    Lv.{stats.level}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Sub-components ====================

interface InsightCardProps {
  icon: string;
  title: string;
  value: string;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

function InsightCard({ icon, title, value, color }: InsightCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${colors[color]}`}>
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs opacity-80">{title}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  entry: ActivityLogEntry;
  settings: UserSettings;
}

function ActivityItem({ entry, settings }: ActivityItemProps) {
  const getActivityInfo = () => {
    switch (entry.type) {
      case 'deposit':
        return {
          icon: '💰',
          text: `Deposited ${formatCurrency(entry.amount || 0, settings.currency)}`,
          subtext: entry.accountNickname,
          color: 'text-green-600',
        };
      case 'withdraw':
        return {
          icon: '📤',
          text: `Withdrew ${formatCurrency(Math.abs(entry.amount || 0), settings.currency)}`,
          subtext: entry.accountNickname,
          color: 'text-red-600',
        };
      case 'level_up':
        return {
          icon: '⬆️',
          text: `Level up! ${entry.oldLevel} -> ${entry.newLevel}`,
          subtext: entry.accountNickname,
          color: 'text-blue-600',
        };
      case 'evolution':
        return {
          icon: '✨',
          text: 'Pokemon evolved!',
          subtext: entry.accountNickname,
          color: 'text-purple-600',
        };
      case 'achievement':
        const achievement = ACHIEVEMENTS.find((a) => a.id === entry.achievementId);
        return {
          icon: achievement?.icon || '🏅',
          text: `Unlocked: ${achievement?.name || 'Achievement'}`,
          subtext: null,
          color: 'text-amber-600',
        };
      case 'new_pokemon':
        return {
          icon: '🎉',
          text: `New Pokemon: ${entry.pokemonName}`,
          subtext: null,
          color: 'text-indigo-600',
        };
      default:
        return {
          icon: '📝',
          text: 'Activity',
          subtext: null,
          color: 'text-gray-600',
        };
    }
  };

  const info = getActivityInfo();
  const timeAgo = getTimeAgo(entry.createdAt);

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-lg">{info.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${info.color}`}>{info.text}</p>
        {info.subtext && (
          <p className="text-xs text-gray-400 truncate">{info.subtext}</p>
        )}
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo}</span>
    </div>
  );
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
