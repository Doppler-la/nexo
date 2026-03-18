import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'

export function useAppInit() {
  const [initialized, setInitialized] = useState(false)
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
    setInitialized(true)
  }, [])

  return { initialized }
}