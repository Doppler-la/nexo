"use client"

import { useState } from "react"
import { AlertCircle, Check, KeyRound, Pencil, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  useApproveB2bUser, useB2bUsers, useCreateB2bUser, useRejectB2bUser,
  useResetB2bPassword, useUpdateB2bUser,
} from "@/src/hooks/useB2bUsers"
import { B2bStatus, B2bUser } from "@/src/types/b2bUser.type"
import { RefreshCustomersButton } from "@/components/dashboard/RefreshCustomersButton"
import { formatDateTime } from "@/lib/formatDate"

type Action =
  | { type: "create" }
  | { type: "approve" | "reject" | "edit" | "reset"; user: B2bUser }

const errorMessage = (e: unknown) =>
  (e as any)?.response?.data?.message || (e as Error)?.message || "Ocurrió un error"

// clientId: solo para el super admin; el cliente opera sobre el suyo (lo resuelve el token)
export function B2bUsersPanel({ clientId }: { clientId?: number }) {
  const [status, setStatus] = useState<B2bStatus>("pending")
  const [action, setAction] = useState<Action | null>(null)
  const { data: users = [], isLoading, isError } = useB2bUsers(clientId, status)
  const { data: pending } = useB2bUsers(clientId, "pending")

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={status} onValueChange={(v) => setStatus(v as B2bStatus)}>
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              Pendientes
              {!!pending?.length && <Badge variant="destructive">{pending.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="approved">Aprobados</TabsTrigger>
            <TabsTrigger value="rejected">Rechazados</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-start gap-2">
          <RefreshCustomersButton clientId={clientId} />
          <Button onClick={() => setAction({ type: "create" })} className="bg-accent hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            Crear usuario
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground py-4 text-center">Cargando usuarios...</p>}
      {isError && <p className="text-sm text-destructive py-4 text-center">Error al cargar los usuarios.</p>}
      {!isLoading && !isError && users.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center">No hay usuarios en esta lista.</p>
      )}
      {users.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Razón social</TableHead>
              <TableHead>Óptica</TableHead>
              <TableHead>CUIT</TableHead>
              <TableHead>Cód. Tango</TableHead>
              <TableHead>{status === "rejected" ? "Motivo" : "Alta"}</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.razonSocial ?? "—"}</TableCell>
                <TableCell>{u.nombreOptica ?? "—"}</TableCell>
                <TableCell>{u.cuit ?? "—"}</TableCell>
                <TableCell>{u.tangoCode || "—"}</TableCell>
                <TableCell>{status === "rejected" ? u.rejectReason ?? "—" : formatDateTime(u.createdAt)}</TableCell>
                <TableCell className="text-right space-x-1 whitespace-nowrap">
                  {u.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => setAction({ type: "approve", user: u })}>
                        <Check className="mr-1 h-4 w-4" />Aprobar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAction({ type: "reject", user: u })}>
                        <X className="mr-1 h-4 w-4" />Rechazar
                      </Button>
                    </>
                  )}
                  {u.status !== "approved" && (
                    <Button size="icon" variant="ghost" title="Editar" onClick={() => setAction({ type: "edit", user: u })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {u.status === "approved" && (
                    <Button size="sm" variant="outline" onClick={() => setAction({ type: "reset", user: u })}>
                      <KeyRound className="mr-1 h-4 w-4" />Resetear clave
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* key: remonta el diálogo para limpiar el estado del form entre acciones */}
      <ActionDialog
        key={action ? `${action.type}-${"user" in action ? action.user.id : ""}` : "none"}
        action={action}
        clientId={clientId}
        onClose={() => setAction(null)}
      />
    </div>
  )
}

function ActionDialog({ action, clientId, onClose }: { action: Action | null; clientId?: number; onClose: () => void }) {
  const approve = useApproveB2bUser(clientId)
  const reject = useRejectB2bUser(clientId)
  const update = useUpdateB2bUser(clientId)
  const create = useCreateB2bUser(clientId)
  const reset = useResetB2bPassword(clientId)

  const user = action && "user" in action ? action.user : undefined
  const [f, setF] = useState({
    email: "", password: "", reason: "",
    name: user?.name ?? "", razonSocial: user?.razonSocial ?? "", cuit: user?.cuit ?? "", nombreOptica: user?.nombreOptica ?? "",
    phone: user?.phone ?? "", tangoCode: user?.tangoCode ?? "",
  })
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }))

  if (!action) return null
  const m = { approve, reject, edit: update, create, reset }[action.type]
  const done = { onSuccess: onClose }
  const opt = (v: string) => v.trim() || undefined

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (action.type === "approve") approve.mutate({ id: action.user.id, tangoCode: opt(f.tangoCode) }, done)
    if (action.type === "reject") reject.mutate({ id: action.user.id, reason: opt(f.reason) }, done)
    if (action.type === "reset") reset.mutate({ id: action.user.id, password: f.password }, done)
    if (action.type === "edit")
      update.mutate({ id: action.user.id, payload: {
        name: f.name, razonSocial: f.razonSocial, nombreOptica: f.nombreOptica, cuit: f.cuit, phone: f.phone, tangoCode: f.tangoCode,
      } }, done)
    if (action.type === "create")
      create.mutate({
        email: f.email, password: f.password, name: f.name, tangoCode: f.tangoCode,
        razonSocial: opt(f.razonSocial), nombreOptica: opt(f.nombreOptica), cuit: opt(f.cuit), phone: opt(f.phone),
      }, done)
  }

  const field = (k: keyof typeof f, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div className="grid gap-2">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} value={f[k]} onChange={set(k)} {...props} />
    </div>
  )
  const password = field("password", "Contraseña temporal", { minLength: 8, maxLength: 72, required: true, placeholder: "8 a 72 caracteres" })
  const title = {
    approve: "Aprobar solicitud", reject: "Rechazar solicitud", edit: "Editar solicitud",
    create: "Crear usuario", reset: "Resetear contraseña",
  }[action.type]

  return (
    <Dialog open onOpenChange={(o) => !o && !m.isPending && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {action.type === "approve" && "Verificá que los datos coincidan con el cliente en Tango. El sistema solo valida que el código exista, no que pertenezca a quien se registró."}
            {action.type === "reject" && "El rechazo es definitivo: no se puede re-aprobar y ese email no podrá volver a registrarse."}
            {action.type === "create" && "Nace aprobado y vinculado. Pasale el email y la clave temporal al cliente: el sistema no manda mails."}
            {action.type === "reset" && `Se le pedirá cambiarla en su próximo ingreso. Pasásela a ${action.user.email} por fuera del sistema.`}
            {action.type === "edit" && "El email no se puede cambiar."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit}>
          <div className="grid gap-4 py-4">
            {(action.type === "approve" || action.type === "reject") && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 rounded-md border p-3 text-sm">
                {([["Nombre", action.user.name], ["Email", action.user.email],
                   ["Razón social", action.user.razonSocial], ["Óptica", action.user.nombreOptica], ["CUIT", action.user.cuit]] as const).map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium break-words">{v || "—"}</dd>
                  </div>
                ))}
              </dl>
            )}
            {action.type === "approve" && field("tangoCode", "Código de cliente en Tango", { required: true })}
            {action.type === "reject" && (
              <div className="grid gap-2">
                <Label htmlFor="reason">Motivo (opcional)</Label>
                <Textarea id="reason" value={f.reason} onChange={set("reason")} maxLength={500} />
              </div>
            )}
            {action.type === "create" && field("email", "Email", { type: "email", required: true })}
            {(action.type === "create" || action.type === "edit") && (
              <>
                {field("name", "Nombre", { required: true })}
                {field("razonSocial", "Razón social")}
                {field("nombreOptica", "Nombre de la óptica")}
                {field("cuit", "CUIT")}
                {field("phone", "Teléfono")}
                {field("tangoCode", "Código de cliente en Tango", { required: action.type === "create" })}
              </>
            )}
            {(action.type === "create" || action.type === "reset") && password}
            {m.error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMessage(m.error)}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={m.isPending}>Cancelar</Button>
            <Button
              type="submit"
              disabled={m.isPending}
              variant={action.type === "reject" ? "destructive" : "default"}
            >
              {m.isPending ? (action.type === "approve" ? "Consultando Tango (puede tardar)..." : "Guardando...") : title}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
