import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'

export function useHydratedAuth() {
  const [hydrated, setHydrated] = useState(false)
  const store = useAuthStore()

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: store.setAuth,
      clearAuth: store.clearAuth,
    }
  }

  return store
}