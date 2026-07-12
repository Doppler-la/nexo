'use client'

import { useClientSyncLog } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { Badge } from '@/components/ui/badge'
import { SyncLogItem } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

interface SyncLogTabProps {
  slug: string
  page: number
  onPageChange: (page: number) => void
}

export function SyncLogTab({ slug, page, onPageChange }: SyncLogTabProps) {
  const { data, isLoading, isError } = useClientSyncLog(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'Tipo', cell: (item: SyncLogItem) => item.type },
    { header: 'Recurso', cell: (item: SyncLogItem) => item.resource ?? '-' },
    {
      header: 'Estado',
      cell: (item: SyncLogItem) => (
        <Badge variant={item.status === 'error' ? 'destructive' : 'default'}>{item.status}</Badge>
      ),
    },
    { header: 'Registros', cell: (item: SyncLogItem) => item.recordsProcessed },
    { header: 'Error', cell: (item: SyncLogItem) => item.errorMessage ?? '-' },
    { header: 'Inicio', cell: (item: SyncLogItem) => formatDateTime(item.startedAt) },
    { header: 'Fin', cell: (item: SyncLogItem) => formatDateTime(item.finishedAt) },
  ]

  return (
    <PaginatedDataTable
      columns={columns}
      items={data?.items ?? []}
      total={data?.total ?? 0}
      page={page}
      onPageChange={onPageChange}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No hay corridas de sincronización para este cliente."
      errorMessage="Error al cargar el historial de sincronización."
      getRowKey={(item) => item.id}
    />
  )
}
