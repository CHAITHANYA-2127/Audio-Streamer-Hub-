/**
 * Audio Streamer Hub - Core Controller
 * Supporting:
 * - Songs playback (Telugu chartbusters, Bollywood, Global, Chill)
 * - Realtime Live Search (iTunes API + Curated catalog)
 * - Likes & Favorites with persistence in IndexedDB
 * - Offline Audio Blob downloads with true offline playback
 * - User authentication (Login, Sign Up, Guest session)
 * - Online / Offline mode detection & manual toggle
 * - Volume controls & 5-Band Hardware Equalizer (Web Audio API)
 * - Live canvas visualizer
 */

// ================= 1. CURATED SONGS CATALOG =================
const TRACKS = [
  // --- TELUGU CHARTBUSTERS ---
  {
    id: "trk_1761152593",
    title: "Chuttamalle (From \"Devara Part 1\")",
    artist: "Anirudh Ravichander, Shilpa Rao",
    album: "Devara Part 1",
    duration: 222,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/86/7c/53/867c53cc-4efe-faef-a20e-8d9c896053db/8903431011411_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f9/28/29/f92829b4-5473-17a9-879a-2efe96b8f95b/mzaf_4766756883763132198.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1747191476",
    title: "Fear Song (From \"Devara Part 1\")",
    artist: "Anirudh Ravichander & Ramajogayya Sastry",
    album: "Devara Part 1",
    duration: 195,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/1d/c6/af/1dc6af82-69e9-5341-5010-a9223fc25709/8903431001368_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8d/b1/16/8db11650-580e-ab11-9747-b7bb8544ce55/mzaf_14247929829726939234.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1766487491",
    title: "Daavudi (From \"Devara Part 1\")",
    artist: "Nakash Aziz, Akasa",
    album: "Devara Part 1",
    duration: 229,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/f0/96/13/f0961340-e9cb-4a9a-6a76-629bfd3869a8/8903431015167_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ce/f9/49/cef94985-9a9d-0902-b535-f05e4044262c/mzaf_9840598461303291959.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1594544794",
    title: "Naatu Naatu (From \"RRR\")",
    artist: "Rahul Sipligunj, Kaala Bhairava, M.M. Keeravani",
    album: "RRR",
    duration: 214,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/dd/39/14/dd3914e5-a2f3-b355-51f3-9a1f0e3ca246/8903431853592_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8e/dd/a4/8edda474-3fe1-3fe6-43d3-765db520a29b/mzaf_11740310005222997767.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1579173354",
    title: "Dosti (From \"RRR\")",
    artist: "Hemachandra & M.M. Keeravani",
    album: "RRR",
    duration: 340,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/32/d3/0d/32d30d96-9cb2-807f-1b8d-69f7b77e4130/8903431821751_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7b/5f/ce/7b5fce98-6629-000d-b86c-ae7821f7123b/mzaf_18235421262980845641.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1744162427",
    title: "Pushpa Pushpa (From \"Pushpa 2 The Rule\")",
    artist: "Nakash Aziz, Deepak Blue",
    album: "Pushpa 2 The Rule",
    duration: 256,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8b/dd/7f/8bdd7fa9-d6f2-2230-5e7a-3c2fe8b5fbfb/8903431993601_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/01/85/b5/0185b5d0-9eb2-7be4-4325-fd3634fbc40b/mzaf_2467991545485613534.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1600014695",
    title: "Oo Antava Mawa (From \"Pushpa\")",
    artist: "Indravathi Chauhan & Devi Sri Prasad",
    album: "Pushpa - The Rise",
    duration: 223,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/59/19/65/591965d4-84b4-d62d-345f-88bd29ce0843/cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/59/5d/86/595d8694-c034-2040-9a11-2f117ed32ea4/mzaf_8961189800316643417.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1723602835",
    title: "Kurchi Madathapetti (From \"Guntur Kaaram\")",
    artist: "S.S. Thaman, Sri Krishna, Sahithi Chaganti",
    album: "Guntur Kaaram",
    duration: 217,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/ff/e9/12/ffe9126b-d040-f90c-2df7-6baf1d00d1e6/cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/5b/8c/64/5b8c640b-bd6f-d479-8ab8-21b78d1d4ddb/mzaf_2982331657416179239.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1728026780",
    title: "Dum Masala (From \"Guntur Kaaram\")",
    artist: "S.S. Thaman, Sanjith Hegde",
    album: "Guntur Kaaram",
    duration: 207,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/a9/54/29/a9542906-08be-3e8d-a26c-635ef92ed5d3/cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/37/32/e3/3732e3a8-8d2f-82b9-1eab-d4b45ba27a2e/mzaf_6002667929431443539.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1481685076",
    title: "Samajavaragamana (From \"Ala Vaikunthapurramuloo\")",
    artist: "S.S. Thaman & Sid Sriram",
    album: "Ala Vaikunthapurramuloo",
    duration: 220,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/53/98/c1/5398c1cf-7c16-24a6-bfa3-391dc6015376/cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/29/a7/55/29a75528-3808-d849-ad00-9e714bf12621/mzaf_2813549342968292058.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1736707044",
    title: "Butta Bomma (From \"Ala Vaikunthapurramuloo\")",
    artist: "S.S. Thaman & Armaan Malik",
    album: "Ala Vaikunthapurramuloo",
    duration: 198,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/46/aa/48/46aa4863-c1ec-4574-e98e-80b8c1f3ef69/cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/28/e0/d3/28e0d30a-2afe-66e4-ac03-69b6d779fecd/mzaf_7857615290499608693.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1838517058",
    title: "Chitti (From \"Jathi Ratnalu\")",
    artist: "Ram Miriyala & Radhan",
    album: "Jathi Ratnalu",
    duration: 187,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3e/3c/d9/3e3cd928-c993-af27-6128-d5dcd53f64d7/8905750019604.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/82/9d/aa/829daa9c-d11b-738d-a289-420d0c8ae9ab/mzaf_3189934257308335980.plus.aac.p.m4a",
    genre: "telugu"
  },
  {
    id: "trk_1753954259",
    title: "Theme Of Kalki (From \"Kalki 2898 AD\")",
    artist: "Santhosh Narayanan, Kala Bhairava",
    album: "Kalki 2898 AD",
    duration: 190,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/19/cc/9c/19cc9ced-1fea-0743-6f79-c57ac6d2da7c/198588494882.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ce/fb/ed/cefbed1c-c98f-f202-b0bb-8e10ac894d90/mzaf_148736713310840851.plus.aac.p.m4a",
    genre: "telugu"
  },

  // --- BOLLYWOOD ---
  {
    id: "trk_1635014240",
    title: "Kesariya (From \"Brahmastra\")",
    artist: "Pritam, Arijit Singh & Amitabh Bhattacharya",
    album: "Brahmastra",
    duration: 268,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/9f/13/ca/9f13ca3b-e533-03e0-f19a-f0aaa774581d/196589311191.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/38/4c/5c/384c5c8f-3ff8-e457-b2f7-3158ce108649/mzaf_12389299033886433185.plus.aac.p.m4a",
    genre: "bollywood"
  },
  {
    id: "trk_1702461667",
    title: "Chaleya (From \"Jawan\")",
    artist: "Anirudh Ravichander, Arijit Singh & Shilpa Rao",
    album: "Jawan",
    duration: 200,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1e/ff/32/1eff3216-190d-6fd9-8f68-acbba846e6ee/8903431956026_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/55/fb/9c/55fb9c31-320a-5dba-0a3f-5e69552085a7/mzaf_13508224660474474886.plus.aac.p.m4a",
    genre: "bollywood"
  },
  {
    id: "trk_1600673693",
    title: "Srivalli (Hindi Version)",
    artist: "Javed Ali & Devi Sri Prasad",
    album: "Pushpa the Rise Part - 01",
    duration: 224,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/7e/78/81/7e78812c-0445-ebad-321c-1beebaaa328a/8902894361460_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/10/b9/b4/10b9b422-924d-7327-3f1c-a7ec9e13d030/mzaf_4886192084825474906.plus.aac.p.m4a",
    genre: "bollywood"
  },

  // --- GLOBAL ---
  {
    id: "trk_1542842761",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a",
    genre: "global"
  },
  {
    id: "trk_1193701392",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: 234,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/c7/4f/44c74f0d-72dc-6143-d4d0-ba14d661ca0d/mzaf_9566898362556366703.plus.aac.p.m4a",
    genre: "global"
  },
  {
    id: "trk_1538003843",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: 204,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6c/11/d6/6c11d681-aa3a-d59e-4c2e-f77e181026ab/190295092665.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/59/dc/4d/59dc4dda-93ff-8f1c-c536-f005f6ea6af5/mzaf_3066686759813252385.plus.aac.p.m4a",
    genre: "global"
  },
  {
    id: "trk_1411628233",
    title: "Believer",
    artist: "Imagine Dragons",
    album: "Evolve",
    duration: 204,
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/11/7a/b8/117ab805-6811-8929-18b9-0fad7baf0c25/17UMGIM98210.rgb.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c0/3f/36/c03f367a-b66b-fd0a-a54c-30f8250c4410/mzaf_12768434238801682952.plus.aac.p.m4a",
    genre: "global"
  },

  // --- CHILL & LO-FI ---
  {
    id: "trk_lofi_1",
    title: "Midnight Coffee & Study",
    artist: "Lofi Chill Session",
    album: "Midnight Chill Vol 1",
    duration: 150,
    cover: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&auto=format&fit=crop&q=80",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3",
    genre: "chill"
  },
  {
    id: "trk_lofi_2",
    title: "Sunset Road Chillhop",
    artist: "Lofi Dreamer",
    album: "Golden Hour",
    duration: 160,
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-chill-medium-version-159456.mp3",
    genre: "chill"
  }
];

