import { useState } from 'react'
import { Music2, Plus } from 'lucide-react'
import { addSong } from '../api'
import { useUser } from '../context/UserContext'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const QUICK_PICKS = {
  mu:        ['Doechii — Nissi','Charli xcx — Apple','Sabrina Carpenter — Espresso','SZA — Snooze'],
  library:   ['Frank Ocean — Godspeed','Mitski — First Love / Late Spring','Lorde — Liability','Bon Iver — Holocene'],
  palm_walk: ["Tyler — IGOR's Theme",'Drake — Passionfruit','Childish Gambino — Redbone','Jorja Smith — On My Mind'],
  coor_hall: ['Billie Eilish — Birds of a Feather','Gracie Abrams — Risk','Noah Kahan — Stick Season','Phoebe Bridgers — Savior Complex'],
}

export default function AuxStrip({ zone, onSongAdded }) {
  const { applyXP } = useUser()
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (song) => {
    if (!song.trim()) return
    setLoading(true)
    try {
      const { data } = await addSong(zone.id, song.trim())
      applyXP(10)
      toast.success(`🎵 +10 Pitchfork Points — "${song.substring(0, 28)}" added!`)
      if (data.newly_unlocked?.length) {
        setTimeout(() => toast.success('🏅 Badge unlocked: Zone DJ!'), 1600)
      }
      if (data.vibe_match_trigger && onSongAdded) onSongAdded('vibe')
      setCustom('')
      setOpen(false)
    } catch {
      toast.error('Could not add song')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-t border-white/8 bg-white/3">
      <div className="px-4 lg:px-6 py-3 lg:py-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="live-dot" />
          <span className="text-[10px] lg:text-xs font-body font-semibold tracking-widest text-white/40 uppercase">
            Zone Aux
          </span>
          <span className="text-white/20 text-[10px]">·</span>
          <span className="text-[10px] lg:text-xs text-white/40">{zone.listeners} listening</span>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <Music2 size={13} className="text-emerald-400 flex-shrink-0 lg:hidden" />
          <Music2 size={16} className="text-emerald-400 flex-shrink-0 hidden lg:block" />
          <p className="text-sm lg:text-base font-body font-medium text-white truncate flex-1">
            {zone.now_playing}
          </p>
        </div>

        {zone.queue?.length > 0 && (
          <p className="text-[11px] lg:text-sm text-white/35 mb-3 pl-[21px] lg:pl-6 truncate">
            up next: {zone.queue.slice(0, 2).join(' · ')}
          </p>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 text-xs lg:text-sm font-body font-medium text-asu-gold/80
                     hover:text-asu-gold transition-colors"
        >
          <Plus size={13} className="lg:hidden" />
          <Plus size={16} className="hidden lg:block" />
          add a song · +10 pts
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: .25 }}
            className="overflow-hidden border-t border-white/8"
          >
            <div className="px-4 lg:px-6 py-3 lg:py-4 space-y-2 lg:space-y-3">
              <p className="text-[11px] lg:text-sm text-white/40 font-body">quick picks</p>
              <div className="grid grid-cols-2 gap-1.5 lg:gap-2">
                {(QUICK_PICKS[zone.id] || []).map(s => (
                  <button
                    key={s}
                    onClick={() => handleAdd(s)}
                    className="text-left text-[11px] lg:text-sm font-body text-white/70 bg-white/5
                               hover:bg-asu-gold/10 hover:text-asu-gold border border-white/10
                               hover:border-asu-gold/30 rounded-lg px-2.5 lg:px-3 py-2 lg:py-2.5
                               transition-all truncate leading-snug"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-[11px] lg:text-sm text-white/40 font-body pt-1">or type your own</p>
              <div className="flex gap-2">
                <input
                  value={custom}
                  onChange={e => setCustom(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdd(custom)}
                  placeholder="Artist — Song title"
                  className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 lg:px-4 py-2 lg:py-2.5
                             text-sm lg:text-base text-white placeholder-white/25 font-body
                             focus:outline-none focus:border-asu-gold/50"
                />
                <button
                  onClick={() => handleAdd(custom)}
                  disabled={loading}
                  className="btn-gold text-sm lg:text-base px-3 lg:px-4 py-2 lg:py-2.5"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
