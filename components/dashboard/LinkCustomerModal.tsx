"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface LinkCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLink: (payload: { wooUserId: number; tangoCode: string; }) => void;
  isPending: boolean
  isSuccess: boolean
  error: Error | null
}

export function LinkCustomerModal({
  open,
  onOpenChange,
  isSuccess,
  isPending,
  error,
  onLink
}: LinkCustomerModalProps) {
  const [wooUserId, setWooUserId] = useState("")
  const [tangoCode, setTangoCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onLink({
      wooUserId: Number(wooUserId),
      tangoCode
    })
  }

  const handleClose = () => {
    setWooUserId("")
    setTangoCode("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular cliente</DialogTitle>
          <DialogDescription>
            Ingresá el ID de usuario de WooCommerce y el código del cliente en
            Tango. El resto de los datos se obtienen automáticamente.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-4">
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Cliente vinculado correctamente</span>
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleClose}>Cerrar</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="wooUserId">ID de usuario en WooCommerce</Label>
                <Input
                  id="wooUserId"
                  type="number"
                  placeholder="Ej: 42"
                  value={wooUserId}
                  onChange={(e) => setWooUserId(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tangoCode">Código de cliente en Tango</Label>
                <Input
                  id="tangoCode"
                  type="text"
                  placeholder="Ej: 000707"
                  value={tangoCode}
                  onChange={(e) => setTangoCode(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error.message || "Error al vincular el cliente"}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-accent hover:bg-accent/90"
              >
                {isPending ? "Vinculando..." : "Vincular"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
