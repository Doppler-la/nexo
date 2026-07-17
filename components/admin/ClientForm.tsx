"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AlertCircle } from "lucide-react"
import { Client, CreateClientPayload, UpdateClientPayload } from "@/src/types/client.type"

interface ClientFormProps {
  mode: "create" | "edit"
  initialValues?: Client
  onSubmit: (payload: CreateClientPayload | UpdateClientPayload) => void
  isPending: boolean
  error: Error | null
}

const REFERENCE_FIELDS = [
  { key: "depositoId", label: "ID de depósito" },
  { key: "talonario", label: "ID de talonario de pedido" },
  { key: "sellerCodeDefault", label: "ID de SellerCode" },
  { key: "transportCodeDefault", label: "ID de TransportCode" },
  { key: "shippingSku", label: "SKU del envío" },
] as const

export function ClientForm({ mode, initialValues, onSubmit, isPending, error }: ClientFormProps) {
  const [slug, setSlug] = useState(initialValues?.slug ?? "")
  const [name, setName] = useState(initialValues?.name ?? "")
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("")
  const [active, setActive] = useState(initialValues?.active ?? true)
  const [tangoAccessToken, setTangoAccessToken] = useState(mode === "create" ? (initialValues?.tangoAccessToken ?? "") : "")
  const [tangoApiUrl, setTangoApiUrl] = useState(initialValues?.tangoApiUrl ?? "")
  const [notes, setNotes] = useState(initialValues?.notes ?? "")
  const [references, setReferences] = useState<Record<string, string>>(
    Object.fromEntries(REFERENCE_FIELDS.map((f) => [f.key, initialValues?.[f.key] ?? ""]))
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const referencePayload = Object.fromEntries(
      REFERENCE_FIELDS.map((f) => [f.key, references[f.key] || null])
    )

    if (mode === "create") {
      onSubmit({
        slug,
        name,
        userEmail,
        userPassword,
        tangoAccessToken,
        tangoApiUrl: tangoApiUrl || undefined,
        notes: notes || null,
        ...referencePayload,
      })
    } else {
      onSubmit({
        name,
        active,
        ...(tangoAccessToken ? { tangoAccessToken } : {}),
        tangoApiUrl: tangoApiUrl || undefined,
        notes: notes || null,
        ...referencePayload,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {mode === "create" && (
          <div className="grid gap-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Ej: imagineone"
              required
            />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Imagine One S.A."
            required
          />
        </div>
      </div>

      {mode === "edit" && (
        <div className="flex items-center gap-3">
          <Switch id="active" checked={active} onCheckedChange={setActive} />
          <Label htmlFor="active">Cliente activo</Label>
        </div>
      )}

      {mode === "create" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="userEmail">Email del usuario del dashboard</Label>
            <Input
              id="userEmail"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="cliente@empresa.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="userPassword">Contraseña del usuario del dashboard</Label>
            <Input
              id="userPassword"
              type="text"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              required
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="tangoAccessToken">
            Access Token de Tango {mode === "edit" && <span className="text-muted-foreground font-normal">(dejar vacío para no cambiarlo)</span>}
          </Label>
          <Input
            id="tangoAccessToken"
            value={tangoAccessToken}
            onChange={(e) => setTangoAccessToken(e.target.value)}
            placeholder="b82723b4-67ea-421e-8ec4-21d3e30bc3b5_15976"
            required={mode === "create"}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tangoApiUrl">URL de la API de Tango</Label>
          <Input
            id="tangoApiUrl"
            value={tangoApiUrl}
            onChange={(e) => setTangoApiUrl(e.target.value)}
            placeholder="https://tiendas.axoft.com/api/Aperture"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {REFERENCE_FIELDS.map((f) => (
          <div key={f.key} className="grid gap-2">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              value={references[f.key]}
              onChange={(e) => setReferences((r) => ({ ...r, [f.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Texto libre, ej: depósito y particularidades del cliente"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          {(error as any)?.response?.data?.message || error.message || "Error al guardar el cliente"}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="bg-accent hover:bg-accent/90">
        {isPending ? "Guardando..." : mode === "create" ? "Crear cliente" : "Guardar cambios"}
      </Button>
    </form>
  )
}
