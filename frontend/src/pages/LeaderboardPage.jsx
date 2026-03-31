import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getLeaderboard } from '../api'
import { Trophy, Zap, Globe } from 'lucide-react'

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

    const t = setInterval(() => {
      getLeaderboard().then(r => setBoard(r.data)).catch(() => {})
    }, 10000)
    return () => clearInterval(t)
  }, [])

  const top3 = board.slice(0, 3)

  // count unique countries in the leaderboard
  const uniqueCountries = [...new Set(board.map(e => e.country).filter(Boolean))]

  return (
    <div>
      {/* Header */}
      <div className="mx-4 mt-4 lg:mt-8 mb-4 lg:mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-5">
          <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-asu-gold/15 border border-asu-gold/30
                          flex items-center justify-center shrink-0">
            <Trophy size={20} className="text-asu-gold lg:hidden" />
            <Trophy size={30} className="text-asu-gold hidden lg:block" />
          </div>
          <div>
            <h1 className="font-display text-2xl lg:text-5xl text-white tracking-wide">EXPLORERS</h1>
            <p className="text-[11px] lg:text-sm text-white/40 font-body mt-0.5">this week · Tempe campus</p>
          </div>
        </div>
        {/* Countries badge */}
        {uniqueCountries.length > 0 && (
          <div className="flex items-center gap-1.5 bg-blue-950/50 border border-blue-500/15 rounded-xl px-3 py-1.5">
            <Globe size={12} className="text-blue-400" />
            <span className="text-xs text-blue-300 font-body font-medium">{uniqueCountries.length} countries</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="px-4 space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 lg:h-28 rounded-2xl shimmer-bg bg-white/5" />
          ))}
        </div>
      ) : (
        <>
          <div className="lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-6 lg:px-4 lg:items-start">

            {/* Podium */}
            <div className="px-4 lg:px-0 mb-4 lg:mb-0">
              <div className="text-[10px] lg:text-xs font-body font-semibold tracking-widest text-white/35 uppercase mb-3 lg:mb-4">
                top 3
              </div>
              <div className="grid grid-cols-3 gap-2 lg:gap-3 items-end">

                {top3[1] && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}
                    className="card-base border border-[#1E2035] p-3 lg:p-5 text-center">
                    <div className="text-lg lg:text-2xl font-body font-bold text-white/45 mb-2 lg:mb-3">2</div>
                    <div className={`w-10 h-10 lg:w-16 lg:h-16 rounded-full mx-auto flex items-center justify-center
                                    text-sm lg:text-lg font-body font-semibold mb-1 lg:mb-2
                                    ${AVATAR_COLORS[top3[1].color] || AVATAR_COLORS.teal}`}>
                      {top3[1].initials}
                    </div>
                    {top3[1].flag && <div className="text-lg lg:text-xl mb-1">{top3[1].flag}</div>}
                    <p className="text-xs lg:text-sm font-body font-semibold text-white truncate">{top3[1].name.split(' ')[0]}</p>
                    <p className="text-[9px] lg:text-xs text-white/35 mt-0.5">{top3[1].country}</p>
                    <p className="text-[10px] lg:text-sm text-white/40 mt-1">{top3[1].xp} XP</p>
                  </motion.div>
                )}

                {top3[0] && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }}
                    className="card-gold border p-3 lg:p-5 text-center -mb-2 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg lg:text-2xl">👑</div>
                    <div className="text-lg lg:text-2xl font-display text-asu-gold mb-2 lg:mb-3 mt-1">1</div>
                    <div className={`w-12 h-12 lg:w-20 lg:h-20 rounded-full mx-auto flex items-center justify-center
                                    text-sm lg:text-xl font-body font-semibold mb-1 lg:mb-2
                                    ${AVATAR_COLORS[top3[0].color] || AVATAR_COLORS.gold}`}>
                      {top3[0].initials}
                    </div>
                    {top3[0].flag && <div className="text-xl lg:text-2xl mb-1">{top3[0].flag}</div>}
                    <p className="text-xs lg:text-sm font-body font-semibold text-white truncate">{top3[0].name.split(' ')[0]}</p>
                    <p className="text-[9px] lg:text-xs text-white/40 mt-0.5">{top3[0].country}</p>
                    <p className="text-[10px] lg:text-sm text-asu-gold mt-1 font-medium">{top3[0].xp} XP</p>
                  </motion.div>
                )}

                {top3[2] && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
                    className="card-base border border-[#1E2035] p-3 lg:p-5 text-center">
                    <div className="text-lg lg:text-2xl font-body font-bold text-orange-400/65 mb-2 lg:mb-3">3</div>
                    <div className={`w-10 h-10 lg:w-16 lg:h-16 rounded-full mx-auto flex items-center justify-center
                                    text-sm lg:text-lg font-body font-semibold mb-1 lg:mb-2
                                    ${AVATAR_COLORS[top3[2].color] || AVATAR_COLORS.maroon}`}>
                      {top3[2].initials}
                    </div>
                    {top3[2].flag && <div className="text-lg lg:text-xl mb-1">{top3[2].flag}</div>}
                    <p className="text-xs lg:text-sm font-body font-semibold text-white truncate">{top3[2].name.split(' ')[0]}</p>
                    <p className="text-[9px] lg:text-xs text-white/35 mt-0.5">{top3[2].country}</p>
                    <p className="text-[10px] lg:text-sm text-white/40 mt-1">{top3[2].xp} XP</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Full list */}
            <div>
              <div className="text-[10px] lg:text-xs font-body font-semibold tracking-widest text-white/35 uppercase
                              px-4 lg:px-0 py-3 lg:py-0 lg:mb-4">
                full ranking
              </div>
              <div className="mx-4 lg:mx-0 card-base border border-[#1E2035] mb-4 overflow-hidden">
                {board.map((entry, idx) => {
                  const rc = RANK_COLORS[entry.rank] || {}
                  return (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * .04 }}
                      className={`flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4
                                  ${idx < board.length - 1 ? 'border-b border-[#1E2035]' : ''}
                                  ${entry.is_me ? 'bg-asu-gold/[0.04]' : ''}`}
                    >
                      <div className={`w-7 h-7 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                       text-sm lg:text-base font-display
                                       ${rc.bg || 'bg-white/4'} ${rc.border || 'border-white/8'} border`}>
                        <span className={rc.num || 'text-white/35'}>{entry.rank}</span>
                      </div>

                      <div className={`w-9 h-9 lg:w-12 lg:h-12 rounded-full flex items-center justify-center
                                      text-xs lg:text-sm font-body font-semibold flex-shrink-0
                                      ${AVATAR_COLORS[entry.color] || AVATAR_COLORS.teal}`}>
                        {entry.initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 lg:gap-2">
                          <p className={`text-sm lg:text-base font-body font-semibold truncate
                                         ${entry.is_me ? 'text-asu-gold' : 'text-white'}`}>
                            {entry.name}
                          </p>
                          {entry.is_me && <span className="text-[10px] lg:text-xs text-asu-gold/55 shrink-0">(you)</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {entry.flag && <span className="text-xs lg:text-sm leading-none">{entry.flag}</span>}
                          <p className="text-[10px] lg:text-xs text-white/30">{entry.country} · {entry.title}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Zap size={11} className={`lg:hidden ${entry.is_me ? 'text-asu-gold' : 'text-white/25'}`} />
                        <Zap size={14} className={`hidden lg:block ${entry.is_me ? 'text-asu-gold' : 'text-white/25'}`} />
                        <span className={`text-sm lg:text-lg font-body font-semibold
                                         ${entry.is_me ? 'text-asu-gold' : 'text-white/65'}`}>
                          {entry.xp}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* CTA */}
              <div className="mx-4 lg:mx-0 mb-6 rounded-2xl border border-asu-maroon/25 px-4 lg:px-6 py-4 lg:py-5"
                   style={{ background: 'linear-gradient(135deg, rgba(140,29,64,0.12) 0%, #13141F 100%)' }}>
                <p className="text-xs lg:text-base text-asu-maroon-light font-body font-semibold mb-1">
                  You belong on this list, Sun Devil 🌵
                </p>
                <p className="text-[11px] lg:text-sm text-white/40 font-body leading-relaxed">
                  Complete quests, make connections, and share your culture. The top 3 get featured on the campus digital board.
                </p>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  )
}
