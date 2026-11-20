// Kage Whistle — Core Game Engine, Shadow Casting & Web Audio Whistle Classifier

(() => {
  // --- DOM Elements ---
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const canvasContainer = document.getElementById('canvasContainer');

  const inGameHud = document.getElementById('inGameHud');
  const hudLevel = document.getElementById('hudLevel');
  const hudEnergyBar = document.getElementById('hudEnergyBar');
  const hudEnergyText = document.getElementById('hudEnergyText');
  const hudScore = document.getElementById('hudScore');
  const hudOrbsProgress = document.getElementById('hudOrbsProgress');
  const hudTimer = document.getElementById('hudTimer');
  const btnToggleMicMobile = document.getElementById('btnToggleMicMobile');
  const micDotMobile = document.getElementById('micDotMobile');
  const micLabelMobile = document.getElementById('micLabelMobile');
  const btnPauseMobile = document.getElementById('btnPauseMobile');
  const shadowDot = document.getElementById('shadowDot');
  const shadowStatusText = document.getElementById('shadowStatusText');
  const whistleLivePill = document.getElementById('whistleLivePill');
  const whistleLiveText = document.getElementById('whistleLiveText');
  const levelNameFooter = document.getElementById('levelNameFooter');

  const homeScreen = document.getElementById('homeScreen');
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingBar = document.getElementById('loadingBar');
  const loadingStatusText = document.getElementById('loadingStatusText');

  const levelSelectScreen = document.getElementById('levelSelectScreen');
  const levelCardsGrid = document.getElementById('levelCardsGrid');
  const totalStarsReadout = document.getElementById('totalStarsReadout');
  const btnLevelSelectHelp = document.getElementById('btnLevelSelectHelp');
  const btnBackHomeFromSelect = document.getElementById('btnBackHomeFromSelect');
  const btnAskReset = document.getElementById('btnAskReset');
  const resetConfirmBox = document.getElementById('resetConfirmBox');
  const btnConfirmReset = document.getElementById('btnConfirmReset');
  const btnCancelReset = document.getElementById('btnCancelReset');

  const pauseOverlay = document.getElementById('pauseOverlay');
  const pauseLevelTitle = document.getElementById('pauseLevelTitle');
  const btnResumeGame = document.getElementById('btnResumeGame');
  const btnPauseRestart = document.getElementById('btnPauseRestart');
  const btnPauseLevelSelect = document.getElementById('btnPauseLevelSelect');
  const btnPauseHome = document.getElementById('btnPauseHome');

  const gameOverlay = document.getElementById('gameOverlay');
  const overlayBadge = document.getElementById('overlayBadge');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const overlayLegend = document.getElementById('overlayLegend');
  const starResultBlock = document.getElementById('starResultBlock');
  const starIconsRow = document.getElementById('starIconsRow');
  const starCriteriaList = document.getElementById('starCriteriaList');
  const btnStartMic = document.getElementById('btnStartMic');
  const btnStartStage = document.getElementById('btnStartStage');
  const whistleTestBox = document.getElementById('whistleTestBox');
  const whistleTestStatus = document.getElementById('whistleTestStatus');
  const whistleTestBar = document.getElementById('whistleTestBar');
  const btnTestMicInline = document.getElementById('btnTestMicInline');

  const btnToggleMic = document.getElementById('btnToggleMic');
  const micDot = document.getElementById('micDot');
  const micLabel = document.getElementById('micLabel');
  const btnMute = document.getElementById('btnMute');
  const iconSfxOn = document.getElementById('iconSfxOn');
  const iconSfxOff = document.getElementById('iconSfxOff');
  const btnPause = document.getElementById('btnPause');
  const btnRestart = document.getElementById('btnRestart');
  const btnHelp = document.getElementById('btnHelp');
  const helpModal = document.getElementById('helpModal');
  const btnCloseHelp = document.getElementById('btnCloseHelp');
  const btnOkHelp = document.getElementById('btnOkHelp');

  const toastBanner = document.getElementById('toastBanner');
  const toastText = document.getElementById('toastText');
  const btnCloseToast = document.getElementById('btnCloseToast');

  const ctrlFaceLeft = document.getElementById('ctrlFaceLeft');
  const ctrlFaceRight = document.getElementById('ctrlFaceRight');
  const mobileTouchControls = document.getElementById('mobileTouchControls');
  const desktopFacingHint = document.getElementById('desktopFacingHint');

  // Wide Full-Viewport Logical Coordinates + Uniform Aspect-Ratio Camera
  const WORLD_W = 1440;
  const WORLD_H = 720;
  const GROUND_Y = 648;
  const cam = {
    scale: 1,
    x: 0,
    offsetY: 0,
    viewW: WORLD_W,
    viewH: WORLD_H
  };

  function detectDeviceUI() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches ||
      ('ontouchstart' in window) ||
      window.innerWidth < 768;
    mobileTouchControls.classList.toggle('hidden', !isTouch);
    desktopFacingHint.classList.toggle('hidden', isTouch);
    return isTouch;
  }

  // --- 3 Atmospheric Forest Levels ---
  const LEVELS = [
    {
      id: 0,
      shortName: 'Rimba Pagi',
      name: 'Level 1 • Rimba Pagi',
      parTime: 30,
      skyTop: '#081b2b',
      skyMid: '#15374a',
      skyBot: '#244b48',
      mistColor: 'rgba(186, 230, 253, 0.08)',
      sunColor: '#fef08a',
      sunBaseAngle: -0.18,
      sunSwingAmp: 0.07,
      sunSwingSpeed: 0.22,
      start: { x: 105, y: 616 },
      portal: { x: 1345, y: 584, r: 34 },
      trees: [
        { x: 110, canopyY: 365, rx: 92, ry: 64, trunkW: 24, seed: 1 },
        { x: 435, canopyY: 335, rx: 88, ry: 60, trunkW: 22, seed: 2 },
        { x: 780, canopyY: 350, rx: 90, ry: 62, trunkW: 24, seed: 3 },
        { x: 1110, canopyY: 325, rx: 84, ry: 58, trunkW: 22, seed: 4 },
        { x: 1340, canopyY: 345, rx: 92, ry: 64, trunkW: 24, seed: 5 }
      ],
      clouds: [
        { x: 180, y: 118, rx: 104, ry: 30, speed: 40 },
        { x: 700, y: 146, rx: 116, ry: 32, speed: 34 },
        { x: 1200, y: 110, rx: 98, ry: 28, speed: 44 }
      ],
      rocks: [
        { x: 585, y: GROUND_Y - 58, w: 64, h: 58 },
        { x: 935, y: GROUND_Y - 66, w: 68, h: 66 }
      ],
      orbs: [
        { x: 270, y: 530 },
        { x: 617, y: 488 },
        { x: 969, y: 482 },
        { x: 1225, y: 530 }
      ]
    },
    {
      id: 1,
      shortName: 'Padang Cahaya',
      name: 'Level 2 • Padang Cahaya',
      parTime: 36,
      skyTop: '#101d35',
      skyMid: '#243a54',
      skyBot: '#46453c',
      mistColor: 'rgba(253, 230, 138, 0.08)',
      sunColor: '#fde047',
      sunBaseAngle: 0.13,
      sunSwingAmp: 0.13,
      sunSwingSpeed: 0.28,
      start: { x: 98, y: 616 },
      portal: { x: 1348, y: 485, r: 34 },
      trees: [
        { x: 102, canopyY: 370, rx: 84, ry: 58, trunkW: 22, seed: 6 },
        { x: 515, canopyY: 325, rx: 80, ry: 56, trunkW: 20, seed: 7 },
        { x: 945, canopyY: 340, rx: 80, ry: 56, trunkW: 20, seed: 8 },
        { x: 1335, canopyY: 315, rx: 82, ry: 58, trunkW: 22, seed: 9 }
      ],
      clouds: [
        { x: 150, y: 112, rx: 112, ry: 32, speed: 52 },
        { x: 590, y: 142, rx: 122, ry: 34, speed: 45 },
        { x: 1030, y: 120, rx: 108, ry: 30, speed: 56 }
      ],
      rocks: [
        { x: 290, y: GROUND_Y - 76, w: 68, h: 76 },
        { x: 715, y: GROUND_Y - 88, w: 72, h: 88 },
        { x: 1135, y: GROUND_Y - 82, w: 70, h: 82 }
      ],
      orbs: [
        { x: 324, y: 470 },
        { x: 515, y: 520 },
        { x: 751, y: 452 },
        { x: 945, y: 512 },
        { x: 1170, y: 456 }
      ]
    },
    {
      id: 2,
      shortName: 'Rimba Senja',
      name: 'Level 3 • Rimba Senja',
      parTime: 44,
      skyTop: '#16122d',
      skyMid: '#3a223e',
      skyBot: '#5c3430',
      mistColor: 'rgba(251, 146, 60, 0.09)',
      sunColor: '#fb923c',
      sunBaseAngle: -0.22,
      sunSwingAmp: 0.20,
      sunSwingSpeed: 0.36,
      start: { x: 94, y: 616 },
      portal: { x: 1352, y: 390, r: 34 },
      trees: [
        { x: 98, canopyY: 380, rx: 78, ry: 56, trunkW: 20, seed: 10 },
        { x: 472, canopyY: 355, rx: 72, ry: 52, trunkW: 18, seed: 11 },
        { x: 892, canopyY: 335, rx: 74, ry: 54, trunkW: 18, seed: 12 },
        { x: 1265, canopyY: 320, rx: 72, ry: 52, trunkW: 18, seed: 13 }
      ],
      clouds: [
        { x: 120, y: 108, rx: 108, ry: 30, speed: 64 },
        { x: 560, y: 138, rx: 118, ry: 34, speed: 54 },
        { x: 1000, y: 116, rx: 112, ry: 32, speed: 62 }
      ],
      rocks: [
        { x: 265, y: GROUND_Y - 82, w: 66, h: 82 },
        { x: 660, y: GROUND_Y - 102, w: 72, h: 102 },
        { x: 1065, y: GROUND_Y - 96, w: 72, h: 96 }
      ],
      orbs: [
        { x: 298, y: 465 },
        { x: 472, y: 530 },
        { x: 696, y: 440 },
        { x: 892, y: 495 },
        { x: 1101, y: 430 },
        { x: 1265, y: 445 }
      ]
    }
  ];

  // --- Persistent Progress Storage (localStorage with safe try/catch) ---
  const SAVE_KEY = 'kage_whistle_save_v1';

  function createDefaultProgress() {
    return {
      hasSeenTutorial: false,
      levels: LEVELS.map((_, i) => ({
        unlocked: i === 0,
        stars: 0,
        bestScore: 0,
        bestTime: null
      }))
    };
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return createDefaultProgress();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.levels) || parsed.levels.length !== LEVELS.length) {
        return createDefaultProgress();
      }
      parsed.levels[0].unlocked = true;
      return parsed;
    } catch (err) {
      return createDefaultProgress();
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
    } catch (err) {
      // Storage blocked in private/sandbox mode; keep in-memory progress smoothly
    }
  }

  let progress = loadProgress();

  // Ambient fireflies & swaying grass blades
  const FIREFLIES = Array.from({ length: 28 }, (_, i) => ({
    x: (i * 59) % WORLD_W,
    y: 280 + ((i * 47) % 340),
    phase: i * 0.65,
    speed: 12 + (i % 5) * 3.5
  }));

  const GRASS_BLADES = Array.from({ length: 110 }, (_, i) => ({
    x: (i / 110) * WORLD_W + (i % 3) * 4,
    h: 10 + (i % 5) * 4,
    phase: i * 0.35
  }));

  // --- Game State ---
  const state = {
    mode: 'home', // 'home' | 'loading' | 'level_select' | 'tutorial' | 'playing' | 'paused' | 'level_clear' | 'gameover' | 'victory'
    pendingLevelIdx: 0,
    levelIdx: 0,
    levelScore: 0,
    levelElapsed: 0,
    energy: 100,
    shadowSource: 'pohon',
    sunAngle: -0.18,
    player: { x: 105, y: 616, vx: 0, vy: 0, r: 19, facing: 1, trail: [] },
    trees: [],
    clouds: [],
    rocks: [],
    orbs: [],
    portal: { x: 1345, y: 584, r: 34 },
    particles: [],
    sfxMuted: false,
    lastTime: 0,
    rafId: null,
    time: 0
  };

  // --- Automatic Background Adaptive Whistle Engine ---
  const audio = {
    ctx: null,
    sfxCtx: null,
    micActive: false,
    stream: null,
    analyser: null,
    timeBuffer: null,
    freqBuffer: null,
    ambientRms: 0.012,
    noiseFloor: 0.022,
    minPurity: 0.38,
    pitchHz: 0,
    smoothPitch: 0,
    validFrames: 0,
    missFrames: 0,
    lastCandidateHz: 0,
    activeZone: 'none'
  };

  function formatTime(sec) {
    if (sec === null || sec === undefined || Number.isNaN(sec)) return '--:--';
    const total = Math.max(0, Math.floor(sec));
    const m = String(Math.floor(total / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    return m + ':' + s;
  }

  // --- Synthesized SFX ---
  function ensureSfxCtx() {
    if (!audio.sfxCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audio.sfxCtx = new AudioCtx();
    }
    if (audio.sfxCtx && audio.sfxCtx.state === 'suspended') {
      audio.sfxCtx.resume().catch(() => {});
    }
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.08, slideTo = null) {
    if (state.sfxMuted) return;
    ensureSfxCtx();
    if (!audio.sfxCtx) return;
    const now = audio.sfxCtx.currentTime;
    const osc = audio.sfxCtx.createOscillator();
    const gain = audio.sfxCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(audio.sfxCtx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function sfxEnter() { playTone(440, 0.2, 'sine', 0.06, 659.25); }
  function sfxOrb() {
    playTone(587.33, 0.14, 'triangle', 0.08, 880);
    setTimeout(() => playTone(880, 0.16, 'sine', 0.06, 1174.66), 70);
  }
  function sfxWin() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.28, 'triangle', 0.07), i * 85);
    });
  }
  function sfxFail() { playTone(220, 0.35, 'sawtooth', 0.06, 110); }

  // --- Adaptive Procedural Forest Ambience (Web Audio API) ---
  const ambience = {
    initialized: false,
    masterGain: null,
    windGain: null,
    padGain: null,
    sunGain: null,
    sunFilter: null
  };

  function initAmbience() {
    if (ambience.initialized) return;
    ensureSfxCtx();
    const actx = audio.sfxCtx;
    if (!actx) return;

    // Master ambience bus
    const master = actx.createGain();
    master.gain.value = 0.0001;
    master.connect(actx.destination);

    // Layer 1: Gentle Forest Wind (Filtered Noise + Slow LFO)
    const bufLen = actx.sampleRate * 3;
    const noiseBuf = actx.createBuffer(1, bufLen, actx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufLen; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.025 * white) / 1.025;
      lastOut = data[i];
      data[i] *= 2.8;
    }
    const windSrc = actx.createBufferSource();
    windSrc.buffer = noiseBuf;
    windSrc.loop = true;

    const windFilter = actx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 440;
    windFilter.Q.value = 1.4;

    const windLfo = actx.createOscillator();
    const windLfoGain = actx.createGain();
    windLfo.frequency.value = 0.14;
    windLfoGain.gain.value = 140;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);

    const windGain = actx.createGain();
    windGain.gain.value = 0.055;
    windSrc.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(master);

    // Layer 2: Serene Shadow Forest Pad (Soft Fifth Drone G3 + D4)
    const padGain = actx.createGain();
    padGain.gain.value = 0.018;
    const padFilter = actx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 620;
    padFilter.connect(padGain);
    padGain.connect(master);

    const padOsc1 = actx.createOscillator();
    const padOsc2 = actx.createOscillator();
    padOsc1.type = 'sine';
    padOsc2.type = 'sine';
    padOsc1.frequency.value = 196.0;
    padOsc2.frequency.value = 293.66;
    padOsc1.connect(padFilter);
    padOsc2.connect(padFilter);

    // Layer 3: Warm Tense Sunlight Hum (Crossfades in when exposed to sun)
    const sunFilter = actx.createBiquadFilter();
    sunFilter.type = 'lowpass';
    sunFilter.frequency.value = 340;
    const sunGain = actx.createGain();
    sunGain.gain.value = 0.0001;
    sunFilter.connect(sunGain);
    sunGain.connect(master);

    const sunOsc1 = actx.createOscillator();
    const sunOsc2 = actx.createOscillator();
    sunOsc1.type = 'triangle';
    sunOsc2.type = 'sawtooth';
    sunOsc1.frequency.value = 146.83;
    sunOsc2.frequency.value = 221.5; // slight tense detune
    sunOsc1.connect(sunFilter);
    sunOsc2.connect(sunFilter);

    windSrc.start();
    windLfo.start();
    padOsc1.start();
    padOsc2.start();
    sunOsc1.start();
    sunOsc2.start();

    ambience.masterGain = master;
    ambience.windGain = windGain;
    ambience.padGain = padGain;
    ambience.sunGain = sunGain;
    ambience.sunFilter = sunFilter;
    ambience.initialized = true;
  }

  function updateAmbience() {
    if (!ambience.initialized || !audio.sfxCtx) return;
    const now = audio.sfxCtx.currentTime;
    const shouldPlay = !state.sfxMuted && state.mode === 'playing';
    const targetMaster = shouldPlay ? 1.0 : 0.0001;
    ambience.masterGain.gain.setTargetAtTime(targetMaster, now, 0.2);

    if (!shouldPlay) return;
    const exposed = state.shadowSource === 'none';
    const critical = state.energy < 30;

    // Crossfade calm shadow wind/pad vs tense sunlight hum
    ambience.windGain.gain.setTargetAtTime(exposed ? 0.020 : 0.060, now, 0.25);
    ambience.padGain.gain.setTargetAtTime(exposed ? 0.005 : 0.020, now, 0.25);
    ambience.sunGain.gain.setTargetAtTime(exposed ? (critical ? 0.052 : 0.032) : 0.0001, now, 0.2);
    ambience.sunFilter.frequency.setTargetAtTime(critical ? 760 : (exposed ? 480 : 280), now, 0.22);
  }

  // --- Toast Helper ---
  function showToast(msg) {
    toastText.textContent = msg;
    toastBanner.classList.remove('hidden');
  }
  function hideToast() {
    toastBanner.classList.add('hidden');
  }

  // --- Facing Helper ---
  function setFacing(dir) {
    state.player.facing = dir >= 0 ? 1 : -1;
    ctrlFaceLeft.classList.toggle('facing-pill-active', state.player.facing === -1);
    ctrlFaceRight.classList.toggle('facing-pill-active', state.player.facing === 1);
  }

  // --- Level Select Renderer ---
  function renderLevelSelect() {
    let totalStars = 0;
    progress.levels.forEach(lv => { totalStars += lv.stars; });
    totalStarsReadout.textContent = `${totalStars} / ${LEVELS.length * 3}`;

    levelCardsGrid.innerHTML = '';
    LEVELS.forEach((tpl, idx) => {
      const data = progress.levels[idx];
      const unlocked = data.unlocked;
      const card = document.createElement('button');
      card.type = 'button';
      card.disabled = !unlocked;
      card.className = unlocked
        ? 'text-left rounded-2xl p-4 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-emerald-400/50 transition flex flex-col justify-between gap-3 cursor-pointer'
        : 'text-left rounded-2xl p-4 border border-white/10 bg-slate-900/50 opacity-55 cursor-not-allowed flex flex-col justify-between gap-3';

      const starsHtml = [1, 2, 3].map(n =>
        `<span class="${n <= data.stars ? 'star-lit' : 'star-dim'}">&#9733;</span>`
      ).join('');

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[11px] font-semibold uppercase tracking-wider ${unlocked ? 'text-emerald-300' : 'text-slate-500'}">Level ${idx + 1}</span>
            <span class="text-sm tracking-widest">${unlocked ? starsHtml : '&#128274;'}</span>
          </div>
          <div class="text-sm font-bold text-white mb-1">${tpl.shortName}</div>
          <div class="text-[11px] text-slate-400">Target: &le; ${tpl.parTime} dtk • ${tpl.orbs.length} Gema</div>
        </div>
        <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-300">
          <span>Skor: ${data.bestScore}</span>
          <span>${formatTime(data.bestTime)}</span>
        </div>
      `;

      if (unlocked) {
        card.addEventListener('click', () => {
          ensureSfxCtx();
          sfxEnter();
          levelSelectScreen.classList.add('hidden');
          inGameHud.classList.remove('hidden');
          state.pendingLevelIdx = idx;
          loadLevel(idx);
          if (!progress.hasSeenTutorial) {
            showOverlay('tutorial');
          } else {
            state.mode = 'playing';
          }
        });
      }
      levelCardsGrid.appendChild(card);
    });
  }

  function openLevelSelect() {
    hideOverlay();
    pauseOverlay.classList.add('hidden');
    homeScreen.classList.add('hidden');
    loadingScreen.classList.add('hidden');
    inGameHud.classList.add('hidden');
    resetConfirmBox.classList.add('hidden');
    resetConfirmBox.classList.remove('flex');
    btnAskReset.classList.remove('hidden');
    state.mode = 'level_select';
    renderLevelSelect();
    levelSelectScreen.classList.remove('hidden');
  }

  // --- Pause / Resume ---
  function pauseGame() {
    if (state.mode !== 'playing') return;
    state.mode = 'paused';
    pauseLevelTitle.textContent = LEVELS[state.levelIdx].name;
    pauseOverlay.classList.remove('hidden');
  }

  function resumeGame() {
    if (state.mode !== 'paused') return;
    pauseOverlay.classList.add('hidden');
    state.mode = 'playing';
  }

  // --- Homescreen -> Loading -> Level Select ---
  function triggerEnterFromHome() {
    if (state.mode !== 'home') return;
    ensureSfxCtx();
    initAmbience();
    sfxEnter();
    state.mode = 'loading';
    homeScreen.classList.add('hidden');
    loadingScreen.classList.remove('hidden');

    const steps = [
      { pct: 32, text: 'Menyiapkan rimba bayangan...' },
      { pct: 68, text: 'Menyelaraskan sinar matahari & awan...' },
      { pct: 100, text: 'Siap dijelajahi' }
    ];

    let idx = 0;
    const timer = setInterval(() => {
      const step = steps[idx];
      loadingBar.style.width = step.pct + '%';
      loadingStatusText.textContent = step.text;
      idx++;
      if (idx >= steps.length) {
        clearInterval(timer);
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
          openLevelSelect();
        }, 260);
      }
    }, 320);
  }

  // --- Microphone Setup ---
  async function startMicrophone() {
    ensureSfxCtx();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast('Browser tidak mendukung akses mikrofon (pastikan dibuka melalui HTTPS).');
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: true, autoGainControl: false }
      });
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audio.ctx = new AudioCtx();
      const source = audio.ctx.createMediaStreamSource(stream);
      audio.analyser = audio.ctx.createAnalyser();
      audio.analyser.fftSize = 2048;
      audio.analyser.smoothingTimeConstant = 0.25;
      source.connect(audio.analyser);
      audio.timeBuffer = new Float32Array(audio.analyser.fftSize);
      audio.freqBuffer = new Float32Array(audio.analyser.frequencyBinCount);
      audio.stream = stream;
      audio.micActive = true;
      audio.ambientRms = 0.012;
      updateMicUI();
      hideToast();
      return true;
    } catch (err) {
      audio.micActive = false;
      updateMicUI();
      showToast('Izinkan akses mikrofon di browser untuk menggerakkan karakter dengan siulan.');
      return false;
    }
  }

  function stopMicrophone() {
    if (audio.stream) {
      audio.stream.getTracks().forEach(t => t.stop());
      audio.stream = null;
    }
    if (audio.ctx) {
      audio.ctx.close().catch(() => {});
      audio.ctx = null;
    }
    audio.analyser = null;
    audio.micActive = false;
    audio.pitchHz = 0;
    audio.smoothPitch = 0;
    audio.validFrames = 0;
    audio.missFrames = 0;
    audio.activeZone = 'none';
    updateMicUI();
  }

  function updateMicUI() {
    if (audio.micActive) {
      micDot.className = 'w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]';
      micLabel.textContent = 'Mic Aktif';
      micDotMobile.className = 'w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]';
      micLabelMobile.textContent = 'Aktif';
    } else {
      micDot.className = 'w-2 h-2 rounded-full bg-slate-400';
      micLabel.textContent = 'Mic Mati';
      micDotMobile.className = 'w-2 h-2 rounded-full bg-slate-400';
      micLabelMobile.textContent = 'Mic';
      whistleLivePill.classList.add('hidden');
    }
  }

  // --- Automatic Background Adaptive FFT Whistle Classifier ---
  function analyzeWhistleAuto() {
    audio.analyser.getFloatTimeDomainData(audio.timeBuffer);
    audio.analyser.getFloatFrequencyData(audio.freqBuffer);

    let sumSq = 0;
    for (let i = 0; i < audio.timeBuffer.length; i++) {
      sumSq += audio.timeBuffer[i] * audio.timeBuffer[i];
    }
    const rms = Math.sqrt(sumSq / audio.timeBuffer.length);

    const sampleRate = audio.ctx.sampleRate;
    const binHz = sampleRate / audio.analyser.fftSize;
    const freq = audio.freqBuffer;
    const maxBin = freq.length - 1;

    const voiceMinBin = Math.max(1, Math.floor(80 / binHz));
    const voiceMaxBin = Math.min(maxBin, Math.floor(500 / binHz));
    const whistleMinBin = Math.max(1, Math.floor(580 / binHz));
    const whistleMaxBin = Math.min(maxBin - 2, Math.floor(2800 / binHz));
    const totalMinBin = Math.max(1, Math.floor(100 / binHz));
    const totalMaxBin = Math.min(maxBin, Math.floor(4000 / binHz));

    let maxVoiceDb = -160;
    for (let b = voiceMinBin; b <= voiceMaxBin; b++) {
      if (freq[b] > maxVoiceDb) maxVoiceDb = freq[b];
    }

    let peakBin = whistleMinBin;
    let peakDb = -160;
    for (let b = whistleMinBin; b <= whistleMaxBin; b++) {
      if (freq[b] > peakDb) {
        peakDb = freq[b];
        peakBin = b;
      }
    }

    let totalPower = 0;
    let peakBandPower = 0;
    let dbSum = 0;
    let dbCount = 0;
    for (let b = totalMinBin; b <= totalMaxBin; b++) {
      const db = Math.max(-140, freq[b]);
      dbSum += db;
      dbCount++;
      const linPow = Math.pow(10, db / 10);
      totalPower += linPow;
      if (Math.abs(b - peakBin) <= 2) peakBandPower += linPow;
    }
    const purity = totalPower > 0 ? peakBandPower / totalPower : 0;
    const meanDb = dbCount > 0 ? dbSum / dbCount : -100;
    const prominenceDb = peakDb - meanDb;

    const looksLikeWhistle =
      (peakDb - maxVoiceDb >= 13) &&
      (prominenceDb >= 17) &&
      (purity >= audio.minPurity);

    if (!looksLikeWhistle) {
      const clampedRms = Math.min(rms, 0.06);
      audio.ambientRms = audio.ambientRms * 0.96 + clampedRms * 0.04;
      audio.noiseFloor = Math.max(0.014, Math.min(0.075, audio.ambientRms * 1.85 + 0.006));
      return { isWhistle: false, hz: 0 };
    }

    if (rms < audio.noiseFloor) return { isWhistle: false, hz: 0 };

    const prevDb = freq[peakBin - 1] || peakDb;
    const nextDb = freq[peakBin + 1] || peakDb;
    const denom = (prevDb - 2 * peakDb + nextDb);
    const delta = Math.abs(denom) > 1e-6 ? 0.5 * (prevDb - nextDb) / denom : 0;
    const hz = (peakBin + Math.max(-0.5, Math.min(0.5, delta))) * binHz;

    return { isWhistle: true, hz };
  }

  function updateAudioAnalysis() {
    if (!audio.micActive || !audio.analyser || !audio.ctx) {
      audio.activeZone = 'none';
      return;
    }

    const res = analyzeWhistleAuto();

    if (res.isWhistle) {
      if (audio.lastCandidateHz === 0 || Math.abs(res.hz - audio.lastCandidateHz) < 155) {
        audio.validFrames = Math.min(10, audio.validFrames + 1);
      } else {
        audio.validFrames = 1;
      }
      audio.lastCandidateHz = res.hz;
      audio.missFrames = 0;

      if (audio.validFrames >= 3) {
        audio.smoothPitch = audio.smoothPitch === 0 ? res.hz : audio.smoothPitch * 0.65 + res.hz * 0.35;
        audio.pitchHz = Math.round(audio.smoothPitch);
      }
    } else {
      audio.missFrames++;
      if (audio.missFrames >= 3) {
        audio.validFrames = 0;
        audio.lastCandidateHz = 0;
        audio.smoothPitch = 0;
        audio.pitchHz = 0;
      }
    }

    if (audio.pitchHz >= 580 && audio.pitchHz <= 1250) {
      audio.activeZone = 'glide';
      whistleLivePill.classList.remove('hidden');
      whistleLiveText.textContent = 'Meluncur';
    } else if (audio.pitchHz > 1250) {
      audio.activeZone = 'lift';
      whistleLivePill.classList.remove('hidden');
      whistleLiveText.textContent = 'Melayang';
    } else {
      audio.activeZone = 'none';
      whistleLivePill.classList.add('hidden');
    }

    // Update Quick Whistle Test Bar inside Tutorial Modal
    if (state.mode === 'tutorial') {
      if (audio.activeZone === 'glide') {
        whistleTestBar.style.width = '58%';
        whistleTestBar.className = 'h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-100';
        whistleTestStatus.textContent = 'Siulan Normal (Meluncur)';
        whistleTestStatus.className = 'text-[11px] font-semibold text-emerald-300';
      } else if (audio.activeZone === 'lift') {
        whistleTestBar.style.width = '100%';
        whistleTestBar.className = 'h-full bg-gradient-to-r from-indigo-400 to-sky-300 rounded-full transition-all duration-100';
        whistleTestStatus.textContent = 'Siulan Tinggi (Melayang)';
        whistleTestStatus.className = 'text-[11px] font-semibold text-indigo-300';
      } else {
        whistleTestBar.style.width = '8%';
        whistleTestBar.className = 'h-full bg-white/20 rounded-full transition-all duration-150';
        whistleTestStatus.textContent = 'Mic aktif — coba bersiul...';
        whistleTestStatus.className = 'text-[11px] text-slate-300';
      }
    }
  }

  // --- Level Loading ---
  function loadLevel(idx) {
    state.levelIdx = idx;
    const tpl = LEVELS[idx];
    state.levelScore = 0;
    state.levelElapsed = 0;
    state.energy = 100;
    state.shadowSource = 'pohon';
    state.sunAngle = tpl.sunBaseAngle;
    state.player = { x: tpl.start.x, y: tpl.start.y, vx: 0, vy: 0, r: 19, facing: 1, trail: [] };
    state.portal = { ...tpl.portal };
    state.trees = tpl.trees.map(t => ({ ...t }));
    state.clouds = tpl.clouds.map(c => ({ ...c }));
    state.rocks = tpl.rocks.map(r => ({ ...r }));
    state.orbs = tpl.orbs.map(o => ({ x: o.x, y: o.y, collected: false }));
    state.particles = [];

    setFacing(1);
    cam.x = 0;
    hudLevel.textContent = (idx + 1) + '/' + LEVELS.length;
    levelNameFooter.textContent = tpl.name;
    hudScore.textContent = '0';
    hudOrbsProgress.textContent = `0/${state.orbs.length}`;
    hudTimer.textContent = '00:00';
    updateEnergyUI();
  }

  function updateEnergyUI() {
    const pct = Math.max(0, Math.min(100, Math.round(state.energy)));
    hudEnergyBar.style.width = pct + '%';
    hudEnergyText.textContent = pct + '%';
    if (pct > 50) {
      hudEnergyBar.className = 'h-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-100 rounded-full';
    } else if (pct > 25) {
      hudEnergyBar.className = 'h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-100 rounded-full';
    } else {
      hudEnergyBar.className = 'h-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-100 rounded-full';
    }
  }

  // --- Directional Sun-Ray Shadow Occlusion ---
  function isUnderShadowCaster(px, py, cx, cy, rx, ry) {
    if (py < cy - ry * 0.2) return false;
    const dy = py - cy;
    const slope = Math.tan(state.sunAngle);
    const projectedCenterX = cx + dy * slope;
    return Math.abs(px - projectedCenterX) <= rx * 0.92;
  }

  function getShadowSource(px, py) {
    for (const t of state.trees) {
      if (isUnderShadowCaster(px, py, t.x, t.canopyY, t.rx, t.ry)) return 'pohon';
    }
    for (const c of state.clouds) {
      if (isUnderShadowCaster(px, py, c.x, c.y, c.rx, c.ry)) return 'awan';
    }
    return 'none';
  }

  function spawnParticles(x, y, color, count = 6) {
    for (let i = 0; i < count; i++) {
      state.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 95,
        vy: (Math.random() - 0.5) * 95,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        r: 2 + Math.random() * 3,
        color
      });
    }
  }

  // --- Level Completion & 1-3 Star Calculation ---
  function handleLevelComplete() {
    const tpl = LEVELS[state.levelIdx];
    const orbsCollected = state.orbs.filter(o => o.collected).length;
    const allOrbs = orbsCollected === state.orbs.length;
    const fastClear = state.levelElapsed <= tpl.parTime;

    const earnedStars = 1 + (allOrbs ? 1 : 0) + (fastClear ? 1 : 0);
    const timeBonus = fastClear ? Math.round((tpl.parTime - state.levelElapsed) * 5) : 0;
    const finalScore = state.levelScore + 250 + timeBonus;
    state.levelScore = finalScore;
    hudScore.textContent = String(finalScore);

    // Save progress & unlock next level
    const lvSave = progress.levels[state.levelIdx];
    const isNewBest = finalScore > lvSave.bestScore || lvSave.bestTime === null || state.levelElapsed < lvSave.bestTime;
    if (earnedStars > lvSave.stars) lvSave.stars = earnedStars;
    if (finalScore > lvSave.bestScore) lvSave.bestScore = finalScore;
    if (lvSave.bestTime === null || state.levelElapsed < lvSave.bestTime) {
      lvSave.bestTime = Math.round(state.levelElapsed);
    }
    if (state.levelIdx + 1 < LEVELS.length) {
      progress.levels[state.levelIdx + 1].unlocked = true;
    }
    saveProgress();

    sfxWin();
    spawnParticles(state.portal.x, state.portal.y, '#34d399', 26);

    const resultMeta = {
      stars: earnedStars,
      allOrbs,
      fastClear,
      orbsCollected,
      totalOrbs: state.orbs.length,
      elapsed: state.levelElapsed,
      parTime: tpl.parTime,
      finalScore,
      isNewBest
    };

    if (state.levelIdx < LEVELS.length - 1) {
      showOverlay('level_clear', resultMeta);
    } else {
      showOverlay('victory', resultMeta);
    }
  }

  // --- Physics & Environment Update ---
  function update(dt) {
    updateAmbience();
    if (state.mode === 'paused') return;

    state.time += dt;
    updateAudioAnalysis();

    const tpl = LEVELS[state.levelIdx];
    state.sunAngle = tpl.sunBaseAngle + Math.sin(state.time * tpl.sunSwingSpeed) * tpl.sunSwingAmp;

    for (const c of state.clouds) {
      c.x += c.speed * dt;
      if (c.x - c.rx > WORLD_W + 120) c.x = -c.rx - 120;
    }

    // Smooth Horizontal Camera Follow (keeps 1:1 proportions on mobile portrait & narrow screens)
    const maxCamX = Math.max(0, WORLD_W - cam.viewW);
    if (maxCamX > 0) {
      if (state.mode === 'home' || state.mode === 'loading' || state.mode === 'level_select') {
        const target = (Math.sin(state.time * 0.16) * 0.5 + 0.5) * maxCamX;
        cam.x += (target - cam.x) * Math.min(1, dt * 2.5);
      } else {
        const lookAhead = state.player.facing * Math.min(70, cam.viewW * 0.14);
        const target = Math.max(0, Math.min(maxCamX, state.player.x + lookAhead - cam.viewW * 0.45));
        cam.x += (target - cam.x) * Math.min(1, dt * 6.5);
      }
    } else {
      cam.x = 0;
    }

    if (state.mode !== 'playing') return;

    // Live level timer
    state.levelElapsed += dt;
    hudTimer.textContent = formatTime(state.levelElapsed);

    // Whistle-driven locomotion in facing direction
    const p = state.player;
    let moveX = 0;
    let lift = false;

    if (audio.activeZone === 'glide') {
      moveX = p.facing * 1.0;
    } else if (audio.activeZone === 'lift') {
      moveX = p.facing * 0.78;
      lift = true;
    }

    const speedX = 255;
    p.vx += (moveX * speedX - p.vx) * Math.min(1, dt * 10);

    if (lift) {
      p.vy += (-275 - p.vy) * Math.min(1, dt * 8);
    } else {
      p.vy += 350 * dt;
      if (p.vy > 250) p.vy = 250;
    }

    p.x += p.vx * dt;
    p.x = Math.max(p.r + 12, Math.min(WORLD_W - p.r - 12, p.x));
    for (const rock of state.rocks) {
      if (circleRectOverlap(p.x, p.y, p.r, rock)) {
        if (p.vx > 0) p.x = rock.x - p.r - 0.5;
        else if (p.vx < 0) p.x = rock.x + rock.w + p.r + 0.5;
        p.vx = 0;
      }
    }

    p.y += p.vy * dt;
    p.y = Math.max(p.r + 24, Math.min(GROUND_Y - p.r, p.y));
    for (const rock of state.rocks) {
      if (circleRectOverlap(p.x, p.y, p.r, rock)) {
        if (p.vy > 0) p.y = rock.y - p.r - 0.5;
        else if (p.vy < 0) p.y = rock.y + rock.h + p.r + 0.5;
        p.vy = 0;
      }
    }

    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > 16) p.trail.shift();

    // Natural Shadow Check
    const source = getShadowSource(p.x, p.y);
    state.shadowSource = source;
    if (source === 'none') {
      state.energy -= 22 * dt;
      if (Math.random() < 0.35) spawnParticles(p.x, p.y, '#fde047', 1);
      shadowDot.className = 'w-1.5 h-1.5 rounded-full bg-amber-400';
      shadowStatusText.textContent = 'Terkena Sinar Matahari';
    } else if (source === 'awan') {
      state.energy = Math.min(100, state.energy + 20 * dt);
      shadowDot.className = 'w-1.5 h-1.5 rounded-full bg-sky-400';
      shadowStatusText.textContent = 'Teduh: Bayangan Awan';
    } else {
      state.energy = Math.min(100, state.energy + 24 * dt);
      shadowDot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
      shadowStatusText.textContent = 'Teduh: Bayangan Pohon';
    }
    updateEnergyUI();

    if (state.energy <= 0) {
      state.energy = 0;
      updateEnergyUI();
      sfxFail();
      showOverlay('gameover');
      return;
    }

    for (const orb of state.orbs) {
      if (!orb.collected && Math.hypot(p.x - orb.x, p.y - orb.y) < p.r + 16) {
        orb.collected = true;
        state.levelScore += 100;
        hudScore.textContent = String(state.levelScore);
        const collectedCount = state.orbs.filter(o => o.collected).length;
        hudOrbsProgress.textContent = `${collectedCount}/${state.orbs.length}`;
        sfxOrb();
        spawnParticles(orb.x, orb.y, '#7dd3fc', 14);
      }
    }

    if (Math.hypot(p.x - state.portal.x, p.y - state.portal.y) < p.r + state.portal.r) {
      handleLevelComplete();
      return;
    }

    for (let i = state.particles.length - 1; i >= 0; i--) {
      const pt = state.particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      if (pt.life <= 0) state.particles.splice(i, 1);
    }
  }

  function circleRectOverlap(cx, cy, r, rect) {
    const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
    const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy < r * r;
  }

  // --- Indie Forest Art Rendering ---
  function drawCastShadowCorridor(cx, cy, rx, opacity) {
    const slope = Math.tan(state.sunAngle);
    const dy = GROUND_Y - cy;
    const dx = dy * slope;

    ctx.beginPath();
    ctx.moveTo(cx - rx, cy);
    ctx.lineTo(cx + rx, cy);
    ctx.lineTo(cx + rx + dx, GROUND_Y);
    ctx.lineTo(cx - rx + dx, GROUND_Y);
    ctx.closePath();

    const grad = ctx.createLinearGradient(cx, cy, cx + dx, GROUND_Y);
    grad.addColorStop(0, `rgba(5, 11, 20, ${opacity * 0.42})`);
    grad.addColorStop(0.65, `rgba(4, 10, 18, ${opacity * 0.78})`);
    grad.addColorStop(1, `rgba(3, 8, 16, ${opacity})`);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
    ctx.fillRect(cx - rx + dx, GROUND_Y - 4, rx * 2, 4);
  }

  function drawCloud(c) {
    ctx.save();
    const puffs = [
      { ox: 0, oy: -4, r: c.ry * 1.15 },
      { ox: -c.rx * 0.36, oy: 2, r: c.ry * 0.92 },
      { ox: c.rx * 0.36, oy: 2, r: c.ry * 0.94 },
      { ox: -c.rx * 0.66, oy: 8, r: c.ry * 0.68 },
      { ox: c.rx * 0.66, oy: 8, r: c.ry * 0.68 }
    ];

    ctx.fillStyle = 'rgba(226, 232, 240, 0.22)';
    ctx.beginPath();
    for (const pf of puffs) {
      ctx.moveTo(c.x + pf.ox + pf.r + 5, c.y + pf.oy);
      ctx.arc(c.x + pf.ox, c.y + pf.oy, pf.r + 5, 0, Math.PI * 2);
    }
    ctx.fill();

    const cg = ctx.createLinearGradient(c.x, c.y - c.ry * 1.2, c.x, c.y + c.ry);
    cg.addColorStop(0, 'rgba(241, 245, 249, 0.92)');
    cg.addColorStop(0.65, 'rgba(203, 213, 225, 0.85)');
    cg.addColorStop(1, 'rgba(100, 116, 139, 0.72)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    for (const pf of puffs) {
      ctx.moveTo(c.x + pf.ox + pf.r, c.y + pf.oy);
      ctx.arc(c.x + pf.ox, c.y + pf.oy, pf.r, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.restore();
  }

  function drawTree(t) {
    const sway = Math.sin(state.time * 1.3 + t.seed) * 3;
    const baseW = t.trunkW * 1.35;
    const topW = t.trunkW * 0.62;

    const trunkGrad = ctx.createLinearGradient(t.x - baseW / 2, 0, t.x + baseW / 2, 0);
    trunkGrad.addColorStop(0, '#1c1411');
    trunkGrad.addColorStop(0.45, '#34241d');
    trunkGrad.addColorStop(1, '#140e0c');
    ctx.fillStyle = trunkGrad;
    ctx.beginPath();
    ctx.moveTo(t.x - baseW / 2, GROUND_Y + 4);
    ctx.lineTo(t.x - topW / 2 + sway * 0.3, t.canopyY + 12);
    ctx.lineTo(t.x + topW / 2 + sway * 0.3, t.canopyY + 12);
    ctx.lineTo(t.x + baseW / 2, GROUND_Y + 4);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#241813';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(t.x, t.canopyY + 58);
    ctx.lineTo(t.x - t.rx * 0.38 + sway * 0.5, t.canopyY + 14);
    ctx.moveTo(t.x, t.canopyY + 46);
    ctx.lineTo(t.x + t.rx * 0.36 + sway * 0.5, t.canopyY + 10);
    ctx.stroke();

    const cx = t.x + sway;
    const cy = t.canopyY;
    const clusters = [
      { ox: -t.rx * 0.52, oy: 12, r: t.ry * 0.66, col: '#0b2e26' },
      { ox: t.rx * 0.52, oy: 12, r: t.ry * 0.66, col: '#0b2e26' },
      { ox: 0, oy: 16, r: t.ry * 0.78, col: '#0e3a2f' },
      { ox: -t.rx * 0.32, oy: -6, r: t.ry * 0.68, col: '#134e3e' },
      { ox: t.rx * 0.32, oy: -4, r: t.ry * 0.68, col: '#134e3e' },
      { ox: 0, oy: -18, r: t.ry * 0.72, col: '#1b6650' },
      { ox: -t.rx * 0.14, oy: -28, r: t.ry * 0.48, col: '#277d62' }
    ];
    for (const cl of clusters) {
      ctx.fillStyle = cl.col;
      ctx.beginPath();
      ctx.arc(cx + cl.ox, cy + cl.oy, cl.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawMossyRock(r) {
    ctx.save();
    const grad = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
    grad.addColorStop(0, '#3e4c5e');
    grad.addColorStop(1, '#1a2230');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(r.x + 2, r.y + r.h);
    ctx.quadraticCurveTo(r.x - 4, r.y + r.h * 0.35, r.x + r.w * 0.22, r.y + 4);
    ctx.quadraticCurveTo(r.x + r.w * 0.52, r.y - 6, r.x + r.w * 0.82, r.y + 6);
    ctx.quadraticCurveTo(r.x + r.w + 4, r.y + r.h * 0.4, r.x + r.w - 2, r.y + r.h);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1b6b46';
    ctx.beginPath();
    ctx.moveTo(r.x + r.w * 0.14, r.y + 16);
    ctx.quadraticCurveTo(r.x + r.w * 0.24, r.y + 2, r.x + r.w * 0.52, r.y - 2);
    ctx.quadraticCurveTo(r.x + r.w * 0.80, r.y + 3, r.x + r.w * 0.88, r.y + 16);
    ctx.quadraticCurveTo(r.x + r.w * 0.52, r.y + 10, r.x + r.w * 0.14, r.y + 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function render() {
    const w = canvas.width;
    const h = canvas.height;
    const tpl = LEVELS[state.levelIdx];
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    // Subtle diegetic screen shake when shadow energy is critical (< 30%)
    if (state.mode === 'playing' && state.energy < 30) {
      const danger = (30 - state.energy) / 30;
      const mag = (1.5 + danger * 5.0) * (state.shadowSource === 'none' ? 1.0 : 0.45);
      const sx = Math.sin(state.time * 52) * mag;
      const sy = Math.cos(state.time * 61) * mag;
      ctx.translate(sx, sy);
    }
    // Uniform camera transform: preserves exact 1:1 circular proportions on all phones & desktops
    ctx.translate(0, cam.offsetY);
    ctx.scale(cam.scale, cam.scale);
    ctx.translate(-cam.x, 0);

    const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGrad.addColorStop(0, tpl.skyTop);
    skyGrad.addColorStop(0.55, tpl.skyMid);
    skyGrad.addColorStop(1, tpl.skyBot);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    const sunX = WORLD_W * 0.5 - Math.sin(state.sunAngle) * 580;
    const sunY = 74;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 480);
    sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.88)');
    sunGlow.addColorStop(0.22, 'rgba(251, 191, 36, 0.28)');
    sunGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, WORLD_W, GROUND_Y);

    ctx.beginPath();
    ctx.arc(sunX, sunY, 26, 0, Math.PI * 2);
    ctx.fillStyle = tpl.sunColor;
    ctx.fill();

    const sunWash = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    sunWash.addColorStop(0, 'rgba(253, 224, 71, 0.07)');
    sunWash.addColorStop(1, 'rgba(251, 191, 36, 0.15)');
    ctx.fillStyle = sunWash;
    ctx.fillRect(0, 0, WORLD_W, GROUND_Y);

    ctx.fillStyle = 'rgba(8, 22, 32, 0.34)';
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    for (let bx = 0; bx <= WORLD_W; bx += 120) {
      const ridgeY = GROUND_Y - 175 - Math.sin(bx * 0.008 + 1) * 48;
      ctx.lineTo(bx, ridgeY);
    }
    ctx.lineTo(WORLD_W, GROUND_Y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(7, 19, 28, 0.52)';
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    for (let bx = 0; bx <= WORLD_W; bx += 58) {
      const peakH = 110 + Math.sin(bx * 0.042) * 34 + Math.cos(bx * 0.019) * 20;
      ctx.lineTo(bx + 29, GROUND_Y - peakH);
      ctx.lineTo(bx + 58, GROUND_Y - 40);
    }
    ctx.lineTo(WORLD_W, GROUND_Y);
    ctx.closePath();
    ctx.fill();

    const mistGrad = ctx.createLinearGradient(0, GROUND_Y - 140, 0, GROUND_Y);
    mistGrad.addColorStop(0, 'rgba(255,255,255,0)');
    mistGrad.addColorStop(1, tpl.mistColor);
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, GROUND_Y - 140, WORLD_W, 140);

    for (const c of state.clouds) drawCastShadowCorridor(c.x, c.y + 10, c.rx * 0.92, 0.72);
    for (const t of state.trees) drawCastShadowCorridor(t.x, t.canopyY, t.rx * 0.92, 0.80);

    for (const f of FIREFLIES) {
      const fx = (f.x + state.time * f.speed) % WORLD_W;
      const fy = f.y + Math.sin(state.time * 2 + f.phase) * 16;
      const alpha = 0.2 + 0.45 * (0.5 + 0.5 * Math.sin(state.time * 2.8 + f.phase));
      ctx.fillStyle = `rgba(167, 243, 208, ${alpha})`;
      ctx.beginPath();
      ctx.arc(fx, fy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const t of state.trees) drawTree(t);
    for (const c of state.clouds) drawCloud(c);

    const floorGrad = ctx.createLinearGradient(0, GROUND_Y, 0, WORLD_H);
    floorGrad.addColorStop(0, '#0f2620');
    floorGrad.addColorStop(1, '#050d0c');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, GROUND_Y, WORLD_W, WORLD_H - GROUND_Y + 420);

    ctx.strokeStyle = 'rgba(52, 211, 153, 0.26)';
    ctx.lineWidth = 1.6;
    for (const g of GRASS_BLADES) {
      const bend = Math.sin(state.time * 2.2 + g.phase) * 4;
      ctx.beginPath();
      ctx.moveTo(g.x, GROUND_Y + 1);
      ctx.quadraticCurveTo(g.x + bend * 0.5, GROUND_Y - g.h * 0.6, g.x + bend, GROUND_Y - g.h);
      ctx.stroke();
    }

    for (const r of state.rocks) drawMossyRock(r);

    for (const orb of state.orbs) {
      if (orb.collected) continue;
      const bob = Math.sin(state.time * 3.8 + orb.x) * 5;
      const og = ctx.createRadialGradient(orb.x, orb.y + bob, 2, orb.x, orb.y + bob, 24);
      og.addColorStop(0, 'rgba(186, 230, 253, 0.95)');
      og.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
      og.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = og;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y + bob, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(orb.x, orb.y + bob, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f0f9ff';
      ctx.fill();
    }

    const pr = state.portal;
    const pulse = Math.sin(state.time * 3.2) * 5;
    const portGrad = ctx.createRadialGradient(pr.x, pr.y, 4, pr.x, pr.y, pr.r + 28 + pulse);
    portGrad.addColorStop(0, '#d1fae5');
    portGrad.addColorStop(0.45, 'rgba(16, 185, 129, 0.72)');
    portGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = portGrad;
    ctx.beginPath();
    ctx.arc(pr.x, pr.y, pr.r + 28 + pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(pr.x, pr.y, pr.r - 5, 0, Math.PI * 2);
    ctx.fillStyle = '#041215';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#34d399';
    ctx.stroke();

    if (state.mode !== 'home' && state.mode !== 'level_select') {
      const p = state.player;
      const inSafeShadow = state.shadowSource !== 'none';
      const idleBob = Math.abs(p.vy) < 5 ? Math.sin(state.time * 4) * 2.5 : 0;

      for (let i = 0; i < p.trail.length; i++) {
        const t = p.trail[i];
        const alpha = (i / p.trail.length) * 0.34;
        const rad = p.r * (0.38 + (i / p.trail.length) * 0.56);
        ctx.beginPath();
        ctx.arc(t.x, t.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = inSafeShadow
          ? `rgba(56, 189, 248, ${alpha})`
          : `rgba(251, 191, 36, ${alpha})`;
        ctx.fill();
      }

      if (audio.activeZone !== 'none') {
        const rippleR = p.r + 12 + ((state.time * 54) % 28);
        ctx.beginPath();
        ctx.arc(p.x, p.y + idleBob, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = audio.activeZone === 'lift'
          ? 'rgba(129, 140, 248, 0.82)'
          : 'rgba(56, 189, 248, 0.78)';
        ctx.lineWidth = 2.4;
        ctx.stroke();
      }

      const dir = p.facing;
      const chevX = p.x + dir * (p.r + 13);
      ctx.beginPath();
      ctx.moveTo(chevX - dir * 5, p.y + idleBob - 6);
      ctx.lineTo(chevX + dir * 5, p.y + idleBob);
      ctx.lineTo(chevX - dir * 5, p.y + idleBob + 6);
      ctx.strokeStyle = inSafeShadow ? 'rgba(52, 211, 153, 0.88)' : 'rgba(251, 191, 36, 0.92)';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p.x, p.y + idleBob, p.r, 0, Math.PI * 2);
      ctx.fillStyle = '#020617';
      ctx.fill();
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = inSafeShadow ? '#34d399' : '#f59e0b';
      ctx.stroke();

      const eyeOffset = dir * 5.5;
      const ex1 = p.x + eyeOffset - 3.5;
      const ex2 = p.x + eyeOffset + 4.5;
      const ey = p.y + idleBob - 2;
      if (inSafeShadow) {
        ctx.fillStyle = '#d1fae5';
        ctx.beginPath();
        ctx.arc(ex1, ey, 2.8, 0, Math.PI * 2);
        ctx.arc(ex2, ey, 2.8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Squinting eyes animation when overheating in sunlight (> <)
        ctx.strokeStyle = state.energy < 30 ? '#fca5a5' : '#fef08a';
        ctx.lineWidth = 2.1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(ex1 - 2.6, ey - 2.2);
        ctx.lineTo(ex1 + 1.4, ey);
        ctx.lineTo(ex1 - 2.6, ey + 2.2);
        ctx.moveTo(ex2 + 2.6, ey - 2.2);
        ctx.lineTo(ex2 - 1.4, ey);
        ctx.lineTo(ex2 + 2.6, ey + 2.2);
        ctx.stroke();
      }
    }

    for (const pt of state.particles) {
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    // Screen-space Diegetic Warm-Orange Danger Vignette (always hugs actual screen edges)
    if (state.mode === 'playing' && (state.shadowSource === 'none' || state.energy < 30)) {
      const criticalFactor = state.energy < 30 ? (30 - state.energy) / 30 : 0;
      const pulse = 0.5 + 0.5 * Math.sin(state.time * (criticalFactor > 0 ? 8.5 : 3.5));
      const edgeAlpha = criticalFactor > 0
        ? 0.24 + criticalFactor * 0.36 + pulse * 0.14
        : 0.14 + pulse * 0.06;
      const maxDim = Math.max(w, h);
      const vig = ctx.createRadialGradient(
        w * 0.5, h * 0.5, maxDim * 0.22,
        w * 0.5, h * 0.5, maxDim * 0.62
      );
      vig.addColorStop(0, 'rgba(251, 146, 60, 0)');
      vig.addColorStop(0.7, `rgba(245, 158, 11, ${edgeAlpha * 0.45})`);
      vig.addColorStop(1, `rgba(234, 88, 12, ${edgeAlpha})`);
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // --- Overlays ---
  function renderStarResult(meta) {
    starResultBlock.classList.remove('hidden');
    starIconsRow.innerHTML = [1, 2, 3].map(n =>
      `<span class="${n <= meta.stars ? 'star-lit' : 'star-dim'}">&#9733;</span>`
    ).join('');

    const pill = (ok, label) =>
      `<span class="px-2.5 py-1 rounded-full border ${ok ? 'border-amber-400/50 bg-amber-500/15 text-amber-200' : 'border-white/10 bg-white/5 text-slate-400'}">${ok ? '&#10003;' : '&times;'} ${label}</span>`;

    starCriteriaList.innerHTML = [
      pill(true, 'Portal Tercapai'),
      pill(meta.allOrbs, `Gema ${meta.orbsCollected}/${meta.totalOrbs}`),
      pill(meta.fastClear, `Waktu ${formatTime(meta.elapsed)} (&le; ${meta.parTime}d)`)
    ].join('');
  }

  function showOverlay(type, meta = null) {
    state.mode = type;
    gameOverlay.classList.remove('hidden');
    starResultBlock.classList.add('hidden');

    whistleTestBox.classList.toggle('hidden', type !== 'tutorial');
    if (type === 'tutorial') {
      overlayBadge.textContent = 'Petunjuk Bermain';
      overlayTitle.textContent = 'Cara Memainkan Kage Whistle';
      overlayDesc.innerHTML = 'Pandu roh bayangan menuju <strong>Portal Hutan</strong> di ujung kanan. Matahari, pohon peneduh, dan awan bergerak otomatis—tunggu bayangan awan melintas sebelum menyeberang.';
      overlayLegend.classList.remove('hidden');
      btnStartMic.textContent = 'Mulai & Aktifkan Mikrofon';
      btnStartStage.textContent = 'Mulai Tanpa Mic';
      if (audio.micActive) {
        btnTestMicInline.classList.add('hidden');
        whistleTestStatus.textContent = 'Mic aktif — coba bersiul...';
      } else {
        btnTestMicInline.classList.remove('hidden');
        whistleTestStatus.textContent = 'Aktifkan mic untuk tes';
        whistleTestBar.style.width = '0%';
      }
    } else if (type === 'level_clear' && meta) {
      overlayBadge.textContent = meta.isNewBest ? 'Hutan Terlewati • Rekor Baru!' : 'Hutan Terlewati';
      overlayTitle.textContent = 'Portal Rimba Tercapai!';
      renderStarResult(meta);
      overlayDesc.innerHTML = `Skor level: <strong>${meta.finalScore}</strong>. Level berikutnya kini sudah terbuka dan progres tersimpan otomatis.`;
      overlayLegend.classList.add('hidden');
      btnStartMic.textContent = 'Lanjut Level Berikutnya';
      btnStartStage.textContent = 'Pilih Level';
    } else if (type === 'gameover') {
      overlayBadge.textContent = 'Energi Bayangan Habis';
      overlayTitle.textContent = 'Terpapar Sinar Matahari';
      overlayDesc.innerHTML = 'Berteduhlah di bawah <strong>bayangan pohon</strong> dan tunggu <strong>bayangan awan</strong> melintas sebelum bersiul menyeberangi celah terang.';
      overlayLegend.classList.add('hidden');
      btnStartMic.textContent = 'Coba Lagi';
      btnStartStage.textContent = 'Pilih Level';
    } else if (type === 'victory' && meta) {
      overlayBadge.textContent = meta.isNewBest ? 'Semua Level Selesai • Rekor Baru!' : 'Semua Level Selesai';
      overlayTitle.textContent = 'Penjelajah Rimba Bayangan!';
      renderStarResult(meta);
      overlayDesc.innerHTML = `Selamat! Kamu menuntaskan <strong>${LEVELS[state.levelIdx].shortName}</strong> dengan skor <strong>${meta.finalScore}</strong>. Progres dan bintangmu tersimpan otomatis.`;
      overlayLegend.classList.add('hidden');
      btnStartMic.textContent = 'Ulang Level Ini';
      btnStartStage.textContent = 'Pilih Level';
    }
  }

  function hideOverlay() {
    gameOverlay.classList.add('hidden');
  }

  function resizeCanvas() {
    const rect = canvasContainer.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(320, Math.floor(rect.width * dpr));
    canvas.height = Math.max(240, Math.floor(rect.height * dpr));
    const isTouch = detectDeviceUI();
    // Reserve a clean dark earth zone at the bottom on touch devices so Kage & ground sit above the buttons
    const bottomReserve = isTouch ? Math.round(92 * dpr) : 0;
    const usableH = Math.max(200, canvas.height - bottomReserve);
    // Uniform scale so circles/trees/characters NEVER stretch on mobile portrait or ultrawide
    cam.scale = Math.max(canvas.width / WORLD_W, usableH / WORLD_H);
    cam.viewW = canvas.width / cam.scale;
    cam.viewH = usableH / cam.scale;
    // Pin forest floor cleanly above the bottom touch controls
    cam.offsetY = usableH - WORLD_H * cam.scale;
    const maxCamX = Math.max(0, WORLD_W - cam.viewW);
    cam.x = Math.max(0, Math.min(maxCamX, state.player.x - cam.viewW * 0.45));
    render();
  }

  function loop(ts) {
    const dt = Math.min(0.05, (ts - state.lastTime) / 1000 || 0.016);
    state.lastTime = ts;
    update(dt);
    render();
    state.rafId = requestAnimationFrame(loop);
  }

  // --- Event Listeners ---
  homeScreen.addEventListener('click', triggerEnterFromHome);

  btnLevelSelectHelp.addEventListener('click', () => helpModal.classList.remove('hidden'));
  btnBackHomeFromSelect.addEventListener('click', () => {
    levelSelectScreen.classList.add('hidden');
    state.mode = 'home';
    homeScreen.classList.remove('hidden');
  });

  btnAskReset.addEventListener('click', () => {
    btnAskReset.classList.add('hidden');
    resetConfirmBox.classList.remove('hidden');
    resetConfirmBox.classList.add('flex');
  });
  btnCancelReset.addEventListener('click', () => {
    resetConfirmBox.classList.add('hidden');
    resetConfirmBox.classList.remove('flex');
    btnAskReset.classList.remove('hidden');
  });
  btnConfirmReset.addEventListener('click', () => {
    progress = createDefaultProgress();
    saveProgress();
    resetConfirmBox.classList.add('hidden');
    resetConfirmBox.classList.remove('flex');
    btnAskReset.classList.remove('hidden');
    renderLevelSelect();
    showToast('Progres permainan berhasil direset.');
  });

  btnPause.addEventListener('click', pauseGame);
  btnPauseMobile.addEventListener('click', pauseGame);
  btnToggleMicMobile.addEventListener('click', async () => {
    if (audio.micActive) stopMicrophone();
    else await startMicrophone();
  });
  btnResumeGame.addEventListener('click', resumeGame);
  btnPauseRestart.addEventListener('click', () => {
    pauseOverlay.classList.add('hidden');
    loadLevel(state.levelIdx);
    state.mode = 'playing';
  });
  btnPauseLevelSelect.addEventListener('click', openLevelSelect);
  btnPauseHome.addEventListener('click', () => {
    pauseOverlay.classList.add('hidden');
    inGameHud.classList.add('hidden');
    loadLevel(0);
    state.mode = 'home';
    homeScreen.classList.remove('hidden');
  });

  btnTestMicInline.addEventListener('click', async () => {
    ensureSfxCtx();
    initAmbience();
    const ok = await startMicrophone();
    if (ok) {
      btnTestMicInline.classList.add('hidden');
      whistleTestStatus.textContent = 'Mic aktif — coba bersiul...';
    }
  });

  btnStartMic.addEventListener('click', async () => {
    ensureSfxCtx();
    initAmbience();
    if (state.mode === 'tutorial') {
      progress.hasSeenTutorial = true;
      saveProgress();
      await startMicrophone();
      loadLevel(state.pendingLevelIdx);
      state.mode = 'playing';
      hideOverlay();
    } else if (state.mode === 'level_clear') {
      loadLevel(state.levelIdx + 1);
      state.mode = 'playing';
      hideOverlay();
    } else if (state.mode === 'gameover' || state.mode === 'victory') {
      loadLevel(state.levelIdx);
      state.mode = 'playing';
      hideOverlay();
    }
  });

  btnStartStage.addEventListener('click', () => {
    ensureSfxCtx();
    if (state.mode === 'tutorial') {
      progress.hasSeenTutorial = true;
      saveProgress();
      loadLevel(state.pendingLevelIdx);
      state.mode = 'playing';
      hideOverlay();
    } else {
      openLevelSelect();
    }
  });

  btnToggleMic.addEventListener('click', async () => {
    if (audio.micActive) stopMicrophone();
    else await startMicrophone();
  });

  btnMute.addEventListener('click', () => {
    state.sfxMuted = !state.sfxMuted;
    iconSfxOn.classList.toggle('hidden', state.sfxMuted);
    iconSfxOff.classList.toggle('hidden', !state.sfxMuted);
  });

  btnRestart.addEventListener('click', () => {
    ensureSfxCtx();
    loadLevel(state.levelIdx);
    state.mode = 'playing';
    hideOverlay();
  });

  btnHelp.addEventListener('click', () => helpModal.classList.remove('hidden'));
  btnCloseHelp.addEventListener('click', () => helpModal.classList.add('hidden'));
  btnOkHelp.addEventListener('click', () => helpModal.classList.add('hidden'));
  btnCloseToast.addEventListener('click', hideToast);

  window.addEventListener('keydown', (e) => {
    if (state.mode === 'home' && (e.code === 'Space' || e.code === 'Enter')) {
      e.preventDefault();
      triggerEnterFromHome();
      return;
    }
    if (e.code === 'Escape' || e.code === 'KeyP') {
      if (!helpModal.classList.contains('hidden')) {
        helpModal.classList.add('hidden');
        return;
      }
      if (state.mode === 'playing') pauseGame();
      else if (state.mode === 'paused') resumeGame();
      return;
    }
    if (['ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') setFacing(-1);
    if (e.code === 'ArrowRight' || e.code === 'KeyD') setFacing(1);
  });

  ctrlFaceLeft.addEventListener('pointerdown', (e) => { e.preventDefault(); ensureSfxCtx(); setFacing(-1); });
  ctrlFaceRight.addEventListener('pointerdown', (e) => { e.preventDefault(); ensureSfxCtx(); setFacing(1); });

  window.addEventListener('resize', resizeCanvas);

  // Boot
  window.addEventListener('load', () => {
    loadLevel(0);
    state.mode = 'home';
    resizeCanvas();
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.lastTime = performance.now();
    state.rafId = requestAnimationFrame(loop);
  });
})();