// ================= 2. APPLICATION STATE =================
class StreamerState {
  constructor() {
    this.currentUser = null;
    this.queue = [...TRACKS];
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isShuffle = false;
    this.repeatMode = 'off';
    this.volume = 0.8;
    this.prevVolume = 0.8;
    this.isMuted = false;
    this.playbackRate = 1.0;
    this.isOfflineMode = !navigator.onLine;
    this.currentView = 'home';
    this.selectedGenre = 'all';

    // User datasets
    this.favorites = [];
    this.downloads = [];
    this.playlists = [];
    this.localFiles = [];

    // Equalizer
    this.eqBands = { 60: 0, 230: 0, 910: 0, 3600: 0, 14000: 0 };
    this.audioCtx = null;
    this.analyser = null;
    this.filters = [];
  }

  get currentTrack() {
    return this.queue[this.currentTrackIndex] || TRACKS[0];
  }
}

const state = new StreamerState();
const audio = document.getElementById('audio');

// ================= 3. TOAST NOTIFICATIONS =================
function notify(msg, type = 'info') {
  const container = document.getElementById('toastBox');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ================= 4. WEB AUDIO & VISUALIZER =================
function initWebAudio() {
  if (state.audioCtx) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    state.audioCtx = new AudioContext();
    const source = state.audioCtx.createMediaElementSource(audio);
    const gain = state.audioCtx.createGain();
    state.analyser = state.audioCtx.createAnalyser();
    state.analyser.fftSize = 64;

    const freqs = [60, 230, 910, 3600, 14000];
    const types = ['lowshelf', 'peaking', 'peaking', 'peaking', 'highshelf'];

    state.filters = freqs.map((f, i) => {
      const filter = state.audioCtx.createBiquadFilter();
      filter.type = types[i];
      filter.frequency.value = f;
      filter.gain.value = state.eqBands[f] || 0;
      return filter;
    });

    let prev = source;
    state.filters.forEach(fl => {
      prev.connect(fl);
      prev = fl;
    });
    prev.connect(gain);
    gain.connect(state.analyser);
    state.analyser.connect(state.audioCtx.destination);

    startVisualizer();
  } catch (e) {
    console.warn('Web Audio error:', e);
  }
}

function startVisualizer() {
  const canvas = document.getElementById('visualizer');
  if (!canvas || !state.analyser) return;
  const ctx = canvas.getContext('2d');
  const bufferLen = state.analyser.frequencyBinCount;
  const data = new Uint8Array(bufferLen);

  function loop() {
    requestAnimationFrame(loop);
    canvas.width = window.innerWidth;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!state.isPlaying) return;

    state.analyser.getByteFrequencyData(data);
    const barWidth = canvas.width / bufferLen;
    let x = 0;

    for (let i = 0; i < bufferLen; i++) {
      const barHeight = (data[i] / 255) * canvas.height;
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, '#8b5cf6');
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      x += barWidth;
    }
  }
  loop();
}

const EQ_PRESETS = {
  flat: { 60: 0, 230: 0, 910: 0, 3600: 0, 14000: 0 },
  bass: { 60: 7, 230: 5, 910: 1, 3600: -1, 14000: -2 },
  treble: { 60: -3, 230: -1, 910: 2, 3600: 6, 14000: 8 },
  acoustic: { 60: 4, 230: 2, 910: 1, 3600: 3, 14000: 4 },
  rock: { 60: 5, 230: 3, 910: -1, 3600: 4, 14000: 6 },
  vocal: { 60: -2, 230: 1, 910: 5, 3600: 4, 14000: 1 },
  electronic: { 60: 6, 230: 4, 910: 0, 3600: 3, 14000: 6 }
};

