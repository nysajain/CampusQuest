import { useUser } from '../context/UserContext'
import { motion } from 'framer-motion'

export default function Header() {
  const { user } = useUser()

  const xpPct = user
    ? Math.min(100, Math.round(((user.xp - (user.xp_next - 200)) / 200) * 100))
    : 68

  return (
    <header className="sticky top-0 z-40 bg-asu-black/95 backdrop-blur-md border-b border-white/8">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* ASU fork logo */}
            <div className="w-8 h-8 rounded-lg bg-asu-maroon flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M12 3L4 8v8l8 5 8-5V8z" stroke="#FFC627" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 3v13M4 8l8 5 8-5" stroke="#FFC627" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <div className="font-display text-xl leading-none text-asu-gold tracking-wide">
                CAMPUS QUEST
              </div>
              <div className="text-[10px] text-white/40 font-body leading-none mt-0.5">
                Arizona State University
              </div>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs font-body font-semibold text-asu-gold leading-none">
                  {user.xp} XP
                </div>
                <div className="text-[10px] text-white/40 leading-none mt-0.5">
                  Lv{user.level} {user.title}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-asu-maroon flex items-center justify-center text-xs font-body font-semibold text-white">
                NJ
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="xp-bar">
            <motion.div
              className="xp-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: .3 }}
            />
          </div>
        )}
      </div>
    </header>
  )
}
