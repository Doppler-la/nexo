"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react"

interface SyncResource {
  name: string
  status: "ok" | "error" | "pending"
}

interface SyncStatus {
  lastSync: string | null
  resources: SyncResource[]
}

export function SyncPanel() {
  const [status, setStatus] = useState<SyncStatus>({
    lastSync: null,
    resources: [
      { name: "Productos", status: "pending" },
      { name: "Listas de precios", status: "pending" },
      { name: "Precios", status: "pending" },
      { name: "Stock", status: "pending" },
    ],
  })
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchSyncStatus()
  }, [])

  const fetchSyncStatus = async () => {
    try {
      const middlewareUrl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL
      const apiKey = process.env.NEXT_PUBLIC_API_KEY

      const res = await fetch(`${middlewareUrl}/api/sync/status`, {
        headers: {
          "X-API-Key": apiKey || "",
        },
      })

      if (res.ok) {
        const data = await res.json()
        setStatus({
          lastSync: data.lastSync || null,
          resources: data.resources || status.resources,
        })
      }
    } catch {
      // Keep default status if fetch fails
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    setMessage("")

    try {
      const middlewareUrl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL
      const apiKey = process.env.NEXT_PUBLIC_API_KEY

      const res = await fetch(`${middlewareUrl}/api/sync/trigger`, {
        method: "POST",
        headers: {
          "X-API-Key": apiKey || "",
        },
      })

      if (!res.ok) {
        throw new Error("Error al iniciar sincronización")
      }

      setMessage("Sincronización iniciada. Los datos se actualizarán en unos minutos.")
      
      // Refresh status after a delay
      setTimeout(fetchSyncStatus, 2000)
    } catch {
      setMessage("Error al iniciar la sincronización. Intentá nuevamente.")
    } finally {
      setSyncing(false)
    }
  }

  const getStatusBadge = (resourceStatus: "ok" | "error" | "pending") => {
    switch (resourceStatus) {
      case "ok":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            OK
          </Badge>
        )
      case "error":
        return (
          <Badge variant="destructive">
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            Pendiente
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Última sincronización</p>
              <p className="font-medium">
                {status.lastSync || "—"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {status.resources.map((resource) => (
              <div
                key={resource.name}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span className="text-sm">{resource.name}</span>
                {getStatusBadge(resource.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSync}
        disabled={syncing}
        className="w-full"
        size="lg"
      >
        {syncing ? (
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

      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg text-sm ${
            message.includes("Error")
              ? "bg-destructive/10 text-destructive"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message.includes("Error") ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {message}
        </div>
      )}
    </div>
  )
}
