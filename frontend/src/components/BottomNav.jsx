import { NavLink } from 'react-router-dom'
import { Home, MapPin, Music2, BookOpen, Trophy, Sun, Moon } from 'lucide-react'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

const tabs = [
  { to: '/home',        icon: Home,      label: 'Home'     },
  { to: '/quests',      icon: MapPin,    label: 'Quests'   },
  { to: '/aux',         icon: Music2,    label: 'Zone Aux' },
  { to: '/badges',      icon: BookOpen,  label: 'Passport' },
  { to: '/leaderboard', icon: Trophy,    label: 'Explorers'},
]

export default function BottomNav() {
  const { user } = useUser()
  const { theme, toggleTheme } = useTheme()
  const xpPct = user
    ? Math.min(100, Math.round(((user.xp - (user.xp_next - 200)) / 200) * 100))
    : 0

  return (
    <>
      {/* ── Mobile: bottom tab bar ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-40
                      backdrop-blur-md border-t border-[#1E2035]"
           style={{ background: 'var(--c-glass)' }}>
        <div className="flex max-w-md mx-auto">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200
                 ${isActive ? 'text-asu-gold' : 'text-white/30 hover:text-white/55'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[10px] font-body font-medium">{label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 w-8 h-0.5 bg-asu-gold rounded-t-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Desktop: left sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen z-40
                        border-r border-[#1E2035]"
             style={{ background: 'var(--c-sidebar-grad)' }}>

        {/* Accent bar — maroon to gold */}
        <div className="h-0.5 w-full shrink-0"
             style={{ background: 'linear-gradient(90deg, #8C1D40 0%, #FFC627 55%, transparent 100%)' }} />

        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-[#1E2035]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-asu-maroon flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path d="M12 3L4 8v8l8 5 8-5V8z" stroke="#FFC627" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 3v13M4 8l8 5 8-5" stroke="#FFC627" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <div className="font-display text-xl leading-none text-asu-gold tracking-wide">
                CAMPUS QUEST
              </div>
              <div className="text-[10px] text-white/35 font-body leading-none mt-1">
                Find Your Tribe at ASU
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1.5 px-3 py-5 flex-1">
          {tabs.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 py-3 rounded-xl transition-all duration-200
                 ${isActive
                   ? 'bg-asu-gold/[0.08] text-asu-gold px-3.5 border border-asu-gold/20 shadow-[inset_2px_0_0_0_#FFC627]'
                   : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03] px-3.5 border border-transparent'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-base font-body font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User passport card */}
        {user && (
          <div className="mx-3 mb-3 rounded-2xl border border-[#1E2035] overflow-hidden"
               style={{ background: 'var(--c-card)' }}>
            <div className="px-4 py-3">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-asu-maroon flex items-center justify-center
                                text-sm font-body font-semibold text-white flex-shrink-0">
                  {user.initials || 'NJ'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-body font-semibold text-white truncate">{user.name}</span>
                    {user.flag && <span className="text-base leading-none">{user.flag}</span>}
                  </div>
                  <div className="text-[10px] text-asu-gold mt-0.5">{user.xp} pts · Lv{user.level} {user.title}</div>
                </div>
              </div>
              <div className="xp-bar">
                <motion.div
                  className="xp-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: .3 }}
                />
              </div>
              {user.country && (
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="text-xs text-white/30 font-body">from</span>
                  <span className="text-xs text-white/60 font-body font-medium">{user.country}</span>
                  {user.languages?.length > 0 && (
                    <span className="text-[10px] text-white/25 font-body ml-auto">{user.languages[0]}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Theme toggle */}
        <div className="mx-3 mb-5">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#1E2035]
                       text-white/35 hover:text-asu-gold hover:border-asu-gold/30 transition-all duration-200
                       font-body text-sm"
            style={{ background: 'var(--c-card)' }}
          >
            {theme === 'dark'
              ? <><Sun size={16} /><span>Light mode</span></>
              : <><Moon size={16} /><span>Dark mode</span></>
            }
          </button>
        </div>
      </aside>
    </>
  )
}
