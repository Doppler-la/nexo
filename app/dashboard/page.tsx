"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Users, RefreshCw } from "lucide-react"
import { LinkedCustomersTable } from "@/components/dashboard/LinkedCustomersTable"
import { LinkCustomerModal } from "@/components/dashboard/LinkCustomerModal"
import { SyncPanel } from "@/components/dashboard/SyncPanel"

interface LinkedCustomer {
  wooUserId: number
  tangoCode: string
  priceList: string
  seller: string
  transport: string
  paymentCondition: string
}

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [customers, setCustomers] = useState<LinkedCustomer[]>([])

  const handleCustomerLinked = (customer: LinkedCustomer) => {
    setCustomers((prev) => [...prev, customer])
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Panel de control</h1>
        <p className="text-muted-foreground mt-1">
          Gestioná la sincronización entre Tango y WooCommerce
        </p>
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers" className="gap-2">
            <Users className="h-4 w-4" />
            Clientes vinculados
          </TabsTrigger>
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
                <Button
                  onClick={() => setModalOpen(true)}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Vincular cliente
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <LinkedCustomersTable customers={customers} />
            </CardContent>
          </Card>
        </TabsContent>

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
        onSuccess={handleCustomerLinked}
      />
    </div>
  )
}
