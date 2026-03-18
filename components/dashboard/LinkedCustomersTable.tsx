"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Customer } from "@/src/types/customer.type"
import { Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "../ui/alert-dialog"
import { useState } from "react"
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog"

interface LinkedCustomersTableProps {
  customers: Customer[]
}

export function LinkedCustomersTable({ customers }: LinkedCustomersTableProps) {
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)

  const handleConfirmDelete = () => {
    // TODO: llamar al endpoint de eliminación cuando esté disponible
    console.log('Eliminar cliente:', customerToDelete?.wooUserId)
    setCustomerToDelete(null)
  }
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
    <>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID WooCommerce</TableHead>
          <TableHead>Código Tango</TableHead>
          <TableHead>Lista de precios</TableHead>
          <TableHead>Vendedor</TableHead>
          <TableHead>ID Cliente Tango</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={`${customer.wooUserId}-${customer.tangoCode}`}>
            <TableCell className="font-medium">{customer.wooUserId}</TableCell>
            <TableCell>{customer.tangoCode}</TableCell>
            <TableCell>{customer.priceListNumber}</TableCell>
            <TableCell>{customer.saleConditionCode ?? '-'}</TableCell>
            <TableCell>{customer.tangoCustomerId}</TableCell>
            <TableCell>
              <Button 
                onClick={() => setCustomerToDelete(customer)} 
                variant="destructive" 
                size="icon" 
                className="cursor-pointer"
              >
                <Trash2 className="h-6 w-6" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <AlertDialog
        open={!!customerToDelete}
        onOpenChange={(open) => { if (!open) setCustomerToDelete(null) }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminás este cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Se va a desvincular el usuario de WooCommerce{' '}
              <span className="font-medium text-foreground">
                #{customerToDelete?.wooUserId}
              </span>{' '}
              del cliente Tango{' '}
              <span className="font-medium text-foreground">
                {customerToDelete?.tangoCode}
              </span>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
