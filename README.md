# PokéSavings - 8-bit Savings Tracker

A retro Game Boy Advance–styled savings tracker inspired by Pokémon FireRed/LeafGreen. Track your savings goals with your favorite starter Pokémon!

![PokéSavings](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png)

## Features

### 🎮 Retro Aesthetic
- Pixel-art, 8-bit visual design throughout
- FireRed/LeafGreen inspired color palette
- Pokédex-style interface with chunky borders and pixel fonts
- Authentic GBA screen effects with scanlines

### 🐾 Pokémon Party System
- Choose from **all starter Pokémon** (Gen 1-9 + Hisuian variants)
- Maximum **6 Pokémon** (savings accounts) like a real party
- Give your Pokémon custom nicknames
- Watch them **evolve** as you save more!

### 📊 Savings Tracking
- Set custom savings goals for each Pokémon
- Add deposits and withdrawals
- Track progress with EXP bars
- View complete entry history

### 🎵 Retro Audio
- Authentic 8-bit sound effects using Web Audio API
- Sounds for: button presses, level ups, evolutions, and more
- Adjustable volume or mute entirely

### 💰 Flexible Currency
- Support for **30+ currencies** worldwide
- Configurable currency symbol and position

### ⚡ Level & Evolution System
- **100 levels** scaled to your savings goal
- **3 evolution stages** per Pokémon:
  - Base form: Levels 1-15
  - First evolution: Levels 16-35
  - Final evolution: Levels 36-100
- Level-up and evolution animations

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Web Audio API** (for 8-bit sounds)
- **localStorage** (no backend required!)
- **PokéAPI Sprites** (for Pokémon images)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pokemon-savings-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Building for Production

```bash
# Create static build
npm run build

# The output will be in the 'out' directory
```

## Deploying to Vercel

This project is configured for **static export** and deploys seamlessly to Vercel:

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Vercel will auto-detect Next.js and deploy

### Option 3: Manual Deploy

1. Run `npm run build`
2. Upload the `out` folder to any static hosting

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles & pixel aesthetics
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main application page
├── components/
│   ├── ExpBar.tsx           # Experience bar component
│   ├── LevelUpOverlay.tsx   # Level up/evolution animations
│   ├── PartyView.tsx        # Main party display (6 slots)
│   ├── PixelButton.tsx      # Styled button component
│   ├── PixelInput.tsx       # Styled input components
│   ├── PokedexFrame.tsx     # Main Pokédex frame container
│   ├── PokemonDetail.tsx    # Individual Pokémon detail view
│   ├── PokemonSelector.tsx  # Pokémon selection modal
│   ├── PokemonSprite.tsx    # Sprite display with animations
│   └── SettingsModal.tsx    # Settings configuration
├── hooks/
│   ├── useAudio.ts          # 8-bit audio hook
│   ├── useLocalStorage.ts   # localStorage persistence
│   └── useSavings.ts        # Main savings state management
├── lib/
│   ├── audio.ts             # Web Audio API sound generation
│   ├── level-calculator.ts  # Level/EXP calculation logic
│   ├── pokemon-data.ts      # All starter Pokémon data
│   └── utils.ts             # Utility functions
└── types/
    └── index.ts             # TypeScript type definitions
```

## Available Pokémon

### Generation 1 (Kanto)
- 🌿 Bulbasaur → Ivysaur → Venusaur
- 🔥 Charmander → Charmeleon → Charizard
- 💧 Squirtle → Wartortle → Blastoise

### Generation 2 (Johto)
- 🌿 Chikorita → Bayleef → Meganium
- 🔥 Cyndaquil → Quilava → Typhlosion
- 💧 Totodile → Croconaw → Feraligatr

### Generation 3 (Hoenn)
- 🌿 Treecko → Grovyle → Sceptile
- 🔥 Torchic → Combusken → Blaziken
- 💧 Mudkip → Marshtomp → Swampert

### Generation 4 (Sinnoh)
- 🌿 Turtwig → Grotle → Torterra
- 🔥 Chimchar → Monferno → Infernape
- 💧 Piplup → Prinplup → Empoleon

### Generation 5 (Unova)
- 🌿 Snivy → Servine → Serperior
- 🔥 Tepig → Pignite → Emboar
- 💧 Oshawott → Dewott → Samurott

### Generation 6 (Kalos)
- 🌿 Chespin → Quilladin → Chesnaught
- 🔥 Fennekin → Braixen → Delphox
- 💧 Froakie → Frogadier → Greninja

### Generation 7 (Alola)
- 🌿 Rowlet → Dartrix → Decidueye
- 🔥 Litten → Torracat → Incineroar
- 💧 Popplio → Brionne → Primarina

### Generation 8 (Galar)
- 🌿 Grookey → Thwackey → Rillaboom
- 🔥 Scorbunny → Raboot → Cinderace
- 💧 Sobble → Drizzile → Inteleon

### Generation 9 (Paldea)
- 🌿 Sprigatito → Floragato → Meowscarada
- 🔥 Fuecoco → Crocalor → Skeledirge
- 💧 Quaxly → Quaxwell → Quaquaval

### Hisuian Variants
- 🌿 Rowlet → Dartrix → Hisuian Decidueye
- 🔥 Cyndaquil → Quilava → Hisuian Typhlosion
- 💧 Oshawott → Dewott → Hisuian Samurott

## License

This project is for educational/personal use. Pokémon and all related properties are trademarks of Nintendo, Game Freak, and The Pokémon Company. Sprites are provided by PokéAPI.

## Credits

- Sprites: [PokéAPI](https://pokeapi.co/)
- Font: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
- Inspired by Pokémon FireRed/LeafGreen (Game Boy Advance)
