'use strict';
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

function poolCountForPhase(phaseKey) {
  return CURRICULUM_LEVEL_POOLS[phaseKey] ? CURRICULUM_LEVEL_POOLS[phaseKey].length : 0;
}

function poolWords(phaseKey, poolIdx) {
  var phase = WORD_BANK[phaseKey];
  var poolNames = CURRICULUM_LEVEL_POOLS[phaseKey];
  if (!phase || !phase.levels || !poolNames || !poolNames[poolIdx]) return [];

  var byWord = {};
  phase.levels.forEach(function(level) {
    level.forEach(function(word) {
      byWord[word.w] = word;
    });
  });

  return poolNames[poolIdx].map(function(name) { return byWord[name]; }).filter(Boolean);
}

function phaseWords(phaseKey, uptoLevelCount) {
  var pools = CURRICULUM_LEVEL_POOLS[phaseKey];
  if (!pools) return [];
  var limit = typeof uptoLevelCount === 'number' ? Math.min(uptoLevelCount, pools.length) : pools.length;
  var words = [];
  for (var i = 0; i < limit; i++) words = words.concat(poolWords(phaseKey, i));
  return words;
}

function rotatePick(pool, count, offset) {
  if (!pool.length || count <= 0) return [];
  var start = offset % pool.length;
  var rotated = pool.slice(start).concat(pool.slice(0, start));
  return rotated.slice(0, Math.min(count, rotated.length));
}

function addUniqueWords(target, source) {
  source.forEach(function(word) {
    var exists = target.some(function(item) { return item.w === word.w; });
    if (!exists && target.length < QUESTIONS_PER_LEVEL) target.push(word);
  });
}

function getReviewCount(worldId, lvIdx) {
  if (worldId === 0) return 0;
  if (lvIdx < 4) return 0;
  if (lvIdx === 4) return 1;
  if (lvIdx === 5) return 2;
  return worldId === 3 ? 3 : 2;
}

function getReviewPool(worldId, lvIdx) {
  var reviewPool = [];
  for (var i = 0; i < worldId; i++) {
    var earlierKey = WORLDS[i].phaseKey;
    reviewPool = reviewPool.concat(phaseWords(earlierKey));
  }
  if (lvIdx >= 5 && worldId > 0) {
    reviewPool = reviewPool.concat(phaseWords(WORLDS[worldId].phaseKey, Math.min(2, poolCountForPhase(WORLDS[worldId].phaseKey))));
  }
  return reviewPool;
}

function getCurrentPool(worldId, lvIdx) {
  var phaseKey = WORLDS[worldId].phaseKey;
  var poolCount = poolCountForPhase(phaseKey);
  if (!poolCount) return [];
  if (lvIdx === 0) return poolWords(phaseKey, 0);
  if (lvIdx === 1) return poolWords(phaseKey, Math.min(1, poolCount - 1));
  if (lvIdx === 2) return poolCount > 2 ? poolWords(phaseKey, 2) : phaseWords(phaseKey, poolCount);
  if (lvIdx === 3) return phaseWords(phaseKey, Math.min(2, poolCount));
  if (lvIdx === 4) return phaseWords(phaseKey, poolCount);
  return phaseWords(phaseKey);
}

function getLevelWords(worldId, lvIdx, attemptIdx) {
  var currentPool = getCurrentPool(worldId, lvIdx);
  if (currentPool.length === 0) return [];
  var attempt = attemptIdx || 0;
  var reviewPool = getReviewPool(worldId, lvIdx);
  var reviewCount = Math.min(getReviewCount(worldId, lvIdx), QUESTIONS_PER_LEVEL);
  var currentCount = QUESTIONS_PER_LEVEL - reviewCount;
  var words = [];

  addUniqueWords(words, rotatePick(currentPool, currentCount, lvIdx * 5 + attempt * 2));

  if (reviewCount > 0 && reviewPool.length) {
    addUniqueWords(words, rotatePick(reviewPool, reviewCount, worldId * 7 + lvIdx * 3 + attempt * 3));
  }

  if (words.length < QUESTIONS_PER_LEVEL) {
    addUniqueWords(words, rotatePick(currentPool, QUESTIONS_PER_LEVEL, lvIdx + attempt + 1));
  }
  if (words.length < QUESTIONS_PER_LEVEL && reviewPool.length) {
    addUniqueWords(words, rotatePick(reviewPool, QUESTIONS_PER_LEVEL, worldId + lvIdx + attempt + 1));
  }

  return words.slice(0, QUESTIONS_PER_LEVEL);
}

