'use client';

// ============================================
// Achievements Panel Component
// Full view of all achievements with progress
// ============================================

import React from 'react';
import { RARITY_COLORS } from '@/types';

interface AchievementWithStatus {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  unlockedAt: string | null;
  progress: { current: number; target: number } | null;
}

interface AchievementsPanelProps {
  achievements: AchievementWithStatus[];
  onClose: () => void;
}

/**
 * Full achievements panel showing all achievements
 */
export function AchievementsPanel({
  achievements,
  onClose,
}: AchievementsPanelProps) {
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const percentage = (unlockedCount / achievements.length) * 100;

  // Group by rarity
  const grouped = {
    legendary: achievements.filter((a) => a.rarity === 'legendary'),
    epic: achievements.filter((a) => a.rarity === 'epic'),
    rare: achievements.filter((a) => a.rarity === 'rare'),
    uncommon: achievements.filter((a) => a.rarity === 'uncommon'),
    common: achievements.filter((a) => a.rarity === 'common'),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Achievements</h2>
              <p className="text-sm text-white/80">
                {unlockedCount} of {achievements.length} unlocked
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl leading-none p-1"
            >
              x
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-xs text-white/80 mt-1 text-right">
              {percentage.toFixed(0)}% complete
            </p>
          </div>
        </div>

        {/* Achievements List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
          {Object.entries(grouped).map(([rarity, items]) => {
            if (items.length === 0) return null;
            const rarityLabel = rarity.charAt(0).toUpperCase() + rarity.slice(1);

            return (
              <div key={rarity}>
                <h3
                  className="text-sm font-bold mb-2 px-2"
                  style={{ color: RARITY_COLORS[rarity as keyof typeof RARITY_COLORS].text }}
                >
                  {rarityLabel}
                </h3>
                <div className="space-y-2">
                  {items.map((achievement) => (
                    <AchievementCard
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-gray-600 font-medium bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface AchievementCardProps {
  achievement: AchievementWithStatus;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const colors = RARITY_COLORS[achievement.rarity];

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-xl border-2 transition-all
        ${achievement.isUnlocked
          ? 'bg-white shadow-sm'
          : 'bg-gray-50 opacity-60'
        }
      `}
      style={{
        borderColor: achievement.isUnlocked ? colors.border : '#e5e7eb',
      }}
    >
      {/* Icon */}
      <div
        className={`
          w-14 h-14 rounded-xl flex items-center justify-center text-2xl
          ${achievement.isUnlocked ? '' : 'grayscale'}
        `}
        style={{
          backgroundColor: achievement.isUnlocked ? colors.bg : '#f3f4f6',
        }}
      >
        {achievement.isUnlocked ? achievement.icon : '?'}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4
          className="font-bold text-sm truncate"
          style={{ color: achievement.isUnlocked ? colors.text : '#9ca3af' }}
        >
          {achievement.name}
        </h4>
        <p className="text-xs text-gray-500 mt-0.5">
          {achievement.description}
        </p>

        {/* Progress bar for achievements with progress */}
        {achievement.progress && !achievement.isUnlocked && (
          <div className="mt-2">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(achievement.progress.current / achievement.progress.target) * 100}%`,
                  backgroundColor: colors.border,
                }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {achievement.progress.current}/{achievement.progress.target}
            </p>
          </div>
        )}

        {/* Unlock date */}
        {achievement.isUnlocked && achievement.unlockedAt && (
          <p className="text-[10px] text-gray-400 mt-1">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Unlocked indicator */}
      {achievement.isUnlocked && (
        <div className="flex-shrink-0">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.bg }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: colors.text }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
