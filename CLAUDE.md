# Project Guidelines: My Bible

## Design and Visual Guardrails
* No emojis anywhere in the interface, code comments, or copy.
* No borders, outline strokes, or border-left accents.
* No shadows (box-shadow, drop-shadow, or text-shadow).
* No divider characters: do not use pipes (`|`), bullet dividers (`•`), or hyphens (`-`) as separators.
* No status dots, green indicators, pulse rings, or glowing badges.
* No decorative extras or artistic embellishments.
* Minimalist layout: lean entirely on typography, natural spacing, and generous whitespace.
* Minimal use of icons: use icons only when strictly necessary for essential actions.

## Typography
* **Serif (Headlines, Titles, Literary Reading)**: `Signifier` (weights 300, 400, 500)
  * CSS variable: `var(--serif)`
* **Sans-Serif (Body & Interface)**: `Neue Haas Grotesk` & `Founders Grotesk` (weights 300, 400, 500, 700, 900)
  * CSS variable: `var(--sans)`, `var(--founders)`
* Font files stored in: `public/fonts/`

## Color Palette (from Interface Craft)
* Flame Orange: `#E54F10` (`var(--craft-orange)`)
* Warm Cream / Paper: `#F6EBD9` (`var(--craft-cream)`)
* Electric Blue: `#1D57F6` (`var(--craft-blue)`)
* Mint Green: `#53F399` (`var(--craft-mint)`)
* Pitch Black: `#010101` (`var(--craft-black)`)
* Sky Blue: `#00A1F1` (`var(--craft-sky)`)
* Pink / Magenta: `#FD73ED` (`var(--craft-pink)`)
* Sunflower Yellow: `#FFD102` (`var(--craft-yellow)`)
* Design tokens exported in: `src/theme/tokens.js`

## Copy and Language
* Use simple, everyday words and conversational grammar.
* Avoid technical terms, engineering jargon, or internal system descriptions (e.g. do not display "API", "payload", "indexedDB", "fetch error", etc.).

## Development and Deployment
* Framework: React + Vite
* Icons: `@tabler/icons-react` (used sparingly)
* Animation: `gsap` (subtle and purposeful)
* Deployment: Firebase Hosting (`x-my-bible`)
* Commands:
  * Dev: `npm run dev`
  * Build: `npm run build`
  * Deploy: `firebase deploy --only hosting --project x-my-bible`
