'use strict';
var STAGE_IMGS = {
  STAGE1: 'assets/seasonal/spring.png',
  STAGE2: 'assets/seasonal/summer.png',
  STAGE3: 'assets/seasonal/autumn.png',
  STAGE4: 'assets/seasonal/winter.png'
};

// â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
// â•‘                       WORD BANK                          â•‘
// â•‘                                                          â•‘
// â•‘  ADD MORE WORDS HERE following the format below.         â•‘
// â•‘  Each phase array feeds one world in the game:           â•‘
// â•‘    phase2 â†’ Spring Garden  (World 1, Reception early)    â•‘
// â•‘    phase3 â†’ Summer Coast   (World 2, Reception later)    â•‘
// â•‘    phase4 â†’ Autumn Forest  (World 3, Year 1 start)       â•‘
// â•‘    phase5 â†’ Winter Palace  (World 4, Year 1)             â•‘
// â•‘                                                          â•‘
// â•‘  Word object format:                                     â•‘
// â•‘  { w:'cat', d:'c â€” a â€” t',                              â•‘
// â•‘    s:[{g:'c',i:'/k/'},{g:'a',i:'/a/'},{g:'t',i:'/t/'}], â•‘
// â•‘    c:[{e:'ðŸ±',ok:1},{e:'ðŸ¶',ok:0},{e:'ðŸŒ‚',ok:0}] }      â•‘
// â•‘                                                          â•‘
// â•‘  For digraphs add w:1  e.g. {g:'sh',i:'/Êƒ/',w:1}        â•‘
// â•‘  For trigraphs add ww:1 e.g. {g:'igh',i:'/aÉª/',ww:1}   â•‘
// â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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

  // â”€â”€ Phase 2: simple CVC practice, widening gradually across mini-sets â”€â”€
  phase2: {
    levels: [
      [
        WORD('sat','s â€” a â€” t',[SND('s','/s/'),SND('a','/a/'),SND('t','/t/')],'ðŸª‘','ðŸ±','â˜€ï¸'),
        WORD('pin','p â€” i â€” n',[SND('p','/p/'),SND('i','/Éª/'),SND('n','/n/')],'ðŸ“Œ','ðŸ·','ðŸ³'),
        WORD('tap','t â€” a â€” p',[SND('t','/t/'),SND('a','/a/'),SND('p','/p/')],'ðŸš°','ðŸŽ©','ðŸŒ™'),
        WORD('pan','p â€” a â€” n',[SND('p','/p/'),SND('a','/a/'),SND('n','/n/')],'ðŸ³','ðŸ§¢','ðŸŸ'),
        WORD('sit','s â€” i â€” t',[SND('s','/s/'),SND('i','/Éª/'),SND('t','/t/')],'ðŸª‘','ðŸ”','ðŸ§¤'),
        WORD('sip','s â€” i â€” p',[SND('s','/s/'),SND('i','/Éª/'),SND('p','/p/')],'ðŸ¥¤','ðŸŒ³','ðŸ¸'),
        WORD('mat','m â€” a â€” t',[SND('m','/m/'),SND('a','/a/'),SND('t','/t/')],'ðŸ§º','ðŸš—','ðŸ'),
        WORD('nap','n â€” a â€” p',[SND('n','/n/'),SND('a','/a/'),SND('p','/p/')],'ðŸ˜´','ðŸ§','ðŸ¦†')
      ],
      [
        WORD('dog','d â€” o â€” g',[SND('d','/d/'),SND('o','/É’/'),SND('g','/g/')],'ðŸ¶','ðŸ±','ðŸ¦Š'),
        WORD('dig','d â€” i â€” g',[SND('d','/d/'),SND('i','/Éª/'),SND('g','/g/')],'â›ï¸','ðŸŽ','ðŸ¦‹'),
        WORD('pot','p â€” o â€” t',[SND('p','/p/'),SND('o','/É’/'),SND('t','/t/')],'ðŸ«•','ðŸ–','ðŸŽµ'),
        WORD('top','t â€” o â€” p',[SND('t','/t/'),SND('o','/É’/'),SND('p','/p/')],'ðŸ§¢','ðŸªµ','ðŸŸ'),
        WORD('bag','b â€” a â€” g',[SND('b','/b/'),SND('a','/a/'),SND('g','/g/')],'ðŸ‘œ','ðŸ¸','ðŸŒ³'),
        WORD('cab','c â€” a â€” b',[SND('c','/k/'),SND('a','/a/'),SND('b','/b/')],'ðŸš•','ðŸ','ðŸ¥'),
        WORD('log','l â€” o â€” g',[SND('l','/l/'),SND('o','/É’/'),SND('g','/g/')],'ðŸªµ','ðŸŒ¿','ðŸ¸'),
        WORD('cot','c â€” o â€” t',[SND('c','/k/'),SND('o','/É’/'),SND('t','/t/')],'ðŸ›ï¸','ðŸš‚','ðŸŸ')
      ],
      [
        WORD('sun','s â€” u â€” n',[SND('s','/s/'),SND('u','/ÊŒ/'),SND('n','/n/')],'â˜€ï¸','ðŸŒ™','â­'),
        WORD('bus','b â€” u â€” s',[SND('b','/b/'),SND('u','/ÊŒ/'),SND('s','/s/')],'ðŸšŒ','ðŸ›','ðŸªµ'),
        WORD('cup','c â€” u â€” p',[SND('c','/k/'),SND('u','/ÊŒ/'),SND('p','/p/')],'â˜•','ðŸŽ©','ðŸŸ'),
        WORD('mug','m â€” u â€” g',[SND('m','/m/'),SND('u','/ÊŒ/'),SND('g','/g/')],'â˜•','ðŸ¶','ðŸŒ¿'),
        WORD('rug','r â€” u â€” g',[SND('r','/r/'),SND('u','/ÊŒ/'),SND('g','/g/')],'ðŸ›‹ï¸','ðŸ›','ðŸƒ'),
        WORD('run','r â€” u â€” n',[SND('r','/r/'),SND('u','/ÊŒ/'),SND('n','/n/')],'ðŸƒ','ðŸ›ï¸','ðŸŸ'),
        WORD('mud','m â€” u â€” d',[SND('m','/m/'),SND('u','/ÊŒ/'),SND('d','/d/')],'ðŸŸ¤','ðŸ„','ðŸŒ·'),
        WORD('bun','b â€” u â€” n',[SND('b','/b/'),SND('u','/ÊŒ/'),SND('n','/n/')],'ðŸž','ðŸ§¢','ðŸ¸')
      ],
      [
        WORD('hen','h â€” e â€” n',[SND('h','/h/'),SND('e','/É›/'),SND('n','/n/')],'ðŸ”','ðŸ§','ðŸ¦†'),
        WORD('pen','p â€” e â€” n',[SND('p','/p/'),SND('e','/É›/'),SND('n','/n/')],'ðŸ–Šï¸','ðŸ“','ðŸ¥'),
        WORD('net','n â€” e â€” t',[SND('n','/n/'),SND('e','/É›/'),SND('t','/t/')],'ðŸ¥…','ðŸŸ','ðŸŒ¿'),
        WORD('bed','b â€” e â€” d',[SND('b','/b/'),SND('e','/É›/'),SND('d','/d/')],'ðŸ›ï¸','ðŸ','ðŸ–ï¸'),
        WORD('red','r â€” e â€” d',[SND('r','/r/'),SND('e','/É›/'),SND('d','/d/')],'ðŸŸ¥','ðŸ¸','ðŸŒ³'),
        WORD('leg','l â€” e â€” g',[SND('l','/l/'),SND('e','/É›/'),SND('g','/g/')],'ðŸ¦µ','ðŸŸ','ðŸŽ©'),
        WORD('peg','p â€” e â€” g',[SND('p','/p/'),SND('e','/É›/'),SND('g','/g/')],'ðŸ“Œ','ðŸ§¢','ðŸŒ™'),
        WORD('ten','t â€” e â€” n',[SND('t','/t/'),SND('e','/É›/'),SND('n','/n/')],'ðŸ”Ÿ','ðŸ”','ðŸŒ¿')
      ],
      [
        WORD('hat','h â€” a â€” t',[SND('h','/h/'),SND('a','/a/'),SND('t','/t/')],'ðŸŽ©','ðŸ¶','ðŸŒž'),
        WORD('bat','b â€” a â€” t',[SND('b','/b/'),SND('a','/a/'),SND('t','/t/')],'ðŸ¦‡','ðŸ§¢','ðŸŸ'),
        WORD('fan','f â€” a â€” n',[SND('f','/f/'),SND('a','/a/'),SND('n','/n/')],'ðŸª­','ðŸ”','ðŸ›ï¸'),
        WORD('rat','r â€” a â€” t',[SND('r','/r/'),SND('a','/a/'),SND('t','/t/')],'ðŸ€','ðŸŒ³','ðŸªµ'),
        WORD('cap','c â€” a â€” p',[SND('c','/k/'),SND('a','/a/'),SND('p','/p/')],'ðŸ§¢','ðŸ¶','ðŸž'),
        WORD('ram','r â€” a â€” m',[SND('r','/r/'),SND('a','/a/'),SND('m','/m/')],'ðŸ','ðŸŒ¿','ðŸ '),
        WORD('lip','l â€” i â€” p',[SND('l','/l/'),SND('i','/Éª/'),SND('p','/p/')],'ðŸ‘„','ðŸ§¤','ðŸ'),
        WORD('ham','h â€” a â€” m',[SND('h','/h/'),SND('a','/a/'),SND('m','/m/')],'ðŸ–','ðŸŒ™','ðŸ”')
      ]
    ]
  },

  // â”€â”€ Phase 3: one new digraph/vowel team focus per mini-set â”€â”€
  phase3: {
    levels: [
      [
        WORD('ship','sh â€” i â€” p',[SND('sh','/Êƒ/',2),SND('i','/Éª/'),SND('p','/p/')],'ðŸš¢','ðŸ‘','ðŸ§¤'),
        WORD('shop','sh â€” o â€” p',[SND('sh','/Êƒ/',2),SND('o','/É’/'),SND('p','/p/')],'ðŸ›ï¸','ðŸ·','ðŸŒ³'),
        WORD('fish','f â€” i â€” sh',[SND('f','/f/'),SND('i','/Éª/'),SND('sh','/Êƒ/',2)],'ðŸŸ','ðŸ¦†','ðŸ§¢'),
        WORD('dish','d â€” i â€” sh',[SND('d','/d/'),SND('i','/Éª/'),SND('sh','/Êƒ/',2)],'ðŸ½ï¸','ðŸŒž','ðŸ›'),
        WORD('shed','sh â€” e â€” d',[SND('sh','/Êƒ/',2),SND('e','/É›/'),SND('d','/d/')],'ðŸ›–','ðŸ”','ðŸš—'),
        WORD('shell','sh â€” e â€” ll',[SND('sh','/Êƒ/',2),SND('e','/É›/'),SND('ll','/l/',2)],'ðŸš','ðŸ¶','ðŸ¥'),
        WORD('bush','b â€” u â€” sh',[SND('b','/b/'),SND('u','/ÊŒ/'),SND('sh','/Êƒ/',2)],'ðŸŒ¿','ðŸ¶','ðŸ§¢'),
        WORD('cash','c â€” a â€” sh',[SND('c','/k/'),SND('a','/a/'),SND('sh','/Êƒ/',2)],'ðŸ’°','ðŸŸ','ðŸŒ™')
      ],
      [
        WORD('chin','ch â€” i â€” n',[SND('ch','/tÊƒ/',2),SND('i','/Éª/'),SND('n','/n/')],'ðŸ§’','ðŸŒ­','ðŸª‘'),
        WORD('chat','ch â€” a â€” t',[SND('ch','/tÊƒ/',2),SND('a','/a/'),SND('t','/t/')],'ðŸ’¬','ðŸ±','ðŸŽ©'),
        WORD('chip','ch â€” i â€” p',[SND('ch','/tÊƒ/',2),SND('i','/Éª/'),SND('p','/p/')],'ðŸŸ','ðŸŸ','ðŸŒ³'),
        WORD('chop','ch â€” o â€” p',[SND('ch','/tÊƒ/',2),SND('o','/É’/'),SND('p','/p/')],'ðŸª“','ðŸ·','ðŸŽµ'),
        WORD('chick','ch â€” i â€” ck',[SND('ch','/tÊƒ/',2),SND('i','/Éª/'),SND('ck','/k/',2)],'ðŸ¥','ðŸŒ™','ðŸªµ'),
        WORD('check','ch â€” e â€” ck',[SND('ch','/tÊƒ/',2),SND('e','/É›/'),SND('ck','/k/',2)],'âœ…','ðŸŸ','ðŸ§¢'),
        WORD('rich','r â€” i â€” ch',[SND('r','/r/'),SND('i','/Éª/'),SND('ch','/tÊƒ/',2)],'ðŸ’°','ðŸŒ¿','ðŸ”'),
        WORD('bench','b â€” e â€” n â€” ch',[SND('b','/b/'),SND('e','/É›/'),SND('n','/n/'),SND('ch','/tÊƒ/',2)],'ðŸª‘','ðŸ','ðŸŽ')
      ],
      [
        WORD('ring','r â€” i â€” ng',[SND('r','/r/'),SND('i','/Éª/'),SND('ng','/Å‹/',2)],'ðŸ’','ðŸ¸','ðŸ””'),
        WORD('sing','s â€” i â€” ng',[SND('s','/s/'),SND('i','/Éª/'),SND('ng','/Å‹/',2)],'ðŸŽ¤','ðŸŸ','ðŸŒž'),
        WORD('song','s â€” o â€” ng',[SND('s','/s/'),SND('o','/É’/'),SND('ng','/Å‹/',2)],'ðŸŽµ','ðŸ”','ðŸ›ï¸'),
        WORD('bang','b â€” a â€” ng',[SND('b','/b/'),SND('a','/a/'),SND('ng','/Å‹/',2)],'ðŸ’¥','ðŸŒ™','ðŸŸ'),
        WORD('king','k â€” i â€” ng',[SND('k','/k/'),SND('i','/Éª/'),SND('ng','/Å‹/',2)],'ðŸ‘‘','ðŸªµ','ðŸ'),
        WORD('wing','w â€” i â€” ng',[SND('w','/w/'),SND('i','/Éª/'),SND('ng','/Å‹/',2)],'ðŸª½','ðŸ¶','ðŸž'),
        WORD('gong','g â€” o â€” ng',[SND('g','/g/'),SND('o','/É’/'),SND('ng','/Å‹/',2)],'ðŸ””','ðŸ¶','ðŸž'),
        WORD('hang','h â€” a â€” ng',[SND('h','/h/'),SND('a','/a/'),SND('ng','/Å‹/',2)],'ðŸª','ðŸŽ©','ðŸ›')
      ],
      [
        WORD('rain','r â€” ai â€” n',[SND('r','/r/'),SND('ai','/eÉª/',2),SND('n','/n/')],'ðŸŒ§ï¸','ðŸš‚','ðŸŒˆ'),
        WORD('tail','t â€” ai â€” l',[SND('t','/t/'),SND('ai','/eÉª/',2),SND('l','/l/')],'ðŸ’','ðŸªµ','ðŸŸ'),
        WORD('sail','s â€” ai â€” l',[SND('s','/s/'),SND('ai','/eÉª/',2),SND('l','/l/')],'â›µ','ðŸ¸','ðŸŒ¿'),
        WORD('pain','p â€” ai â€” n',[SND('p','/p/'),SND('ai','/eÉª/',2),SND('n','/n/')],'ðŸ¤•','ðŸŒž','ðŸ”'),
        WORD('feet','f â€” ee â€” t',[SND('f','/f/'),SND('ee','/iË/',2),SND('t','/t/')],'ðŸ¦¶','ðŸŒ²','ðŸ '),
        WORD('seed','s â€” ee â€” d',[SND('s','/s/'),SND('ee','/iË/',2),SND('d','/d/')],'ðŸŒ±','ðŸ¶','ðŸ§¢'),
        WORD('sheep','sh â€” ee â€” p',[SND('sh','/Êƒ/',2),SND('ee','/iË/',2),SND('p','/p/')],'ðŸ‘','ðŸŸ','ðŸŒ™'),
        WORD('deep','d â€” ee â€” p',[SND('d','/d/'),SND('ee','/iË/',2),SND('p','/p/')],'ðŸ¤¿','ðŸŒ³','ðŸ”')
      ],
      [
        WORD('boat','b â€” oa â€” t',[SND('b','/b/'),SND('oa','/É™ÊŠ/',2),SND('t','/t/')],'â›µ','ðŸ¥','ðŸ¦‹'),
        WORD('coat','c â€” oa â€” t',[SND('c','/k/'),SND('oa','/É™ÊŠ/',2),SND('t','/t/')],'ðŸ§¥','ðŸ','ðŸš—'),
        WORD('goat','g â€” oa â€” t',[SND('g','/g/'),SND('oa','/É™ÊŠ/',2),SND('t','/t/')],'ðŸ','ðŸŒ¿','ðŸ”'),
        WORD('road','r â€” oa â€” d',[SND('r','/r/'),SND('oa','/É™ÊŠ/',2),SND('d','/d/')],'ðŸ›£ï¸','ðŸŸ','ðŸŽ©'),
        WORD('moon','m â€” oo â€” n',[SND('m','/m/'),SND('oo','/uË/',2),SND('n','/n/')],'ðŸŒ•','ðŸ„','ðŸŒŠ'),
        WORD('food','f â€” oo â€” d',[SND('f','/f/'),SND('oo','/uË/',2),SND('d','/d/')],'ðŸ²','ðŸŸ','ðŸŒ³'),
        WORD('boot','b â€” oo â€” t',[SND('b','/b/'),SND('oo','/uË/',2),SND('t','/t/')],'ðŸ‘¢','ðŸ”','ðŸŒ™'),
        WORD('roof','r â€” oo â€” f',[SND('r','/r/'),SND('oo','/uË/',2),SND('f','/f/')],'ðŸ ','ðŸ¶','ðŸž')
      ]
    ]
  },

  // â”€â”€ Phase 4: adjacent consonants only, represented as separate phonemes â”€â”€
  phase4: {
    levels: [
      [
        WORD('frog','f â€” r â€” o â€” g',[SND('f','/f/'),SND('r','/r/'),SND('o','/É’/'),SND('g','/g/')],'ðŸ¸','ðŸ¦Š','ðŸŸ'),
        WORD('clap','c â€” l â€” a â€” p',[SND('c','/k/'),SND('l','/l/'),SND('a','/a/'),SND('p','/p/')],'ðŸ‘','ðŸ—ºï¸','ðŸ§¢'),
        WORD('drum','d â€” r â€” u â€” m',[SND('d','/d/'),SND('r','/r/'),SND('u','/ÊŒ/'),SND('m','/m/')],'ðŸ¥','ðŸ¦Œ','ðŸ’§'),
        WORD('flag','f â€” l â€” a â€” g',[SND('f','/f/'),SND('l','/l/'),SND('a','/a/'),SND('g','/g/')],'ðŸš©','ðŸ¸','ðŸ¦‹'),
        WORD('plug','p â€” l â€” u â€” g',[SND('p','/p/'),SND('l','/l/'),SND('u','/ÊŒ/'),SND('g','/g/')],'ðŸ”Œ','ðŸ¶','ðŸŒ·'),
        WORD('crab','c â€” r â€” a â€” b',[SND('c','/k/'),SND('r','/r/'),SND('a','/a/'),SND('b','/b/')],'ðŸ¦€','ðŸ','ðŸŽ'),
        WORD('clip','c â€” l â€” i â€” p',[SND('c','/k/'),SND('l','/l/'),SND('i','/Éª/'),SND('p','/p/')],'ðŸ“Ž','ðŸ·','ðŸŒž'),
        WORD('trip','t â€” r â€” i â€” p',[SND('t','/t/'),SND('r','/r/'),SND('i','/Éª/'),SND('p','/p/')],'ðŸ§³','ðŸŸ','ðŸŒ™')
      ],
      [
        WORD('tent','t â€” e â€” n â€” t',[SND('t','/t/'),SND('e','/É›/'),SND('n','/n/'),SND('t','/t/')],'â›º','ðŸŒ·','ðŸ¢'),
        WORD('hand','h â€” a â€” n â€” d',[SND('h','/h/'),SND('a','/a/'),SND('n','/n/'),SND('d','/d/')],'ðŸ–ï¸','ðŸŽ©','ðŸ'),
        WORD('belt','b â€” e â€” l â€” t',[SND('b','/b/'),SND('e','/É›/'),SND('l','/l/'),SND('t','/t/')],'ðŸ‘–','ðŸ','ðŸ”ï¸'),
        WORD('milk','m â€” i â€” l â€” k',[SND('m','/m/'),SND('i','/Éª/'),SND('l','/l/'),SND('k','/k/')],'ðŸ¥›','ðŸ„','ðŸŒ¿'),
        WORD('sand','s â€” a â€” n â€” d',[SND('s','/s/'),SND('a','/a/'),SND('n','/n/'),SND('d','/d/')],'ðŸ–ï¸','ðŸŸ','ðŸŽ©'),
        WORD('lamp','l â€” a â€” m â€” p',[SND('l','/l/'),SND('a','/a/'),SND('m','/m/'),SND('p','/p/')],'ðŸ’¡','ðŸ›','ðŸŒ³'),
        WORD('pond','p â€” o â€” n â€” d',[SND('p','/p/'),SND('o','/É’/'),SND('n','/n/'),SND('d','/d/')],'ðŸ¦†','ðŸ¸','ðŸŽµ'),
        WORD('nest','n â€” e â€” s â€” t',[SND('n','/n/'),SND('e','/É›/'),SND('s','/s/'),SND('t','/t/')],'ðŸªº','ðŸŸ','ðŸ§¢')
      ],
      [
        WORD('stop','s â€” t â€” o â€” p',[SND('s','/s/'),SND('t','/t/'),SND('o','/É’/'),SND('p','/p/')],'ðŸ›‘','ðŸ·','ðŸŒ™'),
        WORD('step','s â€” t â€” e â€” p',[SND('s','/s/'),SND('t','/t/'),SND('e','/É›/'),SND('p','/p/')],'ðŸ‘£','ðŸŸ','ðŸŒ³'),
        WORD('spin','s â€” p â€” i â€” n',[SND('s','/s/'),SND('p','/p/'),SND('i','/Éª/'),SND('n','/n/')],'ðŸŒ€','ðŸ”','ðŸŽ©'),
        WORD('skip','s â€” k â€” i â€” p',[SND('s','/s/'),SND('k','/k/'),SND('i','/Éª/'),SND('p','/p/')],'â­ï¸','ðŸ¶','ðŸž'),
        WORD('plan','p â€” l â€” a â€” n',[SND('p','/p/'),SND('l','/l/'),SND('a','/a/'),SND('n','/n/')],'ðŸ—ºï¸','ðŸ¸','ðŸ’§'),
        WORD('plum','p â€” l â€” u â€” m',[SND('p','/p/'),SND('l','/l/'),SND('u','/ÊŒ/'),SND('m','/m/')],'ðŸ‘','ðŸŒ™','ðŸ”'),
        WORD('snap','s â€” n â€” a â€” p',[SND('s','/s/'),SND('n','/n/'),SND('a','/a/'),SND('p','/p/')],'ðŸ“¸','ðŸŸ','ðŸŒ³'),
        WORD('black','b â€” l â€” a â€” ck',[SND('b','/b/'),SND('l','/l/'),SND('a','/a/'),SND('ck','/k/',2)],'âš«','ðŸ¶','ðŸŽ')
      ],
      [
        WORD('train','t â€” r â€” ai â€” n',[SND('t','/t/'),SND('r','/r/'),SND('ai','/eÉª/',2),SND('n','/n/')],'ðŸš†','ðŸŸ','ðŸŒ³'),
        WORD('green','g â€” r â€” ee â€” n',[SND('g','/g/'),SND('r','/r/'),SND('ee','/iË/',2),SND('n','/n/')],'ðŸŸ©','ðŸ¸','ðŸŽ©'),
        WORD('float','f â€” l â€” oa â€” t',[SND('f','/f/'),SND('l','/l/'),SND('oa','/É™ÊŠ/',2),SND('t','/t/')],'ðŸ›Ÿ','ðŸ”','ðŸž'),
        WORD('broom','b â€” r â€” oo â€” m',[SND('b','/b/'),SND('r','/r/'),SND('oo','/uË/',2),SND('m','/m/')],'ðŸ§¹','ðŸŸ','ðŸŒ™'),
        WORD('sleep','s â€” l â€” ee â€” p',[SND('s','/s/'),SND('l','/l/'),SND('ee','/iË/',2),SND('p','/p/')],'ðŸ˜´','ðŸ¶','ðŸŒ³'),
        WORD('spoon','s â€” p â€” oo â€” n',[SND('s','/s/'),SND('p','/p/'),SND('oo','/uË/',2),SND('n','/n/')],'ðŸ¥„','ðŸ”','ðŸŽ©'),
        WORD('snail','s â€” n â€” ai â€” l',[SND('s','/s/'),SND('n','/n/'),SND('ai','/eÉª/',2),SND('l','/l/')],'ðŸŒ','ðŸŸ','ðŸŽ'),
        WORD('brush','b â€” r â€” u â€” sh',[SND('b','/b/'),SND('r','/r/'),SND('u','/ÊŒ/'),SND('sh','/Êƒ/',2)],'ðŸª¥','ðŸ¶','ðŸŒ¿')
      ],
      [
        WORD('toast','t â€” oa â€” s â€” t',[SND('t','/t/'),SND('oa','/É™ÊŠ/',2),SND('s','/s/'),SND('t','/t/')],'ðŸž','ðŸ¸','ðŸŒ™'),
        WORD('paint','p â€” ai â€” n â€” t',[SND('p','/p/'),SND('ai','/eÉª/',2),SND('n','/n/'),SND('t','/t/')],'ðŸŽ¨','ðŸŸ','ðŸŒ³'),
        WORD('chimp','ch â€” i â€” m â€” p',[SND('ch','/tÊƒ/',2),SND('i','/Éª/'),SND('m','/m/'),SND('p','/p/')],'ðŸ’','ðŸ¶','ðŸŽ©'),
        WORD('shelf','sh â€” e â€” l â€” f',[SND('sh','/Êƒ/',2),SND('e','/É›/'),SND('l','/l/'),SND('f','/f/')],'ðŸ“š','ðŸ”','ðŸŽ'),
        WORD('bloom','b â€” l â€” oo â€” m',[SND('b','/b/'),SND('l','/l/'),SND('oo','/uË/',2),SND('m','/m/')],'ðŸŒ¼','ðŸŸ','ðŸŒ™'),
        WORD('crash','c â€” r â€” a â€” sh',[SND('c','/k/'),SND('r','/r/'),SND('a','/a/'),SND('sh','/Êƒ/',2)],'ðŸ’¥','ðŸ¶','ðŸŒ³'),
        WORD('clock','c â€” l â€” o â€” ck',[SND('c','/k/'),SND('l','/l/'),SND('o','/É’/'),SND('ck','/k/',2)],'ðŸ•’','ðŸ”','ðŸž'),
        WORD('drink','d â€” r â€” i â€” n â€” k',[SND('d','/d/'),SND('r','/r/'),SND('i','/Éª/'),SND('n','/n/'),SND('k','/k/')],'ðŸ¥¤','ðŸŸ','ðŸŒ¿')
      ]
    ]
  },

  // â”€â”€ Phase 5: early alternative spellings only (ay, ea, ow) â”€â”€
  phase5: {
    levels: [
      [
        WORD('day','d â€” ay',[SND('d','/d/'),SND('ay','/eÉª/',2)],'ðŸŒž','ðŸŒ™','ðŸ§¤'),
        WORD('play','p â€” l â€” ay',[SND('p','/p/'),SND('l','/l/'),SND('ay','/eÉª/',2)],'ðŸŽ®','ðŸŒ¿','ðŸž'),
        WORD('say','s â€” ay',[SND('s','/s/'),SND('ay','/eÉª/',2)],'ðŸ—£ï¸','ðŸŸ','ðŸŒ³'),
        WORD('may','m â€” ay',[SND('m','/m/'),SND('ay','/eÉª/',2)],'ðŸ“…','ðŸ¶','ðŸŒ™'),
        WORD('bay','b â€” ay',[SND('b','/b/'),SND('ay','/eÉª/',2)],'ðŸ–ï¸','ðŸ”','ðŸŽ'),
        WORD('hay','h â€” ay',[SND('h','/h/'),SND('ay','/eÉª/',2)],'ðŸŒ¾','ðŸŸ','ðŸŽ©'),
        WORD('tray','t â€” r â€” ay',[SND('t','/t/'),SND('r','/r/'),SND('ay','/eÉª/',2)],'ðŸ½ï¸','ðŸ¶','ðŸŒ³'),
        WORD('clay','c â€” l â€” ay',[SND('c','/k/'),SND('l','/l/'),SND('ay','/eÉª/',2)],'ðŸº','ðŸ”','ðŸž')
      ],
      [
        WORD('sea','s â€” ea',[SND('s','/s/'),SND('ea','/iË/',2)],'ðŸŒŠ','ðŸŒ³','ðŸ'),
        WORD('tea','t â€” ea',[SND('t','/t/'),SND('ea','/iË/',2)],'ðŸµ','ðŸŸ','ðŸŒž'),
        WORD('leaf','l â€” ea â€” f',[SND('l','/l/'),SND('ea','/iË/',2),SND('f','/f/')],'ðŸƒ','ðŸ¶','ðŸ§¢'),
        WORD('bead','b â€” ea â€” d',[SND('b','/b/'),SND('ea','/iË/',2),SND('d','/d/')],'ðŸ“¿','ðŸ”','ðŸŒ™'),
        WORD('meat','m â€” ea â€” t',[SND('m','/m/'),SND('ea','/iË/',2),SND('t','/t/')],'ðŸ–','ðŸŸ','ðŸŒ³'),
        WORD('seal','s â€” ea â€” l',[SND('s','/s/'),SND('ea','/iË/',2),SND('l','/l/')],'ðŸ¦­','ðŸ¶','ðŸž'),
        WORD('pea','p â€” ea',[SND('p','/p/'),SND('ea','/iË/',2)],'ðŸ«›','ðŸ”','ðŸŒž'),
        WORD('beach','b â€” ea â€” ch',[SND('b','/b/'),SND('ea','/iË/',2),SND('ch','/tÊƒ/',2)],'ðŸ–ï¸','ðŸŸ','ðŸ§¢')
      ],
      [
        WORD('snow','s â€” n â€” ow',[SND('s','/s/'),SND('n','/n/'),SND('ow','/É™ÊŠ/',2)],'â„ï¸','ðŸŒ§ï¸','ðŸ”¥'),
        WORD('blow','b â€” l â€” ow',[SND('b','/b/'),SND('l','/l/'),SND('ow','/É™ÊŠ/',2)],'ðŸŒ¬ï¸','ðŸ¶','ðŸŒ³'),
        WORD('grow','g â€” r â€” ow',[SND('g','/g/'),SND('r','/r/'),SND('ow','/É™ÊŠ/',2)],'ðŸŒ±','ðŸ”','ðŸŒ™'),
        WORD('glow','g â€” l â€” ow',[SND('g','/g/'),SND('l','/l/'),SND('ow','/É™ÊŠ/',2)],'ðŸ’¡','ðŸŸ','ðŸž'),
        WORD('crow','c â€” r â€” ow',[SND('c','/k/'),SND('r','/r/'),SND('ow','/É™ÊŠ/',2)],'ðŸ¦','ðŸ¶','ðŸŒ¿'),
        WORD('slow','s â€” l â€” ow',[SND('s','/s/'),SND('l','/l/'),SND('ow','/É™ÊŠ/',2)],'ðŸ¢','ðŸ”','ðŸŒž'),
        WORD('show','sh â€” ow',[SND('sh','/Êƒ/',2),SND('ow','/É™ÊŠ/',2)],'ðŸŽ­','ðŸŸ','ðŸŒ³'),
        WORD('row','r â€” ow',[SND('r','/r/'),SND('ow','/É™ÊŠ/',2)],'ðŸš£','ðŸ¶','ðŸ§¢')
      ],
      [
        WORD('dream','d â€” r â€” ea â€” m',[SND('d','/d/'),SND('r','/r/'),SND('ea','/iË/',2),SND('m','/m/')],'ðŸ’­','ðŸŸ','ðŸŒ³'),
        WORD('cream','c â€” r â€” ea â€” m',[SND('c','/k/'),SND('r','/r/'),SND('ea','/iË/',2),SND('m','/m/')],'ðŸ¦','ðŸ¶','ðŸŒ™'),
        WORD('clean','c â€” l â€” ea â€” n',[SND('c','/k/'),SND('l','/l/'),SND('ea','/iË/',2),SND('n','/n/')],'ðŸ§¼','ðŸ”','ðŸž'),
        WORD('speak','s â€” p â€” ea â€” k',[SND('s','/s/'),SND('p','/p/'),SND('ea','/iË/',2),SND('k','/k/')],'ðŸ—£ï¸','ðŸŸ','ðŸŒ³'),
        WORD('tray','t â€” r â€” ay',[SND('t','/t/'),SND('r','/r/'),SND('ay','/eÉª/',2)],'ðŸ½ï¸','ðŸ¶','ðŸŒž'),
        WORD('clay','c â€” l â€” ay',[SND('c','/k/'),SND('l','/l/'),SND('ay','/eÉª/',2)],'ðŸº','ðŸ”','ðŸŒ™'),
        WORD('blow','b â€” l â€” ow',[SND('b','/b/'),SND('l','/l/'),SND('ow','/É™ÊŠ/',2)],'ðŸŒ¬ï¸','ðŸŸ','ðŸž'),
        WORD('grow','g â€” r â€” ow',[SND('g','/g/'),SND('r','/r/'),SND('ow','/É™ÊŠ/',2)],'ðŸŒ±','ðŸ¶','ðŸŒ¿')
      ],
      [
        WORD('play','p â€” l â€” ay',[SND('p','/p/'),SND('l','/l/'),SND('ay','/eÉª/',2)],'ðŸŽ®','ðŸŒ¿','ðŸž'),
        WORD('beach','b â€” ea â€” ch',[SND('b','/b/'),SND('ea','/iË/',2),SND('ch','/tÊƒ/',2)],'ðŸ–ï¸','ðŸŸ','ðŸ§¢'),
        WORD('crow','c â€” r â€” ow',[SND('c','/k/'),SND('r','/r/'),SND('ow','/É™ÊŠ/',2)],'ðŸ¦','ðŸ¶','ðŸŒ¿'),
        WORD('clean','c â€” l â€” ea â€” n',[SND('c','/k/'),SND('l','/l/'),SND('ea','/iË/',2),SND('n','/n/')],'ðŸ§¼','ðŸ”','ðŸŒ™'),
        WORD('tea','t â€” ea',[SND('t','/t/'),SND('ea','/iË/',2)],'ðŸµ','ðŸŸ','ðŸŒž'),
        WORD('clay','c â€” l â€” ay',[SND('c','/k/'),SND('l','/l/'),SND('ay','/eÉª/',2)],'ðŸº','ðŸ¶','ðŸŒ³'),
        WORD('glow','g â€” l â€” ow',[SND('g','/g/'),SND('l','/l/'),SND('ow','/É™ÊŠ/',2)],'ðŸ’¡','ðŸ”','ðŸž'),
        WORD('leaf','l â€” ea â€” f',[SND('l','/l/'),SND('ea','/iË/',2),SND('f','/f/')],'ðŸƒ','ðŸŸ','ðŸ§¢')
      ]
    ]
  }
};

