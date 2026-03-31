import { createContext, useContext, useState, useCallback } from 'react'
import { getUser } from '../api'

const UserCtx = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { data } = await getUser()
      setUser(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  const applyXP = useCallback((gained) => {
    setUser(u => u ? { ...u, xp: u.xp + gained } : u)
  }, [])

  return (
    <UserCtx.Provider value={{ user, loading, refresh, applyXP }}>
      {children}
    </UserCtx.Provider>
  )
}

export const useUser = () => useContext(UserCtx)
