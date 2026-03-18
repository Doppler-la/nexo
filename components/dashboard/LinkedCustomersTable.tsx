"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface LinkedCustomer {
  wooUserId: number
  tangoCode: string
  priceList: string
  seller: string
  transport: string
  paymentCondition: string
}

interface LinkedCustomersTableProps {
  customers: LinkedCustomer[]
}

export function LinkedCustomersTable({ customers }: LinkedCustomersTableProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">
          No hay clientes vinculados todavía.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Usá el botón &quot;+ Vincular cliente&quot; para agregar el primero.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID WooCommerce</TableHead>
          <TableHead>Código Tango</TableHead>
          <TableHead>Lista de precios</TableHead>
          <TableHead>Vendedor</TableHead>
          <TableHead>Transporte</TableHead>
          <TableHead>Condición de pago</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={`${customer.wooUserId}-${customer.tangoCode}`}>
            <TableCell className="font-medium">{customer.wooUserId}</TableCell>
            <TableCell>{customer.tangoCode}</TableCell>
            <TableCell>{customer.priceList}</TableCell>
            <TableCell>{customer.seller}</TableCell>
            <TableCell>{customer.transport}</TableCell>
            <TableCell>{customer.paymentCondition}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
