import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getZones } from '../api'
import { useUser } from '../context/UserContext'
import ZoneCard from '../components/ZoneCard'
import WaveModal from '../components/WaveModal'
import { Zap, Users, Globe } from 'lucide-react'

export default function QuestsPage() {
  const { user } = useUser()
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [waveOpen, setWaveOpen] = useState(false)

  useEffect(() => {
    getZones()
      .then(r => setZones(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: .08 } }
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: .35, ease: [.16,1,.3,1] } }
  }

  // total countries across all loaded zones
  const totalCountries = zones.reduce((sum, z) => sum + (z.countries_here || 0), 0)

  return (
    <div>
      {/* Hero banner */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .1 }}
          className="mx-4 mt-4 lg:mt-8 lg:mb-4 mb-2 rounded-2xl border border-asu-gold/20 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a1208 0%, #161625 60%, #0C0D16 100%)' }}
        >
          <div className="px-4 py-4 lg:px-8 lg:py-7">
            {/* Welcome line */}
            <div className="flex items-center gap-2 mb-3 lg:mb-5">
              {user.flag && <span className="text-2xl lg:text-3xl">{user.flag}</span>}
              <p className="text-xs lg:text-sm text-white/50 font-body">
                Welcome, <span className="text-white font-semibold">{user.name?.split(' ')[0]}</span>
                {user.country && <span className="text-white/40"> from {user.country}</span>}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 lg:gap-6">
              {[
                { icon: Zap,    val: user.quests_done,       label: 'quests done',    color: 'text-asu-gold'     },
                { icon: Users,  val: user.connections_made,  label: 'connections',    color: 'text-teal-400'     },
                { icon: Globe,  val: user.cultures_met,      label: 'cultures met',   color: 'text-blue-400'     },
              ].map(({ icon: Icon, val, label, color }) => (
                <div key={label} className="text-center">
                  <Icon size={14} className={`${color} mx-auto mb-1 lg:hidden`} />
                  <Icon size={22} className={`${color} mx-auto mb-2 hidden lg:block`} />
                  <div className="text-2xl lg:text-6xl font-display text-white tracking-wide">{val}</div>
                  <div className="text-[10px] lg:text-sm text-white/35 font-body leading-tight mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Live diversity banner */}
      {zones.length > 0 && (
        <div className="mx-4 lg:mx-6 mb-3 flex items-center gap-2.5 bg-blue-950/40 border border-blue-500/15 rounded-xl px-3 lg:px-5 py-2 lg:py-3">
          <span className="live-dot" style={{ background: '#3B82F6' }} />
          <p className="text-xs lg:text-sm text-blue-300/80 font-body">
            <span className="font-semibold text-blue-300">{totalCountries} countries</span> represented on campus right now
          </p>
          <div className="ml-auto flex gap-0.5 lg:gap-1">
            {zones.flatMap(z => z.country_flags || []).slice(0, 6).map((f, i) => (
              <span key={i} className="text-sm lg:text-base leading-none">{f}</span>
            ))}
          </div>
        </div>
      )}

      <div className="section-label lg:text-xs lg:py-4 lg:px-6">zones near you</div>

      {loading ? (
        <div className="px-4 lg:px-6 grid grid-cols-1 gap-3 lg:gap-4 lg:grid-cols-2">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 lg:h-32 rounded-2xl shimmer-bg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          className="px-4 lg:px-6 grid grid-cols-1 gap-3 lg:gap-4 lg:grid-cols-2"
          variants={container} initial="hidden" animate="show"
        >
          {zones.map(zone => (
            <motion.div key={zone.id} variants={item}>
              <ZoneCard zone={zone} onVibeMatch={() => setWaveOpen(true)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* How it works */}
      <div className="section-label mt-2 lg:text-xs lg:py-4 lg:px-6">how it works</div>
      <div className="mx-4 lg:mx-6 mb-6 card-base px-4 lg:px-8 py-4 lg:py-6 space-y-3 lg:space-y-5">
        {[
          { n:'1', emoji:'📍', text:"Show up to a zone — you're surrounded by students from around the world. You already have something in common." },
          { n:'2', emoji:'🤝', text:'Complete icebreaker quests. Low stakes, real connection. Ask where someone is from. That\'s it.' },
          { n:'3', emoji:'🎵', text:'Add songs from home to the zone queue. +10 XP, and your music plays for everyone.' },
          { n:'4', emoji:'🌍', text:'Match with a kindred spirit — someone else who queued a song at the same time. Wave to connect.' },
        ].map(({ n, emoji, text }) => (
          <div key={n} className="flex gap-3 lg:gap-4 items-start">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-asu-gold/10 border border-asu-gold/25
                            flex items-center justify-center flex-shrink-0 mt-0.5 text-sm lg:text-lg">
              {emoji}
            </div>
            <p className="text-xs lg:text-base text-white/50 font-body leading-relaxed pt-1">{text}</p>
          </div>
        ))}
      </div>

      <WaveModal open={waveOpen} onClose={() => setWaveOpen(false)} />
    </div>
  )
}
