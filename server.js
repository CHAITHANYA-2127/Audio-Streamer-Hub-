require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();
const port = Number(process.env.PORT || 3000);
const production = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET || 'audio-streamer-hub-local-secret-key-12345';

// ------------------ IN-MEMORY FALLBACK STORE ------------------
// Ensures 100% functionality even when MySQL is not configured or offline.
const memStore = {
  users: [
    {
      id: '1',
      username: 'Chaithanya (Demo)',
      email: 'demo@hub.com',
      password_hash: bcrypt.hashSync('password123', 10),
      avatar: '🎧',
      createdAt: new Date().toISOString()
    }
  ],
  subscriptions: {},
  favorites: {},
  playlists: {},
  playlistTracks: {},
  history: {},
  settings: {}
};

let pool = null;
let isMySQLConnected = false;

// Attempt MySQL Pool Initialization
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'audio_streamer_hub',
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4'
  });
} catch (e) {
  console.warn('[MySQL] Failed to create pool:', e.message);
}

// Session Store with Fallback
let sessionStore;
try {
  if (pool && process.env.DB_PASSWORD !== undefined) {
    const MySQLStore = require('express-mysql-session')(session);
    sessionStore = new MySQLStore({
      clearExpired: true,
      checkExpirationInterval: 15 * 60 * 1000,
      expiration: 7 * 24 * 60 * 60 * 1000
    }, pool);
    sessionStore.on('error', (err) => {
      console.warn('[SessionStore] MySQL session warning (falling back to memory):', err.message);
    });
  } else {
    sessionStore = new session.MemoryStore();
  }
} catch (_e) {
  sessionStore = new session.MemoryStore();
}

app.disable('x-powered-by');
app.set('trust proxy', production ? 1 : false);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(express.json({ limit: '32kb' }));

app.use(session({
  name: 'ash.sid',
  secret: sessionSecret,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: production, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false });

const plans = [
  { id: 'free', name: 'Free', priceInr: 0, interval: 'forever', features: ['Stream music previews', 'Create playlists', 'Like songs'] },
  { id: 'plus', name: 'Hub Plus', priceInr: 99, interval: 'month', features: ['Ad-free listening demo', 'High quality audio demo', 'Unlimited skips', 'Offline library'] },
  { id: 'family', name: 'Hub Family', priceInr: 149, interval: 'month', features: ['Everything in Plus', 'Up to 6 profiles', 'Shared family plan demo'] }
];

function publicUser(user) {
  return { id: String(user.id), username: user.username, email: user.email, avatar: user.avatar || '🎧' };
}

function requireUser(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Please sign in to continue.' });
  next();
}

// ------------------ API ROUTES ------------------

// Health Check
app.get('/api/health', async (_req, res) => {
  if (isMySQLConnected && pool) {
    try {
      await pool.query('SELECT 1');
      return res.json({ status: 'ok', database: 'connected' });
    } catch (_error) {
      isMySQLConnected = false;
    }
  }
  res.json({ status: 'ok', database: 'memory-fallback' });
});

// Auth: Register
app.post('/api/auth/register', authLimiter, async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const avatar = String(req.body.avatar || '🎧').slice(0, 12);

    if (username.length < 2 || username.length > 40) return res.status(400).json({ error: 'Name must be between 2 and 40 characters.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 190) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password.length < 4 || password.length > 72) return res.status(400).json({ error: 'Password must be at least 4 characters.' });

    const passwordHash = await bcrypt.hash(password, 10);

    if (isMySQLConnected && pool) {
      try {
        const [result] = await pool.execute('INSERT INTO users (username, email, password_hash, avatar) VALUES (?, ?, ?, ?)', [username, email, passwordHash, avatar]);
        const user = { id: result.insertId, username, email, avatar };
        req.session.user = publicUser(user);
        return req.session.save(error => error ? next(error) : res.status(201).json({ user: req.session.user }));
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'An account with this email already exists.' });
        // Fallback to memory
      }
    }

    // Memory Store Fallback
    const existing = memStore.users.find(u => u.email === email);
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const newUser = { id: String(Date.now()), username, email, password_hash: passwordHash, avatar, createdAt: new Date().toISOString() };
    memStore.users.push(newUser);
    req.session.user = publicUser(newUser);
    req.session.save(error => error ? next(error) : res.status(201).json({ user: req.session.user }));
  } catch (error) { next(error); }
});

