# 🎵 Audio Streamer Hub

> **Live Demo (GitHub Pages)**: [https://github.io/Audio-Streamer-Hub-/](https://github.io/Audio-Streamer-Hub-/)  
> **Repository**: [https://github.com//Audio-Streamer-Hub-](https://github.com//Audio-Streamer-Hub-)

**Audio Streamer Hub** is a premium, high-productivity music streaming platform built with modern HTML5, Vanilla CSS glassmorphism, JavaScript, Node.js, Express, and a dual-engine storage architecture (MySQL 8.0 + Resilient IndexedDB/LocalStorage fallback).

---

## 🌟 Key Features

### 1. ✈️ Instagram-Style Direct Friend Chat & Song Sharing (`Messages`)
- **2-Column Instagram DM Interface**: Chat directly with friends (Rahul, Priya, Vikram, Sneha, Karthik) with live presence and status indicators.
- **In-App Song Cards**: Click the **`✈` (Share)** icon on any song card or player bar to send tracks directly into friend conversations.
- **Playable in Chat**: Friend and user can hit **`▶ Play`** right inside the chat bubble to immediately stream the song in the main bottom player.
- **Realistic Simulated DM Replies**: Friends reply naturally with feedback and playlist reactions.
- **External Sharing**: One-click **Copy Link**, **WhatsApp**, and **Instagram DM** sharing.

### 2. 👑 Admin Studio & Catalog Song Manager (`Admin Studio`)
- **Add & Publish New Songs**: Easily add any song to the live streaming catalog (Telugu, Bollywood, Global, Lo-Fi) with title, artist, album, genre, duration, and cover image.
- **Live Song Card Preview**: Real-time visual card preview as you type before publishing.
- **Audio File Upload**: Provide an online streaming MP3/AAC URL or attach a local audio file directly from your computer.
- **⚡ 1-Click Sample Telugu Blockbusters**: Instantly populate the catalog with *Game Changer (Raa Macha Macha)*, *Pushpa 2 (Sooseki)*, *Saripodhaa Sanivaaram (Garam Garam)*, and *OG (Fire Storm)*!
- **Catalog Management Table**: Search, filter, play preview, and delete custom tracks.

### 3. 🗄️ Database & Account Management Hub (`Database`)
- **Dual-Engine Live Status**: Real-time inspection of MySQL 8.0 database connection and browser persistent IndexedDB storage.
- **Live KPI Counters**: Real-time counts of Active User Session, Liked Songs (`favorites`), Offline Audio Blobs (`downloads` in MBs), Custom Playlists, Listening History, and Chat Messages.
- **⬇ Export Database Backup (JSON)**: Download your entire account, playlists, and history in a single JSON backup file.
- **↻ Live Stats Refresh & 🗑 Cache Clear**: Re-scan database metrics or reset demo cache on demand.

### 4. 🎤 Sing-Along Live Karaoke Lyrics & ⏱ Sleep Timer
- **Live Karaoke Lyrics**: Micro-synchronized lyrics that highlight and smooth-scroll as the music plays. Click any lyric line to jump directly to that timestamp.
- **Sleep Timer**: Choose 15m, 30m, 45m, 1h, or "End of Track" to automatically fade out and pause playback.

### 5. 🎧 Audio Fidelity & Hardware Equalizer
- **5-Band Equalizer**: Web Audio API biquad filters for 60Hz, 230Hz, 910Hz, 3.6kHz, and 14kHz with Bass Boost, Vocal, Rock, Pop, and Flat presets.
- **Real-Time Visualizer**: Dynamic animated sound waves synced with audio frequencies.
- **True Offline Downloads**: Full binary audio blobs saved directly in IndexedDB for 100% offline playback.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18 or later
- (Optional) MySQL 8.0 server (if MySQL is offline, the app seamlessly runs in resilient in-memory mode without errors)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/CHAITHANYA-2127/Audio-Streamer-Hub-.git
   cd Audio-Streamer-Hub-
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment:
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser at:
   ```
   http://localhost:3000
   ```
   **Quick Demo Login**: `demo@hub.com` / `password123` (or click *"⚡ 1-Click Quick Demo Login"*).

---

## 📡 API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Check server and database engine status |
| `POST` | `/api/auth/login` | Authenticate user session |
| `POST` | `/api/auth/register` | Register new user account |
| `GET` | `/api/auth/me` | Get current active user |
| `POST` | `/api/auth/logout` | Terminate session |
| `GET` | `/api/friends` | Get list of friends with presence and status |
| `GET` | `/api/messages/:friendId` | Get chat messages thread with song cards |
| `POST` | `/api/messages/:friendId` | Send a direct message or share a track |
| `GET` | `/api/database/diagnostics` | Live database & storage metrics |
| `GET` | `/api/admin/tracks` | Get all admin-added catalog tracks |
| `POST` | `/api/admin/tracks` | Publish a new song to live catalog |
| `DELETE` | `/api/admin/tracks/:id` | Remove a custom track from catalog |
| `GET` | `/api/plans` | List available membership tiers |

---

## 🌐 Deployment (GitHub Pages)

This project includes automated GitHub Actions deployment in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Any push to `main` automatically updates and hosts the latest build on GitHub Pages:

👉 **[https://chaithanya-2127.github.io/Audio-Streamer-Hub-/](https://chaithanya-2127.github.io/Audio-Streamer-Hub-/)**

---

© 2026 Chaithanya • Audio Streamer Hub
