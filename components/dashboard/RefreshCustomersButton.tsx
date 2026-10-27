"use client"

import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRefreshCustomers } from "@/src/hooks/useCustomers"

// Re-lee de Tango la lista de precios de todos los clientes vinculados (incluye usuarios B2B aprobados).
export function RefreshCustomersButton({ clientId }: { clientId?: number }) {
  const { mutate, isPending, data, isError } = useRefreshCustomers()

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" onClick={() => mutate(clientId)} disabled={isPending}>
        <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Actualizando..." : "Actualizar desde Tango"}
      </Button>
      {isError && <p className="text-sm text-destructive">No se pudo actualizar desde Tango.</p>}
      {data && (
        <p className="text-sm text-muted-foreground">
          {data.changed} de {data.total} cambiaron de lista de precios
          {data.failed.length > 0 && `. Fallaron ${data.failed.length}: ${data.failed.map((f) => f.tangoCode).join(", ")}`}
        </p>
      )}
    </div>
  )
}