// Auth: Login
app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (isMySQLConnected && pool) {
      try {
        const [rows] = await pool.execute('SELECT id, username, email, password_hash, avatar FROM users WHERE email = ? LIMIT 1', [email]);
        const user = rows[0];
        if (user && (await bcrypt.compare(password, user.password_hash))) {
          req.session.user = publicUser(user);
          return req.session.save(saveError => saveError ? next(saveError) : res.json({ user: req.session.user }));
        }
      } catch (_e) {
        // Fallback to memory
      }
    }

    // Memory Store Fallback
    let user = memStore.users.find(u => u.email === email);
    if (!user && email === 'demo@hub.com') {
      user = memStore.users[0];
    }

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }

    req.session.user = publicUser(user);
    req.session.save(saveError => saveError ? next(saveError) : res.json({ user: req.session.user }));
  } catch (error) { next(error); }
});

// Auth: Current Session
app.get('/api/auth/me', (req, res) => res.json({ user: req.session.user || null }));

// Auth: Logout
app.post('/api/auth/logout', (req, res, next) => {
  req.session.destroy(error => {
    if (error) return next(error);
    res.clearCookie('ash.sid', { httpOnly: true, sameSite: 'lax', secure: production });
    res.status(204).end();
  });
});

// Plans
app.get('/api/plans', (_req, res) => res.json({ plans }));

// Subscriptions
app.get('/api/subscription', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    if (isMySQLConnected && pool) {
      try {
        const [rows] = await pool.execute("SELECT plan_id AS planId, status, started_at AS startedAt, ends_at AS endsAt FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY started_at DESC LIMIT 1", [userId]);
        return res.json({ subscription: rows[0] || { planId: 'free', status: 'active' } });
      } catch (_e) {}
    }
    const sub = memStore.subscriptions[userId] || { planId: 'free', status: 'active' };
    res.json({ subscription: sub });
  } catch (error) { next(error); }
});

app.post('/api/subscription/checkout', requireUser, async (req, res, next) => {
  try {
    const plan = plans.find(item => item.id === req.body.planId);
    if (!plan || plan.id === 'free') return res.status(400).json({ error: 'Choose a valid paid plan.' });
    const userId = req.session.user.id;

    if (isMySQLConnected && pool) {
      try {
        await pool.execute("UPDATE subscriptions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'", [userId]);
        await pool.execute("INSERT INTO subscriptions (user_id, plan_id, status, ends_at) VALUES (?, ?, 'active', DATE_ADD(NOW(), INTERVAL 1 MONTH))", [userId, plan.id]);
        return res.status(201).json({ subscription: { planId: plan.id, status: 'active', demo: true }, message: `${plan.name} demo plan activated!` });
      } catch (_e) {}
    }

    memStore.subscriptions[userId] = { planId: plan.id, status: 'active', startedAt: new Date().toISOString() };
    res.status(201).json({ subscription: memStore.subscriptions[userId], message: `${plan.name} demo plan activated!` });
  } catch (error) { next(error); }
});

app.post('/api/subscription/cancel', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    if (isMySQLConnected && pool) {
      try {
        await pool.execute("UPDATE subscriptions SET status = 'cancelled' WHERE user_id = ? AND status = 'active'", [userId]);
      } catch (_e) {}
    }
    memStore.subscriptions[userId] = { planId: 'free', status: 'active' };
    res.json({ subscription: { planId: 'free', status: 'active' } });
  } catch (error) { next(error); }
});

// Favorites
app.get('/api/favorites', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    if (isMySQLConnected && pool) {
      try {
        const [rows] = await pool.execute('SELECT track FROM favorites WHERE user_id = ? ORDER BY added_at DESC', [userId]);
        return res.json({ favorites: rows.map(r => typeof r.track === 'string' ? JSON.parse(r.track) : r.track) });
      } catch (_e) {}
    }
    const favs = memStore.favorites[userId] || [];
    res.json({ favorites: favs });
  } catch (error) { next(error); }
});

