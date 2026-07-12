'use client'

import { useState } from 'react'
import { useClientProducts } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { ProductItem } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

interface ProductsTabProps {
  slug: string
}

export function ProductsTab({ slug }: ProductsTabProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useClientProducts(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'SKU', cell: (item: ProductItem) => item.sku },
    { header: 'Descripción', cell: (item: ProductItem) => item.description ?? '-' },
    { header: 'Código alternativo', cell: (item: ProductItem) => item.alternativeCode ?? '-' },
    { header: 'Unidad', cell: (item: ProductItem) => item.measureUnitCode ?? '-' },
    { header: 'Estado', cell: (item: ProductItem) => (item.disabled ? 'Deshabilitado' : 'Activo') },
    { header: 'Actualizado en Tango', cell: (item: ProductItem) => formatDateTime(item.lastUpdated) },
    { header: 'Sincronizado', cell: (item: ProductItem) => formatDateTime(item.syncedAt) },
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
      emptyMessage="No hay productos para este cliente."
      errorMessage="Error al cargar productos."
      getRowKey={(item) => item.sku}
    />
  )
}
