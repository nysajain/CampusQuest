import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { UserProvider, useUser } from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import QuestsPage from './pages/QuestsPage'
import AuxPage from './pages/AuxPage'
import BadgesPage from './pages/BadgesPage'
import LeaderboardPage from './pages/LeaderboardPage'
import Header from './components/Header'

function Inner() {
  const { refresh } = useUser()
  useEffect(() => { refresh() }, [refresh])

  return (
    <div className="flex flex-col lg:flex-row min-h-dvh">
      <BottomNav />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 pb-24 lg:pb-8 overflow-y-auto">
          <Routes>
            <Route path="/"            element={<Navigate to="/home" replace />} />
            <Route path="/home"        element={<HomePage />} />
            <Route path="/quests"      element={<QuestsPage />} />
            <Route path="/aux"         element={<AuxPage />} />
            <Route path="/badges"      element={<BadgesPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Inner />
      </UserProvider>
    </ThemeProvider>
  )
}