function applyPreset(name) {
  const p = EQ_PRESETS[name] || EQ_PRESETS.flat;
  Object.keys(p).forEach(freq => {
    state.eqBands[freq] = p[freq];
    if (state.filters.length) {
      const f = state.filters.find(fl => Math.round(fl.frequency.value) === parseInt(freq));
      if (f) f.gain.value = p[freq];
    }
    const input = document.getElementById(`band${freq}`);
    const val = document.getElementById(`eqVal${freq}`);
    if (input) input.value = p[freq];
    if (val) val.textContent = `${p[freq] > 0 ? '+' : ''}${p[freq]}dB`;
  });

  document.querySelectorAll('.eq-preset-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.preset === name);
  });
}

// ================= 5. AUDIO PLAYBACK =================
async function loadAndPlay(index = state.currentTrackIndex, auto = true) {
  if (index < 0 || index >= state.queue.length) return;
  state.currentTrackIndex = index;
  const track = state.currentTrack;

  // Offline check
  if (state.isOfflineMode) {
    const isDl = await isTrackDownloaded(track.id);
    if (!isDl) {
      notify(`"${track.title}" is not downloaded for offline playback.`, 'danger');
      return;
    }
  }

  // Check if track has downloaded blob
  let src = track.audioSrc;
  if (state.currentUser) {
    const dl = await window.hubDB.getDownloadedTrackEntry(state.currentUser.id, track.id);
    if (dl && dl.audioBlob) {
      src = URL.createObjectURL(dl.audioBlob);
    }
  }

  audio.src = src;
  audio.playbackRate = state.playbackRate;

  updatePlayerUI(track);

  if (auto) {
    try {
      if (state.audioCtx && state.audioCtx.state === 'suspended') {
        await state.audioCtx.resume();
      }
      initWebAudio();
      await audio.play();
      state.isPlaying = true;
    } catch (e) {
      console.warn('Auto play failed:', e);
      state.isPlaying = false;
    }
  } else {
    state.isPlaying = false;
  }

  updatePlayButtonUI();
  updateGridActiveUI();
  updateQueueUI();
}

function togglePlay() {
  initWebAudio();
  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
  if (audio.paused) {
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayButtonUI();
      updateGridActiveUI();
    }).catch(console.warn);
  } else {
    audio.pause();
    state.isPlaying = false;
    updatePlayButtonUI();
    updateGridActiveUI();
  }
}

function nextTrack() {
  if (state.isShuffle) {
    let r;
    do {
      r = Math.floor(Math.random() * state.queue.length);
    } while (r === state.currentTrackIndex && state.queue.length > 1);
    loadAndPlay(r, true);
  } else {
    loadAndPlay((state.currentTrackIndex + 1) % state.queue.length, true);
  }
}

function prevTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  loadAndPlay((state.currentTrackIndex - 1 + state.queue.length) % state.queue.length, true);
}

function setVolume(v) {
  v = Math.max(0, Math.min(1, parseFloat(v)));
  state.volume = v;
  audio.volume = v;
  state.isMuted = v === 0;

  const pct = Math.round(v * 100);
  const volRange = document.getElementById('volume');
  const setRange = document.getElementById('settingsVolRange');
  const pctEl = document.getElementById('volumePct');
  const setPctEl = document.getElementById('settingsVolDisplay');

  if (volRange) volRange.value = v;
  if (setRange) setRange.value = v;
  if (pctEl) pctEl.textContent = `${pct}%`;
  if (setPctEl) setPctEl.textContent = `${pct}%`;

  const icon = document.getElementById('volumeIcon');
  if (icon) {
    if (v === 0) icon.textContent = '🔇';
    else if (v < 0.4) icon.textContent = '🔈';
    else if (v < 0.8) icon.textContent = '🔉';
    else icon.textContent = '🔊';
  }
}

function toggleMute() {
  if (state.isMuted) {
    setVolume(state.prevVolume > 0 ? state.prevVolume : 0.8);
  } else {
    state.prevVolume = state.volume;
    setVolume(0);
  }
}

// ================= 6. UI UPDATES =================
async function updatePlayerUI(track) {
  document.getElementById('nowTitle').textContent = track.title;
  document.getElementById('nowArtist').textContent = track.artist;

  const playerArt = document.getElementById('playerArt');
  if (playerArt) {
    playerArt.innerHTML = track.cover ? `<img src="${track.cover}" alt="Art">` : '♫';
  }

  document.title = `▶ ${track.title} • ${track.artist} | Audio Streamer Hub`;

  const isFav = await isTrackFavorite(track.id);
  const isDl = await isTrackDownloaded(track.id);

  const favBtn = document.getElementById('favBtn');
  if (favBtn) {
    favBtn.innerHTML = isFav ? '♥' : '♡';
    favBtn.classList.toggle('is-liked', isFav);
  }

  const dlBtn = document.getElementById('dlBtn');
  if (dlBtn) {
    dlBtn.innerHTML = isDl ? '✓' : '⬇';
    dlBtn.classList.toggle('is-downloaded', isDl);
    dlBtn.title = isDl ? 'Downloaded' : 'Download for offline';
  }
}

function updatePlayButtonUI() {
  const btn = document.getElementById('playBtn');
  if (btn) btn.innerHTML = state.isPlaying ? '⏸' : '▶';
}

function updateGridActiveUI() {
  const id = state.currentTrack.id;
  document.querySelectorAll('.track-card, .queue-row, .library-row').forEach(el => {
    el.classList.toggle('is-playing', el.dataset.trackId === id);
  });
}

