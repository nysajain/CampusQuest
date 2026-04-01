import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getZones } from '../api'
import { useUser } from '../context/UserContext'
import AuxStrip from '../components/AuxStrip'
import WaveModal from '../components/WaveModal'
import { Music2, Disc3 } from 'lucide-react'
import GamificationPanel from '../components/GamificationPanel'

export default function AuxPage() {
  const { user } = useUser()
  const [zones, setZones] = useState([])
  const [loading, setLoading] = useState(true)
  const [waveOpen, setWaveOpen] = useState(false)
  const [mySongs, setMySongs] = useState([])

  useEffect(() => {
    getZones()
      .then(r => setZones(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
    const saved = JSON.parse(localStorage.getItem('cq_my_songs') || '[]')
    setMySongs(saved)
  }, [])

  const handleSongAdded = (type, song, zoneId) => {
    if (type === 'vibe') setTimeout(() => setWaveOpen(true), 1200)
    if (song && zoneId) {
      const updated = [{ song, zoneId, ts: Date.now() }, ...mySongs].slice(0, 20)
      setMySongs(updated)
      localStorage.setItem('cq_my_songs', JSON.stringify(updated))
    }
  }

  const zoneNames = { mu: 'Memorial Union', library: 'Hayden Library', palm_walk: 'Palm Walk', coor_hall: 'Coor Hall' }

  const container = { hidden: {}, show: { transition: { staggerChildren: .07 } } }
  const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: .3 } } }
  const totalListeners = zones.reduce((sum, z) => sum + (z.listeners || 0), 0)

  return (
    <div>
      {/* Header */}
      <div className="mx-4 mt-4 lg:mt-8 mb-3 lg:mb-4">
        <div className="flex items-center gap-3 lg:gap-5 mb-1">
          <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-purple-950/60 border border-purple-500/25
                          flex items-center justify-center shrink-0">
            <Disc3 size={20} className="text-purple-300 lg:hidden" />
            <Disc3 size={30} className="text-purple-300 hidden lg:block" />
          </div>
          <div>
            <h1 className="font-display text-2xl lg:text-5xl text-white tracking-wide">ZONE AUX</h1>
            <p className="text-[11px] lg:text-sm text-white/40 font-body mt-0.5">
              your music, heard across the world
            </p>
          </div>
        </div>
      </div>

      {/* XP + cultural reminder */}
      <div className="mx-4 lg:mx-6 mb-4 lg:mb-6 rounded-xl border border-asu-gold/18 px-3 lg:px-5 py-2.5 lg:py-3.5"
           style={{ background: 'rgba(255,198,39,0.05)' }}>
        <div className="flex items-start gap-2 lg:gap-3">
          <Music2 size={14} className="text-asu-gold flex-shrink-0 mt-0.5 lg:hidden" />
          <Music2 size={18} className="text-asu-gold flex-shrink-0 mt-0.5 hidden lg:block" />
          <p className="text-xs lg:text-base text-asu-gold/80 font-body">
            Add a song from home — let everyone hear where you're from.{' '}
            <span className="font-semibold text-asu-gold">+10 Pitchfork Points</span> per song. Add 5 to unlock Zone DJ.
          </p>
        </div>
      </div>

      <GamificationPanel
        pageLabel="aux progression"
        challenge="Add two songs from different artists to live zone queues."
        reward="+20 pts and faster Zone DJ unlock"
        stats={[
          { label: 'songs queued', value: user?.songs_queued ?? 0, tone: 'violet' },
          { label: 'my shares', value: mySongs.length, tone: 'gold' },
          { label: 'listeners live', value: loading ? '...' : totalListeners, tone: 'teal' },
        ]}
        className="mx-4 lg:mx-6 mb-4 lg:mb-5"
      />

      <div className="section-label lg:text-xs lg:py-4 lg:px-6">live zones</div>

      {loading ? (
        <div className="px-4 lg:px-6 grid grid-cols-1 gap-3 lg:gap-4 lg:grid-cols-2">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-28 lg:h-36 rounded-2xl shimmer-bg bg-white/5" />
          ))}
        </div>
      ) : (
        <motion.div className="px-4 lg:px-6 grid grid-cols-1 gap-3 lg:gap-4 lg:grid-cols-2"
                    variants={container} initial="hidden" animate="show">
          {zones.map(zone => (
            <motion.div key={zone.id} variants={item} className="card-base">
              <div className="px-4 lg:px-6 py-3 lg:py-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm lg:text-base font-body font-semibold text-white">{zone.name}</p>
                    <p className="text-[11px] lg:text-sm text-white/40 mt-0.5">{zone.sublocation}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="live-dot" />
                    <span className="text-[11px] lg:text-sm text-white/45">{zone.listeners} listening</span>
                  </div>
                </div>
                {/* Country diversity row */}
                {zone.country_flags?.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex gap-0.5">
                      {zone.country_flags.slice(0, 5).map((f, i) => (
                        <span key={i} className="text-sm leading-none">{f}</span>
                      ))}
                    </div>
                    <span className="text-[10px] lg:text-xs text-white/30 font-body">
                      {zone.countries_here} countries here
                    </span>
                  </div>
                )}
              </div>
              <AuxStrip zone={zone} onSongAdded={(type) => handleSongAdded(type)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* My songs */}
      {mySongs.length > 0 && (
        <>
          <div className="section-label mt-2 lg:text-xs lg:py-4 lg:px-6">songs you've shared</div>
          <div className="px-4 lg:px-6 space-y-2 lg:space-y-3 mb-6">
            {mySongs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * .04 }}
                className="flex items-center gap-3 rounded-xl px-3 lg:px-5 py-2.5 lg:py-3.5
                           border border-[#1E2035]"
                style={{ background: 'var(--c-card)' }}
              >
                <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg bg-purple-950/50 flex items-center justify-center flex-shrink-0">
                  <Music2 size={12} className="text-purple-300 lg:hidden" />
                  <Music2 size={16} className="text-purple-300 hidden lg:block" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-body font-medium text-white truncate">{item.song}</p>
                  <p className="text-[10px] lg:text-xs text-white/30 mt-0.5">{zoneNames[item.zoneId] || item.zoneId}</p>
                </div>
                <span className="text-[10px] lg:text-xs font-semibold text-asu-gold bg-asu-gold/10
                                 border border-asu-gold/20 px-2 lg:px-3 py-0.5 rounded-full shrink-0">
                  +10 pts
                </span>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <WaveModal open={waveOpen} onClose={() => setWaveOpen(false)} />
    </div>
  )
}
