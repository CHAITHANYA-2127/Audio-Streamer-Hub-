# ♫ Audio Streamer Hub

A modern, high-fidelity **Spotify-styled** web music streaming and offline audio player built with **HTML5, Vanilla CSS, JavaScript, Web Audio API, and IndexedDB Database**.

🌐 **Live URL**: [https://chaithanya-2127.github.io/Audio-Streamer-Hub-/](https://chaithanya-2127.github.io/Audio-Streamer-Hub-/)  
⚡ **Demo Account (Instant 1-Click Login)**: `demo@hub.com` | `password123`

---

## 🌟 Features Implemented (User Requirements)

1. **Songs Catalog (పాటలు)**:
   - Curated with top **Telugu Chartbusters** (*Devara Part 1*, *RRR*, *Pushpa 2*, *Guntur Kaaram*, *Kalki 2898 AD*, *Ala Vaikunthapurramuloo*, *Jathi Ratnalu*), **Bollywood Melodies** (*Kesariya*, *Chaleya*, *Srivalli*), **Global Top 50** (*The Weeknd*, *Ed Sheeran*, *Dua Lipa*, *Imagine Dragons*), and **Lo-Fi / Chill Beats**.
   - High-quality streaming audio previews and HD album artwork.

2. **Real-Time Live Search (వెతకడానికి Search Feature)**:
   - Search across millions of Telugu songs, Bollywood tracks, global artists, and albums.
   - Powered by real-time iTunes Search API with instant 300ms debounce and loading spinner.
   - Quick category chips (*Devara*, *Anirudh*, *Pushpa 2*, *Sid Sriram*, *Arijit Singh*, *RRR*, *The Weeknd*, *Thaman S*).

3. **Favorites / Liked Songs (లైక్ చేస్తే Favourites లో సేవ్ అవ్వడం)**:
   - Click the Heart (`♡` / `♥`) icon on any card, table row, or the bottom player bar.
   - Saved persistently in browser **IndexedDB Database** under `favorites` table.
   - Dedicated **"Liked Songs"** view with Spotify-style gradient banner, "Play All", "Shuffle All", and track counters.

4. **My Library & Offline Downloads (My Library లో Download చేసుకున్న పాటలు రావడం)**:
   - Click `⬇` (Download) on any song to fetch its binary audio `Blob` and save it directly into the local IndexedDB database.
   - Shows a green checkmark `✓` and badge when downloaded.
   - In **"Your Library" -> "Downloaded (Offline)"** tab, all downloaded songs appear with their exact file size (e.g. `2.4 MB`), download date, and instant offline play button.
   - **Local Audio Upload (`＋ Local Audio`)**: Import your own `.mp3` / `.wav` files from your computer directly into your library!

5. **User Login & Sign Up (Login / Sign In Modal)**:
   - Spotify-style Authentication Modal.
   - Features **Sign Up** (Username, Email, Password, Custom Avatar picker), **Log In**, and **"Continue as Guest"**.
   - User sessions are stored and segregated so each user has their own unique favorites, downloads, playlists, and settings.

6. **Online / Offline Mode Toggle (ఆన్‌లైన్ & ఆఫ్‌లైన్ మోడ్)**:
   - Header toggle switch: `🟢 Online` ↔ `📴 Offline Mode`.
   - Automatic detection: Listens to browser connectivity (`window.ononline` / `window.onoffline`).
   - In **Offline Mode**, an alert banner appears and the app plays songs directly from IndexedDB without needing an active internet connection!

7. **Spotify-Style Volume & Audio Settings (వాల్యూమ్ సెట్టింగ్స్)**:
   - Bottom player volume slider with fill percentage, hover thumb, and dynamic mute/unmute speaker icon (`🔊`, `🔉`, `🔈`, `🔇`).
   - **Audio & Volume Settings Modal (`🎚`)**:
     - Master Volume slider with decibel & percentage indicator.
     - **Normalize Volume** toggle (Spotify feature).
     - **Crossfade** slider (Off, 1s - 12s).
     - **Playback Speed** pills (`0.5x`, `0.75x`, `1.0x (Normal)`, `1.25x`, `1.5x`, `2.0x`).
     - **Audio Quality** selector (`Normal 96 kbps`, `High 160 kbps`, `Very High 320 kbps`).
     - **Web Audio API Hardware Equalizer**:
       - 5-Band Equalizer (`60Hz`, `230Hz`, `910Hz`, `3.6kHz`, `14kHz`) powered by `BiquadFilterNode`.
       - Instant sound presets: *Flat*, *Bass Booster*, *Treble Booster*, *Acoustic*, *Rock*, *Vocal Booster*, *Electronic*.

8. **Aesthetic & Identity (Audio Streamer Hub)**:
   - Branded as **Audio Streamer Hub** with glowing green soundwave icon.
   - Ultra-premium Spotify Dark Theme (`#121212`, `#181818`, `#1ed760` Spotify Green).
   - Emerging green play buttons on card hover, glassmorphism topbar, and real-time live **Audio Visualizer Canvas** dancing to the beat!

---

## 🚀 How to Run

### Option 1: Run with Local Node Server (Recommended)
1. Open PowerShell or Terminal in the project folder:
   ```bash
   node server.js
   ```
2. Open your browser and visit:
   ```
   http://localhost:3000
   ```

### Option 2: Open Directly in Any Browser
Simply double-click `index.html` or drag it into Chrome, Edge, Brave, or Firefox. All features (IndexedDB, audio playback, search, equalizer) work out-of-the-box!

---

## ⌨ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Space` | Play / Pause |
| `Arrow Right` | Seek Forward 5 seconds |
| `Arrow Left` | Seek Backward 5 seconds |
| `Arrow Up` | Volume Up (+5%) |
| `Arrow Down` | Volume Down (-5%) |
| `M` | Mute / Unmute Toggle |

---

## 🗄 Database Schema (IndexedDB: `AudioStreamerHubDB`)

- **`users`**: User ID, username, email, password, avatar, created date.
- **`favorites`**: User ID, track ID, song title, artist, album, cover art, added date.
- **`downloads`**: User ID, track ID, metadata, full binary **audio `Blob`**, size in bytes, download timestamp.
- **`playlists`**: User ID, playlist ID, name, description, tracks array.
- **`settings`**: User ID, volume, equalizer presets, audio quality, crossfade duration.
