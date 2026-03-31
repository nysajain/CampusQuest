import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getLeaderboard } from '../api'
import { Trophy, Zap } from 'lucide-react'

const RANK_COLORS = {
  1: { num: 'text-asu-gold',   bg: 'bg-asu-gold/15',   border: 'border-asu-gold/30'   },
  2: { num: 'text-white/60',   bg: 'bg-white/8',        border: 'border-white/15'      },
  3: { num: 'text-orange-400', bg: 'bg-orange-900/20',  border: 'border-orange-500/20' },
}

const AVATAR_COLORS = {
  gold:   'bg-asu-gold/20 text-asu-gold',
  maroon: 'bg-asu-maroon/30 text-asu-maroon-light',
  teal:   'bg-teal-900/40 text-teal-300',
}

export default function LeaderboardPage() {
  const [board, setBoard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then(r => setBoard(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))

    // Poll every 10s
    const t = setInterval(() => {
      getLeaderboard().then(r => setBoard(r.data)).catch(() => {})
    }, 10000)
    return () => clearInterval(t)
  }, [])

  const top3  = board.slice(0, 3)
  const rest  = board.slice(3)

  return (
    <div>
      {/* Header */}
      <div className="mx-4 mt-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-asu-gold/15 border border-asu-gold/30
                        flex items-center justify-center">
          <Trophy size={20} className="text-asu-gold" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-white tracking-wide">LEADERBOARD</h1>
          <p className="text-[11px] text-white/40 font-body">this week · Tempe campus</p>
        </div>
      </div>

      {loading ? (
        <div className="px-4 space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 rounded-2xl shimmer-bg bg-white/5" />
          ))}
        </div>
      ) : (
        <>
          {/* Top 3 podium-style */}
          <div className="px-4 mb-4">
            <div className="grid grid-cols-3 gap-2 items-end">
              {/* 2nd */}
              {top3[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .15 }}
                  className="card-base border border-white/10 p-3 text-center"
                  style={{ marginBottom: 0 }}
                >
                  <div className="text-lg font-body font-bold text-white/50 mb-2">2</div>
                  <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center
                                  text-sm font-body font-semibold mb-2
                                  ${AVATAR_COLORS[top3[1].color] || AVATAR_COLORS.teal}`}>
                    {top3[1].initials}
                  </div>
                  <p className="text-xs font-body font-semibold text-white truncate">{top3[1].name.split(' ')[0]}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{top3[1].xp} XP</p>
                </motion.div>
              )}

              {/* 1st */}
              {top3[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .05 }}
                  className="card-gold border p-3 text-center -mb-2 relative"
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <div className="text-base">👑</div>
                  </div>
                  <div className="text-lg font-display text-asu-gold mb-2 mt-1">1</div>
                  <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center
                                  text-sm font-body font-semibold mb-2
                                  ${AVATAR_COLORS[top3[0].color] || AVATAR_COLORS.gold}`}>
                    {top3[0].initials}
                  </div>
                  <p className="text-xs font-body font-semibold text-white truncate">{top3[0].name.split(' ')[0]}</p>
                  <p className="text-[10px] text-asu-gold mt-0.5 font-medium">{top3[0].xp} XP</p>
                </motion.div>
              )}

              {/* 3rd */}
              {top3[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .2 }}
                  className="card-base border border-white/10 p-3 text-center"
                >
                  <div className="text-lg font-body font-bold text-orange-400/70 mb-2">3</div>
                  <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center
                                  text-sm font-body font-semibold mb-2
                                  ${AVATAR_COLORS[top3[2].color] || AVATAR_COLORS.maroon}`}>
                    {top3[2].initials}
                  </div>
                  <p className="text-xs font-body font-semibold text-white truncate">{top3[2].name.split(' ')[0]}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{top3[2].xp} XP</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Full list */}
          <div className="section-label">full ranking</div>
          <div className="mx-4 card-base border border-white/10 mb-4 overflow-hidden">
            {board.map((entry, idx) => {
              const rc = RANK_COLORS[entry.rank] || {}
              return (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * .05 }}
                  className={`flex items-center gap-3 px-4 py-3
                              ${idx < board.length - 1 ? 'border-b border-white/6' : ''}
                              ${entry.is_me ? 'bg-asu-gold/5' : ''}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                                   text-sm font-display
                                   ${rc.bg || 'bg-white/5'} ${rc.border || 'border-white/10'} border`}>
                    <span className={rc.num || 'text-white/40'}>{entry.rank}</span>
                  </div>

                  <div className={`w-9 h-9 rounded-full flex items-center justify-center
                                  text-xs font-body font-semibold flex-shrink-0
                                  ${AVATAR_COLORS[entry.color] || AVATAR_COLORS.teal}`}>
                    {entry.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-body font-semibold truncate
                                   ${entry.is_me ? 'text-asu-gold' : 'text-white'}`}>
                      {entry.name} {entry.is_me && <span className="text-[10px] text-asu-gold/60">(you)</span>}
                    </p>
                    <p className="text-[10px] text-white/35">{entry.title}</p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Zap size={11} className={entry.is_me ? 'text-asu-gold' : 'text-white/30'} />
                    <span className={`text-sm font-body font-semibold
                                     ${entry.is_me ? 'text-asu-gold' : 'text-white/70'}`}>
                      {entry.xp}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Motivational cta */}
          <div className="mx-4 mb-4 rounded-2xl bg-asu-maroon/15 border border-asu-maroon/30 px-4 py-4">
            <p className="text-xs text-asu-maroon-light font-body font-medium mb-1">
              Keep climbing, Sun Devil
            </p>
            <p className="text-[11px] text-white/40 font-body">
              Complete quests and add songs to climb the ranks.
              Top 3 get featured on the campus board.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
