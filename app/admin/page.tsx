"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ClientsTable } from "@/components/admin/ClientsTable"
import { useAdminClients } from "@/src/hooks/useAdminClients"

export default function AdminClientsPage() {
  const { data: clients = [], isLoading, isError } = useAdminClients()

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <p className="text-muted-foreground mt-1">Gestioná los clientes (tenants) del middleware</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>Listado de todos los clientes dados de alta.</CardDescription>
            </div>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/admin/clients/new">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo cliente
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="text-sm text-muted-foreground py-4 text-center">Cargando clientes...</p>
          )}
          {isError && (
            <p className="text-sm text-destructive py-4 text-center">Error al cargar los clientes.</p>
          )}
          {!isLoading && !isError && <ClientsTable clients={clients} />}
        </CardContent>
      </Card>
    </div>
  )
}
