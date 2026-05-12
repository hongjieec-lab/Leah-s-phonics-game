from pathlib import Path
import hashlib
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "assets" / "word_cards"
TMP_DIR = ROOT / ".tmp_word_bank2_cards"

BROWSER_CANDIDATES = [
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
]

WORD_BANK_2_WORDS = [
    "hand", "tent", "lamp", "milk", "belt", "nest",
    "sand", "pond", "mask", "desk", "vest", "sink",
    "gift", "tank", "pump", "jump", "ant",
    "flag", "frog", "drum", "crab", "plum", "clip",
    "sled", "slug", "clam", "plug", "crib", "pram",
    "brick", "clock", "truck", "grass", "dress", "block",
    "plant", "stamp", "skunk", "stump", "trunk",
    "ship", "shop", "fish", "dish", "shell", "brush",
    "chin", "chick", "chip", "bench", "chest", "chimp",
    "bath", "moth", "tooth", "ring", "king", "wing",
]

# HTML entities keep this file ASCII while rendering colorful emoji artwork.
WORD_ART = {
    "ant": "&#x1F41C;",
    "bath": "&#x1F6C1;",
    "belt": "&#x1F9E3;",
    "bench": "&#x1FA91;",
    "block": "&#x1F9F1;",
    "brick": "&#x1F9F1;",
    "brush": "&#x1FAA5;",
    "chest": "",
    "chick": "&#x1F425;",
    "chin": "&#x1F642;",
    "chimp": "&#x1F412;",
    "chip": "&#x1F9C7;",
    "clam": "&#x1F41A;",
    "clip": "&#x1F4CE;",
    "clock": "&#x1F550;",
    "crab": "&#x1F980;",
    "crib": "&#x1F6CF;&#xFE0F;",
    "desk": "&#x1FA91;",
    "dish": "&#x1F37D;&#xFE0F;",
    "dress": "&#x1F457;",
    "drum": "&#x1F941;",
    "fish": "&#x1F41F;",
    "flag": "&#x1F6A9;",
    "frog": "&#x1F438;",
    "gift": "&#x1F381;",
    "grass": "&#x1F33F;",
    "hand": "&#x1F590;&#xFE0F;",
    "jump": "&#x1F998;",
    "king": "&#x1F451;",
    "lamp": "&#x1F4A1;",
    "mask": "&#x1F637;",
    "milk": "&#x1F95B;",
    "moth": "&#x1F98B;",
    "nest": "&#x1FAB9;",
    "plant": "&#x1FAB4;",
    "plum": "&#x1F351;",
    "plug": "&#x1F50C;",
    "pond": "&#x1F30A;",
    "pram": "&#x1F6D2;",
    "pump": "&#x26FD;",
    "ring": "&#x1F48D;",
    "sand": "&#x1F3D6;&#xFE0F;",
    "shell": "&#x1F41A;",
    "ship": "&#x1F6A2;",
    "shop": "&#x1F3EA;",
    "sink": "&#x1F6B0;",
    "skunk": "&#x1F9A8;",
    "sled": "&#x1F6F7;",
    "slug": "&#x1F40C;",
    "stamp": "&#x1F4EE;",
    "stump": "&#x1FAB5;",
    "tank": "",
    "tent": "&#x26FA;",
    "tooth": "&#x1F9B7;",
    "truck": "&#x1F69A;",
    "trunk": "&#x1F9F3;",
    "vest": "&#x1F9BA;",
    "wing": "&#x1FABD;",
}

PALETTES = [
    ("#fff8df", "#ffe39a", "#f7b84b"),
    ("#eaf8ff", "#b9e8ff", "#38a6d9"),
    ("#eefbe8", "#c9f0b7", "#5bbf6a"),
    ("#fff0ea", "#ffc9b7", "#ec7c5c"),
    ("#f4f0ff", "#d9cdfb", "#8d72d6"),
]


def find_browser() -> Path:
    for candidate in BROWSER_CANDIDATES:
        if candidate.exists():
            return candidate
    raise FileNotFoundError("Could not find Edge or Chrome for card rendering.")


def palette_for(word: str) -> tuple[str, str, str]:
    index = int(hashlib.sha1(word.encode("ascii")).hexdigest(), 16) % len(PALETTES)
    return PALETTES[index]


