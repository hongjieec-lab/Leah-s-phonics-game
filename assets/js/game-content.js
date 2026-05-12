'use strict';
var STAGE_IMGS = {
  STAGE1: 'assets/seasonal/spring.png',
  STAGE2: 'assets/seasonal/summer.png',
  STAGE3: 'assets/seasonal/autumn.png',
  STAGE4: 'assets/seasonal/winter.png'
};

// ╔══════════════════════════════════════════════════════════╗
// ║                       WORD BANK                          ║
// ║                                                          ║
// ║  ADD MORE WORDS HERE following the format below.         ║
// ║  Each phase array feeds one world in the game:           ║
// ║    phase2 → Spring Garden  (World 1, Reception early)    ║
// ║    phase3 → Summer Coast   (World 2, Reception later)    ║
// ║    phase4 → Autumn Forest  (World 3, Year 1 start)       ║
// ║    phase5 → Winter Palace  (World 4, Year 1)             ║
// ║                                                          ║
// ║  Word object format:                                     ║
// ║  { w:'cat', d:'c — a — t',                              ║
// ║    s:[{g:'c',i:'/k/'},{g:'a',i:'/a/'},{g:'t',i:'/t/'}], ║
// ║    c:[{e:'🐱',ok:1},{e:'🐶',ok:0},{e:'🌂',ok:0}] }      ║
// ║                                                          ║
// ║  For digraphs add w:1  e.g. {g:'sh',i:'/ʃ/',w:1}        ║
// ║  For trigraphs add ww:1 e.g. {g:'igh',i:'/aɪ/',ww:1}   ║
// ╚══════════════════════════════════════════════════════════╝
function SND(g, i, width) {
  var part = {g:g, i:i};
  if (width === 2) part.w = 1;
  if (width === 3) part.ww = 1;
  return part;
}

function choiceAssetKey(value) {
  return Array.from(String(value || ''))
    .map(function(ch) { return ch.codePointAt(0).toString(16); })
    .join('-');
}

function choiceAssetPath(value) {
  return value ? 'assets/choice_cards/' + choiceAssetKey(value) + '.svg' : '';
}

function wordAssetPath(word) {
  return word ? 'assets/word_cards/' + String(word).toLowerCase() + '.png' : '';
}

function CHOICE(choice, isCorrect) {
  if (typeof choice === 'string') {
    return {img:choiceAssetPath(choice), fb:choice, label:'', ok:isCorrect ? 1 : 0};
  }
  return {
    img: choice.img || choice.src || choiceAssetPath(choice.fb || choice.fallback || choice.e || ''),
    fb: choice.fb || choice.fallback || choice.e || '',
    label: choice.label || '',
    ok: isCorrect ? 1 : 0
  };
}

function WORD(w, d, s, ok, no1, no2) {
  return {w:w, d:d, s:s, c:[CHOICE({img:wordAssetPath(w), fb:ok, label:w}, true),CHOICE(no1, false),CHOICE(no2, false)]};
}