// â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
// â•‘                    WORLD DEFINITIONS                     â•‘
// â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
var WORLDS = [
  { id:0, name:'Spring Garden', em:'ðŸŒ¸', phase:'Phase 2', phaseKey:'phase2',
    desc:'Short vowels Â· CVC words',
    mapBg:'linear-gradient(180deg,#c8f0d0,#80d898 40%,#50b870)',
    mapBarBg:'rgba(220,255,230,.95)', mapTitleColor:'#1a4d2e',
    sceneBg:'linear-gradient(180deg,#a8ddb5,#3a9050 50%,#1a5030)',
    bubbleBorder:'#6cc258', bubbleColor:'#2c5c20',
    blendBorderColor:'#6cc258', imgBorderColor:'#6cc258',
    imgOkShadow:'rgba(34,197,94,.5)',
    guide:'ðŸ§šâ€â™€ï¸', trees:['ðŸŒ³','ðŸŒ³'], floor:'ðŸŒ·ðŸŒ¼ðŸŒ¸ðŸŒºðŸŒ¼ðŸŒ·',
    stageKey:'STAGE1',
    unlock:{ tag:'ðŸŒ¸ Stage 1 Complete!', name:'Apprentice Spell-Weaver',
      desc:'Emma waved her magic wand and the Spring Garden bloomed! She has learned every short sound. The Summer Coast calls! ðŸŒ¿ðŸª„' },
    nextBg:'linear-gradient(180deg,#1a1000,#402800 50%,#1a0800)' },

  { id:1, name:'Summer Coast', em:'â˜€ï¸', phase:'Phase 3', phaseKey:'phase3',
    desc:'Digraphs Â· vowel teams',
    mapBg:'linear-gradient(180deg,#fff8b0,#ffd040 40%,#f0a000)',
    mapBarBg:'rgba(255,248,200,.95)', mapTitleColor:'#5a3800',
    sceneBg:'linear-gradient(180deg,#a0d8f8,#3888c8 50%,#1060a0)',
    bubbleBorder:'#40a0e0', bubbleColor:'#0a3060',
    blendBorderColor:'#40a0e0', imgBorderColor:'#40a0e0',
    imgOkShadow:'rgba(64,160,224,.5)',
    guide:'ðŸ§œâ€â™€ï¸', trees:['ðŸŒ´','ðŸŒ´'], floor:'ðŸŒŠðŸšðŸŒ¸ðŸšðŸŒŠ',
    stageKey:'STAGE2',
    unlock:{ tag:'â˜€ï¸ Stage 2 Complete!', name:'Knight of the Summer Shore',
      desc:'Emma braved the summer seas and mastered every digraph spell! She has earned a shimmering golden cape! ðŸŒŠâš”ï¸' },
    nextBg:'linear-gradient(180deg,#0a0800,#201000 50%,#0a0500)' },

  { id:2, name:'Autumn Forest', em:'ðŸ‚', phase:'Phase 4', phaseKey:'phase4',
    desc:'Adjacent consonants Â· blends',
    mapBg:'linear-gradient(180deg,#ffe0a0,#f09840 40%,#c06010)',
    mapBarBg:'rgba(255,235,200,.95)', mapTitleColor:'#4a1800',
    sceneBg:'linear-gradient(180deg,#f0b870,#c06820 50%,#703010)',
    bubbleBorder:'#d07020', bubbleColor:'#4a1000',
    blendBorderColor:'#d07020', imgBorderColor:'#d07020',
    imgOkShadow:'rgba(180,100,20,.45)',
    guide:'ðŸ¦‰', trees:['ðŸ','ðŸ‚'], floor:'ðŸ„ðŸ‚ðŸðŸŒ°ðŸ‚ðŸ„',
    stageKey:'STAGE3',
    unlock:{ tag:'ðŸ‚ Stage 3 Complete!', name:'Duchess of the Golden Forest',
      desc:'Emma mastered every tricky blend in the forest! The ancient trees gave her a golden sceptre. One world remains! ðŸ‚ðŸ”±' },
    nextBg:'linear-gradient(180deg,#000a1a,#001030 50%,#000818)' },

  { id:3, name:'Winter Palace', em:'â„ï¸', phase:'Phase 5', phaseKey:'phase5',
    desc:'Alternative spellings Â· rescue!',
    mapBg:'linear-gradient(180deg,#d8f0ff,#90c8f0 40%,#5090d0)',
    mapBarBg:'rgba(210,240,255,.95)', mapTitleColor:'#0a2a50',
    sceneBg:'linear-gradient(180deg,#c0d8f8,#6090d0 50%,#304880)',
    bubbleBorder:'#80b8f0', bubbleColor:'#0a2050',
    blendBorderColor:'#80b8f0', imgBorderColor:'#80b8f0',
    imgOkShadow:'rgba(80,160,240,.45)',
    guide:'â›„', trees:['ðŸŒ²','ðŸŒ²'], floor:'â„ï¸ðŸŒŸâ„ï¸ðŸŒŸâ„ï¸',
    stageKey:'STAGE4',
    unlock:{ tag:'ðŸ‘‘ CORONATION!', name:'Crystal Princess Emma!',
      desc:'Emma read every rune in the Crystal Kingdom! The ice crown floated down onto her head. All the magical creatures cheered: PRINCESS EMMA! ðŸ°ðŸ‘‘âœ¨' },
    nextBg:'radial-gradient(ellipse at 50% 30%,#0a1840,#050d30 50%,#020818)' }
];

// â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
// â•‘                     GAME STATE                           â•‘
// â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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

// â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
// â•‘                       HELPERS                            â•‘
// â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
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
