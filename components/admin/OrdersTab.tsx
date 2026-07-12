'use client'

import { useState } from 'react'
import { useClientOrders } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { JsonViewDialog } from '@/components/admin/JsonViewDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OrderItem, OrderStatus } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

const ERROR_STATUSES: OrderStatus[] = ['error', 'rejected', 'observed']

interface OrdersTabProps {
  slug: string
  page: number
  onPageChange: (page: number) => void
}

export function OrdersTab({ slug, page, onPageChange }: OrdersTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
  const { data, isLoading, isError } = useClientOrders(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'Pedido Woo', cell: (item: OrderItem) => item.wooOrderId },
    { header: 'Pedido Tango', cell: (item: OrderItem) => item.tangoOrderId ?? '-' },
    {
      header: 'Estado',
      cell: (item: OrderItem) => (
        <Badge variant={ERROR_STATUSES.includes(item.status) ? 'destructive' : 'default'}>
          {item.status}
        </Badge>
      ),
    },
    { header: 'Creado', cell: (item: OrderItem) => formatDateTime(item.createdAt) },
    { header: 'Sincronizado', cell: (item: OrderItem) => formatDateTime(item.syncedAt) },
    {
      header: '',
      cell: (item: OrderItem) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(item)}>
          Ver detalle
        </Button>
      ),
    },
  ]

  return (
    <>
      <PaginatedDataTable
        columns={columns}
        items={data?.items ?? []}
        total={data?.total ?? 0}
        page={page}
        onPageChange={onPageChange}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No hay pedidos para este cliente."
        errorMessage="Error al cargar pedidos."
        getRowKey={(item) => item.id}
      />
      <JsonViewDialog
        open={selectedOrder !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null)
        }}
        title={selectedOrder ? `Pedido ${selectedOrder.wooOrderId}` : ''}
        data={
          selectedOrder
            ? {
                errorMessage: selectedOrder.errorMessage,
                rawWooPayload: selectedOrder.rawWooPayload,
                rawTangoPayload: selectedOrder.rawTangoPayload,
              }
            : {}
        }
      />
    </>
  )
}
