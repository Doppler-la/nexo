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
  onSuccess: (customer: LinkedCustomerResult) => void
}

interface LinkedCustomerResult {
  wooUserId: number
  tangoCode: string
  priceList: string
  seller: string
  transport: string
  paymentCondition: string
}

export function LinkCustomerModal({
  open,
  onOpenChange,
  onSuccess,
}: LinkCustomerModalProps) {
  const [wooUserId, setWooUserId] = useState("")
  const [tangoCode, setTangoCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<LinkedCustomerResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(null)

    try {
      const middlewareUrl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL
      const apiKey = process.env.NEXT_PUBLIC_API_KEY

      const res = await fetch(`${middlewareUrl}/api/customers/link`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey || "",
        },
        body: JSON.stringify({
          wooUserId: parseInt(wooUserId),
          tangoCode,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Error al vincular cliente")
      }

      const result: LinkedCustomerResult = {
        wooUserId: parseInt(wooUserId),
        tangoCode,
        priceList: data.priceList || "Lista estándar",
        seller: data.seller || "Vendedor 1",
        transport: data.transport || "Transporte general",
        paymentCondition: data.paymentCondition || "Contado",
      }

      setSuccess(result)
      onSuccess(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al vincular cliente")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setWooUserId("")
    setTangoCode("")
    setError("")
    setSuccess(null)
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

        {success ? (
          <div className="py-4">
            <div className="flex items-center gap-2 text-green-600 mb-4">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Cliente vinculado correctamente</span>
            </div>
            <div className="space-y-2 text-sm bg-muted p-4 rounded-lg">
              <p>
                <span className="text-muted-foreground">Lista de precios:</span>{" "}
                {success.priceList}
              </p>
              <p>
                <span className="text-muted-foreground">Vendedor:</span>{" "}
                {success.seller}
              </p>
              <p>
                <span className="text-muted-foreground">Transporte:</span>{" "}
                {success.transport}
              </p>
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
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-accent hover:bg-accent/90"
              >
                {loading ? "Vinculando..." : "Vincular"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
