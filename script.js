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
let TRACKS = [
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
    this.history = [];
    this.localFiles = [];
    this.isApiConnected = false;
    this.activeFriendId = 'fr_1';
    this.sharingTrack = null;
    this.sleepTimerId = null;
    this.sleepTimerEnd = null;
    this.sleepTimerToEndOfTrack = false;
    this.chatAttachedTrack = null;

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

// Resilient API Helper
async function apiRequest(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

async function checkApiConnection() {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      state.isApiConnected = data.status === 'ok';
    } else {
      state.isApiConnected = false;
    }
  } catch (_e) {
    state.isApiConnected = false;
  }
}

// Membership Plans Definitions
const PLANS = [
  { id: 'free', name: 'Free', priceInr: 0, interval: 'forever', features: ['Stream music previews', 'Create playlists', 'Like songs', 'Offline download demo'] },
  { id: 'plus', name: 'Hub Plus', priceInr: 99, interval: 'month', features: ['Ad-free listening demo', 'High quality audio demo', 'Unlimited skips', 'Offline library'] },
  { id: 'family', name: 'Hub Family', priceInr: 149, interval: 'month', features: ['Everything in Plus', 'Up to 6 profiles', 'Shared family plan demo'] }
];
const PLAN_NAMES = { free: 'Free', plus: 'Hub Plus', family: 'Hub Family' };

async function refreshSubscription() {
  const name = document.getElementById('currentPlanName');
  const description = document.getElementById('currentPlanDescription');
  const cancel = document.getElementById('cancelPlanBtn');
  if (!name || !description || !cancel) return;
  if (!state.currentUser || state.currentUser.id === 'usr_guest') {
    name.textContent = 'Free';
    description.textContent = 'You are listening on the free plan.';
    cancel.classList.add('hidden');
    return;
  }
  let sub = { planId: 'free' };
  try {
    if (state.isApiConnected) {
      const res = await apiRequest('/api/subscription').catch(() => null);
      if (res?.subscription) sub = res.subscription;
      else sub = await window.hubDB.getSubscription(state.currentUser.id);
    } else {
      sub = await window.hubDB.getSubscription(state.currentUser.id);
    }
  } catch (_e) {
    sub = await window.hubDB.getSubscription(state.currentUser.id);
  }
  const planId = sub?.planId || 'free';
  name.textContent = PLAN_NAMES[planId] || 'Free';
  description.textContent = planId === 'free' ? 'You are listening on the free plan.' : `Your ${PLAN_NAMES[planId]} demo plan is active.`;
  cancel.classList.toggle('hidden', planId === 'free');
}

