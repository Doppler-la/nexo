'use client'

import { useState } from 'react'
import { useClientStock } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { StockItem } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

interface StockTabProps {
  slug: string
}

export function StockTab({ slug }: StockTabProps) {
  const [page, setPage] = useState(1)
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
      onPageChange={setPage}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No hay stock cargado para este cliente."
      errorMessage="Error al cargar el stock."
      getRowKey={(item) => `${item.sku}-${item.warehouseCode}`}
    />
  )
}