function renderChoiceContent(btn, choice) {
  var art = document.createElement('div');
  art.className = 'img-choice-art';

  var fallback = document.createElement('span');
  fallback.className = 'img-fallback';
  fallback.textContent = choice.fb || '🖼️';

  if (choice.img) {
    var img = document.createElement('img');
    img.src = choice.img;
    img.alt = choice.label || '';
    img.onerror = function() {
      if (img.parentNode) img.parentNode.removeChild(img);
      fallback.style.display = 'flex';
    };
    art.appendChild(img);
    fallback.style.display = 'none';
  }

  art.appendChild(fallback);
  btn.appendChild(art);
}

function lockChoiceButtons() {
  document.querySelectorAll('.img-btn').forEach(function(button) {
    button.onclick = null;
    button.classList.add('locked');
    button.style.pointerEvents = 'none';
  });
}

function setResultStars(isCorrect) {
  var box = document.querySelector('#sr .sr-stars');
  if (!box) return;
  if (isCorrect) {
    box.className = 'sr-stars';
    box.innerHTML = '<div class="sr-star">⭐</div><div class="sr-star">⭐</div><div class="sr-star">⭐</div>';
  } else {
    box.className = 'sr-stars zero';
    box.innerHTML = '<div class="sr-zero">0 Stars This Time</div>';
  }
}

function showQuestionResult(isCorrect, correctBtn) {
  var lv = S.queue[S.qIdx];
  var wdata = WORLDS[S.cWorld];
  setLeahImg('srChar', wdata.stageKey);
  document.getElementById('srWord').textContent = isCorrect ? lv.w+' ✓' : lv.w;
  setResultStars(isCorrect);

  var srBtn = document.getElementById('srBtn');
  if (S.qIdx < S.queue.length-1) {
    srBtn.textContent = '🌟 Next Word!';
  } else {
    srBtn.textContent = S.correct >= PASS_THRESHOLD ?
      (S.cLevel < 6 ? '🎉 Level Complete!' :
        (S.mastery[S.cWorld] + 1 < requiredWinsForWorld(S.cWorld) ? '🔁 One More Secure Win' : '🌍 World Complete!')) :
      '🔄 Try This Level Again';
  }

  if (isCorrect) {
    document.getElementById('srTag').textContent = 'Well done, Leah!';
    document.getElementById('srName').textContent = 'You read "'+lv.w+'"!';
    document.getElementById('srDesc').textContent =
      S.correct+' of '+S.queue.length+' correct so far! Keep going! 🌟';
  } else {
    document.getElementById('srTag').textContent = 'Nice trying!';
    document.getElementById('srName').textContent = 'The word was "'+lv.w+'".';
    document.getElementById('srDesc').textContent =
      'Leah can keep going. The correct picture is highlighted, and only the first tap counted for scoring.';
    if (correctBtn) {
      correctBtn.classList.add('ok');
      correctBtn.style.borderColor = '#22c55e';
      correctBtn.style.boxShadow = '0 0 28px '+wdata.imgOkShadow;
    }
  }

  if (isCorrect) conf('srConf');
  else {
    var c = document.getElementById('srConf');
    if (c) c.innerHTML = '';
  }
  go('sr');
}

function setLeahImg(elId, stageKey) {
  var el = document.getElementById(elId);
  if (!el) return;
  var src = STAGE_IMGS[stageKey] || '';
  if (src) {
    var stageClass = String(stageKey || '').toLowerCase();
    var unlockClass = elId === 'wuChar' ? ' seasonal-unlock' : '';
    var particleHtml = elId === 'wuChar'
      ? '<span class="seasonal-particle p1"></span>' +
        '<span class="seasonal-particle p2"></span>' +
        '<span class="seasonal-particle p3"></span>' +
        '<span class="seasonal-particle p4"></span>'
      : '';
    el.innerHTML =
      '<div class="seasonal-portrait ' + stageClass + unlockClass + '">' +
        '<img class="seasonal-photo" src="' + src + '" alt="Leah"/>' +
        '<span class="seasonal-sparkle s1"></span>' +
        '<span class="seasonal-sparkle s2"></span>' +
        '<span class="seasonal-sparkle s3"></span>' +
        particleHtml +
      '</div>';
    el.style.fontSize = '0';
    el.style.overflow = 'visible';
  } else {
    el.style.fontSize = '';
    el.style.overflow = '';
    el.textContent = '⭐';
  }
}