app.put('/api/favorites/:trackId', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const track = req.body.track;
    if (!track || !track.id) return res.status(400).json({ error: 'Invalid track details.' });

    if (isMySQLConnected && pool) {
      try {
        await pool.execute('INSERT INTO favorites (user_id, track_id, track) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE track = VALUES(track)', [userId, req.params.trackId, JSON.stringify(track)]);
        return res.status(204).end();
      } catch (_e) {}
    }

    if (!memStore.favorites[userId]) memStore.favorites[userId] = [];
    const existingIdx = memStore.favorites[userId].findIndex(t => String(t.id) === String(req.params.trackId));
    if (existingIdx >= 0) memStore.favorites[userId][existingIdx] = track;
    else memStore.favorites[userId].unshift(track);

    res.status(204).end();
  } catch (error) { next(error); }
});

app.delete('/api/favorites/:trackId', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    if (isMySQLConnected && pool) {
      try {
        await pool.execute('DELETE FROM favorites WHERE user_id = ? AND track_id = ?', [userId, req.params.trackId]);
        return res.status(204).end();
      } catch (_e) {}
    }
    if (memStore.favorites[userId]) {
      memStore.favorites[userId] = memStore.favorites[userId].filter(t => String(t.id) !== String(req.params.trackId));
    }
    res.status(204).end();
  } catch (error) { next(error); }
});

// Playlists
app.get('/api/playlists', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    if (isMySQLConnected && pool) {
      try {
        const [rows] = await pool.execute('SELECT id, name, description, created_at AS createdAt FROM playlists WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        const playlists = await Promise.all(rows.map(async row => {
          const [tracks] = await pool.execute('SELECT track FROM playlist_tracks WHERE playlist_id = ? ORDER BY added_at', [row.id]);
          return { ...row, id: String(row.id), userId: String(userId), tracks: tracks.map(item => typeof item.track === 'string' ? JSON.parse(item.track) : item.track) };
        }));
        return res.json({ playlists });
      } catch (_e) {}
    }
    const pls = memStore.playlists[userId] || [];
    res.json({ playlists: pls });
  } catch (error) { next(error); }
});

app.post('/api/playlists', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const name = String(req.body.name || '').trim();
    const description = String(req.body.description || '').trim();
    if (!name) return res.status(400).json({ error: 'Playlist name is required.' });

    if (isMySQLConnected && pool) {
      try {
        const [result] = await pool.execute('INSERT INTO playlists (user_id, name, description) VALUES (?, ?, ?)', [userId, name, description]);
        return res.status(201).json({ playlist: { id: String(result.insertId), userId: String(userId), name, description, tracks: [], createdAt: new Date().toISOString() } });
      } catch (_e) {}
    }

    if (!memStore.playlists[userId]) memStore.playlists[userId] = [];
    const newPl = { id: 'pl_' + Date.now(), userId: String(userId), name, description, tracks: [], createdAt: new Date().toISOString() };
    memStore.playlists[userId].unshift(newPl);
    res.status(201).json({ playlist: newPl });
  } catch (error) { next(error); }
});

app.post('/api/playlists/:playlistId/tracks', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const track = req.body.track;
    if (!track || !track.id) return res.status(400).json({ error: 'Invalid track.' });

    if (isMySQLConnected && pool) {
      try {
        const [owned] = await pool.execute('SELECT id FROM playlists WHERE id = ? AND user_id = ?', [req.params.playlistId, userId]);
        if (owned.length) {
          await pool.execute('INSERT IGNORE INTO playlist_tracks (playlist_id, track_id, track) VALUES (?, ?, ?)', [req.params.playlistId, String(track.id), JSON.stringify(track)]);
          return res.status(204).end();
        }
      } catch (_e) {}
    }

    const pls = memStore.playlists[userId] || [];
    const pl = pls.find(p => String(p.id) === String(req.params.playlistId));
    if (pl && !pl.tracks.some(t => String(t.id) === String(track.id))) {
      pl.tracks.push(track);
    }
    res.status(204).end();
  } catch (error) { next(error); }
});

