import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/authStore'
import { authRepository } from '../repositories/authRepository'


export function useLogin() {
  const router   = useRouter()
  const setAuth  = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: authRepository.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard')
    },
  })
}

export function useLogout() {
  const router      = useRouter()
  const clearAuth   = useAuthStore((s) => s.clearAuth)
  const queryClient = useQueryClient()

  return () => {
    clearAuth()
    queryClient.clear()
    router.push('/login')
  }
}

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey:  ['me'],
    queryFn:   authRepository.me,
    enabled:   isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry:     false,
  })
}