var WORD_BANK = {

  // ── Phase 2: simple CVC practice, widening gradually across mini-sets ──
  phase2: {
    levels: [
      [
        WORD('sat','s — a — t',[SND('s','/s/'),SND('a','/a/'),SND('t','/t/')],'🪑','🐱','☀️'),
        WORD('pin','p — i — n',[SND('p','/p/'),SND('i','/ɪ/'),SND('n','/n/')],'📌','🐷','🍳'),
        WORD('tap','t — a — p',[SND('t','/t/'),SND('a','/a/'),SND('p','/p/')],'🚰','🎩','🌙'),
        WORD('pan','p — a — n',[SND('p','/p/'),SND('a','/a/'),SND('n','/n/')],'🍳','🧢','🐟'),
        WORD('sit','s — i — t',[SND('s','/s/'),SND('i','/ɪ/'),SND('t','/t/')],'🪑','🐔','🧤'),
        WORD('sip','s — i — p',[SND('s','/s/'),SND('i','/ɪ/'),SND('p','/p/')],'🥤','🌳','🐸'),
        WORD('mat','m — a — t',[SND('m','/m/'),SND('a','/a/'),SND('t','/t/')],'🧺','🚗','🐝'),
        WORD('nap','n — a — p',[SND('n','/n/'),SND('a','/a/'),SND('p','/p/')],'😴','🧁','🦆')
      ],
      [
        WORD('dog','d — o — g',[SND('d','/d/'),SND('o','/ɒ/'),SND('g','/g/')],'🐶','🐱','🦊'),
        WORD('dig','d — i — g',[SND('d','/d/'),SND('i','/ɪ/'),SND('g','/g/')],'⛏️','🍎','🦋'),
        WORD('pot','p — o — t',[SND('p','/p/'),SND('o','/ɒ/'),SND('t','/t/')],'🫕','🐖','🎵'),
        WORD('top','t — o — p',[SND('t','/t/'),SND('o','/ɒ/'),SND('p','/p/')],'🧢','🪵','🐟'),
        WORD('bag','b — a — g',[SND('b','/b/'),SND('a','/a/'),SND('g','/g/')],'👜','🐸','🌳'),
        WORD('cab','c — a — b',[SND('c','/k/'),SND('a','/a/'),SND('b','/b/')],'🚕','🐝','🥁'),
        WORD('log','l — o — g',[SND('l','/l/'),SND('o','/ɒ/'),SND('g','/g/')],'🪵','🌿','🐸'),
        WORD('cot','c — o — t',[SND('c','/k/'),SND('o','/ɒ/'),SND('t','/t/')],'🛏️','🚂','🐟')
      ],
      [
        WORD('sun','s — u — n',[SND('s','/s/'),SND('u','/ʌ/'),SND('n','/n/')],'☀️','🌙','⭐'),
        WORD('bus','b — u — s',[SND('b','/b/'),SND('u','/ʌ/'),SND('s','/s/')],'🚌','🐛','🪵'),
        WORD('cup','c — u — p',[SND('c','/k/'),SND('u','/ʌ/'),SND('p','/p/')],'☕','🎩','🐟'),
        WORD('mug','m — u — g',[SND('m','/m/'),SND('u','/ʌ/'),SND('g','/g/')],'☕','🐶','🌿'),
        WORD('rug','r — u — g',[SND('r','/r/'),SND('u','/ʌ/'),SND('g','/g/')],'🛋️','🐛','🏃'),
        WORD('run','r — u — n',[SND('r','/r/'),SND('u','/ʌ/'),SND('n','/n/')],'🏃','🛏️','🐟'),
        WORD('mud','m — u — d',[SND('m','/m/'),SND('u','/ʌ/'),SND('d','/d/')],'🟤','🐄','🌷'),
        WORD('bun','b — u — n',[SND('b','/b/'),SND('u','/ʌ/'),SND('n','/n/')],'🍞','🧢','🐸')
      ],
      [
        WORD('hen','h — e — n',[SND('h','/h/'),SND('e','/ɛ/'),SND('n','/n/')],'🐔','🐧','🦆'),
        WORD('pen','p — e — n',[SND('p','/p/'),SND('e','/ɛ/'),SND('n','/n/')],'🖊️','🐓','🥁'),
        WORD('net','n — e — t',[SND('n','/n/'),SND('e','/ɛ/'),SND('t','/t/')],'🥅','🐟','🌿'),
        WORD('bed','b — e — d',[SND('b','/b/'),SND('e','/ɛ/'),SND('d','/d/')],'🛏️','🐝','🏖️'),
        WORD('red','r — e — d',[SND('r','/r/'),SND('e','/ɛ/'),SND('d','/d/')],'🟥','🐸','🌳'),
        WORD('leg','l — e — g',[SND('l','/l/'),SND('e','/ɛ/'),SND('g','/g/')],'🦵','🐟','🎩'),
        WORD('peg','p — e — g',[SND('p','/p/'),SND('e','/ɛ/'),SND('g','/g/')],'📌','🧢','🌙'),
        WORD('ten','t — e — n',[SND('t','/t/'),SND('e','/ɛ/'),SND('n','/n/')],'🔟','🐔','🌿')
      ],
      [
        WORD('hat','h — a — t',[SND('h','/h/'),SND('a','/a/'),SND('t','/t/')],'🎩','🐶','🌞'),
        WORD('bat','b — a — t',[SND('b','/b/'),SND('a','/a/'),SND('t','/t/')],'🦇','🧢','🐟'),
        WORD('fan','f — a — n',[SND('f','/f/'),SND('a','/a/'),SND('n','/n/')],'🪭','🐔','🛏️'),
        WORD('rat','r — a — t',[SND('r','/r/'),SND('a','/a/'),SND('t','/t/')],'🐀','🌳','🪵'),
        WORD('cap','c — a — p',[SND('c','/k/'),SND('a','/a/'),SND('p','/p/')],'🧢','🐶','🍞'),
        WORD('ram','r — a — m',[SND('r','/r/'),SND('a','/a/'),SND('m','/m/')],'🐏','🌿','🐠'),
        WORD('lip','l — i — p',[SND('l','/l/'),SND('i','/ɪ/'),SND('p','/p/')],'👄','🧤','🐝'),
        WORD('ham','h — a — m',[SND('h','/h/'),SND('a','/a/'),SND('m','/m/')],'🍖','🌙','🐔')
      ]
    ]
  },

  // ── Phase 3: one new digraph/vowel team focus per mini-set ──
  phase3: {
    levels: [
      [
        WORD('ship','sh — i — p',[SND('sh','/ʃ/',2),SND('i','/ɪ/'),SND('p','/p/')],'🚢','🐑','🧤'),
        WORD('shop','sh — o — p',[SND('sh','/ʃ/',2),SND('o','/ɒ/'),SND('p','/p/')],'🛍️','🐷','🌳'),
        WORD('fish','f — i — sh',[SND('f','/f/'),SND('i','/ɪ/'),SND('sh','/ʃ/',2)],'🐟','🦆','🧢'),
        WORD('dish','d — i — sh',[SND('d','/d/'),SND('i','/ɪ/'),SND('sh','/ʃ/',2)],'🍽️','🌞','🐛'),
        WORD('shed','sh — e — d',[SND('sh','/ʃ/',2),SND('e','/ɛ/'),SND('d','/d/')],'🛖','🐔','🚗'),
        WORD('shell','sh — e — ll',[SND('sh','/ʃ/',2),SND('e','/ɛ/'),SND('ll','/l/',2)],'🐚','🐶','🥁'),
        WORD('bush','b — u — sh',[SND('b','/b/'),SND('u','/ʌ/'),SND('sh','/ʃ/',2)],'🌿','🐶','🧢'),
        WORD('cash','c — a — sh',[SND('c','/k/'),SND('a','/a/'),SND('sh','/ʃ/',2)],'💰','🐟','🌙')
      ],
      [
        WORD('chin','ch — i — n',[SND('ch','/tʃ/',2),SND('i','/ɪ/'),SND('n','/n/')],'🧒','🌭','🪑'),
        WORD('chat','ch — a — t',[SND('ch','/tʃ/',2),SND('a','/a/'),SND('t','/t/')],'💬','🐱','🎩'),
        WORD('chip','ch — i — p',[SND('ch','/tʃ/',2),SND('i','/ɪ/'),SND('p','/p/')],'🍟','🐟','🌳'),
        WORD('chop','ch — o — p',[SND('ch','/tʃ/',2),SND('o','/ɒ/'),SND('p','/p/')],'🪓','🐷','🎵'),
        WORD('chick','ch — i — ck',[SND('ch','/tʃ/',2),SND('i','/ɪ/'),SND('ck','/k/',2)],'🐥','🌙','🪵'),
        WORD('check','ch — e — ck',[SND('ch','/tʃ/',2),SND('e','/ɛ/'),SND('ck','/k/',2)],'✅','🐟','🧢'),
        WORD('rich','r — i — ch',[SND('r','/r/'),SND('i','/ɪ/'),SND('ch','/tʃ/',2)],'💰','🌿','🐔'),
        WORD('bench','b — e — n — ch',[SND('b','/b/'),SND('e','/ɛ/'),SND('n','/n/'),SND('ch','/tʃ/',2)],'🪑','🐝','🍎')
      ],
      [
        WORD('ring','r — i — ng',[SND('r','/r/'),SND('i','/ɪ/'),SND('ng','/ŋ/',2)],'💍','🐸','🔔'),
        WORD('sing','s — i — ng',[SND('s','/s/'),SND('i','/ɪ/'),SND('ng','/ŋ/',2)],'🎤','🐟','🌞'),
        WORD('song','s — o — ng',[SND('s','/s/'),SND('o','/ɒ/'),SND('ng','/ŋ/',2)],'🎵','🐔','🛏️'),
        WORD('bang','b — a — ng',[SND('b','/b/'),SND('a','/a/'),SND('ng','/ŋ/',2)],'💥','🌙','🐟'),
        WORD('king','k — i — ng',[SND('k','/k/'),SND('i','/ɪ/'),SND('ng','/ŋ/',2)],'👑','🪵','🐝'),
        WORD('wing','w — i — ng',[SND('w','/w/'),SND('i','/ɪ/'),SND('ng','/ŋ/',2)],'🪽','🐶','🍞'),
        WORD('gong','g — o — ng',[SND('g','/g/'),SND('o','/ɒ/'),SND('ng','/ŋ/',2)],'🔔','🐶','🍞'),
        WORD('hang','h — a — ng',[SND('h','/h/'),SND('a','/a/'),SND('ng','/ŋ/',2)],'🪝','🎩','🐛')
      ],
      [
        WORD('rain','r — ai — n',[SND('r','/r/'),SND('ai','/eɪ/',2),SND('n','/n/')],'🌧️','🚂','🌈'),
        WORD('tail','t — ai — l',[SND('t','/t/'),SND('ai','/eɪ/',2),SND('l','/l/')],'🐒','🪵','🐟'),
        WORD('sail','s — ai — l',[SND('s','/s/'),SND('ai','/eɪ/',2),SND('l','/l/')],'⛵','🐸','🌿'),
        WORD('pain','p — ai — n',[SND('p','/p/'),SND('ai','/eɪ/',2),SND('n','/n/')],'🤕','🌞','🐔'),
        WORD('feet','f — ee — t',[SND('f','/f/'),SND('ee','/iː/',2),SND('t','/t/')],'🦶','🌲','🐠'),
        WORD('seed','s — ee — d',[SND('s','/s/'),SND('ee','/iː/',2),SND('d','/d/')],'🌱','🐶','🧢'),
        WORD('sheep','sh — ee — p',[SND('sh','/ʃ/',2),SND('ee','/iː/',2),SND('p','/p/')],'🐑','🐟','🌙'),
        WORD('deep','d — ee — p',[SND('d','/d/'),SND('ee','/iː/',2),SND('p','/p/')],'🤿','🌳','🐔')
      ],
      [
        WORD('boat','b — oa — t',[SND('b','/b/'),SND('oa','/əʊ/',2),SND('t','/t/')],'⛵','🥁','🦋'),
        WORD('coat','c — oa — t',[SND('c','/k/'),SND('oa','/əʊ/',2),SND('t','/t/')],'🧥','🐐','🚗'),
        WORD('goat','g — oa — t',[SND('g','/g/'),SND('oa','/əʊ/',2),SND('t','/t/')],'🐐','🌿','🐔'),
        WORD('road','r — oa — d',[SND('r','/r/'),SND('oa','/əʊ/',2),SND('d','/d/')],'🛣️','🐟','🎩'),
        WORD('moon','m — oo — n',[SND('m','/m/'),SND('oo','/uː/',2),SND('n','/n/')],'🌕','🐄','🌊'),
        WORD('food','f — oo — d',[SND('f','/f/'),SND('oo','/uː/',2),SND('d','/d/')],'🍲','🐟','🌳'),
        WORD('boot','b — oo — t',[SND('b','/b/'),SND('oo','/uː/',2),SND('t','/t/')],'👢','🐔','🌙'),
        WORD('roof','r — oo — f',[SND('r','/r/'),SND('oo','/uː/',2),SND('f','/f/')],'🏠','🐶','🍞')
      ]
    ]
  },

  // ── Phase 4: adjacent consonants only, represented as separate phonemes ──
  phase4: {
    levels: [
      [
        WORD('frog','f — r — o — g',[SND('f','/f/'),SND('r','/r/'),SND('o','/ɒ/'),SND('g','/g/')],'🐸','🦊','🐟'),
        WORD('clap','c — l — a — p',[SND('c','/k/'),SND('l','/l/'),SND('a','/a/'),SND('p','/p/')],'👏','🗺️','🧢'),
        WORD('drum','d — r — u — m',[SND('d','/d/'),SND('r','/r/'),SND('u','/ʌ/'),SND('m','/m/')],'🥁','🦌','💧'),
        WORD('flag','f — l — a — g',[SND('f','/f/'),SND('l','/l/'),SND('a','/a/'),SND('g','/g/')],'🚩','🐸','🦋'),
        WORD('plug','p — l — u — g',[SND('p','/p/'),SND('l','/l/'),SND('u','/ʌ/'),SND('g','/g/')],'🔌','🐶','🌷'),
        WORD('crab','c — r — a — b',[SND('c','/k/'),SND('r','/r/'),SND('a','/a/'),SND('b','/b/')],'🦀','🐝','🍎'),
        WORD('clip','c — l — i — p',[SND('c','/k/'),SND('l','/l/'),SND('i','/ɪ/'),SND('p','/p/')],'📎','🐷','🌞'),
        WORD('trip','t — r — i — p',[SND('t','/t/'),SND('r','/r/'),SND('i','/ɪ/'),SND('p','/p/')],'🧳','🐟','🌙')
      ],
      [
        WORD('tent','t — e — n — t',[SND('t','/t/'),SND('e','/ɛ/'),SND('n','/n/'),SND('t','/t/')],'⛺','🌷','🐢'),
        WORD('hand','h — a — n — d',[SND('h','/h/'),SND('a','/a/'),SND('n','/n/'),SND('d','/d/')],'🖐️','🎩','🐝'),
        WORD('belt','b — e — l — t',[SND('b','/b/'),SND('e','/ɛ/'),SND('l','/l/'),SND('t','/t/')],'👖','🐝','🏔️'),
        WORD('milk','m — i — l — k',[SND('m','/m/'),SND('i','/ɪ/'),SND('l','/l/'),SND('k','/k/')],'🥛','🐄','🌿'),
        WORD('sand','s — a — n — d',[SND('s','/s/'),SND('a','/a/'),SND('n','/n/'),SND('d','/d/')],'🏖️','🐟','🎩'),
        WORD('lamp','l — a — m — p',[SND('l','/l/'),SND('a','/a/'),SND('m','/m/'),SND('p','/p/')],'💡','🐛','🌳'),
        WORD('pond','p — o — n — d',[SND('p','/p/'),SND('o','/ɒ/'),SND('n','/n/'),SND('d','/d/')],'🦆','🐸','🎵'),
        WORD('nest','n — e — s — t',[SND('n','/n/'),SND('e','/ɛ/'),SND('s','/s/'),SND('t','/t/')],'🪺','🐟','🧢')
      ],
      [
        WORD('stop','s — t — o — p',[SND('s','/s/'),SND('t','/t/'),SND('o','/ɒ/'),SND('p','/p/')],'🛑','🐷','🌙'),
        WORD('step','s — t — e — p',[SND('s','/s/'),SND('t','/t/'),SND('e','/ɛ/'),SND('p','/p/')],'👣','🐟','🌳'),
        WORD('spin','s — p — i — n',[SND('s','/s/'),SND('p','/p/'),SND('i','/ɪ/'),SND('n','/n/')],'🌀','🐔','🎩'),
        WORD('skip','s — k — i — p',[SND('s','/s/'),SND('k','/k/'),SND('i','/ɪ/'),SND('p','/p/')],'⏭️','🐶','🍞'),
        WORD('plan','p — l — a — n',[SND('p','/p/'),SND('l','/l/'),SND('a','/a/'),SND('n','/n/')],'🗺️','🐸','💧'),
        WORD('plum','p — l — u — m',[SND('p','/p/'),SND('l','/l/'),SND('u','/ʌ/'),SND('m','/m/')],'🍑','🌙','🐔'),
        WORD('snap','s — n — a — p',[SND('s','/s/'),SND('n','/n/'),SND('a','/a/'),SND('p','/p/')],'📸','🐟','🌳'),
        WORD('black','b — l — a — ck',[SND('b','/b/'),SND('l','/l/'),SND('a','/a/'),SND('ck','/k/',2)],'⚫','🐶','🍎')
      ],
      [
        WORD('train','t — r — ai — n',[SND('t','/t/'),SND('r','/r/'),SND('ai','/eɪ/',2),SND('n','/n/')],'🚆','🐟','🌳'),
        WORD('green','g — r — ee — n',[SND('g','/g/'),SND('r','/r/'),SND('ee','/iː/',2),SND('n','/n/')],'🟩','🐸','🎩'),
        WORD('float','f — l — oa — t',[SND('f','/f/'),SND('l','/l/'),SND('oa','/əʊ/',2),SND('t','/t/')],'🛟','🐔','🍞'),
        WORD('broom','b — r — oo — m',[SND('b','/b/'),SND('r','/r/'),SND('oo','/uː/',2),SND('m','/m/')],'🧹','🐟','🌙'),
        WORD('sleep','s — l — ee — p',[SND('s','/s/'),SND('l','/l/'),SND('ee','/iː/',2),SND('p','/p/')],'😴','🐶','🌳'),
        WORD('spoon','s — p — oo — n',[SND('s','/s/'),SND('p','/p/'),SND('oo','/uː/',2),SND('n','/n/')],'🥄','🐔','🎩'),
        WORD('snail','s — n — ai — l',[SND('s','/s/'),SND('n','/n/'),SND('ai','/eɪ/',2),SND('l','/l/')],'🐌','🐟','🍎'),
        WORD('brush','b — r — u — sh',[SND('b','/b/'),SND('r','/r/'),SND('u','/ʌ/'),SND('sh','/ʃ/',2)],'🪥','🐶','🌿')
      ],
      [
        WORD('toast','t — oa — s — t',[SND('t','/t/'),SND('oa','/əʊ/',2),SND('s','/s/'),SND('t','/t/')],'🍞','🐸','🌙'),
        WORD('paint','p — ai — n — t',[SND('p','/p/'),SND('ai','/eɪ/',2),SND('n','/n/'),SND('t','/t/')],'🎨','🐟','🌳'),
        WORD('chimp','ch — i — m — p',[SND('ch','/tʃ/',2),SND('i','/ɪ/'),SND('m','/m/'),SND('p','/p/')],'🐒','🐶','🎩'),
        WORD('shelf','sh — e — l — f',[SND('sh','/ʃ/',2),SND('e','/ɛ/'),SND('l','/l/'),SND('f','/f/')],'📚','🐔','🍎'),
        WORD('bloom','b — l — oo — m',[SND('b','/b/'),SND('l','/l/'),SND('oo','/uː/',2),SND('m','/m/')],'🌼','🐟','🌙'),
        WORD('crash','c — r — a — sh',[SND('c','/k/'),SND('r','/r/'),SND('a','/a/'),SND('sh','/ʃ/',2)],'💥','🐶','🌳'),
        WORD('clock','c — l — o — ck',[SND('c','/k/'),SND('l','/l/'),SND('o','/ɒ/'),SND('ck','/k/',2)],'🕒','🐔','🍞'),
        WORD('drink','d — r — i — n — k',[SND('d','/d/'),SND('r','/r/'),SND('i','/ɪ/'),SND('n','/n/'),SND('k','/k/')],'🥤','🐟','🌿')
      ]
    ]
  },

  // ── Phase 5: early alternative spellings only (ay, ea, ow) ──
  phase5: {
    levels: [
      [
        WORD('day','d — ay',[SND('d','/d/'),SND('ay','/eɪ/',2)],'🌞','🌙','🧤'),
        WORD('play','p — l — ay',[SND('p','/p/'),SND('l','/l/'),SND('ay','/eɪ/',2)],'🎮','🌿','🍞'),
        WORD('say','s — ay',[SND('s','/s/'),SND('ay','/eɪ/',2)],'🗣️','🐟','🌳'),
        WORD('may','m — ay',[SND('m','/m/'),SND('ay','/eɪ/',2)],'📅','🐶','🌙'),
        WORD('bay','b — ay',[SND('b','/b/'),SND('ay','/eɪ/',2)],'🏖️','🐔','🍎'),
        WORD('hay','h — ay',[SND('h','/h/'),SND('ay','/eɪ/',2)],'🌾','🐟','🎩'),
        WORD('tray','t — r — ay',[SND('t','/t/'),SND('r','/r/'),SND('ay','/eɪ/',2)],'🍽️','🐶','🌳'),
        WORD('clay','c — l — ay',[SND('c','/k/'),SND('l','/l/'),SND('ay','/eɪ/',2)],'🏺','🐔','🍞')
      ],
      [
        WORD('sea','s — ea',[SND('s','/s/'),SND('ea','/iː/',2)],'🌊','🌳','🐝'),
        WORD('tea','t — ea',[SND('t','/t/'),SND('ea','/iː/',2)],'🍵','🐟','🌞'),
        WORD('leaf','l — ea — f',[SND('l','/l/'),SND('ea','/iː/',2),SND('f','/f/')],'🍃','🐶','🧢'),
        WORD('bead','b — ea — d',[SND('b','/b/'),SND('ea','/iː/',2),SND('d','/d/')],'📿','🐔','🌙'),
        WORD('meat','m — ea — t',[SND('m','/m/'),SND('ea','/iː/',2),SND('t','/t/')],'🍖','🐟','🌳'),
        WORD('seal','s — ea — l',[SND('s','/s/'),SND('ea','/iː/',2),SND('l','/l/')],'🦭','🐶','🍞'),
        WORD('pea','p — ea',[SND('p','/p/'),SND('ea','/iː/',2)],'🫛','🐔','🌞'),
        WORD('beach','b — ea — ch',[SND('b','/b/'),SND('ea','/iː/',2),SND('ch','/tʃ/',2)],'🏖️','🐟','🧢')
      ],
      [
        WORD('snow','s — n — ow',[SND('s','/s/'),SND('n','/n/'),SND('ow','/əʊ/',2)],'❄️','🌧️','🔥'),
        WORD('blow','b — l — ow',[SND('b','/b/'),SND('l','/l/'),SND('ow','/əʊ/',2)],'🌬️','🐶','🌳'),
        WORD('grow','g — r — ow',[SND('g','/g/'),SND('r','/r/'),SND('ow','/əʊ/',2)],'🌱','🐔','🌙'),
        WORD('glow','g — l — ow',[SND('g','/g/'),SND('l','/l/'),SND('ow','/əʊ/',2)],'💡','🐟','🍞'),
        WORD('crow','c — r — ow',[SND('c','/k/'),SND('r','/r/'),SND('ow','/əʊ/',2)],'🐦','🐶','🌿'),
        WORD('slow','s — l — ow',[SND('s','/s/'),SND('l','/l/'),SND('ow','/əʊ/',2)],'🐢','🐔','🌞'),
        WORD('show','sh — ow',[SND('sh','/ʃ/',2),SND('ow','/əʊ/',2)],'🎭','🐟','🌳'),
        WORD('row','r — ow',[SND('r','/r/'),SND('ow','/əʊ/',2)],'🚣','🐶','🧢')
      ],
      [
        WORD('dream','d — r — ea — m',[SND('d','/d/'),SND('r','/r/'),SND('ea','/iː/',2),SND('m','/m/')],'💭','🐟','🌳'),
        WORD('cream','c — r — ea — m',[SND('c','/k/'),SND('r','/r/'),SND('ea','/iː/',2),SND('m','/m/')],'🍦','🐶','🌙'),
        WORD('clean','c — l — ea — n',[SND('c','/k/'),SND('l','/l/'),SND('ea','/iː/',2),SND('n','/n/')],'🧼','🐔','🍞'),
        WORD('speak','s — p — ea — k',[SND('s','/s/'),SND('p','/p/'),SND('ea','/iː/',2),SND('k','/k/')],'🗣️','🐟','🌳'),
        WORD('tray','t — r — ay',[SND('t','/t/'),SND('r','/r/'),SND('ay','/eɪ/',2)],'🍽️','🐶','🌞'),
        WORD('clay','c — l — ay',[SND('c','/k/'),SND('l','/l/'),SND('ay','/eɪ/',2)],'🏺','🐔','🌙'),
        WORD('blow','b — l — ow',[SND('b','/b/'),SND('l','/l/'),SND('ow','/əʊ/',2)],'🌬️','🐟','🍞'),
        WORD('grow','g — r — ow',[SND('g','/g/'),SND('r','/r/'),SND('ow','/əʊ/',2)],'🌱','🐶','🌿')
      ],
      [
        WORD('play','p — l — ay',[SND('p','/p/'),SND('l','/l/'),SND('ay','/eɪ/',2)],'🎮','🌿','🍞'),
        WORD('beach','b — ea — ch',[SND('b','/b/'),SND('ea','/iː/',2),SND('ch','/tʃ/',2)],'🏖️','🐟','🧢'),
        WORD('crow','c — r — ow',[SND('c','/k/'),SND('r','/r/'),SND('ow','/əʊ/',2)],'🐦','🐶','🌿'),
        WORD('clean','c — l — ea — n',[SND('c','/k/'),SND('l','/l/'),SND('ea','/iː/',2),SND('n','/n/')],'🧼','🐔','🌙'),
        WORD('tea','t — ea',[SND('t','/t/'),SND('ea','/iː/',2)],'🍵','🐟','🌞'),
        WORD('clay','c — l — ay',[SND('c','/k/'),SND('l','/l/'),SND('ay','/eɪ/',2)],'🏺','🐶','🌳'),
        WORD('glow','g — l — ow',[SND('g','/g/'),SND('l','/l/'),SND('ow','/əʊ/',2)],'💡','🐔','🍞'),
        WORD('leaf','l — ea — f',[SND('l','/l/'),SND('ea','/iː/',2),SND('f','/f/')],'🍃','🐟','🧢')
      ]
    ]
  }
};

