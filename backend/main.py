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
        "level": 4, "title": "Wanderer",
        "xp": 340, "xp_next": 500,
        "quests_done": 12, "people_met": 5, "songs_queued": 3,
        "badges": ["first_quest", "zone_dj", "wanderer"],
        "completed_quests": [],
    }
}

zones = {
    "mu": {
        "id": "mu", "name": "Memorial Union", "sublocation": "3rd floor",
        "distance": "you are here", "students_here": 8,
        "color": "gold", "is_current": True,
        "now_playing": "Doechii — Denial Is A River",
        "queue": ["Charli xcx — 360", "Frank Ocean — Nights", "SZA — Snooze"],
        "listeners": 9,
        "quest": {
            "id": "mu_buddy", "type": "multiplayer",
            "title": "find a study buddy",
            "desc": "Sit near someone you don't know and work in the same space for 30 mins. Both tap done to confirm.",
            "xp": 60, "status": "available"
        }
    },
    "library": {
        "id": "library", "name": "Hayden Library", "sublocation": "Lower Level",
        "distance": "0.3 mi", "students_here": 14,
        "color": "maroon", "is_current": False,
        "now_playing": "Tyler, the Creator — See You Again",
        "queue": ["SZA — Kill Bill", "Mitski — Nobody", "Bon Iver — Holocene"],
        "listeners": 14,
        "quest": {
            "id": "lib_study", "type": "solo",
            "title": "silent study challenge",
            "desc": "Study for 45 minutes without your phone. Check in when you arrive, check out when done.",
            "xp": 80, "status": "available"
        }
    },
    "palm_walk": {
        "id": "palm_walk", "name": "Palm Walk", "sublocation": "outdoor seating",
        "distance": "0.5 mi", "students_here": 22,
        "color": "gold", "is_current": False,
        "now_playing": "Kendrick Lamar — Not Like Us",
        "queue": ["Ice Spice — Gimmie A Light", "Benson Boone — Beautiful Things"],
        "listeners": 22,
        "quest": {
            "id": "palm_boss", "type": "boss",
            "title": "eat lunch with a stranger",
            "desc": "Sit at a table where someone else is eating. Say hey. You don't have to talk the whole time.",
            "xp": 150, "status": "available"
        }
    },
    "coor_hall": {
        "id": "coor_hall", "name": "Coor Hall", "sublocation": "lobby",
        "distance": "0.7 mi", "students_here": 6,
        "color": "maroon", "is_current": False,
        "now_playing": "Lorde — Royals",
        "queue": ["Billie Eilish — Birds of a Feather", "Gracie Abrams — Risk"],
        "listeners": 6,
        "quest": {
            "id": "coor_convo", "type": "solo",
            "title": "compliment one person's fit",
            "desc": "Find someone whose style you genuinely like and tell them. That's it. That's the quest.",
            "xp": 40, "status": "available"
        }
    }
}

badges_catalog = {
    "first_quest":    {"id": "first_quest",   "name": "First Quest",      "desc": "Completed your first quest",     "color": "gold"},
    "zone_dj":        {"id": "zone_dj",        "name": "Zone DJ",          "desc": "Added 5 songs to zone queues",   "color": "teal"},
    "wanderer":       {"id": "wanderer",       "name": "Wanderer",         "desc": "Visited 4 different zones",      "color": "gold"},
    "social_butterfly":{"id":"social_butterfly","name":"Social Butterfly",  "desc": "Met 10 new people on campus",    "color": "maroon"},
    "boss_slayer":    {"id": "boss_slayer",    "name": "Boss Slayer",      "desc": "Completed a weekly boss quest",  "color": "maroon"},
    "vibe_match":     {"id": "vibe_match",     "name": "Vibe Match",       "desc": "Got a mutual wave from someone", "color": "teal"},
    "seven_streak":   {"id": "seven_streak",   "name": "7-Day Streak",     "desc": "Quested 7 days in a row",        "color": "gold"},
}

leaderboard_data = [
    {"rank":1,"name":"Krishna L.","initials":"KL","title":"Explorer","xp":680,"color":"teal","is_me":False},
    {"rank":2,"name":"Vaishnavi M.","initials":"VM","title":"Connector","xp":570,"color":"gold","is_me":False},
    {"rank":3,"name":"Asmi K.","initials":"AK","title":"Wanderer","xp":490,"color":"maroon","is_me":False},
    {"rank":4,"name":"Nysa J.","initials":"NJ","title":"Wanderer","xp":340,"color":"gold","is_me":True},
    {"rank":5,"name":"Rohan S.","initials":"RS","title":"Newcomer","xp":210,"color":"teal","is_me":False},
    {"rank":6,"name":"Layla P.","initials":"LP","title":"Newcomer","xp":175,"color":"maroon","is_me":False},
]

song_submissions = []  # {zone_id, song, user_id, ts}

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
    u["badges_full"] = [badges_catalog[b] for b in u["badges"] if b in badges_catalog]
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
    if quest["type"] == "multiplayer":
        u["people_met"] += 1
    quest["status"] = "done"
    newly_unlocked = []
    if u["people_met"] >= 10 and "social_butterfly" not in u["badges"]:
        u["badges"].append("social_butterfly")
        newly_unlocked.append("social_butterfly")
    if quest["type"] == "boss" and "boss_slayer" not in u["badges"]:
        u["badges"].append("boss_slayer")
        newly_unlocked.append("boss_slayer")
    _recalc_level(u)
    return {"xp_gained": xp_gain, "new_xp": u["xp"], "newly_unlocked": newly_unlocked,
            "vibe_match": quest["type"] == "multiplayer"}

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
    if "vibe_match" not in u["badges"]:
        u["badges"].append("vibe_match")
        newly_unlocked.append("vibe_match")
    _recalc_level(u)
    return {"xp_gained": 25, "new_xp": u["xp"], "newly_unlocked": newly_unlocked}

@app.get("/api/leaderboard")
def get_leaderboard():
    u = users["nysa"]
    board = leaderboard_data.copy()
    for entry in board:
        if entry["is_me"]:
            entry["xp"] = u["xp"]
    board.sort(key=lambda x: -x["xp"])
    for i, entry in enumerate(board):
        entry["rank"] = i + 1
    return board

@app.get("/api/badges")
def get_badges():
    u = users["nysa"]
    result = []
    for bid, b in badges_catalog.items():
        result.append({**b, "unlocked": bid in u["badges"]})
    return result

def _recalc_level(u):
    thresholds = [0, 100, 250, 400, 600, 900, 1300]
    titles = ["Newcomer","Scout","Explorer","Wanderer","Connector","Champion","Legend"]
    for i, t in enumerate(thresholds):
        if u["xp"] >= t:
            u["level"] = i + 1
            u["title"] = titles[i]
            u["xp_next"] = thresholds[i + 1] if i + 1 < len(thresholds) else 9999