async function renderPlans() {
  const grid = document.getElementById('plansGrid');
  if (!grid) return;
  let activePlan = 'free';
  if (state.currentUser && state.currentUser.id !== 'usr_guest') {
    try {
      const sub = await window.hubDB.getSubscription(state.currentUser.id);
      if (sub?.planId) activePlan = sub.planId;
    } catch (_e) {}
  }
  grid.innerHTML = '';
  PLANS.forEach(plan => {
    const card = document.createElement('article');
    card.className = `plan-card ${plan.id === 'plus' ? 'featured' : ''}`;
    const features = plan.features.map(f => `<li>${f}</li>`).join('');
    const price = plan.priceInr === 0 ? 'Free' : `₹${plan.priceInr}<small> / month</small>`;
    const isCurrent = plan.id === activePlan;
    const actionText = isCurrent ? 'Current Plan' : (plan.id === 'free' ? 'Included' : 'Activate Demo Plan');
    card.innerHTML = `
      <h2>${plan.name}</h2>
      <p class="plan-copy">${plan.id === 'free' ? 'A simple place to start listening.' : 'A project demonstration of a premium membership.'}</p>
      <div class="plan-price">${price}</div>
      <ul class="plan-features">${features}</ul>
      <button class="primary-btn plan-action" type="button" data-plan-id="${plan.id}" ${isCurrent || plan.id === 'free' ? 'disabled' : ''}>${actionText}</button>
      ${plan.id === 'free' ? '' : '<p class="plan-note">Demo only. No payment is collected and paid benefits are simulated.</p>'}
    `;
    const actionBtn = card.querySelector('[data-plan-id]');
    if (actionBtn && plan.id !== 'free' && !isCurrent) {
      actionBtn.addEventListener('click', async () => {
        if (!state.currentUser || state.currentUser.id === 'usr_guest') {
          openAuthModal('Sign in to activate a demo plan.');
          return;
        }
        await window.hubDB.setSubscription(state.currentUser.id, plan.id);
        if (state.isApiConnected) {
          apiRequest('/api/subscription/checkout', { method: 'POST', body: JSON.stringify({ planId: plan.id }) }).catch(() => {});
        }
        notify(`🎉 ${plan.name} demo plan activated!`, 'success');
        await refreshSubscription();
        await renderPlans();
      });
    }
    grid.appendChild(card);
  });
}

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

  // Record into listening history
  if (state.currentUser) {
    window.hubDB.addHistory(state.currentUser.id, track).catch(() => {});
    if (state.isApiConnected) {
      apiRequest('/api/history', { method: 'POST', body: JSON.stringify({ track }) }).catch(() => {});
    }
  }

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
  state.history = await window.hubDB.getHistory(state.currentUser.id);

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
      <button class="card-share-btn" title="Send to Friends (Instagram DM)">✈</button>
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
  card.querySelector('.card-share-btn').onclick = (e) => {
    e.stopPropagation();
    openShareModal(track);
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
      <button class="row-share-btn" title="Send to Friends (Instagram DM)">✈</button>
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
  row.querySelector('.row-share-btn').onclick = (e) => {
    e.stopPropagation();
    openShareModal(track);
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
  if (viewName === 'plans') renderPlans();
  if (viewName === 'messages') renderMessagesView();
  if (viewName === 'database') renderDatabaseHub();
  if (viewName === 'admin') renderAdminView();
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
  } else if (tab === 'history') {
    items = (state.history || []).map(h => h.track || h).filter(Boolean);
  } else if (tab === 'playlists') {
    renderPlaylistsInLibrary(list);
    return;
  }

  if (items.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <span>${tab === 'history' ? '⌛' : '▣'}</span>
        <h3>${tab === 'history' ? 'No listening history yet' : 'No items found in this section'}</h3>
        <p>${tab === 'history' ? 'Play any song to see it in your history.' : 'Explore trending songs or download tracks to build your library.'}</p>
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
  await refreshSubscription();
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


// ================= 14B. KARAOKE LIVE LYRICS VIEWER =================
const TRACK_LYRICS = {
  trk_1761152593: [
    { time: 0, text: "♪ Chuttamalle chuttukuntive... ♪" },
    { time: 5, text: "Matthuloki dintu vuntive" },
    { time: 10, text: "Gunde poyye gundeloki vachi cheeruthave" },
    { time: 17, text: "Naalo nannu daachi petti nuvve ninnu kanti vuntive" },
    { time: 24, text: "Chuttamalle chuttukuntive... matthuloki dintu vuntive" },
    { time: 32, text: "Naa chethi gari gaare nuvve... naa kanne choopu nuvve" },
    { time: 40, text: "♪ Anirudh beats intensifying ♪" },
    { time: 50, text: "Chuttamalle... Chuttamalle!" }
  ],
  trk_1747191476: [
    { time: 0, text: "♪ All Hail the Tiger! ♪" },
    { time: 5, text: "Raktham tho raasina charitha idhi" },
    { time: 11, text: "Bayapade vaadu brathikunte bayapettina vaadu devudura!" },
    { time: 18, text: "Thala vanchani dhairyam tho nadiche raaju" },
    { time: 24, text: "The Red Sea knows his name!" },
    { time: 30, text: "♪ Fear Song - Devara theme roar ♪" },
    { time: 42, text: "Bhayame thana aayudhamai... Jagathe thana saakshyamai!" }
  ],
  trk_1744162427: [
    { time: 0, text: "♪ Pushpa... Pushparaj! ♪" },
    { time: 4, text: "Asalu thaggedhe le!" },
    { time: 9, text: "Pushpa Pushpa Pushpa... Pushparaj!" },
    { time: 15, text: "Galli nunchi Delhi daaka evadiki thalavanchani peru" },
    { time: 22, text: "Rajyam nadipisthaadu... Rajugala doralaki thodu!" },
    { time: 30, text: "♪ Devi Sri Prasad beat drop ♪" },
    { time: 38, text: "Thaggedhe le! Asalu thaggedhe le!" }
  ],
  trk_1594544794: [
    { time: 0, text: "♪ Komuram Bheemudo... Naatu Naatu! ♪" },
    { time: 4, text: "Polam gattu dhummulona potlethe gattulaaga" },
    { time: 10, text: "Naatu Naatu Naatu Naatu... Veera Naatu!" },
    { time: 16, text: "Gundeladhire chematha chimme oopu choosi dhoosukellu" },
    { time: 23, text: "Naatu Naatu Naatu Naatu Naatu Koothu!" },
    { time: 30, text: "♪ Keeravani Academy Award winning groove ♪" }
  ],
  trk_1600014695: [
    { time: 0, text: "♪ Oo Antava Mawa... Oo Oo Antava Mawa ♪" },
    { time: 5, text: "Mee magavaari theere veru... manasu kante maate veru" },
    { time: 12, text: "Kallathone choosthaaru... daaham theerchukuntaaru" },
    { time: 18, text: "Oo Antava Mawa... Oo Oo Antava Mawa!" },
    { time: 26, text: "Thappante thappelaa avuthundi... thappe meeru chesthunte!" }
  ],
  trk_1723602835: [
    { time: 0, text: "♪ Kurchi Madathapetti... Kurchi Madathapetti! ♪" },
    { time: 4, text: "Thaman beats on fire! 🔥" },
    { time: 8, text: "Maava... hey maava!" },
    { time: 14, text: "Kurchi Madathapetti danchudu shuru chesthe" },
    { time: 20, text: "Mass step-lu pettesthaam guntur kaaram tho!" }
  ],
  trk_1542842761: [
    { time: 0, text: "♪ Synthesizer intro ♪" },
    { time: 4, text: "Yeah..." },
    { time: 8, text: "I've been on my own for long enough" },
    { time: 13, text: "Maybe you can show me how to love, maybe" },
    { time: 18, text: "I look around and Sin City's cold and empty" },
    { time: 24, text: "No one's around to judge me" },
    { time: 28, text: "I can't see clearly when you're gone" },
    { time: 33, text: "I said, ooh, I'm blinded by the lights!" }
  ]
};

function getTrackLyrics(track) {
  if (!track) return [];
  if (TRACK_LYRICS[track.id]) return TRACK_LYRICS[track.id];
  return [
    { time: 0, text: `♪ Listening to "${track.title}" ♪` },
    { time: 4, text: `Artist: ${track.artist}` },
    { time: 9, text: `Album: ${track.album || 'Single'}` },
    { time: 14, text: "♪ Feel the melodic rhythm and harmony ♪" },
    { time: 20, text: "Sing along and vibe to this high-fidelity audio stream 🎧" },
    { time: 28, text: "♪ Beat crescendo & baseline ♪" },
    { time: 36, text: `Enjoying ${track.title} on Audio Streamer Hub!` }
  ];
}

function openLyricsModal() {
  const modal = document.getElementById('lyricsModal');
  const title = document.getElementById('lyricsTrackTitle');
  const artist = document.getElementById('lyricsTrackArtist');
  const container = document.getElementById('lyricsContent');
  if (!modal || !container) return;

  const track = state.currentTrack;
  if (title) title.textContent = track.title;
  if (artist) artist.textContent = track.artist;

  container.innerHTML = '';
  const lyrics = getTrackLyrics(track);

  lyrics.forEach((item, index) => {
    const line = document.createElement('div');
    line.className = 'lyrics-line';
    line.dataset.time = item.time;
    line.dataset.index = index;
    line.textContent = item.text;
    line.onclick = () => {
      audio.currentTime = item.time;
      syncLyricsLine(item.time);
    };
    container.appendChild(line);
  });

  modal.classList.remove('hidden');
  syncLyricsLine(audio.currentTime);
}

function closeLyricsModal() {
  const modal = document.getElementById('lyricsModal');
  if (modal) modal.classList.add('hidden');
}

function syncLyricsLine(currentTime) {
  const container = document.getElementById('lyricsContent');
  if (!container || document.getElementById('lyricsModal')?.classList.contains('hidden')) return;

  const lines = container.querySelectorAll('.lyrics-line');
  if (!lines.length) return;

  let activeIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const t = parseFloat(lines[i].dataset.time);
    if (currentTime >= t) {
      activeIndex = i;
    } else {
      break;
    }
  }

  lines.forEach((l, idx) => {
    if (idx === activeIndex) {
      l.classList.add('active');
      l.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      l.classList.remove('active');
    }
  });
}

// ================= 14C. SLEEP TIMER CONTROLLER =================
function openTimerModal() {
  const modal = document.getElementById('timerModal');
  if (!modal) return;
  updateTimerModalUI();
  modal.classList.remove('hidden');
}

function closeTimerModal() {
  const modal = document.getElementById('timerModal');
  if (modal) modal.classList.add('hidden');
}

function setSleepTimer(minutes) {
  cancelSleepTimer(false);

  const timerBtn = document.getElementById('sleepTimerBtn');

  if (minutes === 'end') {
    state.sleepTimerToEndOfTrack = true;
    state.sleepTimerEnd = null;
    notify('Sleep Timer set: Will pause when current track ends 🌙', 'success');
    if (timerBtn) {
      timerBtn.classList.add('active');
      timerBtn.title = 'Sleep Timer: End of Track';
    }
  } else {
    state.sleepTimerToEndOfTrack = false;
    const mins = parseInt(minutes, 10);
    state.sleepTimerEnd = Date.now() + (mins * 60 * 1000);

    notify(`Sleep Timer set: Music will pause in ${mins} minutes 🌙`, 'success');
    if (timerBtn) {
      timerBtn.classList.add('active');
      timerBtn.title = `Sleep Timer: ${mins}m active`;
    }

    state.sleepTimerId = setInterval(() => {
      const remaining = state.sleepTimerEnd - Date.now();
      if (remaining <= 0) {
        cancelSleepTimer(false);
        audio.pause();
        state.isPlaying = false;
        updatePlayBtn();
        notify('Sleep timer reached: Music stopped to let you rest 🌙', 'info');
      } else {
        updateTimerCountdownDisplay(remaining);
      }
    }, 1000);
  }

  updateTimerModalUI();
  setTimeout(closeTimerModal, 600);
}

function cancelSleepTimer(showToast = true) {
  if (state.sleepTimerId) {
    clearInterval(state.sleepTimerId);
    state.sleepTimerId = null;
  }
  state.sleepTimerEnd = null;
  state.sleepTimerToEndOfTrack = false;

  const timerBtn = document.getElementById('sleepTimerBtn');
  if (timerBtn) {
    timerBtn.classList.remove('active');
    timerBtn.title = 'Sleep Timer';
  }

  const box = document.getElementById('timerCountdownBox');
  if (box) box.classList.add('hidden');

  if (showToast) notify('Sleep Timer turned off', 'info');
  updateTimerModalUI();
}

function updateTimerModalUI() {
  const box = document.getElementById('timerCountdownBox');
  const disp = document.getElementById('timerCountdownDisplay');
  if (!box || !disp) return;

  if (state.sleepTimerToEndOfTrack) {
    box.classList.remove('hidden');
    disp.textContent = 'End of Track';
  } else if (state.sleepTimerEnd) {
    box.classList.remove('hidden');
    const remaining = Math.max(0, state.sleepTimerEnd - Date.now());
    updateTimerCountdownDisplay(remaining);
  } else {
    box.classList.add('hidden');
  }
}

function updateTimerCountdownDisplay(ms) {
  const disp = document.getElementById('timerCountdownDisplay');
  if (!disp) return;
  const totalSecs = Math.floor(ms / 1000);
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  disp.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ================= 14D. INSTAGRAM DIRECT SHARE SHEET =================
function openShareModal(track = null) {
  const modal = document.getElementById('shareModal');
  if (!modal) return;

  const targetTrack = track || state.currentTrack;
  state.sharingTrack = targetTrack;

  const artEl = document.getElementById('shareSongArt');
  const titleEl = document.getElementById('shareSongTitle');
  const artistEl = document.getElementById('shareSongArtist');
  const noteInput = document.getElementById('shareNoteInput');
  const previewPlayBtn = document.getElementById('shareSongPlayBtn');

  if (artEl) {
    artEl.innerHTML = targetTrack.cover
      ? `<img src="${targetTrack.cover}" alt="${targetTrack.title}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;">`
      : '♫';
  }
  if (titleEl) titleEl.textContent = targetTrack.title;
  if (artistEl) artistEl.textContent = targetTrack.artist;
  if (noteInput) noteInput.value = '';

  if (previewPlayBtn) {
    previewPlayBtn.onclick = () => {
      playSharedTrack(targetTrack);
      closeShareModal();
    };
  }

  // Populate Friends list in Share Sheet
  renderShareSheetFriends();

  // External share buttons
  const copyBtn = document.getElementById('copyShareLinkBtn');
  const waBtn = document.getElementById('waShareBtn');
  const igBtn = document.getElementById('instaShareBtn');

  const shareUrl = `${window.location.origin}${window.location.pathname}#track=${encodeURIComponent(targetTrack.id)}`;

  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(shareUrl).then(() => {
        notify('Song link copied to clipboard! 🔗', 'success');
      }).catch(() => {
        notify(`Link: ${shareUrl}`, 'info');
      });
    };
  }

  if (waBtn) {
    waBtn.onclick = () => {
      const text = encodeURIComponent(`Listen to "${targetTrack.title}" by ${targetTrack.artist} on Audio Streamer Hub 🎵\n${shareUrl}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    };
  }

  if (igBtn) {
    igBtn.onclick = () => {
      navigator.clipboard.writeText(`Vibing to "${targetTrack.title}" on Audio Streamer Hub 🎵 ${shareUrl}`);
      notify('Link copied! Open Instagram DM and paste to send to your friend 📸', 'success');
      window.open('https://www.instagram.com/direct/inbox/', '_blank');
    };
  }

  modal.classList.remove('hidden');
}

function closeShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) modal.classList.add('hidden');
}

function renderShareSheetFriends() {
  const container = document.getElementById('shareFriendsList');
  if (!container) return;
  container.innerHTML = '';

  const friends = window.hubDB.getFriends();
  friends.forEach(friend => {
    const item = document.createElement('div');
    item.className = 'share-friend-card';
    item.innerHTML = `
      <div class="share-friend-left">
        <span class="share-friend-avatar">${friend.avatar || '🎧'}</span>
        <div>
          <strong class="share-friend-name">${friend.name}</strong>
          <span class="share-friend-handle">${friend.handle}</span>
        </div>
      </div>
      <button class="primary-btn sm-pill share-send-btn">Send ✈</button>
    `;

    item.querySelector('.share-send-btn').onclick = async () => {
      const noteInput = document.getElementById('shareNoteInput');
      const note = noteInput ? noteInput.value.trim() : '';
      await sendSongToFriend(friend, state.sharingTrack, note);
    };

    container.appendChild(item);
  });
}

async function sendSongToFriend(friend, track, note = '') {
  if (!track) return;
  const currentUserId = state.currentUser ? state.currentUser.id : 'usr_demo_chaithanya';
  const messageText = note ? `${note} 🎵` : `Check out this song: "${track.title}"! 🎧`;

  // Save to database / local store
  await window.hubDB.sendMessage(currentUserId, friend.id, messageText, track);

  // If Express API is running, send over server too
  if (state.isApiConnected) {
    try {
      await apiRequest(`/api/messages/${friend.id}`, {
        method: 'POST',
        body: JSON.stringify({ text: messageText, track })
      });
    } catch (_e) {}
  }

  notify(`Sent "${track.title}" to ${friend.name}! ✈`, 'success');
  closeShareModal();

  // If user is currently looking at messages view, refresh
  if (state.currentView === 'messages') {
    state.activeFriendId = friend.id;
    renderMessagesView();
  }
}

// ================= 14E. DIRECT MESSAGING & FRIENDS HUB =================
let simulatedReplyTimer = null;

async function renderMessagesView() {
  const friendsList = document.getElementById('friendsList');
  if (!friendsList) return;

  const currentUserId = state.currentUser ? state.currentUser.id : 'usr_demo_chaithanya';
  const friends = window.hubDB.getFriends();
  const searchFilter = (document.getElementById('friendSearchInput')?.value || '').toLowerCase().trim();

  friendsList.innerHTML = '';

  const filteredFriends = friends.filter(f => 
    !searchFilter || f.name.toLowerCase().includes(searchFilter) || f.handle.toLowerCase().includes(searchFilter)
  );

  if (filteredFriends.length === 0) {
    friendsList.innerHTML = `<p style="padding:16px; color:var(--muted); font-size:13px;">No friends found matching "${searchFilter}".</p>`;
  } else {
    for (const friend of filteredFriends) {
      const msgs = await window.hubDB.getMessages(currentUserId, friend.id);
      const lastMsg = msgs.length ? msgs[msgs.length - 1] : null;
      const previewText = lastMsg ? (lastMsg.track ? `🎵 ${lastMsg.track.title}` : lastMsg.text) : friend.status;

      const item = document.createElement('div');
      item.className = `friend-item ${state.activeFriendId === friend.id ? 'active' : ''}`;
      item.innerHTML = `
        <div class="friend-avatar-wrap">
          <span class="friend-avatar">${friend.avatar}</span>
          <span class="friend-online-dot ${friend.online ? 'online' : ''}"></span>
        </div>
        <div class="friend-info">
          <div class="friend-top-row">
            <strong>${friend.name}</strong>
            <span class="friend-time">${lastMsg ? (lastMsg.time || '') : ''}</span>
          </div>
          <p class="friend-last-msg">${previewText}</p>
        </div>
      `;

      item.onclick = () => {
        state.activeFriendId = friend.id;
        renderMessagesView();
      };

      friendsList.appendChild(item);
    }
  }

  // Render active conversation thread
  await renderChatThread();
}

async function renderChatThread() {
  const currentUserId = state.currentUser ? state.currentUser.id : 'usr_demo_chaithanya';
  const friends = window.hubDB.getFriends();
  const activeFriend = friends.find(f => f.id === state.activeFriendId) || friends[0];
  state.activeFriendId = activeFriend.id;

  const avatarEl = document.getElementById('chatActiveAvatar');
  const nameEl = document.getElementById('chatActiveName');
  const statusEl = document.getElementById('chatActiveStatus');
  const container = document.getElementById('chatMessages');

  if (avatarEl) avatarEl.textContent = activeFriend.avatar;
  if (nameEl) nameEl.textContent = activeFriend.name;
  if (statusEl) {
    statusEl.innerHTML = activeFriend.online
      ? `🟢 Online • ${activeFriend.status}`
      : `⚪ Offline • ${activeFriend.status}`;
  }

  if (!container) return;
  container.innerHTML = '';

  let messages = await window.hubDB.getMessages(currentUserId, activeFriend.id);
  if (state.isApiConnected) {
    try {
      const res = await apiRequest(`/api/messages/${activeFriend.id}`);
      if (res && res.messages && res.messages.length) {
        messages = res.messages;
      }
    } catch (_e) {}
  }

  if (messages.length === 0) {
    container.innerHTML = `
      <div class="empty" style="padding:40px 16px;">
        <span style="font-size:32px;">💬</span>
        <h3>Say hello to ${activeFriend.name}!</h3>
        <p>Send a message or share a Telugu chartbuster song directly into this chat.</p>
      </div>
    `;
    return;
  }

  messages.forEach(msg => {
    const isUser = msg.sender === 'user';
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble-row ${isUser ? 'sent' : 'received'}`;

    let songCardHtml = '';
    if (msg.track) {
      songCardHtml = `
        <div class="chat-song-card" data-track-id="${msg.track.id}">
          <div class="chat-song-thumb">
            ${msg.track.cover ? `<img src="${msg.track.cover}" alt="${msg.track.title}">` : '♫'}
          </div>
          <div class="chat-song-info">
            <div class="chat-song-title">${msg.track.title}</div>
            <div class="chat-song-artist">${msg.track.artist}</div>
          </div>
          <button class="primary-btn sm-pill chat-song-play-btn" title="Play shared track">▶ Play</button>
        </div>
      `;
    }

    bubble.innerHTML = `
      <div class="chat-bubble ${isUser ? 'user-bubble' : 'friend-bubble'}">
        ${msg.text ? `<p class="chat-bubble-text">${escapeHtml(msg.text)}</p>` : ''}
        ${songCardHtml}
        <span class="chat-bubble-time">${msg.time || ''}</span>
      </div>
    `;

    // Hook play button if song card present
    const playBtn = bubble.querySelector('.chat-song-play-btn');
    if (playBtn && msg.track) {
      playBtn.onclick = () => playSharedTrack(msg.track);
    }

    container.appendChild(bubble);
  });

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[m]);
}

