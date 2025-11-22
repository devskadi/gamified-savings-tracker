// ============================================
// Pokemon Savings Tracker - Type Definitions
// ============================================

/**
 * Represents a single Pokemon evolution stage
 */
export interface PokemonStage {
  id: number; // PokéAPI ID
  name: string; // Pokemon name (e.g., "Charmander")
  spriteUrl: string; // URL to static sprite image
  animatedSpriteUrl?: string; // URL to animated sprite (if available)
}

/**
 * Represents a Pokemon's complete evolution line
 */
export interface PokemonEvolutionLine {
  id: string; // Unique identifier for this evolution line
  name: string; // Display name (e.g., "Charmander Line")
  generation: number; // Generation number (1-9)
  type: 'grass' | 'fire' | 'water'; // Starter type
  isHisuian?: boolean; // Whether this is a Hisuian variant
  stages: [PokemonStage, PokemonStage, PokemonStage]; // Base, Stage 1, Stage 2
}

/**
 * A single savings entry/transaction
 */
export interface SavingsEntry {
  id: string; // Unique ID for the entry
  amount: number; // Amount saved (positive) or withdrawn (negative)
  note?: string; // Optional note/description
  createdAt: string; // ISO timestamp
}

/**
 * Background theme options for Pokemon cards
 */
export type BackgroundTheme =
  | 'default' // Uses type-based color
  | 'forest' // Green nature theme
  | 'ocean' // Blue water theme
  | 'volcano' // Red fire theme
  | 'night' // Dark purple theme
  | 'sunset' // Orange/pink gradient
  | 'aurora' // Teal/purple gradient
  | 'galaxy' // Deep space theme
  | 'meadow' // Light green/yellow
  | 'crystal' // Ice blue theme
  | 'custom'; // User-defined color

/**
 * Background configuration for a Pokemon
 */
export interface BackgroundConfig {
  theme: BackgroundTheme;
  customColor?: string; // Hex color for 'custom' theme
}

/**
 * A savings account represented as a Pokemon
 */
export interface SavingsAccount {
  id: string; // Unique ID for the account
  nickname: string; // User-given nickname for their Pokemon
  pokemonLineId: string; // Reference to PokemonEvolutionLine
  targetAmount: number; // Goal amount to save
  entries: SavingsEntry[]; // All savings entries
  createdAt: string; // ISO timestamp when account was created
  background?: BackgroundConfig; // Custom background theme
}

/**
 * Calculated stats for a savings account
 */
export interface AccountStats {
  totalSaved: number; // Sum of all entries
  level: number; // Current level (1-100)
  expToNextLevel: number; // EXP needed for next level
  currentExp: number; // Current EXP within this level
  expPercentage: number; // Percentage to next level (0-100)
  evolutionStage: 0 | 1 | 2; // Current evolution stage index
  progressPercentage: number; // Progress toward goal (0-100+)
}

/**
 * Level up event data for animations
 */
export interface LevelUpEvent {
  accountId: string;
  oldLevel: number;
  newLevel: number;
  evolved: boolean;
  oldStage?: number;
  newStage?: number;
}

/**
 * User settings stored in localStorage
 */
export interface UserSettings {
  currency: CurrencyOption;
  soundEnabled: boolean;
  soundVolume: number; // 0-100
}

/**
 * Currency configuration option
 */
export interface CurrencyOption {
  code: string; // e.g., "USD"
  symbol: string; // e.g., "$"
  name: string; // e.g., "US Dollar"
  position: 'before' | 'after'; // Symbol position relative to amount
}

/**
 * Available currencies
 */
export const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', position: 'before' },
  { code: 'EUR', symbol: '€', name: 'Euro', position: 'before' },
  { code: 'GBP', symbol: '£', name: 'British Pound', position: 'before' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', position: 'before' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', position: 'before' },
  { code: 'KRW', symbol: '₩', name: 'Korean Won', position: 'before' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', position: 'before' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', position: 'before' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', position: 'before' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', position: 'before' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', position: 'before' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', position: 'before' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', position: 'before' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', position: 'after' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', position: 'before' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', position: 'before' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', position: 'before' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', position: 'before' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', position: 'after' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', position: 'after' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', position: 'after' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty', position: 'after' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', position: 'after' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', position: 'before' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', position: 'before' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', position: 'before' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', position: 'before' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', position: 'before' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', position: 'before' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', position: 'before' },
];

/**
 * Default user settings
 */
export const DEFAULT_SETTINGS: UserSettings = {
  currency: CURRENCIES[0], // USD
  soundEnabled: true,
  soundVolume: 70,
};

/**
 * App view states
 */
export type AppView =
  | 'party' // Main party view showing all Pokemon
  | 'dashboard' // Dashboard with stats and achievements
  | 'pokemon-detail' // Viewing a specific Pokemon's details
  | 'pokemon-select' // Selecting a new Pokemon to add
  | 'settings'; // Settings screen

/**
 * Audio sound types available
 */
export type SoundType =
  | 'button' // Button press
  | 'select' // Selection made
  | 'add' // Entry added
  | 'levelUp' // Level gained
  | 'evolution' // Pokemon evolved
  | 'release' // Pokemon released
  | 'error' // Error sound
  | 'open' // Menu/modal open
  | 'close'; // Menu/modal close

/**
 * Pokemon suggestion from user
 */
