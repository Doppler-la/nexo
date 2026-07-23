"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { useSyncStatus, useTriggerSync } from "@/src/hooks/useSync"
import { SyncInProgressError } from "@/src/repositories/syncRepository"

function StatusBadge({ status }: { status: "ok" | "error" | "pending" }) {
  if (status === "ok") {
    return (
      <Badge variant="outline" className="gap-1 text-green-700 border-green-300 bg-green-50">
        <CheckCircle2 className="h-3 w-3" />
        OK
      </Badge>
    )
  }
  if (status === "error") {
    return (
      <Badge variant="outline" className="gap-1 text-destructive border-destructive/30 bg-destructive/10">
        <AlertCircle className="h-3 w-3" />
        Error
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 text-muted-foreground">
      <Clock className="h-3 w-3" />
      Pendiente
    </Badge>
  )
}

export function SyncPanel() {
  const { data: status, isLoading } = useSyncStatus()
  const { mutate: triggerSync, isPending, isSuccess, isError, error, reset } = useTriggerSync()

  const resources = status?.resources ?? [
    { name: "Productos",         status: "pending" as const },
    { name: "Listas de precios", status: "pending" as const },
    { name: "Precios",           status: "pending" as const },
    { name: "Stock",             status: "pending" as const },
  ]

  const handleSync = () => {
    reset()
    triggerSync()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Última sincronización</p>
              <p className="font-medium">
                {isLoading ? "Cargando..." : (status?.lastSync ?? "—")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.name}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm">{resource.name}</span>
                <StatusBadge status={resource.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSync}
        disabled={isPending}
        className="w-full"
        size="lg"
      >
        {isPending ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Sincronizando...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Ejecutar sincronización ahora
          </>
        )}
      </Button>

      {isSuccess && (
        <div className="flex items-center gap-2 p-4 rounded-lg text-sm bg-green-50 text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Sincronización iniciada. Los datos se actualizarán en unos minutos.
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-2 p-4 rounded-lg text-sm bg-destructive/10 text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error instanceof SyncInProgressError
            ? error.message
            : 'Error al iniciar la sincronización. Intentá de nuevo.'}
        </div>
      )}
    </div>
  )
}