/**
 * Audio Streamer Hub - Robust Persistent Database Module
 * Dual-layer storage: IndexedDB (for audio blobs, user accounts, playlists)
 * with automatic LocalStorage fallback to ensure 100% reliability for Login/Sign Up.
 */

const DB_NAME = 'AudioStreamerHubDB';
const DB_VERSION = 1;

class Database {
  constructor() {
    this.db = null;
    this.isIndexedDBAvailable = typeof indexedDB !== 'undefined';
  }

  async init() {
    if (this.db) return this.db;
    if (!this.isIndexedDBAvailable) return null;

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;

          // 1. Users Store
          if (!db.objectStoreNames.contains('users')) {
            const userStore = db.createObjectStore('users', { keyPath: 'id' });
            userStore.createIndex('email', 'email', { unique: true });
            userStore.createIndex('username', 'username', { unique: false });
          }

          // 2. Favorites / Liked Songs
          if (!db.objectStoreNames.contains('favorites')) {
            const favStore = db.createObjectStore('favorites', { keyPath: 'key' });
            favStore.createIndex('userId', 'userId', { unique: false });
            favStore.createIndex('trackId', 'trackId', { unique: false });
          }

          // 3. Downloaded Songs (Offline Blobs)
          if (!db.objectStoreNames.contains('downloads')) {
            const dlStore = db.createObjectStore('downloads', { keyPath: 'key' });
            dlStore.createIndex('userId', 'userId', { unique: false });
            dlStore.createIndex('trackId', 'trackId', { unique: false });
          }

          // 4. Playlists Store
          if (!db.objectStoreNames.contains('playlists')) {
            const plStore = db.createObjectStore('playlists', { keyPath: 'id' });
            plStore.createIndex('userId', 'userId', { unique: false });
          }

          // 5. Settings Store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'userId' });
          }
        };

        request.onsuccess = (event) => {
          this.db = event.target.result;
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.warn('IndexedDB failed to open, falling back to LocalStorage:', event.target.error);
          this.isIndexedDBAvailable = false;
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB initialization error:', err);
        this.isIndexedDBAvailable = false;
        resolve(null);
      }
    });
  }

  // ------------------ LOCALSTORAGE FALLBACK HELPERS ------------------
  _getLS(key, defaultVal = []) {
    try {
      const data = localStorage.getItem('ash_' + key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  }

  _setLS(key, val) {
    try {
      localStorage.setItem('ash_' + key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // ------------------ AUTHENTICATION & USERS ------------------
  async registerUser(username, email, password, avatar = '👤') {
    const cleanUsername = (username || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanUsername) throw new Error('Please enter a valid username.');
    if (!cleanEmail || !cleanEmail.includes('@')) throw new Error('Please enter a valid email address.');
    if (!cleanPassword || cleanPassword.length < 4) throw new Error('Password must be at least 4 characters long.');

    // 1. Check if user already exists
    const existing = await this.getUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      avatar: avatar || '🎧',
      createdAt: new Date().toISOString()
    };

    // Save to LocalStorage backup always
    const usersLS = this._getLS('users', []);
    usersLS.push(newUser);
    this._setLS('users', usersLS);

    // Save to IndexedDB if available
    const db = await this.init();
    if (db) {
      try {
        const tx = db.transaction('users', 'readwrite');
        const store = tx.objectStore('users');
        await new Promise((resolve, reject) => {
          const req = store.add(newUser);
          req.onsuccess = () => resolve(newUser);
          req.onerror = () => reject(req.error);
        });
      } catch (e) {
        console.warn('IndexedDB user save note:', e);
      }
    }

    this.setCurrentSession(newUser);
    return newUser;
  }

  async loginUser(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) throw new Error('Please enter your email.');
    if (!cleanPassword) throw new Error('Please enter your password.');

    const user = await this.getUserByEmail(cleanEmail);
    if (!user) {
      throw new Error('No account found with this email. Please sign up first.');
    }

    if (user.password !== cleanPassword) {
      throw new Error('Incorrect password. Please check your credentials and try again.');
    }

    this.setCurrentSession(user);
    return user;
  }

  async getUserByEmail(email) {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) return null;

    // Check IndexedDB first
    const db = await this.init();
    if (db) {
      try {
        const user = await new Promise((resolve) => {
          const tx = db.transaction('users', 'readonly');
          const store = tx.objectStore('users');
          const index = store.index('email');
          const req = index.get(cleanEmail);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
        if (user) return user;
      } catch (e) {
        // Fallback below
      }
    }

    // Check LocalStorage fallback
    const usersLS = this._getLS('users', []);
    const foundLS = usersLS.find(u => u.email.toLowerCase() === cleanEmail);
    if (foundLS) return foundLS;

    // Guaranteed fallback for default demo account
    if (cleanEmail === 'demo@hub.com') {
      const demoUser = {
        id: 'usr_demo_chaithanya',
        username: 'Chaithanya (Demo)',
        email: 'demo@hub.com',
        password: 'password123',
        avatar: '🎧',
        createdAt: new Date().toISOString()
      };
      usersLS.push(demoUser);
      this._setLS('users', usersLS);
      return demoUser;
    }

    return null;
  }

  getCurrentSession() {
    try {
      const data = localStorage.getItem('ash_current_session');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  setCurrentSession(user) {
    if (user) {
      localStorage.setItem('ash_current_session', JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || '🎧'
      }));
    } else {
      localStorage.removeItem('ash_current_session');
    }
  }

  logout() {
    this.setCurrentSession(null);
  }

  // ------------------ FAVORITES / LIKED SONGS ------------------
  async toggleFavorite(userId, track) {
    if (!userId) return false;
    const isFav = await this.isFavorite(userId, track.id);
    if (isFav) {
      await this.removeFavorite(userId, track.id);
      return false;
    } else {
      await this.addFavorite(userId, track);
      return true;
    }
  }

  async addFavorite(userId, track) {
    if (!userId) return;
    const key = `${userId}_${track.id}`;
    const entry = {
      key,
      userId,
      trackId: track.id,
      track: { ...track },
      addedAt: new Date().toISOString()
    };

    // LocalStorage backup
    const favsLS = this._getLS('favs_' + userId, []);
    if (!favsLS.some(f => f.trackId === track.id)) {
      favsLS.unshift(entry);
      this._setLS('favs_' + userId, favsLS);
    }

    // IndexedDB
    const db = await this.init();
    if (db) {
      try {
        const tx = db.transaction('favorites', 'readwrite');
        tx.objectStore('favorites').put(entry);
      } catch (e) {}
    }
  }

  async removeFavorite(userId, trackId) {
    if (!userId) return;
    const key = `${userId}_${trackId}`;

    // LocalStorage
    const favsLS = this._getLS('favs_' + userId, []);
    const filtered = favsLS.filter(f => f.trackId !== trackId);
    this._setLS('favs_' + userId, filtered);

    // IndexedDB
    const db = await this.init();
    if (db) {
      try {
        const tx = db.transaction('favorites', 'readwrite');
        tx.objectStore('favorites').delete(key);
      } catch (e) {}
    }
  }

  async isFavorite(userId, trackId) {
    if (!userId || !trackId) return false;
    const favs = await this.getFavorites(userId);
    return favs.some(t => t.id === trackId);
  }

  async getFavorites(userId) {
    if (!userId) return [];
    const db = await this.init();
    if (db) {
      try {
        const results = await new Promise((resolve) => {
          const tx = db.transaction('favorites', 'readonly');
          const index = tx.objectStore('favorites').index('userId');
          const req = index.getAll(userId);
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (results.length > 0) {
          results.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
          return results.map(r => r.track);
        }
      } catch (e) {}
    }

    // LocalStorage fallback
    const favsLS = this._getLS('favs_' + userId, []);
    return favsLS.map(f => f.track);
  }

  // ------------------ DOWNLOADS (AUDIO BLOBS) ------------------
  async saveDownload(userId, track, audioBlob) {
    if (!userId) return;
    const key = `${userId}_${track.id}`;
    const entry = {
      key,
      userId,
      trackId: track.id,
      track: { ...track, isDownloaded: true },
      audioBlob: audioBlob,
      size: audioBlob.size,
      downloadedAt: new Date().toISOString()
    };

    // LocalStorage metadata backup (without raw blob)
    const dlMeta = this._getLS('dls_meta_' + userId, []);
    if (!dlMeta.some(d => d.trackId === track.id)) {
      dlMeta.unshift({
        trackId: track.id,
        track: { ...track, isDownloaded: true },
        size: audioBlob.size,
        downloadedAt: entry.downloadedAt
      });
      this._setLS('dls_meta_' + userId, dlMeta);
    }

    // IndexedDB saves raw Blob
    const db = await this.init();
    if (db) {
      try {
        const tx = db.transaction('downloads', 'readwrite');
        tx.objectStore('downloads').put(entry);
      } catch (e) {}
    }
    return entry;
  }

  async removeDownload(userId, trackId) {
    if (!userId) return;
    const key = `${userId}_${trackId}`;

    const dlMeta = this._getLS('dls_meta_' + userId, []);
    this._setLS('dls_meta_' + userId, dlMeta.filter(d => d.trackId !== trackId));

    const db = await this.init();
    if (db) {
      try {
        const tx = db.transaction('downloads', 'readwrite');
        tx.objectStore('downloads').delete(key);
      } catch (e) {}
    }
  }

  async isDownloaded(userId, trackId) {
    if (!userId || !trackId) return false;
    const dls = await this.getDownloads(userId);
    return dls.some(t => t.id === trackId);
  }

  async getDownloadedTrackEntry(userId, trackId) {
    if (!userId || !trackId) return null;
    const db = await this.init();
    if (db) {
      try {
        const key = `${userId}_${trackId}`;
        return await new Promise((resolve) => {
          const tx = db.transaction('downloads', 'readonly');
          const req = tx.objectStore('downloads').get(key);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });
      } catch (e) {}
    }
    return null;
  }

  async getDownloads(userId) {
    if (!userId) return [];
    const db = await this.init();
    if (db) {
      try {
        const results = await new Promise((resolve) => {
          const tx = db.transaction('downloads', 'readonly');
          const index = tx.objectStore('downloads').index('userId');
          const req = index.getAll(userId);
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (results.length > 0) {
          results.sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt));
          return results.map(r => ({
            ...r.track,
            isDownloaded: true,
            audioBlob: r.audioBlob,
            sizeBytes: r.size,
            downloadedAt: r.downloadedAt
          }));
        }
      } catch (e) {}
    }

    const dlMeta = this._getLS('dls_meta_' + userId, []);
    return dlMeta.map(d => ({
      ...d.track,
      isDownloaded: true,
      sizeBytes: d.size,
      downloadedAt: d.downloadedAt
    }));
  }

  // ------------------ PLAYLISTS ------------------
  async createPlaylist(userId, name, description = '') {
    if (!userId) throw new Error('Sign in required');
    const playlist = {
      id: 'pl_' + Date.now(),
      userId,
      name: name.trim(),
      description: description.trim(),
      tracks: [],
      createdAt: new Date().toISOString()
    };

    const plsLS = this._getLS('pls_' + userId, []);
    plsLS.push(playlist);
    this._setLS('pls_' + userId, plsLS);

    const db = await this.init();
    if (db) {
      try {
        const tx = db.transaction('playlists', 'readwrite');
        tx.objectStore('playlists').add(playlist);
      } catch (e) {}
    }
    return playlist;
  }

  async getPlaylists(userId) {
    if (!userId) return [];
    const db = await this.init();
    if (db) {
      try {
        const results = await new Promise((resolve) => {
          const tx = db.transaction('playlists', 'readonly');
          const index = tx.objectStore('playlists').index('userId');
          const req = index.getAll(userId);
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve([]);
        });
        if (results.length > 0) return results;
      } catch (e) {}
    }
    return this._getLS('pls_' + userId, []);
  }

  async addTrackToPlaylist(playlistId, track) {
    const pls = this._getLS('pls_' + (this.getCurrentSession()?.id || 'usr_guest'), []);
    const pl = pls.find(p => p.id === playlistId);
    if (pl && !pl.tracks.some(t => t.id === track.id)) {
      pl.tracks.push(track);
      this._setLS('pls_' + (this.getCurrentSession()?.id || 'usr_guest'), pls);
    }

    const db = await this.init();
    if (db) {
      try {
        const tx = db.transaction('playlists', 'readwrite');
        const store = tx.objectStore('playlists');
        const dbPl = await new Promise((res) => {
          const req = store.get(playlistId);
          req.onsuccess = () => res(req.result);
          req.onerror = () => res(null);
        });
        if (dbPl && !dbPl.tracks.some(t => t.id === track.id)) {
          dbPl.tracks.push(track);
          store.put(dbPl);
        }
      } catch (e) {}
    }
  }
}

// Global instance
window.hubDB = new Database();
