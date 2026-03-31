import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getBadges } from '../api'
import { Plane, Globe, Map, Music2, Heart, Star, Flame, Lock } from 'lucide-react'

const BADGE_ICONS = {
  first_landing:    Plane,
  culture_bridge:   Globe,
  globe_trotter:    Map,
  zone_dj:          Music2,
  kindred_spirit:   Heart,
  hometown_hero:    Flame,
  sun_devil_streak: Star,
}

const BADGE_COLORS = {
  gold:   { bg: 'bg-asu-gold/12',   border: 'border-asu-gold/35',   icon: 'text-asu-gold',        stamp: 'stamp-gold'   },
  maroon: { bg: 'bg-asu-maroon/18', border: 'border-asu-maroon/40', icon: 'text-asu-maroon-light', stamp: 'stamp-maroon' },
  teal:   { bg: 'bg-teal-900/25',   border: 'border-teal-500/30',   icon: 'text-teal-300',         stamp: 'stamp-teal'   },
}

export default function BadgesPage() {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBadges()
      .then(r => setBadges(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const earned = badges.filter(b => b.unlocked)
  const locked = badges.filter(b => !b.unlocked)

  const container = { hidden: {}, show: { transition: { staggerChildren: .06 } } }
  const item = {
    hidden: { opacity: 0, scale: .88, rotate: -2 },
    show:   { opacity: 1, scale: 1,   rotate: 0, transition: { type: 'spring', stiffness: 220, damping: 18 } }
  }

  return (
    <div>
      {/* Passport cover header */}
      <div className="mx-4 mt-4 lg:mt-8 mb-5 lg:mb-7">
        <div className="rounded-2xl border border-asu-gold/25 overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #1a1208 0%, #13141F 70%)' }}>
          <div className="px-5 lg:px-8 py-5 lg:py-7">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-asu-maroon flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className="lg:hidden">
                      <path d="M12 3L4 8v8l8 5 8-5V8z" stroke="#FFC627" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M12 3v13M4 8l8 5 8-5" stroke="#FFC627" strokeWidth="1.5"/>
                    </svg>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="hidden lg:block">
                      <path d="M12 3L4 8v8l8 5 8-5V8z" stroke="#FFC627" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M12 3v13M4 8l8 5 8-5" stroke="#FFC627" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <span className="text-[10px] lg:text-xs font-body font-semibold tracking-widest text-asu-gold/60 uppercase">
                    Campus Quest
                  </span>
                </div>
                <h1 className="font-display text-3xl lg:text-5xl text-white tracking-wide">PASSPORT</h1>
                <p className="text-[11px] lg:text-sm text-white/40 font-body mt-1">
                  {earned.length} stamp{earned.length !== 1 ? 's' : ''} collected · {locked.length} to discover
                </p>
              </div>

              {/* Passport progress circle */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative w-14 h-14 lg:w-20 lg:h-20">
                  <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4"/>
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#FFC627" strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 22}`}
                            strokeDashoffset={`${2 * Math.PI * 22 * (1 - (badges.length ? earned.length / badges.length : 0))}`}
                            style={{ transition: 'stroke-dashoffset 1s ease' }}/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm lg:text-base font-display text-asu-gold">
                      {badges.length ? Math.round((earned.length / badges.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <span className="text-[9px] lg:text-[10px] text-white/30 font-body uppercase tracking-widest">filled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 lg:gap-4 px-4 lg:px-6 md:grid-cols-3 lg:grid-cols-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-44 lg:h-52 rounded-2xl shimmer-bg bg-white/5" />
          ))}
        </div>
      ) : (
        <>
          {earned.length > 0 && (
            <>
              <div className="section-label lg:text-xs lg:py-4 lg:px-6">
                ✦ earned stamps
              </div>
              <motion.div
                className="grid grid-cols-2 gap-3 lg:gap-4 px-4 lg:px-6 md:grid-cols-3 lg:grid-cols-4"
                variants={container} initial="hidden" animate="show"
              >
                {earned.map(badge => {
                  const Icon = BADGE_ICONS[badge.id] || Star
                  const col  = BADGE_COLORS[badge.color] || BADGE_COLORS.gold
                  return (
                    <motion.div key={badge.id} variants={item}
                      className={`card-base ${col.border} border p-4 lg:p-6 relative`}>
                      {/* Stamp corner */}
                      <div className="absolute top-2.5 right-2.5 lg:top-3.5 lg:right-3.5">
                        <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border-2 ${col.border} opacity-30`} />
                      </div>

                      <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl ${col.bg} border ${col.border}
                                      flex items-center justify-center mb-3 lg:mb-4`}>
                        <Icon size={20} className={`${col.icon} lg:hidden`} />
                        <Icon size={28} className={`${col.icon} hidden lg:block`} />
                      </div>
                      <p className="text-sm lg:text-base font-body font-semibold text-white leading-tight mb-1 lg:mb-2">
                        {badge.name}
                      </p>
                      <p className="text-[10px] lg:text-xs text-white/40 font-body leading-snug mb-3">
                        {badge.desc}
                      </p>
                      <span className={col.stamp}>stamped ✓</span>
                    </motion.div>
                  )
                })}
              </motion.div>
            </>
          )}

          {locked.length > 0 && (
            <>
              <div className="section-label mt-2 lg:text-xs lg:py-4 lg:px-6">
                ○ not yet stamped
              </div>
              <motion.div
                className="grid grid-cols-2 gap-3 lg:gap-4 px-4 lg:px-6 mb-8 md:grid-cols-3 lg:grid-cols-4"
                variants={container} initial="hidden" animate="show"
              >
                {locked.map(badge => {
                  const Icon = BADGE_ICONS[badge.id] || Star
                  return (
                    <motion.div key={badge.id} variants={item}
                      className="card-base border border-white/[0.06] p-4 lg:p-6 opacity-35">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-white/4 border border-white/10
                                      flex items-center justify-center mb-3 lg:mb-4 relative">
                        <Icon size={20} className="text-white/25 lg:hidden" />
                        <Icon size={28} className="text-white/25 hidden lg:block" />
                        <Lock size={10} className="text-white/35 absolute -bottom-1 -right-1 bg-[#13141F] rounded-full p-0.5" />
                      </div>
                      <p className="text-sm lg:text-base font-body font-semibold text-white leading-tight mb-1">
                        {badge.name}
                      </p>
                      <p className="text-[10px] lg:text-xs text-white/35 font-body leading-snug">
                        {badge.desc}
                      </p>
                    </motion.div>
                  )
                })}
              </motion.div>
            </>
          )}
        </>
      )}
    </div>
  )
}