function formatTime(s) {
  if (isNaN(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

// ================= 7. DATABASE & OFFLINE DOWNLOADS =================
async function isTrackFavorite(trackId) {
  if (!state.currentUser) return false;
  return await window.hubDB.isFavorite(state.currentUser.id, trackId);
}

async function isTrackDownloaded(trackId) {
  if (!state.currentUser) return false;
  return await window.hubDB.isDownloaded(state.currentUser.id, trackId);
}

async function toggleFav(track) {
  if (!state.currentUser) {
    openAuthModal('Please sign in or continue as guest to save favorites.');
    return;
  }
  const liked = await window.hubDB.toggleFavorite(state.currentUser.id, track);
  notify(liked ? `Added "${track.title}" to Favorites ♥` : `Removed "${track.title}" from Favorites`, liked ? 'success' : 'info');
  await refreshData();
  updatePlayerUI(state.currentTrack);
  updateGridActiveUI();
}

async function downloadTrack(track) {
  if (!state.currentUser) {
    openAuthModal('Please sign in or continue as guest to download songs.');
    return;
  }
  const isDl = await isTrackDownloaded(track.id);
  if (isDl) {
    notify(`"${track.title}" is already in your offline library!`, 'info');
    return;
  }

  notify(`Downloading "${track.title}" for offline playback...`, 'info');
  try {
    const res = await fetch(track.audioSrc);
    if (!res.ok) throw new Error('Fetch failed');
    const blob = await res.blob();
    await window.hubDB.saveDownload(state.currentUser.id, track, blob);
    notify(`✓ "${track.title}" saved to Offline Library!`, 'success');
    await refreshData();
    updatePlayerUI(state.currentTrack);
    updateGridActiveUI();
  } catch (e) {
    console.error(e);
    notify(`Could not download track (${e.message})`, 'danger');
  }
}

async function refreshData() {
  if (!state.currentUser) return;
  state.favorites = await window.hubDB.getFavorites(state.currentUser.id);
  state.downloads = await window.hubDB.getDownloads(state.currentUser.id);
  state.playlists = await window.hubDB.getPlaylists(state.currentUser.id);

  // Update badges
  const favBadge = document.getElementById('favCountBadge');
  const dlBadge = document.getElementById('dlCountBadge');
  const libBadge = document.getElementById('libraryCountBadge');

  if (favBadge) favBadge.textContent = state.favorites.length;
  if (dlBadge) dlBadge.textContent = state.downloads.length;
  if (libBadge) libBadge.textContent = state.favorites.length + state.downloads.length + state.localFiles.length;

  // Subtitles
  const favSub = document.getElementById('favSubtitle');
  const dlSub = document.getElementById('dlSubtitle');
  if (favSub) favSub.textContent = `${state.favorites.length} liked tracks`;
  if (dlSub) dlSub.textContent = `${state.downloads.length} songs saved for offline playback`;

  // Storage meter
  let bytes = 0;
  state.downloads.forEach(d => bytes += (d.sizeBytes || 0));
  const mb = (bytes / (1024 * 1024)).toFixed(1);

  const storagePill = document.getElementById('storageSizePill');
  const storageFill = document.getElementById('storageFillBar');
  if (storagePill) storagePill.textContent = `${mb} MB`;
  if (storageFill) storageFill.style.width = `${Math.min(100, Math.max(5, mb * 4))}%`;

  // Render Playlists in sidebar
  renderSidebarPlaylists();

  // Re-render active view
  if (state.currentView === 'library') renderLibrary('all');
  if (state.currentView === 'favorites') renderFavorites();
  if (state.currentView === 'downloads') renderDownloads();
}

// ================= 8. ONLINE / OFFLINE MODE =================
function setMode(offline) {
  state.isOfflineMode = offline;
  const btn = document.getElementById('modeBtn');
  const text = document.getElementById('modeText');
  const banner = document.getElementById('offlineBanner');

  if (offline) {
    if (btn) btn.className = 'mode-toggle-btn offline';
    if (text) text.textContent = 'Offline';
    if (banner) banner.classList.remove('hidden');
    notify('Offline Mode enabled. Playing local songs from database.', 'danger');
  } else {
    if (btn) btn.className = 'mode-toggle-btn online';
    if (text) text.textContent = 'Online';
    if (banner) banner.classList.add('hidden');
    notify('Online Mode enabled. Live streaming active.', 'success');
  }
}

window.addEventListener('online', () => setMode(false));
window.addEventListener('offline', () => setMode(true));

// ================= 9. CARD & ROW BUILDERS =================
function buildCard(track) {
  const card = document.createElement('div');
  card.className = `track-card ${state.currentTrack.id === track.id ? 'is-playing' : ''}`;
  card.dataset.trackId = track.id;

  card.innerHTML = `
    <div class="cover">
      <img src="${track.cover}" alt="${track.title}" loading="lazy">
      <div class="cover-play-badge">▶</div>
      <span class="card-dl-indicator ${track.isDownloaded ? '' : 'hidden'}">⬇</span>
    </div>
    <div class="track-title" title="${track.title}">${track.title}</div>
    <div class="track-meta" title="${track.artist}">${track.artist}</div>
    <div class="card-actions">
      <button class="card-fav-btn" title="Like">♡</button>
      <button class="card-dl-btn" title="Download">⬇</button>
      <button class="card-pl-btn" title="Add to Playlist">＋</button>
    </div>
  `;

  isTrackFavorite(track.id).then(isFav => {
    const btn = card.querySelector('.card-fav-btn');
    if (btn) {
      btn.innerHTML = isFav ? '♥' : '♡';
      btn.classList.toggle('is-liked', isFav);
    }
  });

  isTrackDownloaded(track.id).then(isDl => {
    const btn = card.querySelector('.card-dl-btn');
    const badge = card.querySelector('.card-dl-indicator');
    if (btn) {
      btn.innerHTML = isDl ? '✓' : '⬇';
      btn.classList.toggle('is-downloaded', isDl);
    }
    if (badge) badge.classList.toggle('hidden', !isDl);
  });

  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-actions')) return;
    const idx = state.queue.findIndex(t => t.id === track.id);
    if (idx !== -1) {
      loadAndPlay(idx, true);
    } else {
      state.queue.push(track);
      loadAndPlay(state.queue.length - 1, true);
    }
  });

  card.querySelector('.card-fav-btn').onclick = (e) => {
    e.stopPropagation();
    toggleFav(track);
  };
  card.querySelector('.card-dl-btn').onclick = (e) => {
    e.stopPropagation();
    downloadTrack(track);
  };
  card.querySelector('.card-pl-btn').onclick = (e) => {
    e.stopPropagation();
    openAddToPlModal(track);
  };

  return card;
}

function buildRow(track, index = 0, isQueue = false) {
  const row = document.createElement('div');
  row.className = `${isQueue ? 'queue-row' : 'library-row'} ${state.currentTrack.id === track.id ? 'is-playing' : ''}`;
  row.dataset.trackId = track.id;

  row.innerHTML = `
    <div class="row-art">
      <img src="${track.cover}" alt="${track.title}" loading="lazy">
    </div>
    <div>
      <div class="row-title">${track.title}</div>
      <div class="row-meta">${track.artist} • ${track.album || 'Single'}</div>
    </div>
    <div class="row-actions">
      <button class="row-fav-btn" title="Like">♡</button>
      <button class="row-dl-btn" title="Download">⬇</button>
      <button class="row-pl-btn" title="Add to Playlist">＋</button>
    </div>
  `;

  isTrackFavorite(track.id).then(isFav => {
    const btn = row.querySelector('.row-fav-btn');
    if (btn) {
      btn.innerHTML = isFav ? '♥' : '♡';
      btn.classList.toggle('is-liked', isFav);
    }
  });

  isTrackDownloaded(track.id).then(isDl => {
    const btn = row.querySelector('.row-dl-btn');
    if (btn) {
      btn.innerHTML = isDl ? '✓' : '⬇';
      btn.classList.toggle('is-downloaded', isDl);
    }
  });

  row.addEventListener('click', (e) => {
    if (e.target.closest('.row-actions')) return;
    const idx = state.queue.findIndex(t => t.id === track.id);
    if (idx !== -1) {
      loadAndPlay(idx, true);
    } else {
      state.queue.push(track);
      loadAndPlay(state.queue.length - 1, true);
    }
  });

  row.querySelector('.row-fav-btn').onclick = (e) => {
    e.stopPropagation();
    toggleFav(track);
  };
  row.querySelector('.row-dl-btn').onclick = (e) => {
    e.stopPropagation();
    downloadTrack(track);
  };
  row.querySelector('.row-pl-btn').onclick = (e) => {
    e.stopPropagation();
    openAddToPlModal(track);
  };

  return row;
}

// ================= 10. VIEWS CONTROLLER =================
function switchView(viewName) {
  state.currentView = viewName;
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));

  const target = document.getElementById(`${viewName}View`);
  if (target) target.classList.remove('hidden');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (viewName === 'home') renderHomeGrid();
  if (viewName === 'library') renderLibrary('all');
  if (viewName === 'favorites') renderFavorites();
  if (viewName === 'downloads') renderDownloads();
}