// ╔══════════════════════════════════════════════════════════╗
// ║                    WORLD DEFINITIONS                     ║
// ╚══════════════════════════════════════════════════════════╝
var WORLDS = [
  { id:0, name:'Spring Garden', em:'🌸', phase:'Phase 2', phaseKey:'phase2',
    desc:'Short vowels · CVC words',
    mapBg:'linear-gradient(180deg,#c8f0d0,#80d898 40%,#50b870)',
    mapBarBg:'rgba(220,255,230,.95)', mapTitleColor:'#1a4d2e',
    sceneBg:'linear-gradient(180deg,#a8ddb5,#3a9050 50%,#1a5030)',
    bubbleBorder:'#6cc258', bubbleColor:'#2c5c20',
    blendBorderColor:'#6cc258', imgBorderColor:'#6cc258',
    imgOkShadow:'rgba(34,197,94,.5)',
    guide:'🧚‍♀️', trees:['🌳','🌳'], floor:'🌷🌼🌸🌺🌼🌷',
    stageKey:'STAGE1',
    unlock:{ tag:'🌸 Stage 1 Complete!', name:'Apprentice Spell-Weaver',
      desc:'Leah waved her magic wand and the Spring Garden bloomed! She has learned every short sound. The Summer Coast calls! 🌿🪄' },
    nextBg:'linear-gradient(180deg,#1a1000,#402800 50%,#1a0800)' },

  { id:1, name:'Summer Coast', em:'☀️', phase:'Phase 3', phaseKey:'phase3',
    desc:'Digraphs · vowel teams',
    mapBg:'linear-gradient(180deg,#fff8b0,#ffd040 40%,#f0a000)',
    mapBarBg:'rgba(255,248,200,.95)', mapTitleColor:'#5a3800',
    sceneBg:'linear-gradient(180deg,#a0d8f8,#3888c8 50%,#1060a0)',
    bubbleBorder:'#40a0e0', bubbleColor:'#0a3060',
    blendBorderColor:'#40a0e0', imgBorderColor:'#40a0e0',
    imgOkShadow:'rgba(64,160,224,.5)',
    guide:'🧜‍♀️', trees:['🌴','🌴'], floor:'🌊🐚🌸🐚🌊',
    stageKey:'STAGE2',
    unlock:{ tag:'☀️ Stage 2 Complete!', name:'Knight of the Summer Shore',
      desc:'Leah braved the summer seas and mastered every digraph spell! She has earned a shimmering golden cape! 🌊⚔️' },
    nextBg:'linear-gradient(180deg,#0a0800,#201000 50%,#0a0500)' },

  { id:2, name:'Autumn Forest', em:'🍂', phase:'Phase 4', phaseKey:'phase4',
    desc:'Adjacent consonants · blends',
    mapBg:'linear-gradient(180deg,#ffe0a0,#f09840 40%,#c06010)',
    mapBarBg:'rgba(255,235,200,.95)', mapTitleColor:'#4a1800',
    sceneBg:'linear-gradient(180deg,#f0b870,#c06820 50%,#703010)',
    bubbleBorder:'#d07020', bubbleColor:'#4a1000',
    blendBorderColor:'#d07020', imgBorderColor:'#d07020',
    imgOkShadow:'rgba(180,100,20,.45)',
    guide:'🦉', trees:['🍁','🍂'], floor:'🍄🍂🍁🌰🍂🍄',
    stageKey:'STAGE3',
    unlock:{ tag:'🍂 Stage 3 Complete!', name:'Duchess of the Golden Forest',
      desc:'Leah mastered every tricky blend in the forest! The ancient trees gave her a golden sceptre. One world remains! 🍂🔱' },
    nextBg:'linear-gradient(180deg,#000a1a,#001030 50%,#000818)' },

  { id:3, name:'Winter Palace', em:'❄️', phase:'Phase 5', phaseKey:'phase5',
    desc:'Alternative spellings · rescue!',
    mapBg:'linear-gradient(180deg,#d8f0ff,#90c8f0 40%,#5090d0)',
    mapBarBg:'rgba(210,240,255,.95)', mapTitleColor:'#0a2a50',
    sceneBg:'linear-gradient(180deg,#c0d8f8,#6090d0 50%,#304880)',
    bubbleBorder:'#80b8f0', bubbleColor:'#0a2050',
    blendBorderColor:'#80b8f0', imgBorderColor:'#80b8f0',
    imgOkShadow:'rgba(80,160,240,.45)',
    guide:'⛄', trees:['🌲','🌲'], floor:'❄️🌟❄️🌟❄️',
    stageKey:'STAGE4',
    unlock:{ tag:'👑 CORONATION!', name:'Crystal Princess Leah!',
      desc:'Leah read every rune in the Crystal Kingdom! The ice crown floated down onto her head. All the magical creatures cheered: PRINCESS LEAH! 🏰👑✨' },
    nextBg:'radial-gradient(ellipse at 50% 30%,#0a1840,#050d30 50%,#020818)' }
];