function playSharedTrack(track) {
  if (!track) return;
  let idx = state.queue.findIndex(t => t.id === track.id || (t.title === track.title && t.artist === track.artist));
  if (idx === -1) {
    state.queue.unshift(track);
    idx = 0;
  }
  loadAndPlay(idx, true);
  notify(`Now Playing shared song: "${track.title}"! 🎵`, 'success');
}

async function sendChatMessageFromInput(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('chatInput');
  if (!input) return;

  const text = input.value.trim();
  const attachedTrack = state.chatAttachedTrack;

  if (!text && !attachedTrack) return;

  const currentUserId = state.currentUser ? state.currentUser.id : 'usr_demo_chaithanya';
  const friendId = state.activeFriendId || 'fr_1';

  input.value = '';
  state.chatAttachedTrack = null;
  updateChatAttachBtnUI();

  // Send message
  await window.hubDB.sendMessage(currentUserId, friendId, text, attachedTrack);

  if (state.isApiConnected) {
    try {
      await apiRequest(`/api/messages/${friendId}`, {
        method: 'POST',
        body: JSON.stringify({ text, track: attachedTrack })
      });
    } catch (_e) {}
  }

  await renderChatThread();
  renderMessagesView();

  // Friendly simulated reply after 1.5s for authentic Instagram DM experience
  clearTimeout(simulatedReplyTimer);
  simulatedReplyTimer = setTimeout(async () => {
    const friend = window.hubDB.getFriends().find(f => f.id === friendId);
    if (!friend) return;

    let replyText = "Love this track! 🔥 Listening to it right now!";
    if (attachedTrack) {
      replyText = `Whoa "${attachedTrack.title}" is so good! Added it to my playlist right now 🎧`;
    } else if (text.toLowerCase().includes('devara') || text.toLowerCase().includes('anirudh')) {
      replyText = "Anirudh's bgm in Devara is pure goosebumps! 🔥";
    } else if (text.toLowerCase().includes('hi') || text.toLowerCase().includes('hey')) {
      replyText = "Hey bro! What song are you vibing to today?";
    }

    const replyMsg = {
      id: 'm_reply_' + Date.now(),
      sender: 'friend',
      text: replyText,
      track: null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };

    const key = `chat_${currentUserId}_${friendId}`;
    const msgs = await window.hubDB.getMessages(currentUserId, friendId);
    msgs.push(replyMsg);
    window.hubDB._setLS(key, msgs);

    if (state.currentView === 'messages' && state.activeFriendId === friendId) {
      await renderChatThread();
      notify(`${friend.name} replied in chat! 💬`, 'info');
    }
  }, 1600);
}

