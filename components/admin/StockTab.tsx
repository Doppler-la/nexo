'use client'

import { useClientStock } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { StockItem } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

interface StockTabProps {
  slug: string
  page: number
  onPageChange: (page: number) => void
}

export function StockTab({ slug, page, onPageChange }: StockTabProps) {
  const { data, isLoading, isError } = useClientStock(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'SKU', cell: (item: StockItem) => item.sku },
    { header: 'Depósito', cell: (item: StockItem) => item.warehouseCode },
    { header: 'Disponible', cell: (item: StockItem) => item.available },
    { header: 'Sincronizado', cell: (item: StockItem) => formatDateTime(item.syncedAt) },
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
      emptyMessage="No hay stock cargado para este cliente."
      errorMessage="Error al cargar el stock."
      getRowKey={(item) => `${item.sku}-${item.warehouseCode}`}
    />
  )
}
