import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getZones } from '../api'
import { useUser } from '../context/UserContext'
import AuxStrip from '../components/AuxStrip'
import WaveModal from '../components/WaveModal'
import { Music2, Disc3 } from 'lucide-react'

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
    if (type === 'vibe') {
      setTimeout(() => setWaveOpen(true), 1200)
    }
    if (song && zoneId) {
      const updated = [{ song, zoneId, ts: Date.now() }, ...mySongs].slice(0, 20)
      setMySongs(updated)
      localStorage.setItem('cq_my_songs', JSON.stringify(updated))
    }
  }

  const zoneNames = { mu: 'MU Patio', library: 'Library Lounge', palm_walk: 'Palm Walk', coor_hall: 'Coor Hall' }

  const container = { hidden: {}, show: { transition: { staggerChildren: .07 } } }
  const item      = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: .3 } } }

  return (
    <div>
      {/* Header section */}
      <div className="mx-4 mt-4 mb-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/30
                          flex items-center justify-center">
            <Disc3 size={20} className="text-purple-300" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-white tracking-wide">ZONE AUX</h1>
            <p className="text-[11px] text-white/40 font-body">shared playlists by location</p>
          </div>
        </div>
      </div>

      {/* XP reminder */}
      <div className="mx-4 mb-4 flex items-center gap-2 bg-asu-gold/8 border border-asu-gold/20
                      rounded-xl px-3 py-2.5">
        <Music2 size={13} className="text-asu-gold flex-shrink-0" />
        <p className="text-xs text-asu-gold/80 font-body">
          Every song you add earns <span className="font-semibold text-asu-gold">+10 XP</span>.
          Add 5 to unlock the Zone DJ badge.
        </p>
      </div>

      <div className="section-label">live zones</div>

      {loading ? (
        <div className="px-4 space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-28 rounded-2xl shimmer-bg bg-white/5" />
          ))}
        </div>
      ) : (
        <motion.div className="px-4 space-y-3" variants={container} initial="hidden" animate="show">
          {zones.map(zone => (
            <motion.div key={zone.id} variants={item} className="card-base">
              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-body font-semibold text-white">{zone.name}</p>
                  <p className="text-[11px] text-white/40">{zone.sublocation}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="live-dot" />
                  <span className="text-[11px] text-white/50">{zone.listeners} listening</span>
                </div>
              </div>
              <AuxStrip
                zone={zone}
                onSongAdded={(type) => handleSongAdded(type)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* My songs */}
      {mySongs.length > 0 && (
        <>
          <div className="section-label mt-2">songs you've added</div>
          <div className="px-4 space-y-2 mb-4">
            {mySongs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * .04 }}
                className="flex items-center gap-3 bg-white/4 border border-white/8
                           rounded-xl px-3 py-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                  <Music2 size={12} className="text-purple-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-body font-medium text-white truncate">{item.song}</p>
                  <p className="text-[10px] text-white/35">{zoneNames[item.zoneId] || item.zoneId}</p>
                </div>
                <span className="text-[10px] font-semibold text-asu-gold bg-asu-gold/10
                                 px-2 py-0.5 rounded-full">+10 XP</span>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <WaveModal open={waveOpen} onClose={() => setWaveOpen(false)} />
    </div>
  )
}
