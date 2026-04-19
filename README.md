# Emma's Quest — Phonics Learning Game

A UK Reception / Year 1 phonics game for Emma, covering Phases 2–5.

---

## 🚀 Deploy to Vercel (one-time setup)

### Option A — Vercel CLI (recommended)

```bash
# 1. Install Vercel CLI (only needed once)
npm i -g vercel

# 2. In this project folder, deploy
vercel

# Follow the prompts — choose "static site", accept defaults.
# Vercel will print your live URL, e.g. https://emma-quest-phonics.vercel.app
```

### Option B — GitHub + Vercel dashboard

1. Push this folder to a GitHub repository.
2. Go to <https://vercel.com/new> and import the repo.
3. Leave all settings at their defaults and click **Deploy**.
4. Every push to `main` will automatically redeploy the site.

---

## 📁 Project structure

```
phonics_game_v2/
├── index.html          ← Main game (self-contained, all logic inline)
├── vercel.json         ← Vercel static-site config
├── README.md           ← This file
└── assets/
    ├── seasonal/       ← Emma's seasonal photos (spring/summer/autumn/winter.png)
    ├── word_cards/     ← Word card images  (<word>.png)
    ├── choice_cards/   ← Answer choice images (<unicode-codepoints>.svg)
    └── js/             ← Modular JS (reference copies — not loaded by index.html)
        ├── game-config.js
        ├── game-content.js
        └── game-app.js
```

> **Note:** `index.html` is fully self-contained. The JS files in `assets/js/` are
> refactored reference copies and are **not** loaded by the page.

---

## 💾 Progress saving

Progress is automatically saved to the browser's `localStorage` after every completed level.
What is saved: world progress, mastery scores, star count, and retry counters.

The **🔄 Reset** button on the map screen clears all saved progress (after a confirmation prompt).

---

## ➕ Adding new words

All vocabulary lives in the `<script>` block inside `index.html`.  
Find the section headed:

```
╔══════════════════════════════════════════════════════════╗
║                       WORD BANK                          ║
╚══════════════════════════════════════════════════════════╝
```

### Word format

```js
WORD(
  'cat',          // the word
  'c — a — t',   // display string (sounds separated by —)
  [               // grapheme/phoneme array
    SND('c', '/k/'),          // single letter
    SND('sh', '/ʃ/', 2),     // digraph: third arg = 2
    SND('igh', '/aɪ/', 3),   // trigraph: third arg = 3
  ],
  '🐱',           // correct answer emoji / fallback
  '🐶',           // wrong answer 1
  '🌂'            // wrong answer 2
)
```

Each phase feeds one world:

| Phase key | World | Stage |
|-----------|-------|-------|
| `phase2` | 🌸 Spring Garden | CVC words |
| `phase3` | ☀️ Summer Coast | Digraphs & vowel teams |
| `phase4` | 🍂 Autumn Forest | Adjacent consonants & blends |
| `phase5` | ❄️ Winter Palace | Alternative spellings |

Add your `WORD(...)` entries to the corresponding `phase*.levels` array.  
Each inner array is one "pool" of words (a mini-set).  
The game automatically rotates and mixes pools across the 7 levels of each world.

### Using image assets instead of emoji

If you have a `.png` for a word, drop it in `assets/word_cards/<word>.png`  
(e.g. `assets/word_cards/cat.png`). The `WORD()` helper will pick it up automatically —
the emoji you pass becomes the fallback if the image fails to load.

For choice-card images (answer buttons), place SVGs in `assets/choice_cards/`  
named by the Unicode code points of the emoji, e.g. `1f431.svg` for 🐱.

---

## 🔧 Config tweaks

At the top of the `<script>` block in `index.html`:

```js
var QUESTIONS_PER_LEVEL   = 6;   // questions per level
var PASS_THRESHOLD        = 5;   // correct answers to pass
var MASTERY_WINS_REQUIRED = 2;   // boss clears before world unlocks
```

Adjust these to change difficulty.
