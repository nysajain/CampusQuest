import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { UserProvider, useUser } from './context/UserContext'
import BottomNav from './components/BottomNav'
import QuestsPage from './pages/QuestsPage'
import AuxPage from './pages/AuxPage'
import BadgesPage from './pages/BadgesPage'
import LeaderboardPage from './pages/LeaderboardPage'
import Header from './components/Header'

function Inner() {
  const { refresh } = useUser()
  useEffect(() => { refresh() }, [refresh])

  return (
    <div className="flex flex-col min-h-dvh max-w-md mx-auto relative">
      <Header />
      <main className="flex-1 pb-24 overflow-y-auto">
        <Routes>
          <Route path="/"            element={<Navigate to="/quests" replace />} />
          <Route path="/quests"      element={<QuestsPage />} />
          <Route path="/aux"         element={<AuxPage />} />
          <Route path="/badges"      element={<BadgesPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <UserProvider>
      <Inner />
    </UserProvider>
  )
}
