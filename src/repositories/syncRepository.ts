import { isAxiosError } from 'axios'
import { httpClient } from '@/lib/httpClient'

export interface SyncLogEntry {
  id: number
  type: string
  resource: string
  status: 'running' | 'success' | 'error'
  recordsProcessed: number
  errorMessage: string | null
  startedAt: string
  finishedAt: string | null
}

export interface SyncStatusResponse {
  logs: SyncLogEntry[]
}

export class SyncInProgressError extends Error {}

export const syncRepository = {
  // No manda X-API-Key: el cliente a sincronizar se resuelve del JWT en el backend.
  getStatus: async (): Promise<SyncStatusResponse> => {
    const { data } = await httpClient.get<SyncStatusResponse>('/api/sync/mine/status', {
      headers: { 'X-API-Key': undefined },
    })
    return data
  },

  trigger: async (): Promise<void> => {
    try {
      await httpClient.post('/api/sync/mine/trigger', null, {
        headers: { 'X-API-Key': undefined },
      })
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        throw new SyncInProgressError(error.response.data?.message ?? 'Ya hay una sincronización en curso.')
      }
      throw error
    }
  },
}