// ╔══════════════════════════════════════════════════════════╗
// ║                     GAME STATE                           ║
// ╚══════════════════════════════════════════════════════════╝
var S = {
  worldIdx:  0,
  progress:  [0, 0, 0, 0],   // levels completed per world (max 7 each)
  mastery:   [0, 0, 0, 0],   // secure boss clears per world
  levelAttempts: {},         // retry count per world/level
  stars:     0,
  cWorld:    0,
  cLevel:    0,
  // per-level question session
  queue:     [],   // shuffled questions for this level
  qIdx:      0,    // current question index
  correct:   0,    // correct answers so far
  litN:      0,
  blendDone: false,
  answerLocked: false
};

// ╔══════════════════════════════════════════════════════════╗
// ║                       HELPERS                            ║
// ╚══════════════════════════════════════════════════════════╝
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function levelKey(worldId, lvIdx) {
  return worldId + '-' + lvIdx;
}

function requiredWinsForWorld(worldId) {
  return worldId === WORLDS.length - 1 ? 1 : MASTERY_WINS_REQUIRED;
}

function isWorldUnlocked(worldId) {
  return worldId === 0 ||
    (S.progress[worldId-1] >= 7 && S.mastery[worldId-1] >= requiredWinsForWorld(worldId-1));
}

