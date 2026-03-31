import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getBadges } from '../api'
import { Star, Lock, Music2, MapPin, Users, Zap, Flame, TrendingUp } from 'lucide-react'

const BADGE_ICONS = {
  first_quest:     Zap,
  zone_dj:         Music2,
  wanderer:        MapPin,
  social_butterfly:Users,
  boss_slayer:     Flame,
  vibe_match:      Star,
  seven_streak:    TrendingUp,
}

const BADGE_COLORS = {
  gold:   { bg: 'bg-asu-gold/15', border: 'border-asu-gold/30', icon: 'text-asu-gold',          label: 'badge-gold'   },
  maroon: { bg: 'bg-asu-maroon/20', border: 'border-asu-maroon/40', icon: 'text-asu-maroon-light', label: 'badge-maroon' },
  teal:   { bg: 'bg-teal-900/30', border: 'border-teal-500/30',  icon: 'text-teal-300',          label: 'badge-teal'   },
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
    hidden: { opacity: 0, scale: .9 },
    show:   { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  }

  return (
    <div>
      {/* Header */}
      <div className="mx-4 mt-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-asu-gold/15 border border-asu-gold/30
                          flex items-center justify-center">
            <Star size={20} className="text-asu-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-white tracking-wide">BADGES</h1>
            <p className="text-[11px] text-white/40 font-body">
              {earned.length} earned · {locked.length} locked
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white/5 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-asu-gold"
            initial={{ width: 0 }}
            animate={{ width: `${badges.length ? (earned.length / badges.length) * 100 : 0}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: .3 }}
          />
        </div>
        <p className="text-[10px] text-white/30 mt-1 font-body text-right">
          {earned.length} / {badges.length} collected
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-24 rounded-2xl shimmer-bg bg-white/5" />
          ))}
        </div>
      ) : (
        <>
          {earned.length > 0 && (
            <>
              <div className="section-label">earned</div>
              <motion.div
                className="grid grid-cols-2 gap-3 px-4"
                variants={container} initial="hidden" animate="show"
              >
                {earned.map(badge => {
                  const Icon = BADGE_ICONS[badge.id] || Star
                  const col  = BADGE_COLORS[badge.color] || BADGE_COLORS.gold
                  return (
                    <motion.div
                      key={badge.id}
                      variants={item}
                      className={`card-base ${col.border} border p-4`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${col.bg} border ${col.border}
                                      flex items-center justify-center mb-3`}>
                        <Icon size={18} className={col.icon} />
                      </div>
                      <p className="text-sm font-body font-semibold text-white leading-tight mb-1">
                        {badge.name}
                      </p>
                      <p className="text-[10px] text-white/40 font-body leading-snug">
                        {badge.desc}
                      </p>
                      <div className="mt-2">
                        <span className={col.label}>earned ✓</span>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </>
          )}

          {locked.length > 0 && (
            <>
              <div className="section-label mt-2">locked</div>
              <motion.div
                className="grid grid-cols-2 gap-3 px-4 mb-4"
                variants={container} initial="hidden" animate="show"
              >
                {locked.map(badge => {
                  const Icon = BADGE_ICONS[badge.id] || Star
                  return (
                    <motion.div
                      key={badge.id}
                      variants={item}
                      className="card-base border border-white/8 p-4 opacity-40"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10
                                      flex items-center justify-center mb-3 relative">
                        <Icon size={18} className="text-white/30" />
                        <Lock size={10} className="text-white/40 absolute -bottom-1 -right-1
                                                   bg-[#1a1a1a] rounded-full p-0.5" />
                      </div>
                      <p className="text-sm font-body font-semibold text-white leading-tight mb-1">
                        {badge.name}
                      </p>
                      <p className="text-[10px] text-white/40 font-body leading-snug">
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
