import { create } from 'zustand'

interface User {
  id: number
  email: string
  name: string
  nameSrl: string | null
  role: 'admin' | 'client'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  loadFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  token:           null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('nexo_token', token)
    localStorage.setItem('nexo_user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  clearAuth: () => {
    localStorage.removeItem('nexo_token')
    localStorage.removeItem('nexo_user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  loadFromStorage: () => {
    try {
      const token = localStorage.getItem('nexo_token')
      const user  = localStorage.getItem('nexo_user')
      if (token && user) {
        set({ token, user: JSON.parse(user), isAuthenticated: true })
      }
    } catch {
      // ignorar errores de parse
    }
  },
}))