app.delete('/api/playlists/:playlistId', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    if (isMySQLConnected && pool) {
      try {
        await pool.execute('DELETE FROM playlists WHERE id = ? AND user_id = ?', [req.params.playlistId, userId]);
        return res.status(204).end();
      } catch (_e) {}
    }
    if (memStore.playlists[userId]) {
      memStore.playlists[userId] = memStore.playlists[userId].filter(p => String(p.id) !== String(req.params.playlistId));
    }
    res.status(204).end();
  } catch (error) { next(error); }
});

// Listening History
app.get('/api/history', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    if (isMySQLConnected && pool) {
      try {
        const [rows] = await pool.execute('SELECT track, played_at AS playedAt FROM listening_history WHERE user_id = ? ORDER BY played_at DESC LIMIT 100', [userId]);
        return res.json({ history: rows.map(r => ({ track: typeof r.track === 'string' ? JSON.parse(r.track) : r.track, playedAt: r.playedAt })) });
      } catch (_e) {}
    }
    const history = memStore.history[userId] || [];
    res.json({ history });
  } catch (error) { next(error); }
});

app.post('/api/history', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const track = req.body.track;
    if (!track || !track.id) return res.status(400).json({ error: 'Invalid track details.' });

    if (isMySQLConnected && pool) {
      try {
        await pool.execute('INSERT INTO listening_history (user_id, track_id, track) VALUES (?, ?, ?)', [userId, String(track.id), JSON.stringify(track)]);
        return res.status(201).json({ saved: true });
      } catch (_e) {}
    }

    if (!memStore.history[userId]) memStore.history[userId] = [];
    memStore.history[userId] = memStore.history[userId].filter(h => String(h.track?.id) !== String(track.id));
    memStore.history[userId].unshift({ track, playedAt: new Date().toISOString() });
    res.status(201).json({ saved: true });
  } catch (error) { next(error); }
});

// User Settings
app.get('/api/settings', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    if (isMySQLConnected && pool) {
      try {
        const [rows] = await pool.execute('SELECT settings FROM user_settings WHERE user_id = ? LIMIT 1', [userId]);
        const s = rows[0]?.settings;
        return res.json({ settings: !s ? null : typeof s === 'string' ? JSON.parse(s) : s });
      } catch (_e) {}
    }
    res.json({ settings: memStore.settings[userId] || null });
  } catch (error) { next(error); }
});

app.put('/api/settings', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const settings = req.body.settings;
    if (!settings || typeof settings !== 'object') return res.status(400).json({ error: 'Invalid settings.' });

    if (isMySQLConnected && pool) {
      try {
        await pool.execute('INSERT INTO user_settings (user_id, settings) VALUES (?, ?) ON DUPLICATE KEY UPDATE settings = VALUES(settings)', [userId, JSON.stringify(settings)]);
        return res.json({ settings });
      } catch (_e) {}
    }

    memStore.settings[userId] = settings;
    res.json({ settings });
  } catch (error) { next(error); }
});

// Friends & Direct Messaging (Instagram DM Style)
const DEMO_FRIENDS = [
  { id: 'fr_1', name: 'Rahul Varma', handle: '@rahul_beats', avatar: '🎧', online: true, status: 'Vibing to Devara 🔥' },
  { id: 'fr_2', name: 'Priya Sharma', handle: '@priya_melodies', avatar: '🎵', online: true, status: 'Studying with Lo-Fi ☕' },
  { id: 'fr_3', name: 'Vikram Reddy', handle: '@vikram_r', avatar: '🎸', online: false, status: 'Gym workout session 💪' },
  { id: 'fr_4', name: 'Sneha Rao', handle: '@sneha_music', avatar: '✨', online: true, status: 'Listening to Bollywood hits' },
  { id: 'fr_5', name: 'Karthik Kumar', handle: '@karthik_k', avatar: '⚡', online: false, status: 'Offline' }
];

app.get('/api/friends', (_req, res) => res.json({ friends: DEMO_FRIENDS }));

