from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import time, random, uuid

app = FastAPI(title="Campus Quest API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory state ──────────────────────────────────────────────
users = {
    "nysa": {
        "id": "nysa", "name": "Nysa J.", "initials": "NJ",
        "level": 4, "title": "Globe Trotter",
        "xp": 340, "xp_next": 500,
        "country": "India", "flag": "🇮🇳",
        "languages": ["Hindi", "English"],
        "quests_done": 12, "connections_made": 5,
        "cultures_met": 4, "songs_queued": 3,
        "badges": ["first_landing", "zone_dj", "globe_trotter"],
        "completed_quests": [],
        "enrolled_classes": ["CSE 310", "MAT 243", "COM 100", "BIO 181", "ENG 102"],
    }
}

# ── Class roster (dummy data — real version pulls from MyASU) ─────
# Maps classmate name → their enrolled classes
class_roster = {
    "Priya M.":  ["CSE 310", "MAT 243", "PHY 101"],
    "Chen W.":   ["CSE 310", "CSE 360", "MAT 243"],
    "Asmi K.":   ["COM 100", "ENG 102", "SOC 101"],
    "Tariq O.":  ["COM 100", "BIO 181", "CHM 116"],
    "Layla P.":  ["BIO 181", "CHM 116", "PSY 101"],
    "Ji-ho K.":  ["MAT 243", "PHY 101", "CSE 205"],
    "Lucas R.":  ["ENG 102", "HIS 101", "COM 100"],
}

zones = {
    "mu": {
        "id": "mu", "name": "Memorial Union", "sublocation": "3rd floor",
        "distance": "you are here", "students_here": 8,
        "countries_here": 6, "classmates_here": 2,
        "country_flags": ["🇮🇳", "🇨🇳", "🇲🇽", "🇧🇷", "🇰🇷", "🇳🇬"],
        "color": "gold", "is_current": True,
        "now_playing": "Doechii — Denial Is A River",
        "queue": ["Charli xcx — 360", "Frank Ocean — Nights", "SZA — Snooze"],
        "listeners": 9,
        "quest": {
            "id": "mu_buddy", "type": "icebreaker",
            "title": "Find a study buddy",
            "desc": "Sit near someone you don't know and work in the same space for 30 mins. Ask where they're from. Both tap done to confirm.",
            "xp": 60, "status": "available"
        }
    },
    "library": {
        "id": "library", "name": "Hayden Library", "sublocation": "Lower Level",
        "distance": "0.3 mi", "students_here": 14,
        "countries_here": 9, "classmates_here": 1,
        "country_flags": ["🇵🇰", "🇯🇵", "🇫🇷", "🇩🇪", "🇿🇦", "🇨🇴", "🇪🇬", "🇹🇷", "🇦🇺"],
        "color": "maroon", "is_current": False,
        "now_playing": "Tyler, the Creator — See You Again",
        "queue": ["SZA — Kill Bill", "Mitski — Nobody", "Bon Iver — Holocene"],
        "listeners": 14,
        "quest": {
            "id": "lib_study", "type": "explorer",
            "title": "Silent study ritual",
            "desc": "Study for 45 minutes without your phone — just like you'd focus back home. Check in when you arrive, check out when done.",
            "xp": 80, "status": "available"
        }
    },
    "palm_walk": {
        "id": "palm_walk", "name": "Palm Walk", "sublocation": "outdoor seating",
        "distance": "0.5 mi", "students_here": 22,
        "countries_here": 12, "classmates_here": 0,
        "country_flags": ["🇻🇳", "🇧🇩", "🇵🇭", "🇨🇱", "🇰🇪", "🇮🇷", "🇵🇪", "🇬🇭", "🇮🇩", "🇺🇦", "🇪🇹", "🇷🇴"],
        "color": "gold", "is_current": False,
        "now_playing": "Kendrick Lamar — Not Like Us",
        "queue": ["Ice Spice — Gimmie A Light", "Benson Boone — Beautiful Things"],
        "listeners": 22,
        "quest": {
            "id": "palm_boss", "type": "legend",
            "title": "Share your table",
            "desc": "Sit at a table where someone else is eating alone. Say hey. Ask what they miss most about home. You don't have to talk the whole time.",
            "xp": 150, "status": "available"
        }
    },
    "coor_hall": {
        "id": "coor_hall", "name": "Coor Hall", "sublocation": "lobby",
        "distance": "0.7 mi", "students_here": 6,
        "countries_here": 4, "classmates_here": 1,
        "country_flags": ["🇲🇾", "🇸🇦", "🇪🇸", "🇳🇵"],
        "color": "maroon", "is_current": False,
        "now_playing": "Lorde — Royals",
        "queue": ["Billie Eilish — Birds of a Feather", "Gracie Abrams — Risk"],
        "listeners": 6,
        "quest": {
            "id": "coor_convo", "type": "explorer",
            "title": "Teach someone a word",
            "desc": "Say hello to someone in your language and teach them how to say it. Even one word is enough to make someone feel seen.",
            "xp": 40, "status": "available"
        }
    }
}

badges_catalog = {
    "first_landing":   {"id": "first_landing",   "name": "First Landing",    "desc": "Took your first step — completed your first quest at ASU",      "color": "gold"},
    "culture_bridge":  {"id": "culture_bridge",  "name": "Culture Bridge",   "desc": "Connected with someone from a different country",               "color": "teal"},
    "globe_trotter":   {"id": "globe_trotter",   "name": "Globe Trotter",    "desc": "Visited 4 different zones across campus",                       "color": "gold"},
    "zone_dj":         {"id": "zone_dj",         "name": "Zone DJ",          "desc": "Added 5 songs to zone queues — your music, your identity",       "color": "teal"},
    "kindred_spirit":  {"id": "kindred_spirit",  "name": "Kindred Spirit",   "desc": "Waved back at someone — found a moment of real connection",      "color": "teal"},
    "hometown_hero":   {"id": "hometown_hero",   "name": "Hometown Hero",    "desc": "Completed a legend quest — went above and beyond",               "color": "maroon"},
    "sun_devil_streak":{"id": "sun_devil_streak","name": "Sun Devil Streak", "desc": "Showed up 7 days in a row — you belong here",                    "color": "gold"},
}

leaderboard_data = [
    {"rank":1,"name":"Priya M.",  "initials":"PM","title":"World Citizen",  "xp":820,"color":"teal",  "flag":"🇮🇳","country":"India",       "is_me":False,"shared_classes":["CSE 310","MAT 243"]},
    {"rank":2,"name":"Chen W.",   "initials":"CW","title":"Culture Bridge", "xp":710,"color":"gold",  "flag":"🇨🇳","country":"China",       "is_me":False,"shared_classes":["CSE 310","MAT 243"]},
    {"rank":3,"name":"Asmi K.",   "initials":"AK","title":"Globe Trotter",  "xp":490,"color":"maroon","flag":"🇮🇳","country":"India",       "is_me":False,"shared_classes":["COM 100","ENG 102"]},
    {"rank":4,"name":"Nysa J.",   "initials":"NJ","title":"Globe Trotter",  "xp":340,"color":"gold",  "flag":"🇮🇳","country":"India",       "is_me":True, "shared_classes":[]},
    {"rank":5,"name":"Tariq O.",  "initials":"TO","title":"Scout",          "xp":210,"color":"teal",  "flag":"🇳🇬","country":"Nigeria",     "is_me":False,"shared_classes":["COM 100","BIO 181"]},
    {"rank":6,"name":"Layla P.",  "initials":"LP","title":"Newcomer",       "xp":175,"color":"maroon","flag":"🇸🇦","country":"Saudi Arabia","is_me":False,"shared_classes":["BIO 181"]},
    {"rank":7,"name":"Ji-ho K.",  "initials":"JK","title":"Scout",          "xp":160,"color":"teal",  "flag":"🇰🇷","country":"South Korea", "is_me":False,"shared_classes":["MAT 243"]},
    {"rank":8,"name":"Lucas R.",  "initials":"LR","title":"Newcomer",       "xp":95, "color":"gold",  "flag":"🇧🇷","country":"Brazil",      "is_me":False,"shared_classes":["ENG 102","COM 100"]},
]

song_submissions = []

# ── Models ───────────────────────────────────────────────────────
class QuestComplete(BaseModel):
    quest_id: str
    zone_id: str

class SongAdd(BaseModel):
    zone_id: str
    song: str
    user_id: str = "nysa"

class WaveAction(BaseModel):
    user_id: str = "nysa"

# ── Routes ───────────────────────────────────────────────────────
@app.get("/")
def root():
    return {"status": "Campus Quest API running"}

@app.get("/api/user/{user_id}")
def get_user(user_id: str):
    if user_id not in users:
        raise HTTPException(404, "User not found")
    u = users[user_id].copy()
    u["badges_full"]   = [badges_catalog[b] for b in u["badges"] if b in badges_catalog]
    u["badges_locked"] = [b for b in badges_catalog if b not in u["badges"]]
    return u

@app.get("/api/zones")
def get_zones():
    return list(zones.values())

@app.get("/api/zones/{zone_id}")
def get_zone(zone_id: str):
    if zone_id not in zones:
        raise HTTPException(404, "Zone not found")
    return zones[zone_id]

@app.post("/api/quest/complete")
def complete_quest(body: QuestComplete):
    u = users["nysa"]
    if body.quest_id in u["completed_quests"]:
        raise HTTPException(400, "Quest already completed")
    z = zones.get(body.zone_id)
    if not z:
        raise HTTPException(404, "Zone not found")
    quest = z["quest"]
    xp_gain = quest["xp"]
    u["completed_quests"].append(body.quest_id)
    u["xp"] += xp_gain
    u["quests_done"] += 1
    if quest["type"] == "icebreaker":
        u["connections_made"] += 1
        u["cultures_met"] = min(u["cultures_met"] + 1, 20)
    quest["status"] = "done"
    newly_unlocked = []
    if u["connections_made"] >= 10 and "culture_bridge" not in u["badges"]:
        u["badges"].append("culture_bridge")
        newly_unlocked.append("culture_bridge")
    if quest["type"] == "legend" and "hometown_hero" not in u["badges"]:
        u["badges"].append("hometown_hero")
        newly_unlocked.append("hometown_hero")
    if u["quests_done"] >= 1 and "first_landing" not in u["badges"]:
        u["badges"].append("first_landing")
        newly_unlocked.append("first_landing")
    _recalc_level(u)
    return {"xp_gained": xp_gain, "new_xp": u["xp"], "newly_unlocked": newly_unlocked,
            "vibe_match": quest["type"] == "icebreaker"}

@app.post("/api/aux/add")
def add_song(body: SongAdd):
    if body.zone_id not in zones:
        raise HTTPException(404, "Zone not found")
    z = zones[body.zone_id]
    z["queue"].append(body.song)
    u = users[body.user_id]
    u["songs_queued"] += 1
    u["xp"] += 10
    song_submissions.append({"zone_id": body.zone_id, "song": body.song, "ts": time.time()})
    newly_unlocked = []
    if u["songs_queued"] >= 5 and "zone_dj" not in u["badges"]:
        u["badges"].append("zone_dj")
        newly_unlocked.append("zone_dj")
    _recalc_level(u)
    vibe = len([s for s in song_submissions if s["zone_id"] == body.zone_id
                and time.time() - s["ts"] < 120]) >= 2
    return {"xp_gained": 10, "new_xp": u["xp"], "queue": z["queue"],
            "newly_unlocked": newly_unlocked, "vibe_match_trigger": vibe}

@app.post("/api/wave")
def send_wave(body: WaveAction):
    u = users[body.user_id]
    u["xp"] += 25
    newly_unlocked = []
    if "kindred_spirit" not in u["badges"]:
        u["badges"].append("kindred_spirit")
        newly_unlocked.append("kindred_spirit")
    _recalc_level(u)
    return {"xp_gained": 25, "new_xp": u["xp"], "newly_unlocked": newly_unlocked}

@app.get("/api/leaderboard")
def get_leaderboard():
    u = users["nysa"]
    my_classes = set(u["enrolled_classes"])
    board = [dict(e) for e in leaderboard_data]
    for entry in board:
        if entry["is_me"]:
            entry["xp"] = u["xp"]
        # Filter shared_classes to only those that overlap with current user's roster
        entry_classes = set(class_roster.get(entry["name"], []))
        entry["shared_classes"] = sorted(my_classes & entry_classes)
    board.sort(key=lambda x: -x["xp"])
    for i, entry in enumerate(board):
        entry["rank"] = i + 1
    return board

@app.get("/api/stats")
def get_stats():
    total_students = sum(z["students_here"] for z in zones.values())
    all_flags = [f for z in zones.values() for f in z.get("country_flags", [])]
    unique_countries = len(set(all_flags))
    recent_activity = [
        {"name": "Priya",  "flag": "🇮🇳", "action": "connected with someone",  "where": "Memorial Union", "mins_ago": 2},
        {"name": "Chen",   "flag": "🇨🇳", "action": "added a song to the queue","where": "Hayden Library", "mins_ago": 5},
        {"name": "Tariq",  "flag": "🇳🇬", "action": "completed an icebreaker",  "where": "Palm Walk",      "mins_ago": 8},
        {"name": "Ji-ho",  "flag": "🇰🇷", "action": "earned Kindred Spirit",    "where": "Coor Hall",      "mins_ago": 14},
    ]
    return {
        "students_active":       total_students,
        "zones_active":          len(zones),
        "countries_represented": unique_countries,
        "flags_sample":          list(set(all_flags))[:10],
        "recent_activity":       recent_activity,
    }

@app.get("/api/classmates")
def get_classmates():
    """Return the current user's class roster with per-classmate class overlap."""
    u = users["nysa"]
    my_classes = u["enrolled_classes"]
    # Build list of classmates with their overlapping classes
    seen = {}
    for name, their_classes in class_roster.items():
        shared = [c for c in their_classes if c in my_classes]
        if shared:
            flag = next((e["flag"] for e in leaderboard_data if e["name"] == name), "🌍")
            initials = "".join(p[0] for p in name.replace(".", "").split()[:2]).upper()
            seen[name] = {"name": name, "initials": initials, "flag": flag, "classes": shared}
    return {
        "my_classes": my_classes,
        "classmates": list(seen.values()),
    }

@app.get("/api/badges")
def get_badges():
    u = users["nysa"]
    result = []
    for bid, b in badges_catalog.items():
        result.append({**b, "unlocked": bid in u["badges"]})
    return result

def _recalc_level(u):
    thresholds = [0, 100, 250, 400, 600, 900, 1300]
    titles = ["Newcomer", "Scout", "Explorer", "Globe Trotter", "Culture Bridge", "World Citizen", "Sun Devil"]
    for i, t in enumerate(thresholds):
        if u["xp"] >= t:
            u["level"] = i + 1
            u["title"] = titles[i]
            u["xp_next"] = thresholds[i + 1] if i + 1 < len(thresholds) else 9999
