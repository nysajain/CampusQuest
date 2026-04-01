import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'
const api = axios.create({ baseURL: BASE })

export const getUser        = (id = 'nysa') => api.get(`/user/${id}`)
export const getZones       = ()            => api.get('/zones')
export const getZone        = (id)          => api.get(`/zones/${id}`)
export const completeQuest  = (quest_id, zone_id) =>
  api.post('/quest/complete', { quest_id, zone_id })
export const addSong        = (zone_id, song) =>
  api.post('/aux/add', { zone_id, song, user_id: 'nysa' })
export const sendWave       = ()            => api.post('/wave', { user_id: 'nysa' })
export const getLeaderboard = ()            => api.get('/leaderboard')
export const getBadges      = ()            => api.get('/badges')