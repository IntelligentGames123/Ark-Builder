// Playable games: Noah's Ark Builder, Loaves & Fishes Feast, Scripture Spelling Bee.
(function () {
  const $ = (id) => document.getElementById(id);
  const stage = $('game-stage');
  const body = $('stage-body');
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[rand(0, arr.length - 1)];
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  // Answer + three plausible distractors, shuffled.
  const numberOptions = (answer, near) => {
    const set = new Set([answer]);
    const cands = shuffle(near.filter((n) => n > 0 && n !== answer));
    for (const n of cands) { if (set.size < 4) set.add(n); }
    let d = 1;
    while (set.size < 4) { set.add(answer + d); d = d > 0 ? -d : -d + 1; }
    return shuffle([...set]).map(String);
  };
  const fmt = (n) => n.toLocaleString('en-GB');

  /* ---------- Noah's Ark Builder: geometry, perimeter & patterns ---------- */

  const WOOD = ['#b5793f', '#8a5a2b', '#d39a5c'];
  const RAINBOW = ['#e63946', '#f4892a', '#f4c724', '#3fa34d', '#3a86ff', '#4b3f9e', '#9b5de5'];

  // Side view drawn to scale: 1 SVG unit = 1 cubit (300 long x 30 high), 15 sections of 20.
  const SECTIONS = 15;
  function arkSvg(planks) {
    let cols = '';
    for (let i = 0; i < SECTIONS; i++) {
      const p = planks[i];
      const x = 10 + i * 20;
      if (p === undefined) {
        cols += `<rect x="${x}" y="24" width="20" height="30" fill="none" stroke="#c9b48e" stroke-dasharray="3 2" stroke-width=".8"/>`;
      } else {
        const fill = p ? WOOD[i % 3] : '#9aa3b5';
        cols += `<rect x="${x}" y="24" width="20" height="30" fill="${fill}"/>`;
        for (let y = 34; y < 54; y += 10) cols += `<line x1="${x}" y1="${y}" x2="${x + 20}" y2="${y}" stroke="#5c3a17" stroke-width=".6" opacity=".6"/>`;
        cols += `<line x1="${x}" y1="24" x2="${x}" y2="54" stroke="#5c3a17" stroke-width=".6" opacity=".5"/>`;
      }
    }
    const done = planks.length >= SECTIONS;
    return `<svg viewBox="0 0 320 76" role="img" aria-label="Side view of the ark, ${planks.length} of ${SECTIONS} sections built">
      <path d="M0 60 Q40 54 80 60 T160 60 T240 60 T320 60 V76 H0Z" fill="#3a86ff" opacity=".35"/>
      ${cols}
      <rect x="10" y="24" width="300" height="30" fill="none" stroke="#5c3a17" stroke-width="1.2"/>
      <path d="M6 24 L160 8 L314 24Z" fill="${done ? '#6b4423' : 'none'}" stroke="#5c3a17" stroke-width="1"/>
      <rect x="40" y="18" width="240" height="4" fill="${done ? '#ffe9a8' : 'none'}" stroke="#5c3a17" stroke-width=".6" opacity="${done ? 1 : .4}"/>
      <rect x="196" y="36" width="12" height="16" rx="1" fill="${done ? '#4a2c12' : 'none'}" stroke="#5c3a17" stroke-width=".6" opacity="${done ? 1 : .4}"/>
      <text x="160" y="72" text-anchor="middle" font-size="5" fill="#56607a" font-family="Nunito">300 cubits long &middot; 30 cubits high</text>
    </svg>`;
  }

  const rectFigure = (w, h, labelW, labelH, fill) => `<div class="q-figure"><svg viewBox="0 0 340 ${h + 50}">
    <rect x="20" y="15" width="${w}" height="${h}" fill="${fill}" stroke="#5c3a17" stroke-width="2"/>
    <text x="${20 + w / 2}" y="${h + 38}" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor" font-family="Nunito">${labelW}</text>
    <text x="${w + 28}" y="${15 + h / 2 + 5}" font-size="14" font-weight="700" fill="currentColor" font-family="Nunito">${labelH}</text>
  </svg></div>`;

  const swatch = (c) => `<span class="swatch" style="background:${c}"></span>`;

  // Level 1: materials & shapes.
  function arkLevel1() {
    const qs = [];

    qs.push({
      story: 'God said to Noah: &ldquo;Make thee an ark of gopher wood; rooms shalt thou make in the ark, and shalt pitch it within and without with pitch.&rdquo; (Genesis 6:14)',
      text: 'What wood did God tell Noah to use?',
      options: ['Gopher wood', 'Oak', 'Cedar', 'Bamboo'], answer: 'Gopher wood',
      explain: 'Gopher wood, sealed with pitch inside and out so no water could get in.'
    });

    qs.push({
      story: 'The ark was 300 cubits long and 30 cubits high (Genesis 6:15). Here it is from the side:',
      figure: rectFigure(300, 30, '300 cubits', '30', '#d39a5c'),
      text: 'What 2D shape is the side of the ark?',
      options: ['Rectangle', 'Square', 'Triangle', 'Circle'], answer: 'Rectangle',
      explain: 'It has 4 straight sides and 4 right angles, and opposite sides are equal. Not all 4 sides are equal, so it is not a square.'
    });

    qs.push({
      story: 'The ark had a length (300 cubits), a width (50 cubits) and a height (30 cubits). It was a big wooden box!',
      text: 'What 3D shape is the ark?',
      options: ['Cuboid', 'Cube', 'Cylinder', 'Pyramid'], answer: 'Cuboid',
      explain: 'A cuboid is a 3D shape made of 6 rectangular faces, like a shoebox. A cube has 6 square faces.'
    });

    const part = pick([['faces', 6, 'flat surfaces'], ['edges', 12, 'lines where two faces meet'], ['vertices (corners)', 8, 'corners']]);
    qs.push({
      story: 'Noah had to cover every outside surface of the ark with pitch.',
      text: `How many ${part[0]} does a cuboid have?`,
      options: numberOptions(part[1], [4, 5, 6, 8, 10, 12, 16]), answer: String(part[1]),
      explain: `A cuboid has 6 faces, 12 edges and 8 vertices. The ${part[0]} are the ${part[2]}.`
    });

    qs.push({
      story: 'Look at the side of the ark again.',
      figure: rectFigure(300, 30, '300 cubits', '30', '#d39a5c'),
      text: 'How many lines of symmetry does a rectangle have?',
      options: ['2', '1', '4', '0'], answer: '2',
      explain: 'One line goes across the middle from left to right and one goes from top to bottom. Fold along either one and the two halves match.'
    });

    return qs;
  }

  // Level 2: perimeter, area & patterns.
  function arkLevel2() {
    const qs = [];

    qs.push({
      story: 'Noah walked all the way round the top deck. The deck was 300 cubits long and 50 cubits wide.',
      figure: rectFigure(300, 50, '300 cubits', '50', '#e8c99a'),
      text: 'What is the perimeter of the deck?',
      options: numberOptions(700, [350, 650, 600, 750, 15000]).map((n) => n + ' cubits'), answer: '700 cubits',
      explain: 'Perimeter is the distance all the way round: 300 + 50 + 300 + 50 = 700 cubits.'
    });

    qs.push({
      story: 'Now Noah needs enough wood to cover the whole deck floor, 300 cubits by 50 cubits.',
      figure: rectFigure(300, 50, '300 cubits', '50', '#e8c99a'),
      text: 'What is the area of the deck?',
      options: ['15,000 sq cubits', '700 sq cubits', '1,500 sq cubits', '350 sq cubits'], answer: '15,000 sq cubits',
      explain: 'Area = length &times; width = 300 &times; 50 = 15,000 square cubits.'
    });

    qs.push({
      story: '&ldquo;With lower, second, and third stories shalt thou make it.&rdquo; (Genesis 6:16) The ark was 30 cubits high.',
      text: 'If all 3 decks are the same height, how high is each deck?',
      options: numberOptions(10, [3, 15, 27, 33, 90]).map((n) => n + ' cubits'), answer: '10 cubits',
      explain: '30 &divide; 3 = 10 cubits for each deck.'
    });

    qs.push(plankPatternQuestion());

    qs.push(pick([rainbowQuestion, animalsQuestion])());

    return qs;
  }

  // Level 3 (paid): volume, ratio, scale & tessellation.
  function arkLevel3() {
    const a = pick([10, 12, 15, 20]), b = pick([5, 8, 10, 12].filter((n) => n !== a));
    return [
      {
        story: 'The ark was 300 cubits long, 50 cubits wide and 30 cubits high. Volume tells us how much space is inside.',
        text: 'What is the volume of the ark?',
        options: ['450,000 cubic cubits', '15,000 cubic cubits', '45,000 cubic cubits', '380 cubic cubits'], answer: '450,000 cubic cubits',
        explain: 'Volume = length &times; width &times; height = 300 &times; 50 &times; 30 = 450,000 cubic cubits.'
      },
      {
        story: 'Shipbuilders compare a boat\'s length with its width. The ark was 300 cubits long and 50 cubits wide.',
        text: 'How many times longer than its width was the ark?',
        options: numberOptions(6, [3, 5, 10, 250, 60]), answer: '6',
        explain: '300 &divide; 50 = 6. A ratio of 6 to 1 makes a long, steady boat that is hard to tip over.'
      },
      {
        story: 'A cubit is about 45&nbsp;cm, the length from your elbow to your fingertip.',
        text: 'About how long was the ark in metres?',
        options: ['135 m', '13.5 m', '1,350 m', '300 m'], answer: '135 m',
        explain: `300 &times; 45&nbsp;cm = 13,500&nbsp;cm = 135&nbsp;m. That is longer than a football pitch!`
      },
      {
        story: `&ldquo;Rooms shalt thou make in the ark&rdquo; (Genesis 6:14). One room for the animals is ${a} cubits long and ${b} cubits wide.`,
        figure: rectFigure(Math.min(300, a * 12), b * 6, `${a} cubits`, String(b), '#e8c99a'),
        text: 'What is the perimeter of the room?',
        options: numberOptions(2 * (a + b), [a + b, a * b, 2 * a + b, 2 * (a + b) + 2]).map((n) => n + ' cubits'), answer: `${2 * (a + b)} cubits`,
        explain: `${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} cubits.`
      },
      {
        story: 'Planks fit together side by side with no gaps, making a beautiful repeating pattern called a tessellation.',
        text: 'Which shape tessellates with no gaps?',
        options: ['Rectangle', 'Circle', 'Oval', 'Star'], answer: 'Rectangle',
        explain: 'Rectangles fit together edge to edge with no gaps or overlaps. Circles and ovals always leave gaps. God\'s design is full of patterns like this, from honeycombs to snowflakes!'
      }
    ];
  }

  function plankPatternQuestion() {
    const units = [[0, 1], [0, 1, 1], [0, 0, 1], [0, 1, 2], [0, 1, 2, 1]];
    const unit = pick(units);
    const len = Math.max(7, unit.length * 3);
    const seq = Array.from({ length: len + 1 }, (_, i) => unit[i % unit.length]);
    const answer = seq[len];
    const shown = seq.slice(0, len).map((c) => `<span style="background:${WOOD[c]}"></span>`).join('') + '<span class="q">?</span>';
    return {
      story: 'Noah laid the planks in a repeating pattern to make the ark strong and beautiful.',
      figure: `<div class="pattern-row">${shown}</div>`,
      text: 'Which plank comes next?',
      options: shuffle([0, 1, 2]).map((c) => swatch(WOOD[c])), answer: swatch(WOOD[answer]),
      explain: `The pattern repeats every ${unit.length} planks. Spotting the part that repeats tells you what comes next.`
    };
  }

  function rainbowQuestion() {
    const gap = rand(2, 5);
    const shown = RAINBOW.map((c, i) => i === gap ? '<span class="q">?</span>' : `<span style="background:${c}"></span>`).join('');
    const opts = shuffle([gap, ...shuffle(RAINBOW.map((_, i) => i).filter((i) => i !== gap)).slice(0, 3)]);
    return {
      story: 'After the flood, God set a rainbow in the cloud as a sign of His promise (Genesis 9:13). Its colours always come in the same order.',
      figure: `<div class="pattern-row">${shown}</div>`,
      text: 'Which colour is missing?',
      options: opts.map((i) => swatch(RAINBOW[i])), answer: swatch(RAINBOW[gap]),
      explain: 'Red, orange, yellow, green, blue, indigo, violet. The rainbow\'s pattern never changes, just like God\'s promise.'
    };
  }

  function animalsQuestion() {
    const step = pick([2, 7]);
    const start = step * rand(1, 3);
    const seq = [0, 1, 2, 3].map((i) => start + i * step);
    const ans = start + 4 * step;
    return {
      story: step === 2
        ? 'The animals went into the ark two by two (Genesis 7:9).'
        : 'Of every clean animal, Noah took them in by sevens (Genesis 7:2).',
      figure: `<div class="q-visual">${seq.join(', ')}, ?</div>`,
      text: 'What number comes next in the pattern?',
      options: numberOptions(ans, [ans - step, ans + step, ans - 1, ans + 1, ans + 2]), answer: String(ans),
      explain: `Each number is ${step} more than the one before: ${seq[3]} + ${step} = ${ans}.`
    };
  }

  /* ---------- Loaves & Fishes Feast ---------- */

  function loavesQuestions() {
    const qs = [{
      story: 'A boy brought 5 barley loaves and 2 small fishes to Jesus (John 6:9).',
      figure: '<div class="q-visual">🍞🍞🍞🍞🍞 🐟🐟</div>',
      text: 'How many loaves and fishes altogether?',
      options: numberOptions(7, [6, 8, 10, 5]), answer: '7',
      explain: '5 + 2 = 7.'
    }];
    const makers = [
      () => {
        const b = rand(2, 6), n = rand(2, 10);
        return { story: `The disciples carried ${b} baskets, with ${n} loaves in each basket.`, figure: `<div class="q-visual">${'🧺'.repeat(b)}</div>`,
          text: `How many loaves is that?`, options: numberOptions(b * n, [b + n, b * n + b, b * n - n, (b + 1) * n]), answer: String(b * n),
          explain: `${b} &times; ${n} = ${b * n}.` };
      },
      () => {
        const g = rand(2, 5), s = rand(2, 9);
        return { story: `Jesus shared ${g * s} fish fairly between ${g} groups of people.`, figure: `<div class="q-visual">${'🐟'.repeat(Math.min(g * s, 24))}</div>`,
          text: `How many fish does each group get?`, options: numberOptions(s, [s + 1, s - 1, s + 2, g]), answer: String(s),
          explain: `${g * s} &divide; ${g} = ${s}.` };
      },
      () => {
        const a = rand(2, 9) * 10, b = rand(11, 49);
        return { story: `On one hillside sat ${a} men and ${b} women and children.`, figure: '<div class="q-visual">👨‍👩‍👧‍👦</div>',
          text: `How many people is that?`, options: numberOptions(a + b, [a + b + 10, a + b - 10, a + b + 1, a + b - 1]), answer: String(a + b),
          explain: `${a} + ${b} = ${a + b}.` };
      },
      () => {
        const per = pick([2, 3, 4, 6]);
        return { story: 'Afterwards there were 12 baskets of leftovers (John 6:13).', figure: `<div class="q-visual">${'🧺'.repeat(12)}</div>`,
          text: `If each disciple carried ${per} baskets, how many disciples carried them?`, options: numberOptions(12 / per, [per, 12 / per + 1, 12 / per - 1, 12 - per]),
          answer: String(12 / per), explain: `12 &divide; ${per} = ${12 / per}.` };
      },
      () => {
        const start = rand(20, 60), eaten = rand(5, start - 5);
        return { story: `A basket held ${start} pieces of bread. The people ate ${eaten} of them.`, figure: '<div class="q-visual">🧺🍞</div>',
          text: 'How many pieces are left?', options: numberOptions(start - eaten, [start - eaten + 10, start - eaten - 1, start + eaten, start - eaten + 1]),
          answer: String(start - eaten), explain: `${start} &minus; ${eaten} = ${start - eaten}.` };
      }
    ];
    for (let i = 0; i < 9; i++) qs.push(makers[i % makers.length]());
    return qs;
  }

  /* ---------- Scripture Spelling Bee ---------- */

  const WORDS = [
    ['NOAH', 'He built the ark'], ['RAINBOW', 'Sign of God\'s promise after the flood'], ['DAVID', 'Shepherd boy who became king'],
    ['GOLIATH', 'The giant David defeated'], ['MOSES', 'Led Israel out of Egypt'], ['MANNA', 'Bread from heaven in the desert'],
    ['JONAH', 'Swallowed by a great fish'], ['SHEPHERD', 'Someone who looks after sheep'], ['PSALM', 'A song or poem of praise'],
    ['BETHLEHEM', 'Town where Jesus was born'], ['PARABLE', 'A story Jesus told to teach a lesson'], ['ANGEL', 'A messenger from God'],
    ['GARDEN', 'Eden was one'], ['DANIEL', 'Kept safe in the lions\' den'], ['RUTH', 'Loyal to Naomi: "Where you go, I will go"'],
    ['PRAYER', 'Talking with God'], ['ESTHER', 'A brave queen who saved her people'], ['JOSEPH', 'Had a coat of many colours'],
    ['MIRACLE', 'A wonderful act of God\'s power'], ['DISCIPLE', 'A follower of Jesus'], ['ABRAHAM', 'Father of many nations'],
    ['TEMPLE', 'Solomon built one in Jerusalem'], ['KINDNESS', 'A fruit of the Spirit']
  ];

  function spellingQuestions() {
    return shuffle(WORDS).slice(0, 10).map(([word, clue]) => {
      const nBlanks = word.length <= 4 ? 1 : word.length <= 6 ? 2 : 3;
      const blanks = shuffle(word.split('').map((_, i) => i)).slice(0, nBlanks).sort((a, b) => a - b);
      return { type: 'spell', word, clue, blanks };
    });
  }

  /* ---------- Game definitions ---------- */

  const GAMES = {
    ark: {
      title: "Noah's Ark Builder",
      intro: `<p class="q-story">God gave Noah exact plans for the ark: <b>300 cubits long, 50 cubits wide and 30 cubits high</b>, made of gopher wood, sealed with pitch, with rooms, three decks, a window and a door (Genesis 6:14&ndash;16).</p>
        <p class="q-story">A cubit is the length from your elbow to your fingertip, about 45&nbsp;cm. Answer each question to add a section. Finish all 3 levels to complete the ark!</p>`,
      build: true,
      levels: [
        { name: 'Materials & Shapes', make: arkLevel1 },
        { name: 'Measuring the Ark', make: arkLevel2 },
        { name: 'Master Builder', make: arkLevel3, paid: true }
      ],
      verse: '&ldquo;Thus did Noah; according to all that God commanded him, so did he.&rdquo; (Genesis 6:22)'
    },
    loaves: {
      title: 'Loaves & Fishes Feast',
      intro: '<p class="q-story">A huge crowd followed Jesus. A boy shared his 5 loaves and 2 fishes, and Jesus fed five thousand people! Help the disciples count and share the food.</p>',
      make: loavesQuestions,
      verse: '&ldquo;Gather up the fragments that remain, that nothing be lost.&rdquo; (John 6:12)'
    },
    spelling: {
      title: 'Scripture Spelling Bee',
      intro: '<p class="q-story">Read the clue, then tap the letters to fill in the missing spaces. Spell 10 words from the Bible!</p>',
      make: spellingQuestions,
      verse: '&ldquo;Thy word is a lamp unto my feet, and a light unto my path.&rdquo; (Psalm 119:105)'
    }
  };

  /* ---------- Engine ---------- */

  /* ---------- Payments: unlock & donate ---------- */

  const CONFIG = window.IG4U_CONFIG || {};
  const UNLOCK_KEY = 'ig4u-unlocked';

  // The payment page redirects back with ?unlocked=1 after a successful payment.
  try {
    if (new URLSearchParams(location.search).get('unlocked') === '1') localStorage.setItem(UNLOCK_KEY, '1');
  } catch (e) { /* storage unavailable */ }

  function isUnlocked() {
    try { return localStorage.getItem(UNLOCK_KEY) === '1'; } catch (e) { return false; }
  }

  function payButton(link, label, cls) {
    return link
      ? `<a class="btn ${cls}" href="${link}" target="_blank" rel="noopener">${label}</a>`
      : `<span class="btn ${cls} btn-disabled" aria-disabled="true">${label} (coming soon)</span>`;
  }

  /* ---------- Engine ---------- */

  let game, levels, level, questions, idx, score, total, planks;

  function setProgress() {
    const named = levels.length > 1;
    $('stage-progress').textContent = idx < questions.length
      ? `${named ? `Level ${level + 1}: ${levels[level].name} · ` : ''}Question ${idx + 1} of ${questions.length}`
      : named ? `Level ${level + 1} complete!` : 'Finished!';
    $('stage-score').textContent = score;
    const done = levels.slice(0, level).length * questions.length + idx;
    $('progress-fill').style.width = (done / (levels.length * questions.length)) * 100 + '%';
  }

  function open(key) {
    game = GAMES[key];
    document.querySelectorAll('.choose-card').forEach((c) => c.classList.toggle('active', c.dataset.game === key));
    stage.hidden = false;
    $('stage-title').textContent = game.title;
    levels = game.levels || [{ make: game.make }];
    level = 0; questions = levels[0].make(); idx = 0; score = 0; total = 0; planks = [];
    setProgress();
    body.innerHTML = `${header()}${game.intro}
      ${levels.length > 1 ? `<p class="q-story"><b>${levels.length} levels:</b> ${levels.map((l, i) => `${i + 1}. ${l.name}${l.paid && !isUnlocked() ? ' 🔒' : ''}`).join(' &middot; ')}</p>` : ''}
      <button class="btn" id="start-btn">Start</button>`;
    $('start-btn').addEventListener('click', showQuestion);
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function header() {
    return game.build ? `<div class="ark-build">${arkSvg(planks)}</div>` : '';
  }

  function startLevel(n) {
    level = n; questions = levels[n].make(); idx = 0;
    showQuestion();
  }

  function levelComplete() {
    setProgress();
    const next = levels[level + 1];
    const locked = next.paid && !isUnlocked();
    body.innerHTML = `${header()}
      <div class="result-stars">🎉</div>
      <p class="q-text">Level ${level + 1} complete!</p>
      <p>You have ${score} correct answers so far. Next up: <b>Level ${level + 2}: ${next.name}</b>${locked ? ' 🔒' : ''}</p>
      ${locked ? `<div class="paywall">
          <h3>Unlock the full game</h3>
          <p>You've finished the free levels! Unlock <b>${next.name}</b> and every level to come: volume, ratio, scale and tessellation patterns.</p>
          <div class="result-actions">
            ${payButton(CONFIG.unlockLink, `Unlock for ${CONFIG.unlockPrice || ''}`.trim(), '')}
            ${payButton(CONFIG.donateLink, 'Donate', 'btn-ghost')}
          </div>
          <p class="pay-note">Secure payment by Paystack: card, bank transfer or USSD. Payments and donations go to Intelligent Games 4U Limited. Already paid? <button class="hint-btn" id="recheck">Check again</button></p>
        </div>`
        : `<button class="btn" id="next-level">Start Level ${level + 2}</button>`}`;
    if (locked) $('recheck').addEventListener('click', () => { if (isUnlocked()) levelComplete(); });
    else $('next-level').addEventListener('click', () => startLevel(level + 1));
  }

  function showQuestion() {
    if (idx >= questions.length) return level + 1 < levels.length ? levelComplete() : showResult();
    setProgress();
    const q = questions[idx];
    if (q.type === 'spell') return showSpelling(q);
    q.options = shuffle(q.options);
    body.innerHTML = `${header()}<p class="q-story">${q.story}</p>${q.figure || ''}
      <p class="q-text">${q.text}</p>
      <div class="answers">${q.options.map((o, i) => `<button class="answer" data-i="${i}">${o}</button>`).join('')}</div>
      <p class="feedback" id="feedback"></p>`;
    body.querySelectorAll('.answer').forEach((btn) => btn.addEventListener('click', () => {
      const chosen = q.options[+btn.dataset.i];
      const right = chosen === q.answer;
      body.querySelectorAll('.answer').forEach((b) => {
        b.disabled = true;
        if (q.options[+b.dataset.i] === q.answer) b.classList.add('correct');
      });
      if (!right) btn.classList.add('wrong');
      finish(right, q.explain);
    }));
  }

  function showSpelling(q) {
    const filled = new Set();
    let mistakes = 0;
    const letters = q.blanks.map((i) => q.word[i]);
    const pool = 'ABCDEFGHIJKLMNOPRSTUWY'.split('').filter((l) => !letters.includes(l));
    const tiles = shuffle([...letters, ...shuffle(pool).slice(0, 6 - letters.length)]);

    const render = () => {
      body.querySelector('.word-slots').innerHTML = q.word.split('').map((ch, i) => {
        const blank = q.blanks.includes(i);
        const show = !blank || filled.has(i);
        return `<span class="slot ${blank ? (show ? 'filled' : 'blank') : ''}">${show ? ch : '_'}</span>`;
      }).join('');
    };

    body.innerHTML = `<p class="q-story">Clue</p><p class="q-text">${q.clue}</p>
      <div class="word-slots"></div>
      <div class="letters">${tiles.map((l, i) => `<button class="letter" data-i="${i}">${l}</button>`).join('')}</div>
      <button class="hint-btn" id="hint">Need a hint?</button>
      <p class="feedback" id="feedback"></p>`;
    render();

    const nextBlank = () => q.blanks.find((i) => !filled.has(i));
    const place = (pos) => {
      filled.add(pos); render();
      if (nextBlank() === undefined) {
        body.querySelectorAll('.letter').forEach((b) => { b.disabled = true; });
        $('hint').remove();
        finish(mistakes === 0, mistakes === 0 ? `${q.word}, spelled perfectly!` : `The word is ${q.word}. Well done for finishing it!`);
      }
    };

    body.querySelectorAll('.letter').forEach((btn) => btn.addEventListener('click', () => {
      const pos = nextBlank();
      if (btn.textContent === q.word[pos]) {
        btn.disabled = true;
        $('feedback').textContent = ''; $('feedback').className = 'feedback';
        place(pos);
      } else {
        mistakes++;
        $('feedback').textContent = 'Not quite. Try another letter!';
        $('feedback').className = 'feedback bad';
      }
    }));
    $('hint').addEventListener('click', () => {
      mistakes++;
      const pos = nextBlank();
      const tile = [...body.querySelectorAll('.letter')].find((b) => !b.disabled && b.textContent === q.word[pos]);
      if (tile) tile.disabled = true;
      place(pos);
    });
  }

  function finish(right, explain) {
    total++;
    if (right) score++;
    if (game.build) {
      planks.push(right);
      const holder = body.querySelector('.ark-build');
      if (holder) holder.innerHTML = arkSvg(planks);
    }
    $('stage-score').textContent = score;
    const fb = $('feedback');
    fb.className = 'feedback ' + (right ? 'good' : 'bad');
    fb.innerHTML = (right ? pick(['Well done! ', 'Excellent! ', 'Brilliant! ', 'Great job! ']) : 'Good try! ') +
      `<span style="font-weight:600;color:var(--ink)">${explain}</span>`;
    const next = document.createElement('button');
    next.className = 'btn';
    next.style.marginTop = '16px';
    next.textContent = idx + 1 < questions.length ? 'Next' : level + 1 < levels.length ? 'Finish level' : 'See my result';
    next.addEventListener('click', () => { idx++; showQuestion(); });
    fb.after(next);
    next.focus({ preventScroll: true });
  }

  function showResult() {
    setProgress();
    const n = total;
    const stars = score >= n ? 3 : score >= n * 0.7 ? 2 : score >= n * 0.4 ? 1 : 0;
    const msg = game.build
      ? (score === n ? 'The ark is complete, built exactly to God\'s plan!' : `The ark is built! ${score} planks are perfect and ${n - score} were patched. Play again to make it perfect.`)
      : (stars === 3 ? 'Perfect score!' : stars === 2 ? 'Wonderful work!' : 'Good effort, keep practising!');
    body.innerHTML = `${header()}
      <div class="result-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p class="q-text">You scored ${score} out of ${n}</p>
      <p>${msg}</p>
      <p class="result-verse">${game.verse}</p>
      <div class="result-actions">
        <button class="btn" id="again">Play again</button>
        <a class="btn btn-ghost" href="#play" id="other">Try another game</a>
      </div>
      <p class="pay-note">Enjoying our games? ${CONFIG.donateLink ? `<a href="${CONFIG.donateLink}" target="_blank" rel="noopener">Make a donation</a>` : '<a href="#donate">Support our work</a>'} to help us make more.</p>`;
    $('again').addEventListener('click', () => open(Object.keys(GAMES).find((k) => GAMES[k] === game)));
    $('other').addEventListener('click', () => { stage.hidden = true; });
  }

  document.querySelectorAll('[data-game]').forEach((el) => el.addEventListener('click', () => open(el.dataset.game)));
})();
