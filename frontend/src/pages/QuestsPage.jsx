import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getZones } from '../api'
import { useUser } from '../context/UserContext'
import ZoneCard from '../components/ZoneCard'
import WaveModal from '../components/WaveModal'
import { Zap, Users, Music2, MapPin } from 'lucide-react'

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

  return (
    <div>
      {/* Hero stats strip */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .1 }}
          className="mx-4 mt-4 mb-2 bg-asu-pattern rounded-2xl border border-asu-gold/20
                     bg-[#111] overflow-hidden"
        >
          <div className="px-4 py-4">
            <p className="text-xs text-white/40 font-body mb-3">
              your stats this week
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Zap,    val: user.quests_done, label: 'quests done',    color: 'text-asu-gold'   },
                { icon: Users,  val: user.people_met,  label: 'people met',     color: 'text-teal-400'   },
                { icon: Music2, val: user.songs_queued,label: 'songs queued',   color: 'text-purple-400' },
              ].map(({ icon: Icon, val, label, color }) => (
                <div key={label} className="text-center">
                  <Icon size={14} className={`${color} mx-auto mb-1`} />
                  <div className="text-2xl font-display text-white tracking-wide">{val}</div>
                  <div className="text-[10px] text-white/35 font-body leading-tight">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="section-label">zones near you</div>

      {loading ? (
        <div className="px-4 space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-24 rounded-2xl shimmer-bg bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          className="px-4 space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {zones.map(zone => (
            <motion.div key={zone.id} variants={item}>
              <ZoneCard
                zone={zone}
                onVibeMatch={() => setWaveOpen(true)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* How it works */}
      <div className="section-label mt-2">how it works</div>
      <div className="mx-4 mb-4 card-base px-4 py-4 space-y-3">
        {[
          { n:'1', text:'Arrive at a zone — zone music starts, you\'re already part of something.' },
          { n:'2', text:'Complete quests to earn XP and level up your profile.' },
          { n:'3', text:'Add songs to the zone queue for +10 XP each.' },
          { n:'4', text:'Back-to-back queues trigger a vibe match — wave to connect.' },
        ].map(({ n, text }) => (
          <div key={n} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-asu-gold/15 border border-asu-gold/30
                            flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[11px] font-display text-asu-gold">{n}</span>
            </div>
            <p className="text-xs text-white/50 font-body leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <WaveModal open={waveOpen} onClose={() => setWaveOpen(false)} />
    </div>
  )
}
