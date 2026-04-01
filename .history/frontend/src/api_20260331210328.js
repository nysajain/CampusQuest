import axios from 'axios'
import {
  demoBadgesCatalog,
  demoClassRoster,
  demoInitialUser,
  demoLeaderboard,
  demoRecentActivity,
  demoZones,
} from './demoData'

const api = axios.create({ baseURL: '/api' })

const DEMO_USER_ID = 'nysa'
const LEVEL_THRESHOLDS = [0, 100, 250, 400, 600, 900, 1300]
const LEVEL_TITLES = ['Newcomer', 'Scout', 'Explorer', 'Globe Trotter', 'Culture Bridge', 'World Citizen', 'Sun Devil']

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

const demoState = {
  user: clone(demoInitialUser),
  zones: clone(demoZones),
  leaderboard: clone(demoLeaderboard),
}

function recalcLevel(user) {
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (user.xp >= LEVEL_THRESHOLDS[i]) {
      user.level = i + 1
      user.title = LEVEL_TITLES[i]
      user.xp_next = LEVEL_THRESHOLDS[i + 1] || 9999
    }
  }
}

function withBadgeMeta(user) {
  const u = clone(user)
  const allBadges = Object.values(demoBadgesCatalog)
  u.badges_full = allBadges.filter(b => u.badges.includes(b.id))
  u.badges_locked = allBadges.filter(b => !u.badges.includes(b.id)).map(b => b.id)
  return u
}

function getDemoStats() {
  const totalStudents = demoState.zones.reduce((sum, z) => sum + (z.students_here || 0), 0)
  const flags = demoState.zones.flatMap(z => z.country_flags || [])
  const uniqueFlags = Array.from(new Set(flags))

  return {
    students_active: totalStudents,
    zones_active: demoState.zones.length,
    countries_represented: uniqueFlags.length,
    flags_sample: uniqueFlags.slice(0, 10),
    recent_activity: clone(demoRecentActivity),
  }
}

async function withNetworkFallback(request, fallback) {
  try {
    return await request()
  } catch (err) {
    if (err?.response) throw err
    return { data: fallback() }
  }
}

function getDemoZone(zoneId) {
  return demoState.zones.find(z => z.id === zoneId)
}

function unlockBadge(user, badgeId, newlyUnlocked) {
  if (!user.badges.includes(badgeId)) {
    user.badges.push(badgeId)
    newlyUnlocked.push(badgeId)
  }
}

export const getUser = (id = DEMO_USER_ID) =>
  withNetworkFallback(
    () => api.get(`/user/${id}`),
    () => withBadgeMeta(demoState.user)
  )

export const getZones = () =>
  withNetworkFallback(
    () => api.get('/zones'),
    () => clone(demoState.zones)
  )

export const getZone = (id) =>
  withNetworkFallback(
    () => api.get(`/zones/${id}`),
    () => clone(getDemoZone(id))
  )

export const completeQuest = (quest_id, zone_id) =>
  withNetworkFallback(
    () => api.post('/quest/complete', { quest_id, zone_id }),
    () => {
      const user = demoState.user
      const zone = getDemoZone(zone_id)
      if (!zone?.quest || user.completed_quests.includes(quest_id) || zone.quest.status === 'done') {
        return { xp_gained: 0, new_xp: user.xp, newly_unlocked: [], vibe_match: false }
      }

      const xpGain = zone.quest.xp || 60
      user.completed_quests.push(quest_id)
      user.xp += xpGain
      user.quests_done += 1
      zone.quest.status = 'done'
      const newlyUnlocked = []

      if (zone.quest.type === 'icebreaker') {
        user.connections_made += 1
        user.cultures_met = Math.min(user.cultures_met + 1, 20)
      }

      if (user.quests_done >= 1) unlockBadge(user, 'first_landing', newlyUnlocked)
      if (zone.quest.type === 'legend') unlockBadge(user, 'hometown_hero', newlyUnlocked)
      if (user.connections_made >= 10) unlockBadge(user, 'culture_bridge', newlyUnlocked)
      if (user.quests_done >= 7) unlockBadge(user, 'sun_devil_streak', newlyUnlocked)

      recalcLevel(user)

      return {
        xp_gained: xpGain,
        new_xp: user.xp,
        newly_unlocked: newlyUnlocked,
        vibe_match: zone.quest.type === 'icebreaker',
      }
    }
  )

export const addSong = (zone_id, song) =>
  withNetworkFallback(
    () => api.post('/aux/add', { zone_id, song, user_id: DEMO_USER_ID }),
    () => {
      const user = demoState.user
      const zone = getDemoZone(zone_id)
      if (!zone) {
        return { xp_gained: 0, new_xp: user.xp, queue: [], newly_unlocked: [], vibe_match_trigger: false }
      }

      zone.queue = [...zone.queue, song]
      zone.listeners += 1
      user.songs_queued += 1
      user.xp += 10

      const newlyUnlocked = []
      if (user.songs_queued >= 5) unlockBadge(user, 'zone_dj', newlyUnlocked)
      recalcLevel(user)

      // Classmates in the same zone boost vibe match probability slightly
      const classBoost = (zone.classmates_here || 0) > 0 ? 0.15 : 0

      return {
        xp_gained: 10,
        new_xp: user.xp,
        queue: clone(zone.queue),
        newly_unlocked: newlyUnlocked,
        vibe_match_trigger: Math.random() < (0.4 + classBoost),
      }
    }
  )

export const sendWave = () =>
  withNetworkFallback(
    () => api.post('/wave', { user_id: DEMO_USER_ID }),
    () => {
      const user = demoState.user
      user.xp += 25
      user.connections_made += 1

      const newlyUnlocked = []
      unlockBadge(user, 'kindred_spirit', newlyUnlocked)
      if (user.connections_made >= 10) unlockBadge(user, 'culture_bridge', newlyUnlocked)
      recalcLevel(user)

      return { xp_gained: 25, new_xp: user.xp, newly_unlocked: newlyUnlocked }
    }
  )

export const getLeaderboard = () =>
  withNetworkFallback(
    () => api.get('/leaderboard'),
    () => {
      const board = clone(demoState.leaderboard)
      const me = board.find(entry => entry.is_me)
      if (me) {
        me.xp = demoState.user.xp
        me.title = demoState.user.title
      }
      board.sort((a, b) => b.xp - a.xp)
      board.forEach((entry, i) => {
        entry.rank = i + 1
        const classmate = demoClassRoster.classmates.find(c => c.name === entry.name)
        entry.shared_classes = classmate
          ? classmate.classes.filter(c => demoClassRoster.my_classes.includes(c))
          : []
      })
      return board
    }
  )

export const getClassmates = () =>
  withNetworkFallback(
    () => api.get('/classmates'),
    () => ({
      my_classes: demoClassRoster.my_classes,
      classmates: demoClassRoster.classmates,
    })
  )

export const getBadges = () =>
  withNetworkFallback(
    () => api.get('/badges'),
    () => Object.values(demoBadgesCatalog).map(badge => ({
      ...badge,
      unlocked: demoState.user.badges.includes(badge.id),
    }))
  )

export const getStats = () =>
  withNetworkFallback(
    () => api.get('/stats'),
    () => getDemoStats()
  )
