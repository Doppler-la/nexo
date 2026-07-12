"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"
import { ClientWithSetup } from "@/src/types/client.type"
import { SecretField } from "./SecretField"

interface ClientCreatedPanelProps {
  setup: ClientWithSetup
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
      {copied ? <Check className="mr-2 h-4 w-4 text-green-600" /> : <Copy className="mr-2 h-4 w-4" />}
      Copiar
    </Button>
  )
}

export function ClientCreatedPanel({ setup }: ClientCreatedPanelProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Snippet para functions.php</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <pre className="max-h-64 overflow-auto rounded-md bg-muted p-4 text-xs">
            <code>{setup.phpSnippet}</code>
          </pre>
          <CopyButton value={setup.phpSnippet} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook de WooCommerce</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">URL del webhook</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-md bg-muted px-3 py-2 text-sm">
                {setup.wooWebhookUrl}
              </code>
              <CopyButton value={setup.wooWebhookUrl} />
            </div>
          </div>
          <SecretField label="Secreto del webhook" value={setup.wooWebhookSecret} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Instrucciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{setup.instructions}</p>
        </CardContent>
      </Card>
    </div>
  )
}