def card_html(word: str) -> str:
    top, bottom, accent = palette_for(word)
    art = WORD_ART[word]
    if word == "chest":
        art = '<div class="treasure"><div class="lid"></div><div class="body"></div><div class="lock"></div><div class="coin c1"></div><div class="coin c2"></div><div class="coin c3"></div></div>'
    elif word == "tank":
        art = '<div class="tank-art"><div class="barrel"></div><div class="turret"></div><div class="body"></div><div class="track"></div><div class="wheel w1"></div><div class="wheel w2"></div><div class="wheel w3"></div></div>'
    return f"""<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
html, body {{
  margin: 0;
  width: 512px;
  height: 512px;
  overflow: hidden;
  background: #ffffff;
}}
body {{
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
}}
.card {{
  position: relative;
  width: 464px;
  height: 464px;
  border-radius: 36px;
  background: linear-gradient(180deg, {top}, {bottom});
  box-shadow: inset 0 0 0 8px {accent}, 0 12px 28px rgba(40, 50, 70, .16);
  overflow: hidden;
}}
.card::before {{
  content: "";
  position: absolute;
  inset: 18px;
  border-radius: 28px;
  background:
    radial-gradient(circle at 22% 20%, rgba(255,255,255,.75), transparent 24%),
    radial-gradient(circle at 78% 80%, rgba(255,255,255,.44), transparent 26%);
}}
.dot {{
  position: absolute;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: {accent};
  opacity: .92;
}}
.dot.a {{ left: 38px; top: 38px; }}
.dot.b {{ right: 38px; bottom: 38px; }}
.ground {{
  position: absolute;
  left: 50%;
  bottom: 72px;
  width: 260px;
  height: 42px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(80, 70, 60, .14);
  filter: blur(1px);
}}
.art {{
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 240px;
  line-height: 1;
  transform: translateY(-14px);
  filter: drop-shadow(0 12px 0 rgba(40, 45, 55, .10));
}}
.treasure {{
  position: relative;
  width: 250px;
  height: 190px;
}}
.treasure .lid {{
  position: absolute;
  left: 26px;
  top: 22px;
  width: 198px;
  height: 78px;
  border-radius: 44px 44px 12px 12px;
  background: linear-gradient(180deg, #8a4c2a, #5b321f);
  box-shadow: inset 0 0 0 8px #f4c04b;
}}
.treasure .body {{
  position: absolute;
  left: 18px;
  top: 86px;
  width: 214px;
  height: 94px;
  border-radius: 16px 16px 24px 24px;
  background: linear-gradient(180deg, #a85c31, #6e3d25);
  box-shadow: inset 0 0 0 8px #f4c04b;
}}
.treasure .lock {{
  position: absolute;
  left: 104px;
  top: 94px;
  width: 42px;
  height: 58px;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffe48a, #d49724);
}}
.treasure .coin {{
  position: absolute;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ffe27a, #e0a21e);
}}
.treasure .c1 {{ left: 48px; top: 46px; }}
.treasure .c2 {{ left: 104px; top: 36px; }}
.treasure .c3 {{ left: 158px; top: 48px; }}
.tank-art {{
  position: relative;
  width: 278px;
  height: 170px;
}}
.tank-art .barrel {{
  position: absolute;
  left: 156px;
  top: 38px;
  width: 112px;
  height: 28px;
  border-radius: 999px;
  background: #5c8d46;
}}
.tank-art .turret {{
  position: absolute;
  left: 86px;
  top: 24px;
  width: 112px;
  height: 70px;
  border-radius: 34px 34px 16px 16px;
  background: linear-gradient(180deg, #8ccf5d, #4f9a3b);
}}
.tank-art .body {{
  position: absolute;
  left: 24px;
  top: 78px;
  width: 232px;
  height: 70px;
  border-radius: 38px 28px 30px 30px;
  background: linear-gradient(180deg, #7bcf57, #3f8d36);
}}
.tank-art .track {{
  position: absolute;
  left: 42px;
  top: 126px;
  width: 196px;
  height: 42px;
  border-radius: 999px;
  background: #394032;
}}
.tank-art .wheel {{
  position: absolute;
  top: 134px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #aeb8a4;
}}
.tank-art .w1 {{ left: 76px; }}
.tank-art .w2 {{ left: 126px; }}
.tank-art .w3 {{ left: 176px; }}
</style>
</head>
<body>
  <div class="card" aria-label="{word}">
    <div class="dot a"></div>
    <div class="dot b"></div>
    <div class="ground"></div>
    <div class="art">{art}</div>
  </div>
</body>
</html>
"""


def render_word(browser: Path, word: str) -> None:
    TMP_DIR.mkdir(exist_ok=True)
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    html_path = TMP_DIR / f"{word}.html"
    out_path = ASSET_DIR / f"{word}.png"
    html_path.write_text(card_html(word), encoding="utf-8")
    profile_dir = TMP_DIR / f"profile-{word}"
    if profile_dir.exists():
        shutil.rmtree(profile_dir)
    command = [
        str(browser),
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=512,512",
        "--virtual-time-budget=1200",
        f"--user-data-dir={profile_dir}",
        f"--screenshot={out_path}",
        html_path.resolve().as_uri(),
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(
            f"Rendering failed for {word} with exit code {result.returncode}\n"
            f"stdout:\n{result.stdout}\n"
            f"stderr:\n{result.stderr}"
        )


def main() -> int:
    missing_art = sorted(set(WORD_BANK_2_WORDS) - set(WORD_ART))
    if missing_art:
        raise SystemExit(f"Missing art mappings: {', '.join(missing_art)}")
    browser = find_browser()
    force_words = {"chest", "tank"}
    for word in sorted(set(WORD_BANK_2_WORDS)):
        out_path = ASSET_DIR / f"{word}.png"
        if word not in force_words and out_path.exists() and out_path.stat().st_size > 50_000:
            print(f"Skipping {word}.png")
            continue
        render_word(browser, word)
        print(f"Regenerated {word}.png")
    return 0


if __name__ == "__main__":
    sys.exit(main())
