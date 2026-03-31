import { NavLink } from 'react-router-dom'
import { MapPin, Music2, Star, Trophy } from 'lucide-react'

const tabs = [
  { to: '/quests',      icon: MapPin,  label: 'Quests'      },
  { to: '/aux',         icon: Music2,  label: 'Zone Aux'    },
  { to: '/badges',      icon: Star,    label: 'Badges'      },
  { to: '/leaderboard', icon: Trophy,  label: 'Ranks'       },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40
                    bg-[#111]/95 backdrop-blur-md border-t border-white/10">
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 transition-all duration-200
               ${isActive
                 ? 'text-asu-gold'
                 : 'text-white/35 hover:text-white/60'}`
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
  )
}
