'use client'

import { useClientCustomers } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { CustomerItem } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

interface CustomersTabProps {
  slug: string
  page: number
  onPageChange: (page: number) => void
}

export function CustomersTab({ slug, page, onPageChange }: CustomersTabProps) {
  const { data, isLoading, isError } = useClientCustomers(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'Usuario Woo', cell: (item: CustomerItem) => item.wooUserId },
    { header: 'Código Tango', cell: (item: CustomerItem) => item.tangoCode ?? '-' },
    { header: 'Documento', cell: (item: CustomerItem) => item.documentNumber ?? '-' },
    { header: 'IVA', cell: (item: CustomerItem) => item.ivaCategory ?? '-' },
    { header: 'Lista de precios', cell: (item: CustomerItem) => item.priceListNumber ?? '-' },
    { header: 'Vinculado', cell: (item: CustomerItem) => formatDateTime(item.createdAt) },
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
      emptyMessage="No hay clientes de WooCommerce vinculados."
      errorMessage="Error al cargar los clientes vinculados."
      getRowKey={(item) => item.id}
    />
  )
}