function renderMapLeah(stageKey) {
  var host = document.getElementById('mapLeah');
  if (!host) return;
  var src = STAGE_IMGS[stageKey] || '';
  if (src) {
    var stageClass = String(stageKey || '').toLowerCase();
    host.innerHTML =
      '<div id="mapLeahImg" class="seasonal-portrait seasonal-map ' + stageClass + '">' +
        '<img class="seasonal-photo" src="' + src + '" alt="Leah"/>' +
        '<span class="seasonal-sparkle s1"></span>' +
        '<span class="seasonal-sparkle s2"></span>' +
        '<span class="seasonal-sparkle s3"></span>' +
      '</div>';
  } else {
    host.innerHTML = '<div id="mapLeahImg">⭐</div>';
  }
}

function conf(id) {
  var c = document.getElementById(id); if (!c) return;
  c.innerHTML = '';
  var cols = ['#ffd700','#ff6b9d','#9b59f5','#00d4ff','#ff9f43','#80ffca','#ff4444','#44ff88'];
  for (var i = 0; i < 36; i++) {
    var p = document.createElement('div'); p.className = 'conf';
    p.style.cssText = 'left:'+Math.random()*100+'%;top:-10px;background:'+cols[i%cols.length]+';width:'+(7+Math.random()*8)+'px;height:'+(7+Math.random()*8)+'px;animation-delay:'+Math.random()*2+'s;animation-duration:'+(2.5+Math.random()*2.5)+'s;transform:rotate('+Math.random()*360+'deg)';
    c.appendChild(p);
  }
}

function sparkle(draw, x, y, sz, col, a) {
  // draw is ImageDraw-like — not used in JS; sparkles are CSS only here
}

// ╔══════════════════════════════════════════════════════════╗
// ║                    SCREEN NAVIGATION                     ║
// ╚══════════════════════════════════════════════════════════╝
function go(id) {
  document.querySelectorAll('.sc').forEach(function(s){ s.classList.remove('on'); });
  document.getElementById(id).classList.add('on');
}

function goMap() { renderMap(S.worldIdx); go('sm'); }

