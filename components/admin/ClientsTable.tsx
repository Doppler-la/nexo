"use client"

import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Client } from "@/src/types/client.type"

interface ClientsTableProps {
  clients: Client[]
}

export function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No hay clientes creados todavía.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Usá el botón &quot;+ Nuevo cliente&quot; para dar de alta el primero.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Creado</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id} className="cursor-pointer">
            <TableCell className="font-medium">
              <Link href={`/admin/clients/${client.slug}`} className="hover:underline">
                {client.name}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">{client.slug}</TableCell>
            <TableCell>
              {client.active ? (
                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                  Activo
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Inactivo
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
                new Date(client.createdAt)
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/admin/clients/${client.slug}`}>
                  Ver detalle
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
