import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SyncLogEntry, syncRepository } from '../repositories/syncRepository'

const QUERY_KEY = ['sync-status']

const RESOURCE_LABELS: Record<string, string> = {
  products:     'Productos',
  price_lists:  'Listas de precios',
  prices:       'Precios',
  stock:        'Stock',
}

function getResourceStatus(logs: SyncLogEntry[], resource: string) {
  const last = logs
    .filter(l => l.resource === resource && l.status !== 'running')
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0]

  if (!last) return 'pending' as const
  return last.status === 'success' ? 'ok' as const : 'error' as const
}

function getLastSyncDate(logs: SyncLogEntry[]) {
  const last = logs
    .filter(l => l.status === 'success' && l.finishedAt)
    .sort((a, b) => new Date(b.finishedAt!).getTime() - new Date(a.finishedAt!).getTime())[0]

  if (!last) return null

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(last.finishedAt!))
}

export function useSyncStatus() {
  return useQuery({
    queryKey:        QUERY_KEY,
    queryFn:         syncRepository.getStatus,
    refetchInterval: 10_000, // refresca cada 10 segundos para ver cuando termina el sync
    select: (data) => ({
      lastSync:  getLastSyncDate(data.logs),
      resources: Object.entries(RESOURCE_LABELS).map(([key, name]) => ({
        name,
        status: getResourceStatus(data.logs, key),
      })),
    }),
  })
}

export function useTriggerSync() {
  const queryClient = useQueryClient()

  return useMutation<void, Error>({
    mutationFn:   syncRepository.trigger,
    throwOnError: false,
    onSuccess: () => {
      // Refrescar el status después de disparar el sync
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      }, 2000)
    },
  })
}