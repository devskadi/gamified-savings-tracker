// ============================================
// Pokemon Starter Data - Gen 1-9 + Hisuian
// ============================================

import { PokemonEvolutionLine, PokemonStage } from '@/types';

/**
 * Base URL for PokéAPI sprites
 * Using the official GitHub-hosted sprites for reliability
 */
const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/**
 * Get sprite URL for a given Pokemon ID
 * Uses the default front sprite
 */
const getSprite = (id: number | string): string => `${SPRITE_BASE}/${id}.png`;

/**
 * Get animated sprite URL (Gen 5 style)
 * Falls back to static if animated doesn't exist
 */
const getAnimatedSprite = (id: number): string =>
  `${SPRITE_BASE}/versions/generation-v/black-white/animated/${id}.gif`;

/**
 * Helper to create a Pokemon stage
 */
const createStage = (id: number | string, name: string): PokemonStage => ({
  id: typeof id === 'string' ? parseInt(id) : id,
  name,
  spriteUrl: getSprite(id),
});

/**
 * All starter Pokemon evolution lines from Gen 1-9 + Hisuian variants
 */
export const POKEMON_LINES: PokemonEvolutionLine[] = [
  // ==================== GENERATION 1 ====================
  {
    id: 'bulbasaur-line',
    name: 'Bulbasaur',
    generation: 1,
    type: 'grass',
    stages: [
      createStage(1, 'Bulbasaur'),
      createStage(2, 'Ivysaur'),
      createStage(3, 'Venusaur'),
    ],
  },
  {
    id: 'charmander-line',
    name: 'Charmander',
    generation: 1,
    type: 'fire',
    stages: [
      createStage(4, 'Charmander'),
      createStage(5, 'Charmeleon'),
      createStage(6, 'Charizard'),
    ],
  },
  {
    id: 'squirtle-line',
    name: 'Squirtle',
    generation: 1,
    type: 'water',
    stages: [
      createStage(7, 'Squirtle'),
      createStage(8, 'Wartortle'),
      createStage(9, 'Blastoise'),
    ],
  },

  // ==================== GENERATION 2 ====================
  {
    id: 'chikorita-line',
    name: 'Chikorita',
    generation: 2,
    type: 'grass',
    stages: [
      createStage(152, 'Chikorita'),
      createStage(153, 'Bayleef'),
      createStage(154, 'Meganium'),
    ],
  },
  {
    id: 'cyndaquil-line',
    name: 'Cyndaquil',
    generation: 2,
    type: 'fire',
    stages: [
      createStage(155, 'Cyndaquil'),
      createStage(156, 'Quilava'),
      createStage(157, 'Typhlosion'),
    ],
  },
  {
    id: 'totodile-line',
    name: 'Totodile',
    generation: 2,
    type: 'water',
    stages: [
      createStage(158, 'Totodile'),
      createStage(159, 'Croconaw'),
      createStage(160, 'Feraligatr'),
    ],
  },

  // ==================== GENERATION 3 ====================
  {
    id: 'treecko-line',
    name: 'Treecko',
    generation: 3,
    type: 'grass',
    stages: [
      createStage(252, 'Treecko'),
      createStage(253, 'Grovyle'),
      createStage(254, 'Sceptile'),
    ],
  },
  {
    id: 'torchic-line',
    name: 'Torchic',
    generation: 3,
    type: 'fire',
    stages: [
      createStage(255, 'Torchic'),
      createStage(256, 'Combusken'),
      createStage(257, 'Blaziken'),
    ],
  },
  {
    id: 'mudkip-line',
    name: 'Mudkip',
    generation: 3,
    type: 'water',
    stages: [
      createStage(258, 'Mudkip'),
      createStage(259, 'Marshtomp'),
      createStage(260, 'Swampert'),
    ],
  },

  // ==================== GENERATION 4 ====================
  {
    id: 'turtwig-line',
    name: 'Turtwig',
    generation: 4,
    type: 'grass',
    stages: [
      createStage(387, 'Turtwig'),
      createStage(388, 'Grotle'),
      createStage(389, 'Torterra'),
    ],
  },
  {
    id: 'chimchar-line',
    name: 'Chimchar',
    generation: 4,
    type: 'fire',
    stages: [
      createStage(390, 'Chimchar'),
      createStage(391, 'Monferno'),
      createStage(392, 'Infernape'),
    ],
  },
  {
    id: 'piplup-line',
    name: 'Piplup',
    generation: 4,
    type: 'water',
    stages: [
      createStage(393, 'Piplup'),
      createStage(394, 'Prinplup'),
      createStage(395, 'Empoleon'),
    ],
  },

  // ==================== GENERATION 5 ====================
  {
    id: 'snivy-line',
    name: 'Snivy',
    generation: 5,
    type: 'grass',
    stages: [
      createStage(495, 'Snivy'),
      createStage(496, 'Servine'),
      createStage(497, 'Serperior'),
    ],
  },
  {
    id: 'tepig-line',
    name: 'Tepig',
    generation: 5,
    type: 'fire',
    stages: [
      createStage(498, 'Tepig'),
      createStage(499, 'Pignite'),
      createStage(500, 'Emboar'),
    ],
  },
  {
    id: 'oshawott-line',
    name: 'Oshawott',
    generation: 5,
    type: 'water',
    stages: [
      createStage(501, 'Oshawott'),
      createStage(502, 'Dewott'),
      createStage(503, 'Samurott'),
    ],
  },

  // ==================== GENERATION 6 ====================
  {
    id: 'chespin-line',
    name: 'Chespin',
    generation: 6,
    type: 'grass',
    stages: [
      createStage(650, 'Chespin'),
      createStage(651, 'Quilladin'),
      createStage(652, 'Chesnaught'),
    ],
  },
  {
    id: 'fennekin-line',
    name: 'Fennekin',
    generation: 6,
    type: 'fire',
    stages: [
      createStage(653, 'Fennekin'),
      createStage(654, 'Braixen'),
      createStage(655, 'Delphox'),
    ],
  },
  {
    id: 'froakie-line',
    name: 'Froakie',
    generation: 6,
    type: 'water',
    stages: [
      createStage(656, 'Froakie'),
      createStage(657, 'Frogadier'),
      createStage(658, 'Greninja'),
    ],
  },

  // ==================== GENERATION 7 ====================
  {
    id: 'rowlet-line',
    name: 'Rowlet',
    generation: 7,
    type: 'grass',
    stages: [
      createStage(722, 'Rowlet'),
      createStage(723, 'Dartrix'),
      createStage(724, 'Decidueye'),
    ],
  },
  {
    id: 'litten-line',
    name: 'Litten',
    generation: 7,
    type: 'fire',
    stages: [
      createStage(725, 'Litten'),
      createStage(726, 'Torracat'),
      createStage(727, 'Incineroar'),
    ],
  },
  {
    id: 'popplio-line',
    name: 'Popplio',
    generation: 7,
    type: 'water',
    stages: [
      createStage(728, 'Popplio'),
      createStage(729, 'Brionne'),
      createStage(730, 'Primarina'),
    ],
  },

  // ==================== GENERATION 8 ====================
  {
    id: 'grookey-line',
    name: 'Grookey',
    generation: 8,
    type: 'grass',
    stages: [
      createStage(810, 'Grookey'),
      createStage(811, 'Thwackey'),
      createStage(812, 'Rillaboom'),
    ],
  },
  {
    id: 'scorbunny-line',
    name: 'Scorbunny',
    generation: 8,
    type: 'fire',
    stages: [
      createStage(813, 'Scorbunny'),
      createStage(814, 'Raboot'),
      createStage(815, 'Cinderace'),
    ],
  },
  {
    id: 'sobble-line',
    name: 'Sobble',
    generation: 8,
    type: 'water',
    stages: [
      createStage(816, 'Sobble'),
      createStage(817, 'Drizzile'),
      createStage(818, 'Inteleon'),
    ],
  },

  // ==================== GENERATION 9 ====================
  {
    id: 'sprigatito-line',
    name: 'Sprigatito',
    generation: 9,
    type: 'grass',
    stages: [
      createStage(906, 'Sprigatito'),
      createStage(907, 'Floragato'),
      createStage(908, 'Meowscarada'),
    ],
  },
  {
    id: 'fuecoco-line',
    name: 'Fuecoco',
    generation: 9,
    type: 'fire',
    stages: [
      createStage(909, 'Fuecoco'),
      createStage(910, 'Crocalor'),
      createStage(911, 'Skeledirge'),
    ],
  },
  {
    id: 'quaxly-line',
    name: 'Quaxly',
    generation: 9,
    type: 'water',
    stages: [
      createStage(912, 'Quaxly'),
      createStage(913, 'Quaxwell'),
      createStage(914, 'Quaquaval'),
    ],
  },

  // ==================== HISUIAN VARIANTS ====================
  // These share base forms with their original counterparts
  // but have unique final evolutions
  {
    id: 'rowlet-hisui-line',
    name: 'Rowlet (Hisui)',
    generation: 8,
    type: 'grass',
    isHisuian: true,
    stages: [
      createStage(722, 'Rowlet'),
      createStage(723, 'Dartrix'),
      createStage('10239', 'H-Decidueye'),
    ],
  },
  {
    id: 'cyndaquil-hisui-line',
    name: 'Cyndaquil (Hisui)',
    generation: 8,
    type: 'fire',
    isHisuian: true,
    stages: [
      createStage(155, 'Cyndaquil'),
      createStage(156, 'Quilava'),
      createStage('10240', 'H-Typhlosion'),
    ],
  },
  {
    id: 'oshawott-hisui-line',
    name: 'Oshawott (Hisui)',
    generation: 8,
    type: 'water',
    isHisuian: true,
    stages: [
      createStage(501, 'Oshawott'),
      createStage(502, 'Dewott'),
      createStage('10241', 'H-Samurott'),
    ],
  },
];

