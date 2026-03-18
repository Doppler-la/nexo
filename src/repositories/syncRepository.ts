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

export const syncRepository = {
  getStatus: async (): Promise<SyncStatusResponse> => {
    const { data } = await httpClient.get<SyncStatusResponse>('/api/sync/status')
    return data
  },

  trigger: async (): Promise<void> => {
    await httpClient.post('/api/sync/trigger')
  },
}