export interface PokemonSuggestion {
  id: string;
  pokemonName: string;
  reason?: string;
  createdAt: string;
}

/**
 * Background theme definitions with gradients
 */
export const BACKGROUND_THEMES: Record<
  Exclude<BackgroundTheme, 'custom' | 'default'>,
  { name: string; gradient: string; textColor: string }
> = {
  forest: {
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #2d5a27 0%, #1a3a15 50%, #0d2a0a 100%)',
    textColor: '#a8e6a3',
  },
  ocean: {
    name: 'Ocean',
    gradient: 'linear-gradient(135deg, #1e5799 0%, #2989d8 50%, #207cca 100%)',
    textColor: '#b3e0ff',
  },
  volcano: {
    name: 'Volcano',
    gradient: 'linear-gradient(135deg, #8b0000 0%, #cc3300 50%, #ff4500 100%)',
    textColor: '#ffcccc',
  },
  night: {
    name: 'Night',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    textColor: '#c9b8ff',
  },
  sunset: {
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
    textColor: '#4a0033',
  },
  aurora: {
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #00d9ff 0%, #00ffc8 25%, #7b68ee 75%, #9400d3 100%)',
    textColor: '#ffffff',
  },
  galaxy: {
    name: 'Galaxy',
    gradient: 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 25%, #2d1b4e 50%, #1a0a2e 100%)',
    textColor: '#e0d0ff',
  },
  meadow: {
    name: 'Meadow',
    gradient: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 50%, #7cb342 100%)',
    textColor: '#1a3a0a',
  },
  crystal: {
    name: 'Crystal',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)',
    textColor: '#2a1a3a',
  },
};

// ============================================
// Achievement System Types
// ============================================

/**
 * Achievement IDs for all available achievements
 */
export type AchievementId =
  | 'first_steps'      // Create your first savings goal
  | 'first_evolution'  // Evolve a Pokemon for the first time
  | 'full_party'       // Fill all 6 slots
  | 'level_50'         // Get a Pokemon to level 50
  | 'master_trainer'   // Get a Pokemon to level 100
  | 'final_form'       // Fully evolve a Pokemon (stage 3)
  | 'goal_crusher'     // Reach 100% of a savings goal
  | 'big_saver'        // Have $1000+ total saved
  | 'dedicated'        // Make 10+ deposits
  | 'collector';       // Have 3+ fully evolved Pokemon

/**
 * Achievement definition
 */
export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string; // Emoji icon
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

/**
 * User's achievement progress
 */
export interface AchievementProgress {
  unlockedAt: string | null; // ISO timestamp when unlocked, null if locked
  progress?: number; // Optional progress value (e.g., 7/10 deposits)
  target?: number; // Optional target value
}

/**
 * All achievements with their definitions
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Create your first savings goal',
    icon: '🥚',
    rarity: 'common',
  },
  {
    id: 'first_evolution',
    name: 'First Evolution',
    description: 'Evolve a Pokemon for the first time',
    icon: '🌱',
    rarity: 'common',
  },
  {
    id: 'full_party',
    name: 'Full Party',
    description: 'Fill all 6 Pokemon slots',
    icon: '👥',
    rarity: 'uncommon',
  },
  {
    id: 'level_50',
    name: 'Level 50 Club',
    description: 'Get a Pokemon to level 50',
    icon: '⭐',
    rarity: 'uncommon',
  },
  {
    id: 'master_trainer',
    name: 'Master Trainer',
    description: 'Get a Pokemon to level 100',
    icon: '🏆',
    rarity: 'legendary',
  },
  {
    id: 'final_form',
    name: 'Final Form',
    description: 'Fully evolve a Pokemon to its final stage',
    icon: '💎',
    rarity: 'rare',
  },
  {
    id: 'goal_crusher',
    name: 'Goal Crusher',
    description: 'Reach 100% of a savings goal',
    icon: '🎯',
    rarity: 'rare',
  },
  {
    id: 'big_saver',
    name: 'Big Saver',
    description: 'Have $1000+ total saved across all accounts',
    icon: '💰',
    rarity: 'epic',
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Make 10 or more deposits',
    icon: '📈',
    rarity: 'uncommon',
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Have 3 or more fully evolved Pokemon',
    icon: '🌟',
    rarity: 'epic',
  },
];

/**
 * Rarity colors for achievements
 */
export const RARITY_COLORS: Record<Achievement['rarity'], { bg: string; border: string; text: string }> = {
  common: { bg: '#f3f4f6', border: '#d1d5db', text: '#374151' },
  uncommon: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  rare: { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
  epic: { bg: '#f3e8ff', border: '#c4b5fd', text: '#6b21a8' },
  legendary: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
};

/**
 * Activity log entry for recent activity feed
 */
export interface ActivityLogEntry {
  id: string;
  type: 'deposit' | 'withdraw' | 'level_up' | 'evolution' | 'achievement' | 'new_pokemon';
  accountId?: string; // Associated Pokemon account
  accountNickname?: string;
  amount?: number; // For deposit/withdraw
  oldLevel?: number; // For level up
  newLevel?: number;
  oldStage?: number; // For evolution
  newStage?: number;
  achievementId?: AchievementId; // For achievement unlock
  pokemonName?: string; // For new pokemon
  createdAt: string; // ISO timestamp
}
