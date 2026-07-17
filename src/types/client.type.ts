export interface Client {
  id: number
  slug: string
  name: string
  active: boolean
  tangoAccessToken: string
  tangoApiUrl: string
  wcWebhookSecret: string
  middlewareApiKey: string
  depositoId: string | null
  talonario: string | null
  sellerCodeDefault: string | null
  transportCodeDefault: string | null
  shippingSku: string | null
  notes: string | null
  createdAt: string
}

export interface ClientWithSetup {
  client: Client
  phpSnippet: string
  wooWebhookUrl: string
  wooWebhookSecret: string
  instructions: string
}

export interface ClientsResponse {
  clients: Client[]
}

export interface CreateClientPayload {
  slug: string
  name: string
  userEmail: string
  userPassword: string
  tangoAccessToken: string
  tangoApiUrl?: string
  depositoId?: string | null
  talonario?: string | null
  sellerCodeDefault?: string | null
  transportCodeDefault?: string | null
  shippingSku?: string | null
  notes?: string | null
}

export type UpdateClientPayload = Partial<Omit<CreateClientPayload, 'slug'>> & {
  active?: boolean
}
