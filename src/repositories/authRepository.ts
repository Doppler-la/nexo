import { httpClient } from '@/lib/httpClient'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    email: string
    name: string
    nameSrl: string | null
    role: 'admin' | 'client'
  }
}

export interface MeResponse {
  id: number
  email: string
  name: string
  nameSrl: string | null
  role: 'admin' | 'client'
}

export const authRepository = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await httpClient.post<LoginResponse>('/api/auth/login', payload)
    return data
  },

  me: async (): Promise<MeResponse> => {
    const { data } = await httpClient.get<MeResponse>('/api/auth/me')
    return data
  },
}