function renderHomeGrid(filter = state.selectedGenre) {
  const grid = document.getElementById('trackGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const list = filter === 'all' ? TRACKS : TRACKS.filter(t => t.genre === filter);
  list.forEach(t => grid.appendChild(buildCard(t)));

  updateQueueUI();
}

function updateQueueUI() {
  const container = document.getElementById('playlist');
  const countEl = document.getElementById('queueCount');
  if (!container) return;
  container.innerHTML = '';

  const remaining = state.queue.slice(state.currentTrackIndex, state.currentTrackIndex + 12);
  if (countEl) countEl.textContent = `${state.queue.length} songs in queue`;

  remaining.forEach((track, i) => {
    container.appendChild(buildRow(track, i, true));
  });
}

function renderFavorites() {
  const list = document.getElementById('favoriteList');
  if (!list) return;
  list.innerHTML = '';

  if (state.favorites.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <span>♥</span>
        <h3>No favorite songs yet</h3>
        <p>Like songs using the heart icon to add them to your favorites.</p>
      </div>
    `;
    return;
  }

  state.favorites.forEach((t, i) => list.appendChild(buildRow(t, i)));
}

function renderDownloads() {
  const list = document.getElementById('downloadList');
  if (!list) return;
  list.innerHTML = '';

  if (state.downloads.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <span>⬇</span>
        <h3>No downloaded tracks</h3>
        <p>Click the ⬇ button on any song to save it for offline playback.</p>
      </div>
    `;
    return;
  }

  state.downloads.forEach((t, i) => list.appendChild(buildRow(t, i)));
}

function renderLibrary(tab = 'all') {
  const list = document.getElementById('libraryList');
  if (!list) return;
  list.innerHTML = '';

  document.querySelectorAll('.lib-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });

  let items = [];
  if (tab === 'all') {
    const map = new Map();
    [...state.downloads, ...state.favorites, ...state.localFiles].forEach(t => map.set(t.id, t));
    items = Array.from(map.values());
  } else if (tab === 'downloads') {
    items = state.downloads;
  } else if (tab === 'favorites') {
    items = state.favorites;
  } else if (tab === 'local') {
    items = state.localFiles;
  } else if (tab === 'playlists') {
    renderPlaylistsInLibrary(list);
    return;
  }

  if (items.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <span>▣</span>
        <h3>No items found in this section</h3>
        <p>Explore trending songs or download tracks to build your library.</p>
      </div>
    `;
    return;
  }

  items.forEach((t, i) => list.appendChild(buildRow(t, i)));
}

function renderPlaylistsInLibrary(container) {
  if (state.playlists.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <span>📁</span>
        <h3>No playlists created yet</h3>
        <p>Create a custom playlist to organize your favorite Telugu and Bollywood hits.</p>
        <button id="libCreatePlBtn" class="primary-btn" style="margin-top:10px;">＋ Create Playlist</button>
      </div>
    `;
    const btn = document.getElementById('libCreatePlBtn');
    if (btn) btn.onclick = openCreatePlModal;
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'track-grid';
  grid.style.padding = '16px';
  state.playlists.forEach(pl => {
    const card = document.createElement('div');
    card.className = 'track-card';
    card.innerHTML = `
      <div class="cover" style="font-size:36px;">📁</div>
      <div class="track-title">${pl.name}</div>
      <div class="track-meta">${pl.tracks.length} songs</div>
    `;
    card.onclick = () => openCustomPlaylistView(pl);
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

function renderSidebarPlaylists() {
  const container = document.getElementById('sidebarPlaylists');
  if (!container) return;
  container.innerHTML = '';

  state.playlists.forEach(pl => {
    const btn = document.createElement('button');
    btn.className = 'playlist-chip';
    btn.textContent = `📁 ${pl.name}`;
    btn.onclick = () => openCustomPlaylistView(pl);
    container.appendChild(btn);
  });
}

function openCustomPlaylistView(pl) {
  switchView('playlistDetail');
  document.getElementById('customPlTitle').textContent = pl.name;
  document.getElementById('customPlDesc').textContent = pl.description || `${pl.tracks.length} songs`;

  const container = document.getElementById('playlistTracksList');
  container.innerHTML = '';

  if (pl.tracks.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <span>📁</span>
        <h3>This playlist is empty</h3>
        <p>Add songs to this playlist using the ＋ button on any song card.</p>
      </div>
    `;
  } else {
    pl.tracks.forEach((t, i) => container.appendChild(buildRow(t, i)));
  }

  document.getElementById('playCustomPlBtn').onclick = () => {
    if (pl.tracks.length === 0) return;
    state.queue = [...pl.tracks];
    loadAndPlay(0, true);
  };

  document.getElementById('deleteCustomPlBtn').onclick = async () => {
    if (confirm(`Delete playlist "${pl.name}"?`)) {
      const store = await window.hubDB.getStore('playlists', 'readwrite');
      store.delete(pl.id);
      notify(`Deleted "${pl.name}"`, 'info');
      await refreshData();
      switchView('library');
    }
  };
}

// ================= 11. LIVE SEARCH (ITUNES & CURATED) =================
let searchTimer = null;

async function runSearch(query) {
  query = query.trim();
  const grid = document.getElementById('trackGrid');
  const spinner = document.getElementById('searchSpinner');
  const heading = document.getElementById('gridHeading');

  if (!query) {
    if (heading) heading.textContent = 'Trending & Available Songs';
    renderHomeGrid();
    return;
  }

  if (heading) heading.textContent = `Search results for "${query}"`;
  if (spinner) spinner.style.display = 'block';

  // Filter curated
  const curated = TRACKS.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.artist.toLowerCase().includes(query.toLowerCase())
  );

  let remote = [];

  // If online, search iTunes
  if (!state.isOfflineMode) {
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=24`);
      if (res.ok) {
        const d = await res.json();
        remote = (d.results || []).map(t => ({
          id: 'itunes_' + t.trackId,
          title: t.trackName,
          artist: t.artistName,
          album: t.collectionName || 'Single',
          duration: Math.round(t.trackTimeMillis / 1000) || 30,
          cover: t.artworkUrl100 ? t.artworkUrl100.replace('100x100bb', '600x600bb') : '',
          audioSrc: t.previewUrl,
          genre: 'search'
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  }

  if (spinner) spinner.style.display = 'none';

  const merged = [...curated];
  remote.forEach(r => {
    if (!merged.some(m => m.title.toLowerCase() === r.title.toLowerCase())) {
      merged.push(r);
    }
  });

  if (grid) {
    grid.innerHTML = '';
    if (merged.length === 0) {
      grid.innerHTML = `
        <div class="empty" style="grid-column: 1 / -1;">
          <span>🔍</span>
          <h3>No songs found for "${query}"</h3>
          <p>Try searching for a different song or artist.</p>
        </div>
      `;
    } else {
      merged.forEach(t => grid.appendChild(buildCard(t)));
    }
  }
}

// ================= 12. AUTHENTICATION =================
function openAuthModal(msg = '') {
  const modal = document.getElementById('authModal');
  const errL = document.getElementById('loginError');
  const errS = document.getElementById('signupError');
  if (errL) {
    errL.textContent = msg || '';
    if (msg) errL.classList.remove('hidden');
    else errL.classList.add('hidden');
  }
  if (errS) errS.classList.add('hidden');
  if (modal) modal.classList.remove('hidden');
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) modal.classList.add('hidden');
}

async function loginSuccess(user, showToast = true) {
  state.currentUser = user;
  closeAuthModal();

  const isGuest = !user || user.id === 'usr_guest';

  const headerLoginBtn = document.getElementById('headerLoginBtn');
  const menuLoginBtn = document.getElementById('menuLoginBtn');
  const menuLogoutBtn = document.getElementById('menuLogoutBtn');
  const userNameEl = document.getElementById('userName');
  const userAvatarEl = document.getElementById('userAvatar');
  const dropdownUsernameEl = document.getElementById('dropdownUsername');
  const dropdownEmailEl = document.getElementById('dropdownEmail');

  if (isGuest) {
    if (userNameEl) userNameEl.textContent = 'Guest';
    if (userAvatarEl) userAvatarEl.textContent = '🎧';
    if (dropdownUsernameEl) dropdownUsernameEl.textContent = 'Guest Listener';
    if (dropdownEmailEl) dropdownEmailEl.textContent = 'Not signed in';

    if (headerLoginBtn) headerLoginBtn.classList.remove('hidden');
    if (menuLoginBtn) menuLoginBtn.classList.remove('hidden');
    if (menuLogoutBtn) menuLogoutBtn.classList.add('hidden');
  } else {
    if (userNameEl) userNameEl.textContent = user.username;
    if (userAvatarEl) userAvatarEl.textContent = user.avatar || '🎧';
    if (dropdownUsernameEl) dropdownUsernameEl.textContent = user.username;
    if (dropdownEmailEl) dropdownEmailEl.textContent = user.email;

    if (headerLoginBtn) headerLoginBtn.classList.add('hidden');
    if (menuLoginBtn) menuLoginBtn.classList.add('hidden');
    if (menuLogoutBtn) menuLogoutBtn.classList.remove('hidden');

    if (showToast) {
      notify(`Welcome, ${user.username}! 🎉`, 'success');
    }
  }

  await refreshData();
}

function continueAsGuest(showToast = false) {
  const guest = {
    id: 'usr_guest',
    username: 'Guest Listener',
    email: 'guest@audiostreamerhub.com',
    avatar: '🎧'
  };
  window.hubDB.setCurrentSession(guest);
  loginSuccess(guest, showToast);
}

function logout() {
  window.hubDB.logout();
  continueAsGuest(false);
  notify('Signed out successfully', 'info');
  openAuthModal();
}

// ================= 13. PLAYLIST MODALS =================
function openCreatePlModal() {
  document.getElementById('playlistModal').classList.remove('hidden');
}

function openAddToPlModal(track) {
  if (!state.currentUser) {
    openAuthModal('Please sign in to add songs to playlists.');
    return;
  }
  const modal = document.getElementById('addToPlModal');
  const list = document.getElementById('addToPlList');
  if (!modal || !list) return;

  list.innerHTML = '';
  if (state.playlists.length === 0) {
    list.innerHTML = `<p style="font-size:13px; color:var(--muted); padding:8px;">No playlists created yet.</p>`;
  } else {
    state.playlists.forEach(pl => {
      const btn = document.createElement('button');
      btn.className = 'playlist-chip';
      btn.textContent = `📁 ${pl.name} (${pl.tracks.length} songs)`;
      btn.onclick = async () => {
        await window.hubDB.addTrackToPlaylist(pl.id, track);
        notify(`Added "${track.title}" to "${pl.name}"`, 'success');
        modal.classList.add('hidden');
        await refreshData();
      };
      list.appendChild(btn);
    });
  }
  modal.classList.remove('hidden');
}

// ================= 14. LOCAL AUDIO FILE UPLOAD =================
function initLocalUpload() {
  const btn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('fileInput');

  if (btn && fileInput) {
    btn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      files.forEach(f => {
        const item = {
          id: 'local_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          title: f.name.replace(/\.[^/.]+$/, ""),
          artist: "Local Audio",
          album: "My Computer",
          duration: 180,
          cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
          audioSrc: URL.createObjectURL(f),
          genre: "local",
          isDownloaded: true
        };
        state.localFiles.push(item);
        state.queue.push(item);
      });

      notify(`Added ${files.length} audio file(s) to My Library!`, 'success');
      switchView('library');
      renderLibrary('local');
    };
  }
}

// ================= 15. ATTACH EVENT HANDLERS =================
function setupHandlers() {
  // Navigation
  document.querySelectorAll('[data-view]').forEach(b => {
    b.onclick = () => switchView(b.dataset.view);
  });

  // Playback Controls
  document.getElementById('playBtn').onclick = togglePlay;
  document.getElementById('nextBtn').onclick = nextTrack;
  document.getElementById('prevBtn').onclick = prevTrack;

  document.getElementById('shuffleBtn').onclick = () => {
    state.isShuffle = !state.isShuffle;
    document.getElementById('shuffleBtn').classList.toggle('active', state.isShuffle);
    notify(state.isShuffle ? 'Shuffle ON' : 'Shuffle OFF', 'info');
  };

  document.getElementById('repeatBtn').onclick = () => {
    const btn = document.getElementById('repeatBtn');
    if (state.repeatMode === 'off') {
      state.repeatMode = 'all';
      btn.classList.add('active');
      notify('Repeat All ON', 'info');
    } else if (state.repeatMode === 'all') {
      state.repeatMode = 'one';
      btn.innerHTML = '🔂';
      notify('Repeat One ON', 'info');
    } else {
      state.repeatMode = 'off';
      btn.classList.remove('active');
      btn.innerHTML = '↻';
      notify('Repeat OFF', 'info');
    }
  };

  // Timeline
  const prog = document.getElementById('progress');
  const curTime = document.getElementById('currentTime');
  const durTime = document.getElementById('duration');

  audio.ontimeupdate = () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    prog.value = pct;
    curTime.textContent = formatTime(audio.currentTime);
    durTime.textContent = formatTime(audio.duration);
  };

  prog.oninput = (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  };

  audio.onended = () => {
    if (state.repeatMode === 'one') {
      audio.currentTime = 0;
      audio.play();
    } else {
      nextTrack();
    }
  };

  // Volume
  const vol = document.getElementById('volume');
  if (vol) vol.oninput = (e) => setVolume(e.target.value);
  document.getElementById('volumeIcon').onclick = toggleMute;

  // Search input
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClearBtn');

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value;
    searchClear.classList.toggle('hidden', !q);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (state.currentView !== 'home') switchView('home');
      runSearch(q);
    }, 300);
  });

  searchClear.onclick = () => {
    searchInput.value = '';
    searchClear.classList.add('hidden');
    runSearch('');
  };

  // Search quick tags
  document.querySelectorAll('.search-chip').forEach(c => {
    c.onclick = () => {
      const q = c.dataset.search;
      searchInput.value = q;
      searchClear.classList.remove('hidden');
      runSearch(q);
    };
  });

  // Featured Genre Chips
  document.querySelectorAll('.playlist-chip[data-genre]').forEach(c => {
    c.onclick = () => {
      state.selectedGenre = c.dataset.genre;
      switchView('home');
      renderHomeGrid(state.selectedGenre);
    };
  });

  // Online / Offline Mode button
  document.getElementById('modeBtn').onclick = () => setMode(!state.isOfflineMode);
  document.getElementById('bannerGoOnlineBtn').onclick = () => setMode(false);
  document.getElementById('menuOfflineBtn').onclick = () => {
    setMode(true);
    document.getElementById('userDropdown').classList.add('hidden');
  };

  // Player action buttons
  document.getElementById('favBtn').onclick = () => toggleFav(state.currentTrack);
  document.getElementById('dlBtn').onclick = () => downloadTrack(state.currentTrack);

  // Hero Actions
  document.getElementById('heroPlayBtn').onclick = () => loadAndPlay(0, true);
  document.getElementById('heroDlAlbumBtn').onclick = async () => {
    const devara = TRACKS.filter(t => t.album.includes('Devara'));
    for (const t of devara) {
      await downloadTrack(t);
    }
  };

  // Reset Queue button
  document.getElementById('clearBtn').onclick = () => {
    state.queue = [state.currentTrack];
    state.currentTrackIndex = 0;
    updateQueueUI();
    notify('Queue reset', 'info');
  };

  // Library & Favorites actions
  document.getElementById('libPlayAllBtn').onclick = () => {
    const all = [...state.downloads, ...state.favorites];
    if (all.length > 0) {
      state.queue = all;
      loadAndPlay(0, true);
    }
  };
  document.getElementById('playAllFavsBtn').onclick = () => {
    if (state.favorites.length > 0) {
      state.queue = [...state.favorites];
      loadAndPlay(0, true);
    }
  };
  document.getElementById('shuffleFavsBtn').onclick = () => {
    if (state.favorites.length > 0) {
      state.queue = [...state.favorites];
      state.isShuffle = true;
      document.getElementById('shuffleBtn').classList.add('active');
      loadAndPlay(Math.floor(Math.random() * state.queue.length), true);
    }
  };
  document.getElementById('downloadAllFavsBtn').onclick = async () => {
    for (const t of state.favorites) {
      await downloadTrack(t);
    }
  };
  document.getElementById('playAllDlsBtn').onclick = () => {
    if (state.downloads.length > 0) {
      state.queue = [...state.downloads];
      loadAndPlay(0, true);
    }
  };
  document.getElementById('shuffleDlsBtn').onclick = () => {
    if (state.downloads.length > 0) {
      state.queue = [...state.downloads];
      state.isShuffle = true;
      document.getElementById('shuffleBtn').classList.add('active');
      loadAndPlay(Math.floor(Math.random() * state.queue.length), true);
    }
  };

  // Library tabs
  document.querySelectorAll('.lib-tab').forEach(b => {
    b.onclick = () => renderLibrary(b.dataset.tab);
  });

  // User Profile Dropdown & Header Login Button
  const headerLoginBtn = document.getElementById('headerLoginBtn');
  if (headerLoginBtn) {
    headerLoginBtn.onclick = () => openAuthModal();
  }

  const userBtn = document.getElementById('userBtn');
  const userDropdown = document.getElementById('userDropdown');
  userBtn.onclick = (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('hidden');
  };
  document.addEventListener('click', () => userDropdown.classList.add('hidden'));

  document.getElementById('menuLoginBtn').onclick = () => {
    userDropdown.classList.add('hidden');
    openAuthModal();
  };
  document.getElementById('menuLogoutBtn').onclick = logout;
  document.getElementById('closeAuthBtn').onclick = closeAuthModal;

  // Modal Backdrop click to close & Escape key
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
      if (userDropdown) userDropdown.classList.add('hidden');
    }
  });

  // Auth Form tabs & Switchers
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const formLogin = document.getElementById('loginForm');
  const formSignup = document.getElementById('signupForm');

  const clearAuthErrors = () => {
    const errL = document.getElementById('loginError');
    const errS = document.getElementById('signupError');
    if (errL) errL.classList.add('hidden');
    if (errS) errS.classList.add('hidden');
  };

  const showLoginTab = () => {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    formLogin.classList.remove('hidden');
    formSignup.classList.add('hidden');
    clearAuthErrors();
  };

  const showSignupTab = () => {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    formSignup.classList.remove('hidden');
    formLogin.classList.add('hidden');
    clearAuthErrors();
  };

  tabLogin.onclick = showLoginTab;
  tabSignup.onclick = showSignupTab;

  const toSignupLink = document.getElementById('toSignupLink');
  if (toSignupLink) toSignupLink.onclick = showSignupTab;

  const toLoginLink = document.getElementById('toLoginLink');
  if (toLoginLink) toLoginLink.onclick = showLoginTab;

  // Password visibility toggles
  const setupPwdToggle = (inputId, btnId) => {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input || !btn) return;
    btn.onclick = () => {
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🔒';
      } else {
        input.type = 'password';
        btn.textContent = '👁';
      }
    };
  };
  setupPwdToggle('loginPassword', 'toggleLoginPwd');
  setupPwdToggle('signupPassword', 'toggleSignupPwd');

  // Avatar select
  let selectedAvatar = '🎧';
  document.querySelectorAll('.avatar-opt').forEach(opt => {
    opt.onclick = () => {
      document.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedAvatar = opt.dataset.avatar;
    };
  });

  // 1-Click Quick Demo Login
  const quickDemoBtn = document.getElementById('quickDemoBtn');
  if (quickDemoBtn) {
    quickDemoBtn.onclick = async () => {
      clearAuthErrors();
      const emailField = document.getElementById('loginEmail');
      const passField = document.getElementById('loginPassword');
      if (emailField) emailField.value = 'demo@hub.com';
      if (passField) passField.value = 'password123';
      try {
        const u = await window.hubDB.loginUser('demo@hub.com', 'password123');
        await loginSuccess(u, true);
      } catch (errObj) {
        try {
          const u = await window.hubDB.registerUser('Chaithanya (Demo)', 'demo@hub.com', 'password123', '🎧');
          await loginSuccess(u, true);
        } catch (e) {
          const errL = document.getElementById('loginError');
          if (errL) {
            errL.textContent = e.message;
            errL.classList.remove('hidden');
          }
        }
      }
    };
  }

  // Form Submissions
  formLogin.onsubmit = async (e) => {
    e.preventDefault();
    clearAuthErrors();
    const em = document.getElementById('loginEmail').value;
    const pw = document.getElementById('loginPassword').value;
    const err = document.getElementById('loginError');
    try {
      const u = await window.hubDB.loginUser(em, pw);
      loginSuccess(u, true);
    } catch (errObj) {
      err.textContent = errObj.message;
      err.classList.remove('hidden');
    }
  };

  formSignup.onsubmit = async (e) => {
    e.preventDefault();
    clearAuthErrors();
    const name = document.getElementById('signupUsername').value;
    const em = document.getElementById('signupEmail').value;
    const pw = document.getElementById('signupPassword').value;
    const err = document.getElementById('signupError');
    try {
      const u = await window.hubDB.registerUser(name, em, pw, selectedAvatar);
      loginSuccess(u, true);
    } catch (errObj) {
      err.textContent = errObj.message;
      err.classList.remove('hidden');
    }
  };

  document.getElementById('guestBtn').onclick = () => continueAsGuest(true);

  // Audio Settings Modal
  const settingsModal = document.getElementById('settingsModal');
  const openSettings = () => settingsModal.classList.remove('hidden');
  const closeSettings = () => settingsModal.classList.add('hidden');

  document.getElementById('settingsBtn').onclick = openSettings;
  document.getElementById('playerSettingsBtn').onclick = openSettings;
  document.getElementById('menuSettingsBtn').onclick = openSettings;
  document.getElementById('closeSettingsBtn').onclick = closeSettings;
  document.getElementById('applySettingsBtn').onclick = () => {
    notify('Settings saved', 'success');
    closeSettings();
  };

  document.getElementById('settingsVolRange').oninput = (e) => setVolume(e.target.value);

  // Speed buttons
  document.querySelectorAll('.speed-btn').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('.speed-btn').forEach(s => s.classList.remove('active'));
      b.classList.add('active');
      const rate = parseFloat(b.dataset.speed);
      state.playbackRate = rate;
      audio.playbackRate = rate;
      document.getElementById('settingsSpeedDisplay').textContent = `${rate}x`;
    };
  });

  // Equalizer presets & sliders
  document.querySelectorAll('.eq-preset-chip').forEach(c => {
    c.onclick = () => applyPreset(c.dataset.preset);
  });

  [60, 230, 910, 3600, 14000].forEach(freq => {
    const input = document.getElementById(`band${freq}`);
    const val = document.getElementById(`eqVal${freq}`);
    if (input) {
      input.oninput = (e) => {
        const gain = parseFloat(e.target.value);
        state.eqBands[freq] = gain;
        if (state.filters.length) {
          const f = state.filters.find(fl => Math.round(fl.frequency.value) === freq);
          if (f) f.gain.value = gain;
        }
        if (val) val.textContent = `${gain > 0 ? '+' : ''}${gain}dB`;
      };
    }
  });

  // Playlist Modals
  document.getElementById('sidebarNewPlBtn').onclick = openCreatePlModal;
  document.getElementById('closePlModalBtn').onclick = () => {
    document.getElementById('playlistModal').classList.add('hidden');
  };
  document.getElementById('closeAddToPlBtn').onclick = () => {
    document.getElementById('addToPlModal').classList.add('hidden');
  };

  document.getElementById('createPlForm').onsubmit = async (e) => {
    e.preventDefault();
    if (!state.currentUser) {
      openAuthModal('Please sign in to create playlists.');
      return;
    }
    const name = document.getElementById('newPlName').value;
    const desc = document.getElementById('newPlDesc').value;
    await window.hubDB.createPlaylist(state.currentUser.id, name, desc);
    document.getElementById('playlistModal').classList.add('hidden');
    document.getElementById('createPlForm').reset();
    notify(`Created playlist "${name}"`, 'success');
    await refreshData();
  };

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowRight') {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    } else if (e.code === 'ArrowLeft') {
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    } else if (e.code === 'ArrowUp') {
      e.preventDefault();
      setVolume(state.volume + 0.05);
    } else if (e.code === 'ArrowDown') {
      e.preventDefault();
      setVolume(state.volume - 0.05);
    } else if (e.code === 'KeyM') {
      toggleMute();
    }
  });

  // Local audio upload
  initLocalUpload();
}

// ================= 16. INITIALIZE =================
async function init() {
  try {
    await window.hubDB.init();
    setupHandlers();
    renderHomeGrid();
    setVolume(0.8);

    const session = window.hubDB.getCurrentSession();
    if (session && session.id && session.id !== 'usr_guest') {
      await loginSuccess(session, false);
    } else {
      continueAsGuest(false);
    }

    // Prepare first track ready
    loadAndPlay(0, false);
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener('DOMContentLoaded', init);
