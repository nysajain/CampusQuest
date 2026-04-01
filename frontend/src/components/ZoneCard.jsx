import { useState } from 'react'
import { MapPin, Users, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { completeQuest } from '../api'
import { useUser } from '../context/UserContext'
import AuxStrip from './AuxStrip'
import toast from 'react-hot-toast'

const TYPE_CONFIG = {
  icebreaker: { label: 'icebreaker', color: 'quest-icebreaker', btnColor: 'btn-gold'   },
  explorer:   { label: 'explorer',   color: 'quest-explorer',   btnColor: 'btn-gold'   },
  legend:     { label: 'legend',     color: 'quest-legend',     btnColor: 'btn-maroon' },
  // legacy fallbacks
  solo:        { label: 'explorer',  color: 'quest-explorer',   btnColor: 'btn-gold'   },
  multiplayer: { label: 'icebreaker',color: 'quest-icebreaker', btnColor: 'btn-gold'   },
  boss:        { label: 'legend',    color: 'quest-legend',     btnColor: 'btn-maroon' },
}

const ZONE_ACCENT = {
  gold:   'border-asu-gold/25',
  maroon: 'border-asu-maroon/35',
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
      toast.success(`⚡ +${data.xp_gained} Pitchfork Points — quest complete!`)
      if (data.newly_unlocked?.length) {
        data.newly_unlocked.forEach(() =>
          setTimeout(() => toast.success('🏅 Passport stamp unlocked!'), 1800)
        )
      }
      if (data.vibe_match) setTimeout(() => onVibeMatch?.(), 2200)
      await refresh()
    } catch (e) {
      const msg = e.response?.data?.detail || 'Already completed!'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const tc     = TYPE_CONFIG[zone.quest?.type] || TYPE_CONFIG.explorer
  const accent = ZONE_ACCENT[zone.color] || 'border-[#1E2035]'

  return (
    <motion.div
      layout
      className={`card-base border ${accent} ${zone.is_current ? 'ring-1 ring-asu-gold/15' : ''}`}
    >
      {/* Zone header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left px-4 lg:px-6 py-3.5 lg:py-5 flex items-start gap-3 lg:gap-4"
      >
        <div className={`w-9 h-9 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center flex-shrink-0
                        ${zone.color === 'gold' ? 'bg-asu-gold/12' : 'bg-asu-maroon/18'}`}>
          <MapPin size={16} className={`lg:hidden ${zone.color === 'gold' ? 'text-asu-gold' : 'text-asu-maroon-light'}`} />
          <MapPin size={22} className={`hidden lg:block ${zone.color === 'gold' ? 'text-asu-gold' : 'text-asu-maroon-light'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm lg:text-lg font-body font-semibold text-white leading-tight">
              {zone.name}
            </p>
            {zone.is_current && (
              <span className="text-[10px] lg:text-xs font-body font-semibold bg-asu-gold text-asu-black
                               px-2 py-0.5 rounded-full">you are here</span>
            )}
          </div>
          <p className="text-[11px] lg:text-sm text-white/35 mt-0.5">{zone.sublocation} · {zone.distance}</p>

          {/* Diversity + quest info row */}
          <div className="flex items-center gap-2.5 lg:gap-3.5 mt-1.5 lg:mt-2 flex-wrap">
            <span className={tc.color}>{tc.label}</span>
            <span className="flex items-center gap-1 text-[11px] lg:text-sm text-white/35">
              <Users size={10} className="lg:hidden" /><Users size={13} className="hidden lg:block" />
              {zone.students_here}
            </span>
            {zone.country_flags?.length > 0 && (
              <span className="flex items-center gap-0.5 text-[11px] lg:text-sm text-white/30">
                {zone.country_flags.slice(0,3).map((f,i) => <span key={i} className="text-xs lg:text-sm leading-none">{f}</span>)}
                {zone.countries_here > 3 && <span className="ml-0.5">+{zone.countries_here - 3}</span>}
              </span>
            )}
            {zone.classmates_here > 0 && (
              <span className="text-[10px] lg:text-xs font-body font-semibold
                               bg-teal-900/40 border border-teal-500/30 text-teal-300
                               px-1.5 py-0.5 rounded-full">
                {zone.classmates_here} classmate{zone.classmates_here !== 1 ? 's' : ''} here
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] lg:text-sm text-asu-gold font-medium ml-auto">
              <Zap size={10} className="lg:hidden" /><Zap size={13} className="hidden lg:block" />
              +{zone.quest?.xp} pts
            </span>
          </div>
        </div>

        <div className="text-white/25 pt-0.5 flex-shrink-0">
          {expanded
            ? <><ChevronUp size={16} className="lg:hidden" /><ChevronUp size={20} className="hidden lg:block" /></>
            : <><ChevronDown size={16} className="lg:hidden" /><ChevronDown size={20} className="hidden lg:block" /></>
          }
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
            <AuxStrip zone={zone} onSongAdded={onVibeMatch} />

            {/* Quest block */}
            <div className="px-4 lg:px-6 py-4 lg:py-6 border-t border-[#1E2035]">
              <div className="flex items-start justify-between gap-2 mb-2 lg:mb-3">
                <p className="text-sm lg:text-lg font-body font-semibold text-white">
                  {zone.quest?.title}
                </p>
                {questDone
                  ? <span className="quest-icebreaker">done ✓</span>
                  : <span className={tc.color}>{tc.label}</span>
                }
              </div>
              <p className="text-xs lg:text-sm text-white/45 font-body leading-relaxed mb-4 lg:mb-6">
                {zone.quest?.desc}
              </p>

              {!questDone ? (
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className={`${tc.btnColor} text-sm lg:text-base py-2.5 lg:py-3.5 px-5 w-full
                              flex items-center justify-center gap-2`}
                >
                  {loading ? 'Saving...' : (
                    <>
                      <Zap size={13} className="lg:hidden" />
                      <Zap size={17} className="hidden lg:block" />
                      {zone.quest?.type === 'icebreaker' || zone.quest?.type === 'multiplayer'
                        ? 'Mark done — I made a connection'
                        : 'Start this quest'}
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center text-xs lg:text-sm text-white/35 font-body py-2">
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