function needsWorldMastery(worldId) {
  return S.progress[worldId] >= 7 && S.mastery[worldId] < requiredWinsForWorld(worldId);
}

function activeLevelForWorld(worldId) {
  return needsWorldMastery(worldId) ? 6 : Math.min(S.progress[worldId], 6);
}

var CURRICULUM_LEVEL_POOLS = {
  phase2: [
    ['sat','pin','tap','pan','sit','sip','mat','nap','hat'],
    ['dog','dig','pot','top','bag','cab','log','cot','cap'],
    ['sun','bus','cup','mud','rug','run','hen','pen','net']
  ],
  phase3: [
    ['ship','shop','fish','dish','shed','shell','bush','cash'],
    ['chin','chat','chip','chop','chick','check','ring','sing','song'],
    ['king','wing','rain','tail','sail','feet','seed','boat','moon']
  ],
  phase4: [
    ['frog','clap','drum','flag','plug','crab','clip','trip','stop'],
    ['tent','hand','belt','milk','sand','lamp','pond','nest','step'],
    ['spin','skip','plan','plum','snap','black','train','green','float']
  ],
  phase5: [
    ['day','play','bay','hay','tray','clay','sea','tea','leaf'],
    ['snow','blow','crow','row','seal','pea','beach','meat','bead']
  ]
};
