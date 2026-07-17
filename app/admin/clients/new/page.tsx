"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { ClientForm } from "@/components/admin/ClientForm"
import { ClientCreatedPanel } from "@/components/admin/ClientCreatedPanel"
import { useState } from "react"
import { useCreateClient } from "@/src/hooks/useAdminClients"
import { CreateClientPayload } from "@/src/types/client.type"

export default function NewClientPage() {
  const { mutate: createClient, isPending, error, data } = useCreateClient()
  const [userCredentials, setUserCredentials] = useState({ email: "", password: "" })

  const handleSubmit = (payload: CreateClientPayload) => {
    setUserCredentials({ email: payload.userEmail, password: payload.userPassword })
    createClient(payload)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      {data ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <CardTitle className="text-base">Cliente &quot;{data.client.name}&quot; creado correctamente</CardTitle>
              </div>
              <CardDescription>
                La sincronización inicial con Tango se disparó en segundo plano. Copiá los datos de abajo para
                terminar la instalación en WordPress.
              </CardDescription>
            </CardHeader>
          </Card>
          <ClientCreatedPanel setup={data} userCredentials={userCredentials} />
          <Button asChild variant="outline">
            <Link href={`/admin/clients/${data.client.slug}`}>Ir al detalle del cliente</Link>
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Nuevo cliente</CardTitle>
            <CardDescription>Completá los datos que llegan en el documento de integración del cliente.</CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm
              mode="create"
              onSubmit={(payload) => handleSubmit(payload as CreateClientPayload)}
              isPending={isPending}
              error={error}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
