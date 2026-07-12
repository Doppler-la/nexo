import { httpClient } from '@/lib/httpClient'
import {
  ClientsResponse,
  ClientWithSetup,
  CreateClientPayload,
  UpdateClientPayload,
} from '../types/client.type'

export const adminClientsRepository = {
  getAll: async () => {
    const { data } = await httpClient.get<ClientsResponse>('/api/admin/clients')
    return data.clients
  },

  getBySlug: async (slug: string) => {
    const { data } = await httpClient.get<ClientWithSetup>(`/api/admin/clients/${slug}`)
    return data
  },

  create: async (payload: CreateClientPayload) => {
    const { data } = await httpClient.post<ClientWithSetup>('/api/admin/clients', payload)
    return data
  },

  update: async (slug: string, payload: UpdateClientPayload) => {
    const { data } = await httpClient.patch<ClientWithSetup>(`/api/admin/clients/${slug}`, payload)
    return data
  },
}
