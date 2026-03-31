import { useState } from 'react'
import { MapPin, Users, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { completeQuest } from '../api'
import { useUser } from '../context/UserContext'
import AuxStrip from './AuxStrip'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  solo:        { label: 'solo',          color: 'badge-gold'   },
  multiplayer: { label: 'multiplayer',   color: 'badge-teal'   },
  boss:        { label: 'weekly boss',   color: 'badge-maroon' },
}

const ZONE_ACCENT = {
  gold:   'border-asu-gold/30',
  maroon: 'border-asu-maroon/40',
}

export default function ZoneCard({ zone, onVibeMatch }) {
  const { applyXP, refresh } = useUser()
  const [expanded, setExpanded] = useState(zone.is_current)
  const [questDone, setQuestDone] = useState(zone.quest?.status === 'done')
  const [loading, setLoading] = useState(false)

  const handleComplete = async () => {
    if (questDone || loading) return
    setLoading(true)
    try {
      const { data } = await completeQuest(zone.quest.id, zone.id)
      applyXP(data.xp_gained)
      setQuestDone(true)
      toast.success(`⚡ +${data.xp_gained} XP — quest complete!`)
      if (data.newly_unlocked?.length) {
        data.newly_unlocked.forEach(b =>
          setTimeout(() => toast.success(`🏅 Badge unlocked!`), 1800)
        )
      }
      if (data.vibe_match) {
        setTimeout(() => onVibeMatch?.(), 2200)
      }
      await refresh()
    } catch (e) {
      const msg = e.response?.data?.detail || 'Already completed!'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const tc = TYPE_CONFIG[zone.quest?.type] || TYPE_CONFIG.solo
  const accent = ZONE_ACCENT[zone.color] || 'border-white/10'

  return (
    <motion.div
      layout
      className={`card-base border ${accent} ${zone.is_current ? 'ring-1 ring-asu-gold/20' : ''}`}
    >
      {/* Zone header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                        ${zone.color === 'gold' ? 'bg-asu-gold/15' : 'bg-asu-maroon/20'}`}>
          <MapPin size={16} className={zone.color === 'gold' ? 'text-asu-gold' : 'text-asu-maroon-light'} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-body font-semibold text-white leading-tight">
              {zone.name}
            </p>
            {zone.is_current && (
              <span className="text-[10px] font-body font-semibold bg-asu-gold text-asu-black
                               px-2 py-0.5 rounded-full">you are here</span>
            )}
          </div>
          <p className="text-[11px] text-white/40 mt-0.5">{zone.sublocation} · {zone.distance}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={tc.color + ' ' + 'inline-flex items-center gap-1'}>{tc.label}</span>
            <span className="flex items-center gap-1 text-[11px] text-white/40">
              <Users size={10} /> {zone.students_here}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-asu-gold font-medium">
              <Zap size={10} /> +{zone.quest?.xp} XP
            </span>
          </div>
        </div>

        <div className="text-white/30 pt-0.5 flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: .25 }}
            className="overflow-hidden"
          >
            {/* Aux strip */}
            <AuxStrip zone={zone} onSongAdded={onVibeMatch} />

            {/* Quest block */}
            <div className="px-4 py-4 border-t border-white/8">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-body font-semibold text-white">
                  {zone.quest?.title}
                </p>
                {questDone
                  ? <span className="badge-teal">done ✓</span>
                  : <span className={tc.color}>{tc.label}</span>
                }
              </div>
              <p className="text-xs text-white/50 font-body leading-relaxed mb-4">
                {zone.quest?.desc}
              </p>

              {!questDone ? (
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className={`${zone.color === 'maroon' ? 'btn-maroon' : 'btn-gold'} text-sm py-2.5 px-5 w-full
                              flex items-center justify-center gap-2`}
                >
                  {loading ? 'Saving...' : (
                    <>
                      <Zap size={13} />
                      {zone.quest?.type === 'multiplayer' ? 'Mark done' : 'Start quest'}
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center text-xs text-white/40 font-body py-2">
                  Quest complete — XP earned ✦
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