// ╔══════════════════════════════════════════════════════════╗
// ║                      MAP RENDERING                       ║
// ╚══════════════════════════════════════════════════════════╝
function renderMap(wIdx) {
  S.worldIdx = wIdx;
  var w = WORLDS[wIdx];

  var sm = document.getElementById('sm');
  sm.style.background = w.mapBg;
  document.getElementById('mapBar').style.background = w.mapBarBg;

  var titleEl = document.getElementById('mapTitle');
  titleEl.textContent = w.em + ' ' + w.name;
  titleEl.style.color = w.mapTitleColor;

  document.getElementById('mapStars').textContent   = '⭐ ' + S.stars;
  document.getElementById('mapStarBtn').textContent = '⭐ ' + S.stars;

  // update map Leah avatar to current world stage
  renderMapLeah(w.stageKey);

  // world tabs
  var tabs = document.getElementById('worldTabs');
  tabs.innerHTML = '';
  WORLDS.forEach(function(wd, i) {
    var unlocked = isWorldUnlocked(i);
    var t = document.createElement('button');
    t.className = 'wtab' + (i === wIdx ? ' active' : '') + (unlocked ? '' : ' locked');
    t.textContent = wd.em + ' ' + wd.name.split(' ')[0];
    if (unlocked) (function(ii){ t.onclick = function(){ renderMap(ii); }; })(i);
    tabs.appendChild(t);
  });

  // path map
  var scr = document.getElementById('mapScroll');
  scr.innerHTML = '';

  var strip = document.createElement('div');
  strip.className = 'world-strip';
  strip.style.color = w.mapTitleColor;
  strip.innerHTML = '<div class="ws-em">'+w.em+'</div><div><div class="ws-name" style="color:'+w.mapTitleColor+'">'+w.name+'</div><div class="ws-phase">'+w.phase+' · '+w.desc+'</div></div>';
  scr.appendChild(strip);

  var worldUnlocked = isWorldUnlocked(wIdx);
  var done = S.progress[wIdx];
  var masteryPending = needsWorldMastery(wIdx);

  var svgNS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox','0 0 360 530');
  svg.setAttribute('width','100%');
  svg.style.display = 'block';

  var positions = [
    {x:180,y:58},{x:272,y:118},{x:262,y:195},{x:172,y:242},
    {x:90,y:292},{x:100,y:372},{x:180,y:445}
  ];

  // connecting lines
  for (var li = 0; li < positions.length-1; li++) {
    var p1 = positions[li], p2 = positions[li+1];
    var seg = document.createElementNS(svgNS, 'line');
    seg.setAttribute('x1',p1.x); seg.setAttribute('y1',p1.y);
    seg.setAttribute('x2',p2.x); seg.setAttribute('y2',p2.y);
    seg.setAttribute('stroke', done>li+1 ? 'rgba(34,197,94,0.55)' : 'rgba(0,0,0,0.14)');
    seg.setAttribute('stroke-width','6');
    seg.setAttribute('stroke-linecap','round');
    if (done <= li+1) seg.setAttribute('stroke-dasharray','10 8');
    svg.appendChild(seg);
  }

  // level nodes
  positions.forEach(function(pos, i) {
    var isDone   = done > i || (done >= 7 && i < 6);
    var isActive = worldUnlocked && ((done === i) || (masteryPending && i === 6));
    var isLocked = !isDone && !isActive;
    var isBoss   = i === 6;
    var isReview = i === 5;
    var r        = isBoss ? 30 : isReview ? 26 : 24;

    var g = document.createElementNS(svgNS, 'g');
    g.setAttribute('transform', 'translate('+pos.x+','+pos.y+')');
    if ((isDone || isActive) && worldUnlocked) {
      g.style.cursor = 'pointer';
      (function(lvv){ g.onclick = function(){ startLevel(wIdx, lvv); }; })(i);
    }

    if (isActive) {
      var glow = document.createElementNS(svgNS, 'circle');
      glow.setAttribute('r','36'); glow.setAttribute('fill','none');
      glow.setAttribute('stroke','rgba(37,99,235,0.35)');
      glow.setAttribute('stroke-width','10');
      svg.appendChild(g); // append first, add glow behind
      g.insertBefore(glow, g.firstChild);
    }

    var circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('r', r);
    circle.setAttribute('fill',
      isLocked ? 'rgba(0,0,0,0.16)' :
      isBoss   ? (isDone||isActive ? '#ffd700' : 'rgba(200,160,0,0.3)') :
      isDone   ? 'rgba(34,197,94,0.85)' :
      isActive ? 'white' : 'rgba(180,180,180,0.28)');
    circle.setAttribute('stroke',
      isActive ? '#2563eb' : isBoss ? '#c8a000' : isDone ? '#16a34a' : 'rgba(0,0,0,0.18)');
    circle.setAttribute('stroke-width', isActive||isBoss ? '3' : '2');
    g.appendChild(circle);

    var icon = document.createElementNS(svgNS, 'text');
    icon.setAttribute('text-anchor','middle');
    icon.setAttribute('dominant-baseline','central');
    icon.setAttribute('font-size', isBoss ? '20' : '16');
    icon.textContent = isBoss?'⭐': isDone?'✅': isActive?'▶': '🔒';
    g.appendChild(icon);

    var label = document.createElementNS(svgNS, 'text');
    label.setAttribute('text-anchor','middle');
    label.setAttribute('y', r+15);
    label.setAttribute('font-size','11');
    label.setAttribute('font-weight','800');
    label.setAttribute('fill', isLocked ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.6)');
    label.setAttribute('font-family','Nunito,sans-serif');
    label.textContent = isBoss?'⭐ Boss': isReview?'Review': 'Level '+(i+1);
    g.appendChild(label);

    if (!isActive) svg.appendChild(g);
  });

  scr.appendChild(svg);

  // play button
  var aw=WORLDS.length-1, al=6;
  for (var wi=0; wi<4; wi++) {
    if (isWorldUnlocked(wi)) {
      if (S.progress[wi] < 7 || needsWorldMastery(wi)) {
        aw = wi;
        al = activeLevelForWorld(wi);
        break;
      }
    }
  }
  var pb = document.getElementById('playBtn');
  pb.textContent = '▶ '+WORLDS[aw].em+' Level '+(al+1);
  pb.onclick = function(){ startLevel(aw, al); };
}

