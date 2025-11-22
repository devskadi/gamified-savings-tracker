// ============================================
// Pokemon Savings Tracker - Type Definitions
// ============================================

/**
 * Represents a single Pokemon evolution stage
 */
export interface PokemonStage {
  id: number; // PokéAPI ID
  name: string; // Pokemon name (e.g., "Charmander")
  spriteUrl: string; // URL to sprite image
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
 * A savings account represented as a Pokemon
 */
export interface SavingsAccount {
  id: string; // Unique ID for the account
  nickname: string; // User-given nickname for their Pokemon
  pokemonLineId: string; // Reference to PokemonEvolutionLine
  targetAmount: number; // Goal amount to save
  entries: SavingsEntry[]; // All savings entries
  createdAt: string; // ISO timestamp when account was created
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
