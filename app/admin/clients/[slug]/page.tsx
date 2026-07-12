"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { ClientForm } from "@/components/admin/ClientForm"
import { ClientCreatedPanel } from "@/components/admin/ClientCreatedPanel"
import { useAdminClient, useUpdateClient } from "@/src/hooks/useAdminClients"
import { UpdateClientPayload } from "@/src/types/client.type"

export default function ClientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: setup, isLoading, isError } = useAdminClient(slug)
  const { mutate: updateClient, isPending, error } = useUpdateClient(slug)

  const handleSubmit = (payload: UpdateClientPayload) => {
    updateClient(payload)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      {isLoading && <p className="text-sm text-muted-foreground py-4 text-center">Cargando cliente...</p>}
      {isError && <p className="text-sm text-destructive py-4 text-center">No se encontró el cliente.</p>}

      {setup && (
        <div className="space-y-6">
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
      )}
    </div>
  )
}