function toggleChatAttachSong() {
  const current = state.currentTrack;
  if (!current) return;

  if (state.chatAttachedTrack) {
    state.chatAttachedTrack = null;
    notify('Song detached from message', 'info');
  } else {
    state.chatAttachedTrack = current;
    notify(`Attached "${current.title}" to message! 🎵`, 'success');
  }
  updateChatAttachBtnUI();
}

function updateChatAttachBtnUI() {
  const btn = document.getElementById('chatAttachSongBtn');
  const input = document.getElementById('chatInput');
  if (!btn) return;

  if (state.chatAttachedTrack) {
    btn.classList.add('active');
    btn.textContent = '✓ Attached';
    if (input && !input.value) {
      input.placeholder = `Sharing: "${state.chatAttachedTrack.title}"... Type a note!`;
    }
  } else {
    btn.classList.remove('active');
    btn.textContent = '🎵';
    if (input) input.placeholder = 'Message friend or send song...';
  }
}

// ================= 14F. DATABASE & ACCOUNT MANAGEMENT HUB =================
async function renderDatabaseHub() {
  const currentUserId = state.currentUser ? state.currentUser.id : 'usr_demo_chaithanya';
  const diag = await window.hubDB.getDatabaseDiagnostics(currentUserId);

  let serverDiag = null;
  if (state.isApiConnected) {
    try {
      const res = await apiRequest('/api/database/diagnostics');
      if (res && res.diagnostics) serverDiag = res.diagnostics;
    } catch (_e) {}
  }

  // Update hero badges
  const engineTitle = document.getElementById('dbEngineTitle');
  const engineDesc = document.getElementById('dbEngineDesc');
  const engineIcon = document.getElementById('dbEngineIcon');

  if (serverDiag && serverDiag.engine === 'MySQL 8.0') {
    if (engineTitle) engineTitle.textContent = 'MySQL 8.0 Active (Full Relational Database)';
    if (engineIcon) engineIcon.textContent = '🟢';
    if (engineDesc) engineDesc.textContent = 'Node.js Express server is connected to MySQL 8.0 with tables for users, favorites, downloads, playlists, and history.';
  } else {
    if (engineTitle) engineTitle.textContent = 'Dual-Engine Active: Resilient LocalDB (IndexedDB & Cache)';
    if (engineIcon) engineIcon.textContent = '🟢';
    if (engineDesc) engineDesc.textContent = 'Persistent browser IndexedDB + LocalStorage is active. All songs, audio blobs, chat messages, and user sessions are stored reliably.';
  }

  // Update KPI counters
  const user = state.currentUser;
  const statUser = document.getElementById('statUserId');
  const statEmail = document.getElementById('statUserEmail');
  const statFav = document.getElementById('statFavCount');
  const statDl = document.getElementById('statDlCount');
  const statDlSize = document.getElementById('statDlSize');
  const statPl = document.getElementById('statPlCount');
  const statHistory = document.getElementById('statHistoryCount');
  const statMsg = document.getElementById('statMsgCount');

  if (statUser) statUser.textContent = user ? user.username : 'Chaithanya (Demo)';
  if (statEmail) statEmail.textContent = user ? user.email : 'demo@hub.com';
  if (statFav) statFav.textContent = diag.favoritesCount;
  if (statDl) statDl.textContent = diag.downloadsCount;
  if (statDlSize) statDlSize.textContent = `${diag.storageUsedMb} MB offline audio stored`;
  if (statPl) statPl.textContent = diag.playlistsCount;
  if (statHistory) statHistory.textContent = diag.historyCount;

  // Compute friend message count
  let totalMsgs = 0;
  const friends = window.hubDB.getFriends();
  for (const f of friends) {
    const msgs = await window.hubDB.getMessages(currentUserId, f.id);
    totalMsgs += msgs.length;
  }
  if (statMsg) statMsg.textContent = totalMsgs;
}

