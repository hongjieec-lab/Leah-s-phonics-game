from pathlib import Path
import hashlib
import subprocess
import sys
ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "word_cards"
TMP_DIR = ROOT / ".tmp_word_card_build"
EDGE_CANDIDATES = [
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
]

WORD_EMOJI = {
    "ant": "🐜",
    "bag": "🎒",
    "bat": "🦇",
    "bed": "🛏️",
    "bell": "🔔",
    "bid": "🪙",
    "big": "🐘",
    "bin": "🗑️",
    "bit": "🧩",
    "bog": "🐸",
    "box": "📦",
    "bug": "🐛",
    "bun": "🍞",
    "can": "🥫",
    "cap": "🧢",
    "cat": "🐱",
    "cod": "🐟",
    "cog": "⚙️",
    "cop": "👮",
    "cot": "🛏️",
    "cup": "☕",
    "den": "🕳️",
    "dig": "⛏️",
    "dog": "🐶",
    "dot": "🔴",
    "egg": "🥚",
    "fin": "🐟",
    "fog": "🌫️",
    "fox": "🦊",
    "gem": "💎",
    "gun": "🔫",
    "hat": "🎩",
    "hen": "🐔",
    "hit": "🥊",
    "hog": "🐷",
    "hop": "🐇",
    "hot": "🔥",
    "hug": "🤗",
    "jam": "🍯",
    "jet": "✈️",
    "jug": "🏺",
    "leg": "🦵",
    "lip": "👄",
    "log": "🪵",
    "man": "👨",
    "map": "🗺️",
    "mat": "🧺",
    "mop": "🧹",
    "mug": "☕",
    "nap": "😴",
    "net": "🥅",
    "nit": "🪲",
    "ox": "🐂",
    "pan": "🍳",
    "peg": "📌",
    "pen": "🖊️",
    "pet": "🐶",
    "pig": "🐷",
    "pin": "📌",
    "pot": "🫕",
    "pup": "🐶",
    "ram": "🐏",
    "rat": "🐀",
    "red": "🟥",
    "rug": "🧶",
    "run": "🏃",
    "set": "🧩",
    "sit": "🪑",
    "sun": "☀️",
    "tag": "🏷️",
    "tap": "🚰",
    "ten": "🔟",
    "tip": "👉",
    "top": "🔝",
    "tug": "🪢",
    "van": "🚐",
    "vet": "🩺",
    "web": "🕸️",
    "wet": "💧",
    "yak": "🐂",
    "zip": "🤐",
}

PALETTES = [
    ("#fff8d9", "#ffe8a3", "#fffdf2"),
    ("#eef8ff", "#d7ecff", "#ffffff"),
    ("#eef9f0", "#d8f3da", "#ffffff"),
    ("#fff3e8", "#ffd8b8", "#fffaf5"),
]


def find_browser() -> Path:
    for candidate in EDGE_CANDIDATES:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("No supported browser found for headless screenshots.")


def palette_for(word: str) -> tuple[str, str, str]:
    idx = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16) % len(PALETTES)
    return PALETTES[idx]


def card_html(word: str, emoji: str) -> str:
    top, bottom, page = palette_for(word)
    word_label = word.capitalize()
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    html, body {{
      margin: 0;
      width: 341px;
      height: 341px;
      overflow: hidden;
      background: {page};
      font-family: "Segoe UI Emoji", "Apple Color Emoji", sans-serif;
    }}
    body {{
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .card {{
      position: relative;
      width: 289px;
      height: 289px;
      border-radius: 28px;
      background: linear-gradient(180deg, {top}, {bottom});
      box-shadow: 0 10px 22px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.9);
      overflow: hidden;
    }}
    .card::before {{
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 28px;
      background:
        radial-gradient(circle at 24% 18%, rgba(255,255,255,.48), transparent 30%),
        radial-gradient(circle at 78% 78%, rgba(255,255,255,.18), transparent 28%),
        linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,0));
    }}
    .ground {{
      position: absolute;
      left: 50%;
      bottom: 46px;
      width: 140px;
      height: 24px;
      transform: translateX(-50%);
      border-radius: 999px;
      background: rgba(201, 152, 62, .14);
      filter: blur(1px);
    }}
    .emoji {{
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 148px;
      line-height: 1;
      transform: translateY(-10px);
    }}
    .label {{
      position: absolute;
      left: 0;
      right: 0;
      bottom: 16px;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      color: rgba(95, 74, 36, .36);
      letter-spacing: .4px;
      font-family: "Trebuchet MS", "Segoe UI", sans-serif;
    }}
  </style>
</head>
<body>
  <div class="card">
    <div class="ground"></div>
    <div class="emoji">{emoji}</div>
    <div class="label">{word_label}</div>
  </div>
</body>
</html>
"""


def render_word(browser: Path, word: str, emoji: str) -> None:
    TMP_DIR.mkdir(exist_ok=True)
    html_path = TMP_DIR / f"{word}.html"
    out_path = ASSET_DIR / f"{word}.png"
    html_path.write_text(card_html(word, emoji), encoding="utf-8")
    url = html_path.resolve().as_uri()
    profile_dir = TMP_DIR / "browser-profile"
    cmd = [
        str(browser),
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=341,341",
        "--virtual-time-budget=1200",
        f"--user-data-dir={profile_dir}",
        f"--screenshot={out_path}",
        url,
    ]
    subprocess.run(cmd, check=True)


def main() -> int:
    browser = find_browser()
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    existing = {p.stem.lower() for p in ASSET_DIR.glob("*.png")}
    missing = sorted(word for word in WORD_EMOJI if word not in existing)
    if not missing:
      print("No missing word cards.")
      return 0
    for word in missing:
        render_word(browser, word, WORD_EMOJI[word])
        print(f"Generated {word}.png")
    print(f"Generated {len(missing)} new word cards.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
