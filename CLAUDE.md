# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run preview  # Preview production build locally
```

Deployment is automatic via GitHub Actions on push to `main` branch, deploying to GitHub Pages.

## Architecture

This is a React 19 + Vite 7 app for a gift exchange game ("Cadeautjes Spel"). Participants take turns being randomly selected via an animated slot machine, then have a countdown timer to pick their gift.

### Game Flow

The `NamePicker` component manages game phases: `idle` -> `spinning` -> `revealed` -> `waiting` (5s) -> `countdown` (15s with music) -> `modal`

After round 1 completes (all names picked once), players can protect their gift in the modal, preventing it from being stolen and allowing early departure.

### Key Components

- **NamePicker** (`src/components/NamePicker/NamePicker.jsx`) - Main orchestrator, manages phase transitions and renders the three-panel layout (rules, game, progress)
- **SlotMachine/SpinningWheel** - Swappable animation components passed as `AnimationComponent` prop
- **Timer/TimesUpModal** - Countdown display and end-of-turn modal

### Custom Hooks

- `useNamePicker` - Game state: tracks available/picked/protected names, random selection, protection, round transitions
- `useTimer` - Countdown timer with start/stop/reset and completion callback
- `useAudio` - Audio playback control for countdown music

### Data

Participant names are configured in `src/data/participants.js`. The `PARTICIPANTS` array is the single source of truth for player names.

### Vite Config

Base path is set to `/gift-exchange/` for GitHub Pages deployment.