// ╔══════════════════════════════════════════════════════════╗
// ║                   CHALLENGE LOGIC                        ║
// ╚══════════════════════════════════════════════════════════╝
function startLevel(wIdx, lvIdx) {
  S.cWorld = wIdx; S.cLevel = lvIdx;
  var key = levelKey(wIdx, lvIdx);
  if (S.levelAttempts[key] == null) S.levelAttempts[key] = 0;
  S.queue   = getLevelWords(wIdx, lvIdx, S.levelAttempts[key]);
  S.qIdx    = 0;
  S.correct = 0;
  if (S.queue.length === 0) { alert('No words loaded for this phase yet!'); return; }
  buildQuestion();
  go('sc2');
}

function buildQuestion() {
  var w  = WORLDS[S.cWorld];
  var lv = S.queue[S.qIdx];
  S.litN = lv.s.length; S.blendDone = true; S.answerLocked = false;

  // Scene theming
  var scene = document.getElementById('cScene');
  scene.innerHTML = '';
  scene.style.background = w.sceneBg;
  // clouds
  var cl1 = document.createElement('div'); cl1.className='c-cloud';
  cl1.style.cssText='width:72px;height:28px;background:rgba(255,255,255,.7);top:18px;left:16px';
  var cl2 = document.createElement('div'); cl2.className='c-cloud';
  cl2.style.cssText='width:112px;height:36px;background:rgba(255,255,255,.62);top:28px;right:20px';
  scene.appendChild(cl1); scene.appendChild(cl2);
  // trees
  var tl=document.createElement('div'); tl.className='c-deco';
  tl.style.cssText='bottom:0;left:-8px;font-size:60px'; tl.textContent=w.trees[0];
  var tr=document.createElement('div'); tr.className='c-deco';
  tr.style.cssText='bottom:0;right:-8px;font-size:60px'; tr.textContent=w.trees[1];
  scene.appendChild(tl); scene.appendChild(tr);
  // floor
  var fl=document.createElement('div'); fl.className='c-deco';
  fl.style.cssText='bottom:12px;left:50%;transform:translateX(-50%);font-size:17px;white-space:nowrap';
  fl.textContent=w.floor; scene.appendChild(fl);

  // UI theming
  document.getElementById('cGuide').textContent = w.guide;
  var bub = document.getElementById('cBubble');
  bub.style.borderColor = w.bubbleBorder; bub.style.color = w.bubbleColor;
  bub.textContent = 'Look at the sounds, blend the word, then choose the picture. ✨';

  document.getElementById('cPhaseTag').textContent = w.phase;
  document.getElementById('cPhaseTag').style.cssText = 'background:rgba(255,255,255,.85);color:'+w.bubbleColor;
  document.getElementById('cLvTag').textContent = 'Level '+(S.cLevel+1);
  document.getElementById('cLvTag').style.cssText = 'background:rgba(255,255,255,.7);color:#444';

  // Progress bar
  var pct = (S.qIdx / S.queue.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent =
    'Question '+(S.qIdx+1)+' of '+S.queue.length+
    (S.qIdx > 0 ? '  ✅ '+S.correct+' correct' : '');

  document.getElementById('cWordDisplay').textContent = lv.d;
  document.getElementById('blendZone').style.borderColor = w.blendBorderColor;
  document.getElementById('blendPh').style.display = 'flex';
  var bwEl = document.getElementById('blendWd');
  bwEl.style.display = 'none'; bwEl.textContent = '';
  document.getElementById('blendPh').textContent = 'Say the sounds, blend them together, then find the matching picture.';

  // Crystal stones
  var row = document.getElementById('crystalsRow'); row.innerHTML = '';
  lv.s.forEach(function(s, i) {
    var wrap = document.createElement('div'); wrap.className = 'crw';
    var btn = document.createElement('button');
    btn.className = 'cry-btn' + (s.ww?' wider': s.w?' wide':'');
    btn.id = 'cry'+i;
    btn.type = 'button';
    btn.disabled = true;

    var svgH = '<svg class="cry-svg" viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">';
    svgH += '<defs>';
    svgH += '<linearGradient id="gu'+i+'" x1="0%" y1="0%" x2="100%" y2="100%">';
    svgH += '<stop offset="0%" style="stop-color:#a0f0c0"/><stop offset="50%" style="stop-color:#30c880"/><stop offset="100%" style="stop-color:#108050"/>';
    svgH += '</linearGradient>';
    svgH += '<linearGradient id="gl'+i+'" x1="0%" y1="0%" x2="100%" y2="100%">';
    svgH += '<stop offset="0%" style="stop-color:#fffaaa"/><stop offset="40%" style="stop-color:#ffd700"/><stop offset="100%" style="stop-color:#c88000"/>';
    svgH += '</linearGradient></defs>';
    svgH += '<polygon id="cpoly'+i+'" points="30,4 56,22 50,58 30,66 10,58 4,22" fill="url(#gu'+i+')" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>';
    svgH += '<polygon points="30,10 48,24 30,18" fill="rgba(255,255,255,0.35)"/>';
    svgH += '<polygon points="30,18 48,24 44,44 30,38" fill="rgba(255,255,255,0.12)"/>';
    svgH += '<polygon points="30,18 12,24 16,44 30,38" fill="rgba(255,255,255,0.08)"/>';
    svgH += '</svg>';
    btn.innerHTML = svgH;

    var letter = document.createElement('div'); letter.className = 'cry-letter'; letter.textContent = s.g;
    btn.appendChild(letter);
    var ipa = document.createElement('div'); ipa.className = 'cry-ipa'; ipa.textContent = s.i;
    wrap.appendChild(btn); wrap.appendChild(ipa);
    row.appendChild(wrap);
  });

  // Image choices (no labels, shuffled)
  var ic = document.getElementById('imgChoices'); ic.innerHTML = '';
  shuffle(lv.c).forEach(function(ch) {
    var btn = document.createElement('button'); btn.className = 'img-btn';
    btn.style.borderColor = w.imgBorderColor;
    btn.dataset.ok = ch.ok ? '1' : '0';
    renderChoiceContent(btn, ch);
    var tick = document.createElement('span');
    tick.className = 'tick-ov';
    tick.textContent = '✅';
    btn.appendChild(tick);
    btn.onclick = (function(c,b){ return function(){ pickAnswer(c,b); }; })(ch, btn);
    ic.appendChild(btn);
  });
}

function tapCrystal(i, total) {
  var btn = document.getElementById('cry'+i);
  if (btn.classList.contains('lit')) return;
  btn.classList.add('lit');
  var poly = btn.querySelector('#cpoly'+i);
  if (poly) poly.setAttribute('fill','url(#gl'+i+')');
  S.litN++;
  if (S.litN >= total && !S.blendDone) {
    S.blendDone = true;
    setTimeout(function() {
      document.getElementById('blendPh').style.display = 'none';
      var bw = document.getElementById('blendWd');
      bw.style.display = 'block'; bw.textContent = 'Which picture? 👇';
      document.getElementById('cBubble').textContent = 'Find the right picture! 🌟';
    }, 280);
  }
}

function pickAnswer(choice, btn) {
  if (S.answerLocked) return;
  S.answerLocked = true;
  var w = WORLDS[S.cWorld];
  var correctBtn = Array.prototype.find.call(document.querySelectorAll('.img-btn'), function(choiceBtn) {
    return choiceBtn.dataset.ok === '1';
  });
  lockChoiceButtons();
  if (choice.ok) {
    btn.classList.add('ok'); btn.style.borderColor = '#22c55e';
    btn.style.boxShadow = '0 0 28px '+w.imgOkShadow;
    S.correct++;
    S.stars += 3;
    document.getElementById('cBubble').textContent = 'Yes, Leah! That was the right picture. 🌟';
    setTimeout(function() {
      showQuestionResult(true, correctBtn);
    }, CORRECT_RESULT_DELAY_MS);
  } else {
    btn.classList.add('no'); btn.style.borderColor='#ef4444';
    document.getElementById('cBubble').textContent = 'Nice try. Here is the right picture for this word. 💛';
    if (correctBtn) {
      correctBtn.classList.add('ok');
      correctBtn.style.borderColor = '#22c55e';
      correctBtn.style.boxShadow = '0 0 28px '+w.imgOkShadow;
    }
    setTimeout(function() {
      showQuestionResult(false, correctBtn);
    }, WRONG_RESULT_DELAY_MS);
  }
}

function nextQuestion() {
  S.qIdx++;
  if (S.qIdx < S.queue.length) {
    // more questions in this level
    buildQuestion(); go('sc2');
  } else {
    // level finished — check pass
    if (S.correct >= PASS_THRESHOLD) {
      levelPassed();
    } else {
      // retry same level target with a fresh slice from the same pool where possible
      var key = levelKey(S.cWorld, S.cLevel);
      S.levelAttempts[key] = (S.levelAttempts[key] || 0) + 1;
      S.queue = getLevelWords(S.cWorld, S.cLevel, S.levelAttempts[key]);
      S.qIdx = 0; S.correct = 0;
      buildQuestion(); go('sc2');
    }
  }
}

function levelPassed() {
  var currentKey = levelKey(S.cWorld, S.cLevel);
  S.levelAttempts[currentKey] = 0;
  if (S.progress[S.cWorld] <= S.cLevel) S.progress[S.cWorld] = S.cLevel+1;
  document.getElementById('mapStarBtn').textContent = '⭐ '+S.stars;

  if (S.cLevel === 6) {
    var wdata = WORLDS[S.cWorld];
    var nextW = S.cWorld+1;
    var wuBg = document.getElementById('wuBg');
    S.mastery[S.cWorld] = Math.min(requiredWinsForWorld(S.cWorld), S.mastery[S.cWorld] + 1);
    var worldMastered = S.mastery[S.cWorld] >= requiredWinsForWorld(S.cWorld);
    document.getElementById('wuTop').textContent = '🌟 World Complete! 🌟';
    wuBg.className = 'wu-bg ' + String(wdata.stageKey || '').toLowerCase();
    wuBg.style.background =
      nextW <= 3 ? WORLDS[S.cWorld].nextBg : 'radial-gradient(ellipse at 50% 30%,#0a1840,#050d30 50%,#020818)';
    setLeahImg('wuChar', wdata.stageKey);
    if (worldMastered) {
      document.getElementById('wuSubtitle').textContent = wdata.unlock.tag;
      document.getElementById('wuName').textContent = wdata.unlock.name;
      document.getElementById('wuDesc').textContent = wdata.unlock.desc;
    } else {
      document.getElementById('wuSubtitle').textContent = '🔁 Keep Blending!';
      document.getElementById('wuName').textContent = 'Secure Win '+S.mastery[S.cWorld]+' of '+requiredWinsForWorld(S.cWorld);
      document.getElementById('wuDesc').textContent = 'Leah needs one more secure boss-level success before the next world unlocks. Review is still active, so this is a practice win, not just a lucky pass.';
    }
    conf('wuConf');
    if (worldMastered && nextW <= 3) S.worldIdx = nextW;
    else S.worldIdx = S.cWorld;
    go('wu');
  } else {
    S.cLevel++;
    var nextKey = levelKey(S.cWorld, S.cLevel);
    if (S.levelAttempts[nextKey] == null) S.levelAttempts[nextKey] = 0;
    S.queue = getLevelWords(S.cWorld, S.cLevel, S.levelAttempts[nextKey]);
    S.qIdx = 0; S.correct = 0;
    buildQuestion(); go('sc2');
  }
}

// ╔══════════════════════════════════════════════════════════╗
// ║                      INIT                                ║
// ╚══════════════════════════════════════════════════════════╝
(function init(){
  // Snowflakes on intro
  var sn = document.getElementById('iSnow');
  ['❄','❅','❆','·'].forEach(function(ch){
    for(var i=0;i<5;i++){
      var el=document.createElement('span'); el.className='sf';
      var sz=10+Math.random()*16;
      el.style.cssText='left:'+Math.random()*100+'%;font-size:'+sz+'px;animation-duration:'+(5+Math.random()*8)+'s;animation-delay:'+Math.random()*8+'s;top:-30px';
      el.textContent=ch; sn.appendChild(el);
    }
  });
  // Crystal shards
  var cr=document.getElementById('iCrystals');
  for(var k=0;k<16;k++){
    var c=document.createElement('div'); c.className='cr-shard';
    var cw=16+Math.random()*26, ch2=32+Math.random()*75;
    var rb=200+Math.floor(Math.random()*55);
    c.style.cssText='left:'+Math.floor(k*6.4+Math.random()*3)+'%;border-left-width:'+cw/2+'px;border-right-width:'+cw/2+'px;border-bottom-width:'+ch2+'px;border-bottom-color:rgba(100,180,'+rb+',0.26)';
    cr.appendChild(c);
  }
})();