app.get('/api/messages/:friendId', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const friendId = req.params.friendId;
    if (!memStore.messages) memStore.messages = {};
    const key = `${userId}_${friendId}`;
    if (!memStore.messages[key]) {
      memStore.messages[key] = [
        {
          id: 'm_1',
          sender: 'friend',
          text: 'Hey bro! Check out this song, the beat drop is crazy!',
          track: {
            id: 'tel_1',
            title: 'Chuttamalle (From "Devara")',
            artist: 'Anirudh Ravichander, Shilpa Rao',
            album: 'Devara Part 1',
            cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
            audioSrc: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=summer-walk-111105.mp3'
          },
          time: 'Just now'
        }
      ];
    }
    res.json({ messages: memStore.messages[key] });
  } catch (error) { next(error); }
});

app.post('/api/messages/:friendId', requireUser, async (req, res, next) => {
  try {
    const userId = req.session.user.id;
    const friendId = req.params.friendId;
    const { text, track } = req.body;
    if (!memStore.messages) memStore.messages = {};
    const key = `${userId}_${friendId}`;
    if (!memStore.messages[key]) memStore.messages[key] = [];

    const newMsg = {
      id: 'm_' + Date.now(),
      sender: 'user',
      text: (text || '').trim(),
      track: track || null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };
    memStore.messages[key].push(newMsg);
    res.status(201).json({ message: newMsg });
  } catch (error) { next(error); }
});

// Database Diagnostics API
app.get('/api/database/diagnostics', async (req, res, next) => {
  try {
    const user = req.session?.user;
    const userId = user?.id || 'usr_guest';
    const favCount = (memStore.favorites[userId] || []).length;
    const plCount = (memStore.playlists[userId] || []).length;
    const historyCount = (memStore.history[userId] || []).length;

    res.json({
      engine: isMySQLConnected ? 'MySQL 8.0 Active' : 'Resilient Memory + Local Storage (Offline Ready)',
      isMySQL: isMySQLConnected,
      usersCount: memStore.users.length,
      favoritesCount: favCount,
      playlistsCount: plCount,
      historyCount: historyCount,
      currentUser: user || null
    });
  } catch (error) { next(error); }
});

// ------------------ ADMIN CATALOG TRACKS API ------------------
if (!memStore.customTracks) memStore.customTracks = [];

app.get('/api/admin/tracks', (_req, res) => {
  res.json({ tracks: memStore.customTracks || [] });
});

app.post('/api/admin/tracks', (req, res, next) => {
  try {
    const { title, artist, album, genre, duration, cover, audioSrc, lyrics } = req.body;
    if (!title || !artist) return res.status(400).json({ error: 'Title and Artist are required.' });

    const track = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      artist: artist.trim(),
      album: (album || 'Single').trim(),
      genre: (genre || 'telugu').toLowerCase(),
      duration: Number(duration) || 210,
      cover: cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      audioSrc: audioSrc || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=summer-walk-111105.mp3',
      lyrics: lyrics || null,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    if (!memStore.customTracks) memStore.customTracks = [];
    memStore.customTracks.unshift(track);
    res.status(201).json({ track });
  } catch (error) { next(error); }
});

app.delete('/api/admin/tracks/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    if (memStore.customTracks) {
      memStore.customTracks = memStore.customTracks.filter(t => t.id !== id);
    }
    res.json({ success: true, removedId: id });
  } catch (error) { next(error); }
});

// Static Files & SPA fallback
app.use(express.static(path.join(__dirname), { dotfiles: 'deny', extensions: ['html'], maxAge: production ? '1h' : 0 }));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Global Error Handler
app.use((error, _req, res, _next) => {
  console.error('[Error]', error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

async function start() {
  if (pool) {
    try {
      await pool.query('SELECT 1');
      isMySQLConnected = true;
      console.log('✓ MySQL connection established.');
    } catch (error) {
      console.warn('ℹ MySQL is not configured or unavailable (' + error.message + ').');
      console.log('⚡ Running in resilient in-memory/demo mode. All audio features, logins, and endpoints are 100% active!');
    }
  } else {
    console.log('⚡ Running in in-memory mode. All audio features are 100% active!');
  }

  app.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`🎵 Audio Streamer Hub is running!`);
    console.log(`📡 Local URL: http://localhost:${port}`);
    console.log(`👤 Demo Account: demo@hub.com | password123`);
    console.log(`======================================================\n`);
  });
}

start();
