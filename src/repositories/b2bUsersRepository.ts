import { httpClient } from '@/lib/httpClient'
import {
  B2bStatus,
  B2bUser,
  CreateB2bUserPayload,
  UpdateB2bUserPayload,
} from '../types/b2bUser.type'

// clientId solo lo manda el super admin; el cliente lo resuelve el servidor desde el token
const opts = (clientId?: number) => ({ params: clientId ? { clientId } : undefined })
const unwrap = <T extends { data: { user: B2bUser } }>(r: T) => r.data.user

export const b2bUsersRepository = {
  list: async (clientId?: number, status?: B2bStatus) => {
    const { data } = await httpClient.get<{ users: B2bUser[] }>('/api/b2b-users', {
      params: { clientId, status },
    })
    return data.users
  },

  approve: async (clientId: number | undefined, id: number, tangoCode?: string) =>
    unwrap(await httpClient.post(`/api/b2b-users/${id}/approve`, { tangoCode }, opts(clientId))),

  reject: async (clientId: number | undefined, id: number, reason?: string) =>
    unwrap(await httpClient.post(`/api/b2b-users/${id}/reject`, { reason }, opts(clientId))),

  update: async (clientId: number | undefined, id: number, payload: UpdateB2bUserPayload) =>
    unwrap(await httpClient.patch(`/api/b2b-users/${id}`, payload, opts(clientId))),

  create: async (clientId: number | undefined, payload: CreateB2bUserPayload) =>
    unwrap(await httpClient.post('/api/b2b-users', payload, opts(clientId))),

  resetPassword: async (clientId: number | undefined, id: number, password: string) =>
    unwrap(await httpClient.post(`/api/b2b-users/${id}/reset-password`, { password }, opts(clientId))),
}
