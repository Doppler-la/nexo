export type PaginatedResponse<T> = {
  total: number
  limit: number
  offset: number
  items: T[]
}

export type ProductItem = {
  clientId: number
  sku: string
  description: string | null
  additionalDescription: string | null
  alternativeCode: string | null
  barCode: string | null
  measureUnitCode: string | null
  salesMeasureUnitCode: string | null
  salesEquivalence: string
  disabled: boolean
  isKit: boolean
  lastUpdated: string | null
  syncedAt: string
}

export type StockItem = {
  clientId: number
  sku: string
  warehouseCode: string
  available: string
  syncedAt: string
}

export type CustomerItem = {
  id: number
  clientId: number
  wooUserId: number
  tangoCode: string | null
  tangoCustomerId: string | null
  documentType: string | null
  documentNumber: string | null
  ivaCategory: string | null
  priceListNumber: number | null
  saleConditionCode: string | null
  discountPercentage: string
  sellerCode: string | null
  transportCode: string | null
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | 'pending'
  | 'sending'
  | 'sent'
  | 'processed'
  | 'observed'
  | 'rejected'
  | 'error'

export type OrderItem = {
  id: number
  clientId: number
  wooOrderId: string
  tangoOrderId: string | null
  wooUserId: number | null
  status: OrderStatus
  rawWooPayload: object | null
  rawTangoPayload: object | null
  errorMessage: string | null
  createdAt: string
  syncedAt: string | null
}

export type SyncLogItem = {
  id: number
  clientId: number
  type: 'full' | 'incremental' | 'webhook'
  resource: 'products' | 'prices' | 'stock' | 'customers' | null
  status: 'running' | 'success' | 'error'
  recordsProcessed: number
  errorMessage: string | null
  startedAt: string
  finishedAt: string | null
}