async function exportDatabaseBackup() {
  const currentUserId = state.currentUser ? state.currentUser.id : 'usr_demo_chaithanya';
  const jsonStr = await window.hubDB.exportDatabaseBackup(currentUserId);

  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AudioStreamerHub_Database_Backup_${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  notify('Database backup downloaded successfully! 💾', 'success');
}

async function clearDatabaseCacheAction() {
  if (confirm('Clear local database cache and reset demo data? Your user account will stay intact.')) {
    const currentUserId = state.currentUser ? state.currentUser.id : 'usr_demo_chaithanya';
    await window.hubDB.clearDatabaseCache(currentUserId);
    notify('Database cache cleared & refreshed! 🧹', 'info');
    await refreshData();
    await renderDatabaseHub();
  }
}


// ================= 14G. ADMIN STUDIO & CATALOG MANAGEMENT =================
const DEFAULT_CATALOG = [...TRACKS];

async function loadCustomCatalogTracks() {
  const localCustom = window.hubDB.getCustomTracks();
  let serverCustom = [];

  if (state.isApiConnected) {
    try {
      const res = await apiRequest('/api/admin/tracks');
      if (res && res.tracks) serverCustom = res.tracks;
    } catch (_e) {}
  }

  // Merge custom tracks without duplicates
  const mergedMap = new Map();
  [...serverCustom, ...localCustom].forEach(t => mergedMap.set(t.id, t));
  const customList = Array.from(mergedMap.values());

  // Reset TRACKS to defaults then prepend custom
  TRACKS = [...customList, ...DEFAULT_CATALOG];
  state.queue = [...TRACKS];

  // Register any custom lyrics into TRACK_LYRICS
  customList.forEach(t => {
    if (t.lyrics && typeof t.lyrics === 'string') {
      const lines = t.lyrics.split('\n').map((l, i) => ({ time: i * 5, text: l.trim() })).filter(l => l.text);
      if (lines.length) TRACK_LYRICS[t.id] = lines;
    }
  });
}

function renderAdminView() {
  const countEl = document.getElementById('adminCatalogCount');
  const tableBody = document.getElementById('adminCatalogTableBody');
  const filterVal = (document.getElementById('adminCatalogSearch')?.value || '').toLowerCase().trim();

  if (countEl) countEl.textContent = `Total ${TRACKS.length} songs active in catalog (${TRACKS.filter(t => t.isCustom).length} custom admin added)`;
  if (!tableBody) return;
  tableBody.innerHTML = '';

  const filtered = TRACKS.filter(t =>
    !filterVal ||
    t.title.toLowerCase().includes(filterVal) ||
    t.artist.toLowerCase().includes(filterVal) ||
    (t.album && t.album.toLowerCase().includes(filterVal))
  );

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--muted);">No songs match "${escapeHtml(filterVal)}".</td></tr>`;
    return;
  }

  filtered.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${t.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300'}" alt="${escapeHtml(t.title)}" style="width:38px; height:38px; border-radius:6px; object-fit:cover;">
          <strong>${escapeHtml(t.title)}</strong>
        </div>
      </td>
      <td>${escapeHtml(t.artist)} • <small style="color:var(--muted);">${escapeHtml(t.album || 'Single')}</small></td>
      <td><span style="text-transform:capitalize;">${escapeHtml(t.genre || 'all')}</span></td>
      <td>${formatTime(t.duration || 210)}</td>
      <td>
        <span class="${t.isCustom ? 'badge-custom' : 'badge-curated'}">
          ${t.isCustom ? '★ Admin Added' : 'Curated Hit'}
        </span>
      </td>
      <td>
        <div style="display:flex; gap:6px;">
          <button class="primary-btn sm-pill admin-play-btn" title="Preview track">▶ Play</button>
          ${t.isCustom ? `<button class="secondary-btn sm-pill danger admin-del-btn" title="Delete custom song">🗑</button>` : ''}
        </div>
      </td>
    `;

    tr.querySelector('.admin-play-btn').onclick = () => {
      let idx = state.queue.findIndex(q => q.id === t.id);
      if (idx === -1) {
        state.queue.unshift(t);
        idx = 0;
      }
      loadAndPlay(idx, true);
      notify(`Previewing "${t.title}"! 🎵`, 'success');
    };

    const delBtn = tr.querySelector('.admin-del-btn');
    if (delBtn) {
      delBtn.onclick = async () => {
        if (confirm(`Remove "${t.title}" from the catalog?`)) {
          await deleteAdminTrack(t.id);
        }
      };
    }

    tableBody.appendChild(tr);
  });
}

async function deleteAdminTrack(trackId) {
  window.hubDB.deleteCustomTrack(trackId);
  if (state.isApiConnected) {
    try {
      await apiRequest(`/api/admin/tracks/${trackId}`, { method: 'DELETE' });
    } catch (_e) {}
  }

  TRACKS = TRACKS.filter(t => t.id !== trackId);
  state.queue = state.queue.filter(t => t.id !== trackId);

  notify('Song removed from catalog', 'info');
  renderAdminView();
  renderHomeGrid();
}

// Sample Telugu Blockbusters for 1-Click addition
const SAMPLE_TELUGU_HITS = [
  {
    id: "custom_gamechanger_1",
    title: "Raa Macha Macha (From \"Game Changer\")",
    artist: "Thaman S & Nakash Aziz",
    album: "Game Changer",
    duration: 218,
    genre: "telugu",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/86/7c/53/867c53cc-4efe-faef-a20e-8d9c896053db/8903431011411_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/01/85/b5/0185b5d0-9eb2-7be4-4325-fd3634fbc40b/mzaf_2467991545485613534.plus.aac.p.m4a",
    lyrics: "Raa Macha Macha... Thaman mass beat shuru!\nAndariki thalavanchani speed tho...\nRaa Macha Macha Game Changer!",
    isCustom: true
  },
  {
    id: "custom_pushpa2_couple",
    title: "Sooseki - The Couple Song (From \"Pushpa 2\")",
    artist: "Shreya Ghoshal & Devi Sri Prasad",
    album: "Pushpa 2 The Rule",
    duration: 260,
    genre: "telugu",
    cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8b/dd/7f/8bdd7fa9-d6f2-2230-5e7a-3c2fe8b5fbfb/8903431993601_cover.jpg/600x600bb.jpg",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f9/28/29/f92829b4-5473-17a9-879a-2efe96b8f95b/mzaf_4766756883763132198.plus.aac.p.m4a",
    lyrics: "Sooseki choodu mawa...\nPushpa and Srivalli magic!\n♪ DSP soulful romantic rhythm ♪",
    isCustom: true
  },
  {
    id: "custom_saripodhaa_1",
    title: "Garam Garam (From \"Saripodhaa Sanivaaram\")",
    artist: "Jakes Bejoy & Vishal Dadlani",
    album: "Saripodhaa Sanivaaram",
    duration: 198,
    genre: "telugu",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=summer-walk-111105.mp3",
    lyrics: "Garam Garam Sanivaaram!\nNani mass avatar in full fury!\nJakes Bejoy electrifying bgm!",
    isCustom: true
  },
  {
    id: "custom_og_firestorm",
    title: "Fire Storm (From \"They Call Him OG\")",
    artist: "Thaman S",
    album: "OG",
    duration: 180,
    genre: "telugu",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80",
    audioSrc: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8d/b1/16/8db11650-580e-ab11-9747-b7bb8544ce55/mzaf_14247929829726939234.plus.aac.p.m4a",
    lyrics: "Fire Storm is coming!\nThey Call Him OG!\n♪ Pure rampage theme ♪",
    isCustom: true
  }
];

async function quickAddSampleTeluguHits() {
  for (const t of SAMPLE_TELUGU_HITS) {
    window.hubDB.addCustomTrack(t);
    if (!TRACKS.some(exist => exist.id === t.id)) {
      TRACKS.unshift(t);
    }
    if (state.isApiConnected) {
      apiRequest('/api/admin/tracks', { method: 'POST', body: JSON.stringify(t) }).catch(() => {});
    }
  }
  state.queue = [...TRACKS];
  notify('Added 4 blockbuster Telugu tracks to Catalog! 🔥', 'success');
  renderAdminView();
  renderHomeGrid();
}

function resetCustomCatalog() {
  if (confirm('Reset custom songs back to the default curated catalog?')) {
    window.hubDB.clearCustomTracks();
    TRACKS = [...DEFAULT_CATALOG];
    state.queue = [...TRACKS];
    notify('Custom songs reset to default catalog', 'info');
    renderAdminView();
    renderHomeGrid();
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
    if (typeof syncLyricsLine === 'function') syncLyricsLine(audio.currentTime);
  };

  prog.oninput = (e) => {
    if (!audio.duration) return;
    audio.currentTime = (e.target.value / 100) * audio.duration;
  };

  audio.onended = () => {
    if (state.sleepTimerToEndOfTrack) {
      audio.pause();
      state.isPlaying = false;
      updatePlayBtn();
      cancelSleepTimer(false);
      notify('Sleep timer reached: Track finished, pausing playback 🌙', 'info');
      return;
    }
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
      notify('Logging into Demo Account...', 'info');
      let user = null;
      if (state.isApiConnected) {
        try {
          const res = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'demo@hub.com', password: 'password123' })
          });
          if (res?.user) user = res.user;
        } catch (_e) {}
      }
      if (!user) {
        try {
          user = await window.hubDB.loginUser('demo@hub.com', 'password123');
        } catch (_err) {
          user = await window.hubDB.registerUser('Chaithanya (Demo)', 'demo@hub.com', 'password123', '🎧');
        }
      }
      if (user) {
        window.hubDB.setCurrentSession(user);
        await loginSuccess(user, true);
      }
    };
  }

  // Form Submissions
  formLogin.onsubmit = async (e) => {
    e.preventDefault();
    clearAuthErrors();
    const em = document.getElementById('loginEmail').value.trim();
    const pw = document.getElementById('loginPassword').value.trim();
    const err = document.getElementById('loginError');
    let user = null;
    if (state.isApiConnected) {
      try {
        const res = await apiRequest('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: em, password: pw })
        });
        if (res?.user) user = res.user;
      } catch (_apiErr) {
        // Fallback to local DB
      }
    }
    if (!user) {
      try {
        user = await window.hubDB.loginUser(em, pw);
      } catch (errObj) {
        err.textContent = errObj.message;
        err.classList.remove('hidden');
        return;
      }
    }
    window.hubDB.setCurrentSession(user);
    await loginSuccess(user, true);
  };

  formSignup.onsubmit = async (e) => {
    e.preventDefault();
    clearAuthErrors();
    const name = document.getElementById('signupUsername').value.trim();
    const em = document.getElementById('signupEmail').value.trim();
    const pw = document.getElementById('signupPassword').value.trim();
    const err = document.getElementById('signupError');
    let user = null;
    if (state.isApiConnected) {
      try {
        const res = await apiRequest('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ username: name, email: em, password: pw, avatar: selectedAvatar })
        });
        if (res?.user) user = res.user;
      } catch (apiErr) {
        if (apiErr.message && !apiErr.message.includes('500') && !apiErr.message.includes('failed')) {
          err.textContent = apiErr.message;
          err.classList.remove('hidden');
          return;
        }
      }
    }
    if (!user) {
      try {
        user = await window.hubDB.registerUser(name, em, pw, selectedAvatar);
      } catch (errObj) {
        err.textContent = errObj.message;
        err.classList.remove('hidden');
        return;
      }
    }
    window.hubDB.setCurrentSession(user);
    await loginSuccess(user, true);
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

  // Cancel plan button
  const cancelPlanBtn = document.getElementById('cancelPlanBtn');
  if (cancelPlanBtn) {
    cancelPlanBtn.onclick = async () => {
      if (!state.currentUser) return;
      await window.hubDB.setSubscription(state.currentUser.id, 'free');
      if (state.isApiConnected) {
        apiRequest('/api/subscription/cancel', { method: 'POST' }).catch(() => {});
      }
      notify('Switched back to Free plan.', 'info');
      await refreshSubscription();
      await renderPlans();
    };
  }


  // Topbar and Dropdown DM & Database navigation
  const topbarDmBtn = document.getElementById('topbarDmBtn');
  if (topbarDmBtn) topbarDmBtn.onclick = () => switchView('messages');

  const topbarDbBtn = document.getElementById('topbarDbBtn');
  if (topbarDbBtn) topbarDbBtn.onclick = () => switchView('database');

  const menuDmBtn = document.getElementById('menuDmBtn');
  if (menuDmBtn) {
    menuDmBtn.onclick = () => {
      document.getElementById('userDropdown')?.classList.add('hidden');
      switchView('messages');
    };
  }

  const menuDbBtn = document.getElementById('menuDbBtn');
  if (menuDbBtn) {
    menuDbBtn.onclick = () => {
      document.getElementById('userDropdown')?.classList.add('hidden');
      switchView('database');
    };
  }

  // Player action buttons: Share, Lyrics, Sleep Timer
  const playerShareBtn = document.getElementById('playerShareBtn');
  if (playerShareBtn) playerShareBtn.onclick = () => openShareModal(state.currentTrack);

  const lyricsBtn = document.getElementById('lyricsBtn');
  if (lyricsBtn) lyricsBtn.onclick = openLyricsModal;

  const sleepTimerBtn = document.getElementById('sleepTimerBtn');
  if (sleepTimerBtn) sleepTimerBtn.onclick = openTimerModal;

  // Modals close buttons
  const closeShareBtn = document.getElementById('closeShareBtn');
  if (closeShareBtn) closeShareBtn.onclick = closeShareModal;

  const closeLyricsBtn = document.getElementById('closeLyricsBtn');
  if (closeLyricsBtn) closeLyricsBtn.onclick = closeLyricsModal;

  const closeTimerBtn = document.getElementById('closeTimerBtn');
  if (closeTimerBtn) closeTimerBtn.onclick = closeTimerModal;

  // Chat Form & Friend Search
  const chatForm = document.getElementById('chatForm');
  if (chatForm) chatForm.onsubmit = sendChatMessageFromInput;

  const chatAttachSongBtn = document.getElementById('chatAttachSongBtn');
  if (chatAttachSongBtn) chatAttachSongBtn.onclick = toggleChatAttachSong;

  const chatSendCurrentBtn = document.getElementById('chatSendCurrentBtn');
  if (chatSendCurrentBtn) chatSendCurrentBtn.onclick = toggleChatAttachSong;

  const friendSearch = document.getElementById('friendSearchInput');
  if (friendSearch) friendSearch.oninput = () => renderMessagesView();

  // Sleep Timer presets & Cancel
  document.querySelectorAll('.timer-opt-btn[data-minutes]').forEach(b => {
    b.onclick = () => setSleepTimer(b.dataset.minutes);
  });
  const cancelTimerBtn = document.getElementById('cancelTimerBtn');
  if (cancelTimerBtn) cancelTimerBtn.onclick = () => cancelSleepTimer(true);

  // Database Hub actions
  const dbRefreshBtn = document.getElementById('dbRefreshBtn');
  if (dbRefreshBtn) {
    dbRefreshBtn.onclick = async () => {
      notify('Refreshing database diagnostics...', 'info');
      await renderDatabaseHub();
      notify('Database metrics up to date! 🟢', 'success');
    };
  }

  const dbExportBtn = document.getElementById('dbExportBtn');
  if (dbExportBtn) dbExportBtn.onclick = exportDatabaseBackup;

  const dbClearCacheBtn = document.getElementById('dbClearCacheBtn');
  if (dbClearCacheBtn) dbClearCacheBtn.onclick = clearDatabaseCacheAction;

  // Local audio upload
  initLocalUpload();
}

// ================= 16. INITIALIZE =================
async function init() {
  try {
    await window.hubDB.init();
    await checkApiConnection();
    setupHandlers();
    renderHomeGrid();
    setVolume(0.8);

    let session = window.hubDB.getCurrentSession();
    if (state.isApiConnected) {
      try {
        const { user } = await apiRequest('/api/auth/me');
        if (user) session = user;
      } catch (_e) {}
    }

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
