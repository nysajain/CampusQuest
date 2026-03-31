import { motion, AnimatePresence } from 'framer-motion'
import { sendWave } from '../api'
import { useUser } from '../context/UserContext'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Music2 } from 'lucide-react'

export default function WaveModal({ open, onClose }) {
  const { applyXP, refresh } = useUser()
  const [sent, setSent] = useState(false)

  const handleWave = async () => {
    try {
      const { data } = await sendWave()
      applyXP(data.xp_gained)
      setSent(true)
      if (data.newly_unlocked?.length) {
        setTimeout(() => toast.success('🏅 Badge unlocked: Vibe Match!'), 800)
      }
      toast.success(`+${data.xp_gained} XP — they waved back!`)
      setTimeout(() => { setSent(false); onClose(); refresh() }, 2000)
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end lg:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-sm mx-4 lg:mx-0 bg-[#1a1a1a] border border-asu-gold/20
                       rounded-t-3xl lg:rounded-3xl px-6 py-8 text-center"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

            <div className="w-16 h-16 rounded-2xl bg-asu-gold/10 border border-asu-gold/30
                            flex items-center justify-center mx-auto mb-4">
              <Music2 size={28} className="text-asu-gold" />
            </div>

            {!sent ? (
              <>
                <h2 className="font-display text-3xl text-asu-gold tracking-wide mb-2">
                  KINDRED SPIRIT
                </h2>
                <p className="text-sm text-white/60 font-body leading-relaxed mb-6">
                  You and someone else added songs at the same zone at the same time.
                  Maybe you're not as alone as you feel. Wave?
                </p>
                <div className="flex gap-3">
                  <button onClick={handleWave} className="btn-gold flex-1 py-3 text-base">
                    👋 Wave back
                  </button>
                  <button onClick={onClose} className="btn-outline flex-1 py-3">
                    Maybe later
                  </button>
                </div>
                <p className="text-[11px] text-white/30 mt-3 font-body">
                  If they wave back, you both earn +25 XP and unlock Kindred Spirit
                </p>
              </>
            ) : (
              <motion.div
                initial={{ scale: .8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <h2 className="font-display text-3xl text-asu-gold tracking-wide mb-2">
                  KINDRED SPIRIT! 🌍
                </h2>
                <p className="text-sm text-white/60 font-body">You found each other. +25 XP earned ✦</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