/**
 * Get a Pokemon evolution line by its ID
 */
export const getPokemonLine = (id: string): PokemonEvolutionLine | undefined => {
  return POKEMON_LINES.find((line) => line.id === id);
};

/**
 * Get all Pokemon lines for a specific generation
 */
export const getPokemonByGeneration = (gen: number): PokemonEvolutionLine[] => {
  return POKEMON_LINES.filter((line) => line.generation === gen);
};

/**
 * Get all Pokemon lines of a specific type
 */
export const getPokemonByType = (
  type: 'grass' | 'fire' | 'water'
): PokemonEvolutionLine[] => {
  return POKEMON_LINES.filter((line) => line.type === type);
};

/**
 * Get all Hisuian variant lines
 */
export const getHisuianPokemon = (): PokemonEvolutionLine[] => {
  return POKEMON_LINES.filter((line) => line.isHisuian);
};

/**
 * Get all non-Hisuian (standard) Pokemon lines
 */
export const getStandardPokemon = (): PokemonEvolutionLine[] => {
  return POKEMON_LINES.filter((line) => !line.isHisuian);
};

/**
 * Type colors for UI theming
 */
export const TYPE_COLORS = {
  grass: {
    primary: '#78C850',
    secondary: '#4E8234',
    light: '#A7DB8D',
  },
  fire: {
    primary: '#F08030',
    secondary: '#9C531F',
    light: '#F5AC78',
  },
  water: {
    primary: '#6890F0',
    secondary: '#445E9C',
    light: '#9DB7F5',
  },
} as const;

/**
 * Generation names for display
 */
export const GENERATION_NAMES: Record<number, string> = {
  1: 'Kanto',
  2: 'Johto',
  3: 'Hoenn',
  4: 'Sinnoh',
  5: 'Unova',
  6: 'Kalos',
  7: 'Alola',
  8: 'Galar/Hisui',
  9: 'Paldea',
};
