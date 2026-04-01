import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function Header() {
  const { user } = useUser()
  const { theme, toggleTheme } = useTheme()

  const xpPct = user
    ? Math.min(100, Math.round(((user.xp - (user.xp_next - 200)) / 200) * 100))
    : 68

  return (
    <header className="lg:hidden sticky top-0 z-40 backdrop-blur-md border-b border-[#1E2035]"
            style={{ background: 'var(--c-glass)' }}>
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          {/* Logo */}
          <div className="flex items-center gap-2">
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
              <div className="text-[9px] text-white/35 font-body leading-none mt-0.5">
                Find Your Tribe at ASU
              </div>
            </div>
          </div>

          {/* Right: theme toggle + user */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150
                         border border-white/10 hover:border-asu-gold/40 hover:text-asu-gold text-white/40"
              aria-label="Toggle theme"
            >
              {theme === 'dark'
                ? <Sun size={15} />
                : <Moon size={15} />
              }
            </button>

            {/* User */}
            {user && (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-body font-semibold text-asu-gold leading-none">
                    {user.xp} pts
                  </div>
                  <div className="text-[10px] text-white/35 leading-none mt-0.5">
                    Lv{user.level} {user.title}
                  </div>
                </div>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-asu-maroon flex items-center justify-center text-xs font-body font-semibold text-white">
                    {user.initials || 'NJ'}
                  </div>
                  {user.flag && (
                    <span className="absolute -bottom-0.5 -right-0.5 text-xs leading-none">{user.flag}</span>
                  )}
                </div>
              </div>
            )}
          </div>
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
