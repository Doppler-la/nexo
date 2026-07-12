"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { ClientForm } from "@/components/admin/ClientForm"
import { ClientCreatedPanel } from "@/components/admin/ClientCreatedPanel"
import { ProductsTab } from "@/components/admin/ProductsTab"
import { StockTab } from "@/components/admin/StockTab"
import { CustomersTab } from "@/components/admin/CustomersTab"
import { OrdersTab } from "@/components/admin/OrdersTab"
import { SyncLogTab } from "@/components/admin/SyncLogTab"
import { useAdminClient, useUpdateClient } from "@/src/hooks/useAdminClients"
import { UpdateClientPayload } from "@/src/types/client.type"

export default function ClientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: setup, isLoading, isError } = useAdminClient(slug)
  const { mutate: updateClient, isPending, error } = useUpdateClient(slug)
  const [productsPage, setProductsPage] = useState(1)
  const [stockPage, setStockPage] = useState(1)
  const [customersPage, setCustomersPage] = useState(1)
  const [ordersPage, setOrdersPage] = useState(1)
  const [syncLogPage, setSyncLogPage] = useState(1)

  const handleSubmit = (payload: UpdateClientPayload) => {
    updateClient(payload)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      {isLoading && <p className="text-sm text-muted-foreground py-4 text-center">Cargando cliente...</p>}
      {isError && <p className="text-sm text-destructive py-4 text-center">No se encontró el cliente.</p>}

      {setup && (
        <Tabs defaultValue="config">
          <TabsList>
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="sync-log">Sync log</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <div className="max-w-3xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{setup.client.name}</CardTitle>
                  <CardDescription>Slug: {setup.client.slug} (no editable)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientForm
                    mode="edit"
                    initialValues={setup.client}
                    onSubmit={(payload) => handleSubmit(payload as UpdateClientPayload)}
                    isPending={isPending}
                    error={error}
                  />
                </CardContent>
              </Card>

              <div>
                <h2 className="text-lg font-semibold mb-3">Snippet y webhook</h2>
                <ClientCreatedPanel setup={setup} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab slug={slug} page={productsPage} onPageChange={setProductsPage} />
          </TabsContent>
          <TabsContent value="stock">
            <StockTab slug={slug} page={stockPage} onPageChange={setStockPage} />
          </TabsContent>
          <TabsContent value="customers">
            <CustomersTab slug={slug} page={customersPage} onPageChange={setCustomersPage} />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab slug={slug} page={ordersPage} onPageChange={setOrdersPage} />
          </TabsContent>
          <TabsContent value="sync-log">
            <SyncLogTab slug={slug} page={syncLogPage} onPageChange={setSyncLogPage} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
