"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, RefreshCw } from "lucide-react"
import { LinkedCustomersTable } from "@/components/dashboard/LinkedCustomersTable"
import { LinkCustomerModal } from "@/components/dashboard/LinkCustomerModal"
import { B2bUsersPanel } from "@/components/b2b/B2bUsersPanel"
import { useMe } from "@/src/hooks/useAuth"
import { SyncPanel } from "@/components/dashboard/SyncPanel"
import { useCustomers, useLinkCustomer, useRefreshCustomers } from "@/src/hooks/useCustomers"

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const b2bEnabled = useMe().data?.client?.b2bEnabled === true
  const { data: customers = [], isLoading, isError } = useCustomers()
  const { mutateAsync: linkCustomer, isPending, error: linkError, isSuccess, reset } = useLinkCustomer()

  const { mutate: refresh, isPending: isRefreshing, data: refreshResult, isError: refreshError } = useRefreshCustomers()

  const handleOpenModal = () => {
    reset() // limpiar estado anterior del modal
    setModalOpen(true)
  }

  const handleLink = (payload: { wooUserId: number; tangoCode: string }) => {
    linkCustomer(payload)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Panel de control</h1>
        <p className="text-muted-foreground mt-1">
          Gestioná la sincronización entre Tango y tu negocio
        </p>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers" className="gap-2">
            <Users className="h-4 w-4" />
            Clientes vinculados
          </TabsTrigger>
          {b2bEnabled && (
            <TabsTrigger value="b2b" className="gap-2">
              <Users className="h-4 w-4" />
              Usuarios B2B
            </TabsTrigger>
          )}
          <TabsTrigger value="sync" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sincronización
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Clientes vinculados</CardTitle>
                  <CardDescription>
                    Asociá usuarios de WooCommerce con clientes de Tango.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => refresh()} disabled={isRefreshing}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    {isRefreshing ? "Actualizando..." : "Actualizar desde Tango"}
                  </Button>
                  <Button
                    onClick={handleOpenModal}
                    className="bg-accent hover:bg-accent/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Vincular cliente
                  </Button>
                </div>
              </div>
              {refreshError && (
                <p className="text-sm text-destructive mt-2">No se pudo actualizar desde Tango.</p>
              )}
              {refreshResult && (
                <p className="text-sm text-muted-foreground mt-2">
                  {refreshResult.changed} de {refreshResult.total} cambiaron de lista de precios
                  {refreshResult.failed.length > 0 &&
                    `. Fallaron ${refreshResult.failed.length}: ${refreshResult.failed.map((f) => f.tangoCode).join(", ")}`}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {isLoading && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Cargando clientes...
                </p>
              )}
              {isError && (
                <p className="text-sm text-destructive py-4 text-center">
                  Error al cargar los clientes.
                </p>
              )}
              {!isLoading && !isError && (
                <LinkedCustomersTable customers={customers} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {b2bEnabled && (
          <TabsContent value="b2b">
            <Card>
              <CardHeader>
                <CardTitle>Usuarios del portal B2B</CardTitle>
                <CardDescription>
                  Aprobá o rechazá solicitudes, creá usuarios y reseteá contraseñas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <B2bUsersPanel />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle>Sincronización con Tango</CardTitle>
              <CardDescription>
                Forzá una sincronización manual si realizaste cambios en Tango y
                querés verlos reflejados de inmediato.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SyncPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <LinkCustomerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onLink={handleLink}
        isPending={isPending}
        isSuccess={isSuccess}
        error={linkError}
      />
    </div>
  )
}