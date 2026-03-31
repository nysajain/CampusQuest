import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getStats } from '../api'
import { useUser } from '../context/UserContext'
import { MapPin, Music2, BookOpen, Trophy, ArrowRight, Zap, Globe, Users } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: .45, ease: [.16, 1, .3, 1], delay },
})

export default function HomePage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getStats().then(r => setStats(r.data)).catch(() => {})
  }, [])

  const features = [
    {
      icon: MapPin,
      color: 'text-asu-gold',
      bg: 'bg-asu-gold/10 border-asu-gold/20',
      tab: '/quests',
      label: 'Quests',
      title: 'Show up somewhere',
      desc: 'Each zone on campus has a live quest. Low-pressure social missions designed to start real conversations — not just awkward small talk.',
      cta: 'See quests →',
    },
    {
      icon: Music2,
      color: 'text-purple-300',
      bg: 'bg-purple-900/25 border-purple-500/20',
      tab: '/aux',
      label: 'Zone Aux',
      title: 'Share your soundtrack',
      desc: "Add a song from home to the zone's live playlist. Your music plays for everyone there. It's the easiest way to say 'this is where I'm from.'",
      cta: 'Open Zone Aux →',
    },
    {
      icon: BookOpen,
      color: 'text-teal-300',
      bg: 'bg-teal-900/25 border-teal-500/20',
      tab: '/badges',
      label: 'Passport',
      title: 'Collect your stamps',
      desc: 'Every quest you finish, every connection you make earns a passport stamp. Watch your ASU story build, one brave moment at a time.',
      cta: 'View passport →',
    },
    {
      icon: Trophy,
      color: 'text-orange-300',
      bg: 'bg-orange-900/20 border-orange-500/20',
      tab: '/leaderboard',
      label: 'Explorers',
      title: 'See who\'s leading',
      desc: 'Students from 20+ countries competing on the same board. The more you explore, the higher you climb. Top 3 get featured on the campus board.',
      cta: 'See rankings →',
    },
  ]

  return (
    <div className="pb-8">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(140,29,64,0.18) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(255,198,39,0.06) 0%, transparent 70%)' }} />

        <div className="relative px-4 lg:px-10 pt-8 lg:pt-12 pb-6 lg:pb-10">

          {/* Greeting line */}
          {user && (
            <motion.div {...fadeUp(0)} className="flex items-center gap-2 mb-4 lg:mb-5">
              {user.flag && <span className="text-2xl">{user.flag}</span>}
              <span className="text-sm lg:text-base text-white/50 font-body">
                Hey <span className="text-white font-semibold">{user.name?.split(' ')[0]}</span>
                {user.country && <span className="text-white/40"> from {user.country}</span>} 👋
              </span>
            </motion.div>
          )}

          {/* Main headline */}
          <motion.h1 {...fadeUp(0.06)}
            className="font-display tracking-wide leading-none mb-3 lg:mb-4"
            style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)' }}>
            <span className="text-white">YOU DON'T HAVE</span><br />
            <span className="text-asu-gold">TO FIGURE OUT</span><br />
            <span className="text-white">ASU ALONE.</span>
          </motion.h1>

          <motion.p {...fadeUp(0.12)}
            className="text-sm lg:text-lg text-white/50 font-body leading-relaxed max-w-lg mb-6 lg:mb-8">
            CampusQuest turns the loneliness of a new campus into a game you play with the people around you.
            Show up. Do a quest. Find your people.
          </motion.p>

          {/* Primary CTA */}
          <motion.button
            {...fadeUp(0.18)}
            onClick={() => navigate('/quests')}
            className="btn-gold text-base lg:text-lg px-7 lg:px-10 py-3 lg:py-4 flex items-center gap-2 rounded-2xl"
          >
            Start exploring <ArrowRight size={18} />
          </motion.button>
        </div>
      </div>

      {/* ── LIVE CAMPUS STRIP ── */}
      {stats && (
        <motion.div {...fadeUp(0.22)} className="mx-4 lg:mx-10 mb-6 lg:mb-8">
          <div className="rounded-2xl border border-[#1E2035] overflow-hidden"
               style={{ background: 'linear-gradient(135deg, #13141F 0%, #0F1020 100%)' }}>
            <div className="px-4 lg:px-7 py-4 lg:py-5">
              <div className="flex items-center gap-2 mb-3 lg:mb-4">
                <span className="live-dot" />
                <span className="text-xs lg:text-sm font-body font-semibold text-white/50 tracking-widest uppercase">
                  live on campus right now
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 lg:gap-6 mb-4 lg:mb-5">
                {[
                  { icon: Users,  val: stats.students_active,       label: 'students active',   color: 'text-teal-400' },
                  { icon: MapPin, val: stats.zones_active,           label: 'zones open',        color: 'text-asu-gold' },
                  { icon: Globe,  val: stats.countries_represented,  label: 'countries here',    color: 'text-blue-400' },
                ].map(({ icon: Icon, val, label, color }) => (
                  <div key={label} className="text-center">
                    <div className={`text-3xl lg:text-5xl font-display ${color}`}>{val}</div>
                    <div className="text-[10px] lg:text-xs text-white/35 font-body mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Flags */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {stats.flags_sample?.slice(0, 8).map((f, i) => (
                    <span key={i} className="text-base lg:text-xl leading-none">{f}</span>
                  ))}
                </div>
                <span className="text-[10px] lg:text-xs text-white/25 font-body">all here right now</span>
              </div>
            </div>

            {/* Recent activity */}
            <div className="border-t border-[#1E2035] divide-y divide-[#1E2035]">
              {stats.recent_activity?.slice(0, 3).map((ev, i) => (
                <div key={i} className="flex items-center gap-2.5 px-4 lg:px-7 py-2.5 lg:py-3">
                  <span className="text-base lg:text-lg leading-none shrink-0">{ev.flag}</span>
                  <p className="text-xs lg:text-sm text-white/45 font-body min-w-0 truncate">
                    <span className="text-white/70 font-medium">{ev.name}</span>
                    {' '}{ev.action}
                    <span className="text-white/30"> at {ev.where}</span>
                  </p>
                  <span className="text-[10px] lg:text-xs text-white/20 font-body shrink-0 ml-auto">
                    {ev.mins_ago}m ago
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── HOW IT WORKS ── */}
      <div className="px-4 lg:px-10 mb-6 lg:mb-8">
        <motion.div {...fadeUp(0.26)} className="mb-5 lg:mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 lg:h-6 rounded-full bg-asu-gold" />
            <span className="text-[10px] lg:text-xs font-body font-semibold tracking-widest text-white/35 uppercase">how it works</span>
          </div>
          <h2 className="font-display text-2xl lg:text-4xl text-white tracking-wide mt-2">
            THREE STEPS.<br /><span className="text-asu-gold">ONE FRIEND.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          {[
            {
              n: '01', emoji: '📍', color: 'border-asu-gold/20 bg-asu-gold/[0.04]',
              title: 'Go somewhere on campus',
              desc: "Open Quests and pick a zone near you. You're already surrounded by people who get it — they're far from home too.",
            },
            {
              n: '02', emoji: '🤝', color: 'border-teal-500/20 bg-teal-900/[0.08]',
              title: 'Do one quest',
              desc: "Each zone has a mission. Say hi to someone. Study side by side. Teach them a word. Small moves, real connections.",
            },
            {
              n: '03', emoji: '✦',  color: 'border-asu-maroon/20 bg-asu-maroon/[0.06]',
              title: 'Earn XP, find your people',
              desc: "Every quest earns XP and passport stamps. Enough stamps and you're on the leaderboard. Enough connections and you've found your tribe.",
            },
          ].map(({ n, emoji, color, title, desc }, i) => (
            <motion.div key={n} {...fadeUp(0.28 + i * 0.06)}
              className={`rounded-2xl border ${color} px-5 lg:px-6 py-5 lg:py-6`}>
              <div className="flex items-center gap-3 mb-3 lg:mb-4">
                <span className="text-2xl lg:text-3xl">{emoji}</span>
                <span className="font-display text-4xl lg:text-5xl text-white/10 leading-none select-none">{n}</span>
              </div>
              <h3 className="text-sm lg:text-base font-body font-semibold text-white mb-1.5 lg:mb-2">{title}</h3>
              <p className="text-xs lg:text-sm text-white/45 font-body leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── WHAT'S IN THE APP ── */}
      <div className="px-4 lg:px-10 mb-6 lg:mb-8">
        <motion.div {...fadeUp(0.4)} className="mb-5 lg:mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 lg:h-6 rounded-full bg-asu-maroon-light" />
            <span className="text-[10px] lg:text-xs font-body font-semibold tracking-widest text-white/35 uppercase">what's inside</span>
          </div>
          <h2 className="font-display text-2xl lg:text-4xl text-white tracking-wide mt-2">
            FOUR TOOLS,<br /><span className="text-asu-gold">ONE PURPOSE.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          {features.map(({ icon: Icon, color, bg, tab, label, title, desc, cta }, i) => (
            <motion.button
              key={label}
              {...fadeUp(0.42 + i * 0.05)}
              onClick={() => navigate(tab)}
              className="text-left rounded-2xl border border-[#1E2035] px-5 lg:px-6 py-5 lg:py-6
                         hover:border-white/15 transition-all duration-200 group"
              style={{ background: '#13141F' }}
            >
              <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl border ${bg}
                              flex items-center justify-center mb-3 lg:mb-4`}>
                <Icon size={18} className={`${color} lg:hidden`} />
                <Icon size={26} className={`${color} hidden lg:block`} />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] lg:text-xs font-body font-semibold tracking-widest text-white/25 uppercase">{label}</span>
                  </div>
                  <h3 className="text-sm lg:text-lg font-body font-semibold text-white mb-1.5 lg:mb-2">{title}</h3>
                  <p className="text-xs lg:text-sm text-white/45 font-body leading-relaxed">{desc}</p>
                </div>
              </div>
              <div className={`text-xs lg:text-sm font-body font-medium mt-3 lg:mt-4 ${color}
                              flex items-center gap-1 group-hover:gap-2 transition-all`}>
                {cta}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <motion.div {...fadeUp(0.6)} className="mx-4 lg:mx-10">
        <div className="rounded-2xl overflow-hidden relative"
             style={{ background: 'linear-gradient(135deg, rgba(140,29,64,0.25) 0%, rgba(255,198,39,0.08) 50%, #13141F 100%)' }}>
          <div className="border border-asu-gold/20 rounded-2xl px-6 lg:px-10 py-6 lg:py-8 text-center">
            <div className="text-3xl lg:text-4xl mb-3">🌍</div>
            <h3 className="font-display text-2xl lg:text-4xl text-white tracking-wide mb-2">
              YOUR FIRST QUEST IS<br /><span className="text-asu-gold">30 SECONDS AWAY</span>
            </h3>
            <p className="text-sm lg:text-base text-white/45 font-body mb-5 lg:mb-6 max-w-sm mx-auto">
              Pick a zone, do something small, earn XP. That's it.
              The hard part isn't the quest — it's deciding to start.
            </p>
            <button
              onClick={() => navigate('/quests')}
              className="btn-gold text-sm lg:text-base px-8 lg:px-12 py-3 lg:py-4 rounded-2xl
                         inline-flex items-center gap-2"
            >
              Let's go <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  )
}
