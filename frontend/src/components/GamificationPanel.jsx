import { motion } from 'framer-motion'
import { Flame, Target, Trophy, Zap } from 'lucide-react'
import { useUser } from '../context/UserContext'

const LEVEL_THRESHOLDS = [0, 100, 250, 400, 600, 900, 1300, 9999]

const TONE_CLASS = {
  gold: 'text-asu-gold',
  teal: 'text-teal-300',
  blue: 'text-blue-300',
  maroon: 'text-asu-maroon-light',
  violet: 'text-violet-300',
  white: 'text-white',
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function levelStartFromNext(xpNext) {
  const exact = LEVEL_THRESHOLDS.indexOf(xpNext)
  if (exact > 0) return LEVEL_THRESHOLDS[exact - 1]
  if (exact === 0) return 0

  for (let i = 1; i < LEVEL_THRESHOLDS.length; i += 1) {
    if (xpNext <= LEVEL_THRESHOLDS[i]) return LEVEL_THRESHOLDS[i - 1]
  }
  return Math.max(0, xpNext - 300)
}

export default function GamificationPanel({
  pageLabel = 'mission board',
  challenge = 'Complete one quest in a new zone.',
  reward = '+60 pts +1 stamp',
  stats = [],
  myRank,
  className = '',
  earnedBadges,
  totalBadges,
}) {
  const { user } = useUser()
  if (!user) return null

  const xp = toNumber(user.xp)
  const xpNext = toNumber(user.xp_next, xp + 200)
  const levelStart = levelStartFromNext(xpNext)
  const levelSpan = Math.max(1, xpNext - levelStart)
  const levelProgress = Math.max(0, Math.min(levelSpan, xp - levelStart))
  const levelPct = Math.round((levelProgress / levelSpan) * 100)
  const xpToNext = Math.max(0, xpNext - xp)

  const connections = toNumber(user.connections_made)
  const songsQueued = toNumber(user.songs_queued)
  const unlockedCount = toNumber(
    earnedBadges ?? (Array.isArray(user.badges) ? user.badges.length : 0)
  )
  const badgeTotal = Math.max(toNumber(totalBadges, 7), unlockedCount)

  const defaultStats = [
    { label: 'pitchfork pts', value: xp, tone: 'gold' },
    { label: 'level', value: user.level ?? '-', tone: 'teal' },
    { label: 'badges', value: unlockedCount, tone: 'blue' },
  ]
  const cards = stats.length > 0 ? stats : defaultStats

  const trackers = [
    { key: 'bridge', label: 'Culture Bridge', value: connections, target: 10, grad: 'from-teal-500/70 to-teal-300/60' },
    { key: 'dj', label: 'Zone DJ', value: songsQueued, target: 5, grad: 'from-violet-500/70 to-violet-300/60' },
    { key: 'passport', label: 'Passport', value: unlockedCount, target: badgeTotal, grad: 'from-amber-500/70 to-amber-300/60' },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [.16, 1, .3, 1] }}
      className={`rounded-2xl border border-[#1E2035] overflow-hidden ${className}`}
      style={{ background: 'var(--c-panel-grad)' }}
    >
      <div className="px-4 lg:px-6 py-4 lg:py-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-asu-maroon/35 border border-asu-maroon/35 flex items-center justify-center">
              <Trophy size={14} className="text-asu-gold" />
            </div>
            <div>
              <p className="text-[10px] lg:text-xs font-body font-semibold tracking-widest text-white/35 uppercase">{pageLabel}</p>
              <p className="text-xs lg:text-sm text-white/65 font-body">Lv{user.level} {user.title}</p>
            </div>
          </div>
          {typeof myRank === 'number' && (
            <span className="badge-maroon">rank #{myRank}</span>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] lg:text-xs font-body mb-1.5">
            <span className="text-white/45">{xp} pts</span>
            <span className="text-asu-gold">{xpToNext} pts to next level</span>
          </div>
          <div className="xp-bar">
            <div
              className="xp-fill"
              style={{ width: `${levelPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 lg:gap-3 mb-4">
          {cards.map(({ label, value, tone = 'white' }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.02] px-2.5 py-2 text-center">
              <p className={`text-lg lg:text-2xl font-display leading-none ${TONE_CLASS[tone] || TONE_CLASS.white}`}>
                {value}
              </p>
              <p className="text-[9px] lg:text-[10px] uppercase tracking-widest text-white/35 font-body mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2.5 mb-4">
          {trackers.map(({ key, label, value, target, grad }) => {
            const pct = Math.min(100, Math.round((Math.max(0, value) / Math.max(1, target)) * 100))
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-[10px] lg:text-xs font-body mb-1">
                  <span className="text-white/45">{label}</span>
                  <span className="text-white/65">{Math.min(value, target)}/{target}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.07] overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${grad}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-xl border border-asu-gold/20 bg-asu-gold/[0.05] px-3 py-2.5 flex items-start gap-2.5">
          <Target size={14} className="text-asu-gold mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] lg:text-xs uppercase tracking-widest text-asu-gold/70 font-body font-semibold mb-0.5">
              Today Challenge
            </p>
            <p className="text-xs lg:text-sm text-white/75 font-body">{challenge}</p>
          </div>
          <div className="ml-auto shrink-0 flex items-center gap-1.5 text-asu-gold">
            <Flame size={13} />
            <Zap size={13} />
          </div>
        </div>
        <p className="text-[10px] lg:text-xs text-white/35 font-body mt-1.5">
          reward: <span className="text-asu-gold/85">{reward}</span>
        </p>
      </div>
    </motion.section>
  )
}
