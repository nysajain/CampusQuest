# Campus Quest 🎮✦

> **ASU's gamified campus connection app** — complete real-world social quests, vibe with zone music, and meet people without the awkward intros.

Built for the **PI Academy — Student Loneliness** challenge at Arizona State University.

---

## What is this?

Campus Quest turns your campus into an RPG map. Each location (MU, Hayden Library, Palm Walk...) is a **zone** with:
- **Quests** — solo, multiplayer, and weekly boss challenges that earn you XP
- **Zone Aux** — a live shared playlist everyone at that location contributes to
- **Vibe Match** — when two students queue songs back-to-back, they get a low-pressure wave prompt
- **Badges & Leaderboard** — collect achievements, climb the weekly XP ranks

---

## Tech Stack

| Layer    | Tech                         |
|----------|------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing  | React Router v6              |
| Animation| Framer Motion                |
| Backend  | FastAPI (Python 3.11+)       |
| State    | React Context + localStorage |
| Fonts    | Bebas Neue · DM Sans (Google Fonts) |

---

## Project Structure

```
campus-quest/
├── backend/
│   ├── main.py            # FastAPI app — all routes
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/    # Header, BottomNav, ZoneCard, AuxStrip, WaveModal
│   │   ├── pages/         # QuestsPage, AuxPage, BadgesPage, LeaderboardPage
│   │   ├── context/       # UserContext (global XP/user state)
│   │   ├── api.js         # Axios API helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css      # Tailwind + ASU custom tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/campus-quest.git
cd campus-quest
```

### 2. Start the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will be live at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

App will open at `http://localhost:5173`

> The Vite dev server proxies `/api/*` to the FastAPI backend automatically — no CORS setup needed in dev.

---

## API Endpoints

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/api/user/{id}`      | Get user profile + XP + badges     |
| GET    | `/api/zones`          | List all campus zones              |
| GET    | `/api/zones/{id}`     | Single zone details + queue        |
| POST   | `/api/quest/complete` | Complete a quest, earn XP          |
| POST   | `/api/aux/add`        | Add song to zone queue, earn XP    |
| POST   | `/api/wave`           | Send wave, unlock Vibe Match badge |
| GET    | `/api/leaderboard`    | Weekly XP rankings                 |
| GET    | `/api/badges`         | All badges + unlock status         |

---

## ASU Design Tokens

| Token            | Value     | Usage                     |
|------------------|-----------|---------------------------|
| `asu-gold`       | `#FFC627` | Primary accent, XP bars   |
| `asu-maroon`     | `#8C1D40` | Secondary, boss quests    |
| `asu-black`      | `#191919` | App background            |
| Font Display     | Bebas Neue| Headers, XP numbers       |
| Font Body        | DM Sans   | All UI text               |

---

## Features Roadmap

- [ ] Real GPS zone detection via browser Geolocation API
- [ ] Spotify Web API integration for Zone Aux playback
- [ ] Push notifications for vibe matches
- [ ] Multiplayer quest confirmation (both parties tap done)
- [ ] Weekly boss reset automation
- [ ] ASU SSO / My ASU login integration
- [ ] PostgreSQL persistence (replace in-memory state)
- [ ] Admin dashboard for quest management

---

## Team

Built by Team 7 — PI Academy 2026
Vaishnavi M. · Krishna B. · Nysa J. · Asmi K.

*Arizona State University · University College · Principled Innovation Academy*
