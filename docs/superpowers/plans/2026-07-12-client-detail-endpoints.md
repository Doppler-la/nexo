# Client Detail Endpoints Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consume the 5 new admin endpoints (`products`, `stock`, `customers`, `orders`, `sync-log`) and expose them as tabs on the existing client detail page (`app/admin/clients/[slug]/page.tsx`), each rendering a numbered-paginated table.

**Architecture:** Follows the existing layered pattern: `component → src/hooks (TanStack Query) → src/repositories (httpClient) → external middleware API`. One new repository file, one new hooks file, one new types file, one generic paginated-table component reused by 5 small per-resource tab components, and one JSON-view modal for order payload debugging. The existing client detail page is restructured to wrap its current content (the edit form) in a `Tabs` alongside the 5 new tabs.

**Tech Stack:** Next.js App Router, TypeScript, TanStack Query v5, axios (via `lib/httpClient.ts`), shadcn/ui (`Tabs`, `Table`, `Pagination`, `Dialog`, `Badge` — all already installed, none used elsewhere yet).

## Global Constraints

- UI text and comments in Spanish (es-AR), matching the rest of the codebase.
- Path alias `@/*` maps to repo root; use it in all new files (`@/lib/...`, `@/src/...`, `@/components/...`).
- No test runner configured in this repo — verification per task is `npx tsc --noEmit` (type check) and `npm run lint`, with a final manual browser smoke test against the real middleware.
- Page size is fixed at 50 (the backend default) — no page-size selector.
- All 5 endpoints return `{ total, limit, offset, items }` and take optional `limit`/`offset` query params — see `2026-07-12-frontend-admin-client-detail-handoff.md` for exact shapes.
- Design spec: `docs/superpowers/specs/2026-07-12-client-detail-endpoints-design.md`.

---

### Task 1: Types for the 5 resources + generic paginated envelope

**Files:**
- Create: `src/types/clientDetail.type.ts`

**Interfaces:**
- Produces: `PaginatedResponse<T>`, `ProductItem`, `StockItem`, `CustomerItem`, `OrderItem`, `OrderStatus`, `SyncLogItem` — used by every later task.

- [ ] **Step 1: Write the types file**

```ts
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors (this file has no external dependencies, so it can't fail beyond a syntax typo).

- [ ] **Step 3: Commit**

```bash
git add src/types/clientDetail.type.ts
git commit -m "feat: add types for client detail endpoints"
```

---

### Task 2: Shared date formatting helper

**Files:**
- Create: `lib/formatDate.ts`

**Interfaces:**
- Produces: `formatDateTime(value: string | null): string` — used by all 5 tab components (Task 7-11) to render `syncedAt`, `lastUpdated`, `createdAt`, `updatedAt`, `startedAt`, `finishedAt` columns consistently.

- [ ] **Step 1: Write the helper**

```ts
export function formatDateTime(value: string | null): string {
  if (!value) return '-'

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/formatDate.ts
git commit -m "feat: add shared date formatting helper"
```

---

### Task 3: Repository for the 5 endpoints

**Files:**
- Create: `src/repositories/adminClientDetailRepository.ts`

**Interfaces:**
- Consumes: `httpClient` from `@/lib/httpClient` (existing, unchanged); `PaginatedResponse`, `ProductItem`, `StockItem`, `CustomerItem`, `OrderItem`, `SyncLogItem` from Task 1.
- Produces: `adminClientDetailRepository` object with `getProducts`, `getStock`, `getCustomers`, `getOrders`, `getSyncLog`, each `(slug: string, params?: { limit?: number; offset?: number }) => Promise<PaginatedResponse<T>>` — used by Task 4's hooks.

- [ ] **Step 1: Write the repository**

```ts
import { httpClient } from '@/lib/httpClient'
import {
  PaginatedResponse,
  ProductItem,
  StockItem,
  CustomerItem,
  OrderItem,
  SyncLogItem,
} from '../types/clientDetail.type'

type PageParams = { limit?: number; offset?: number }

export const adminClientDetailRepository = {
  getProducts: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<ProductItem>>(
      `/api/admin/clients/${slug}/products`,
      { params },
    )
    return data
  },

  getStock: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<StockItem>>(
      `/api/admin/clients/${slug}/stock`,
      { params },
    )
    return data
  },

  getCustomers: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<CustomerItem>>(
      `/api/admin/clients/${slug}/customers`,
      { params },
    )
    return data
  },

  getOrders: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<OrderItem>>(
      `/api/admin/clients/${slug}/orders`,
      { params },
    )
    return data
  },

  getSyncLog: async (slug: string, params?: PageParams) => {
    const { data } = await httpClient.get<PaginatedResponse<SyncLogItem>>(
      `/api/admin/clients/${slug}/sync-log`,
      { params },
    )
    return data
  },
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/repositories/adminClientDetailRepository.ts
git commit -m "feat: add repository for client detail endpoints"
```

---

### Task 4: TanStack Query hooks for the 5 endpoints

**Files:**
- Create: `src/hooks/useClientDetail.ts`

**Interfaces:**
- Consumes: `adminClientDetailRepository` from Task 3.
- Produces: `useClientProducts(slug, { limit, offset })`, `useClientStock(...)`, `useClientCustomers(...)`, `useClientOrders(...)`, `useClientSyncLog(...)` — each returns the standard TanStack Query result (`data`, `isLoading`, `isError`) with `data` typed as `PaginatedResponse<T>`. Used by Tasks 7-11.

- [ ] **Step 1: Write the hooks**

```ts
import { useQuery } from '@tanstack/react-query'
import { adminClientDetailRepository } from '../repositories/adminClientDetailRepository'

const QUERY_KEY = ['admin-clients']

type PageParams = { limit: number; offset: number }

export function useClientProducts(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'products', params],
    queryFn:  () => adminClientDetailRepository.getProducts(slug, params),
    enabled:  !!slug,
  })
}

export function useClientStock(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'stock', params],
    queryFn:  () => adminClientDetailRepository.getStock(slug, params),
    enabled:  !!slug,
  })
}

export function useClientCustomers(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'customers', params],
    queryFn:  () => adminClientDetailRepository.getCustomers(slug, params),
    enabled:  !!slug,
  })
}

export function useClientOrders(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'orders', params],
    queryFn:  () => adminClientDetailRepository.getOrders(slug, params),
    enabled:  !!slug,
  })
}

export function useClientSyncLog(slug: string, params: PageParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'sync-log', params],
    queryFn:  () => adminClientDetailRepository.getSyncLog(slug, params),
    enabled:  !!slug,
  })
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useClientDetail.ts
git commit -m "feat: add hooks for client detail endpoints"
```

---

### Task 5: Generic paginated data table component

**Files:**
- Create: `components/admin/PaginatedDataTable.tsx`

**Interfaces:**
- Consumes: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` from `@/components/ui/table`; `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext` from `@/components/ui/pagination`.
- Produces: `PaginatedDataTable<T>` component with props `{ columns: { header: string; cell: (item: T) => React.ReactNode }[]; items: T[]; total: number; page: number; onPageChange: (page: number) => void; isLoading: boolean; isError: boolean; emptyMessage: string; errorMessage: string; getRowKey: (item: T) => string | number }` and exported constant `PAGE_SIZE = 50` — used by Tasks 7-11.

- [ ] **Step 1: Write the component**

```tsx
'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'

export const PAGE_SIZE = 50

type Column<T> = {
  header: string
  cell: (item: T) => React.ReactNode
}

interface PaginatedDataTableProps<T> {
  columns: Column<T>[]
  items: T[]
  total: number
  page: number
  onPageChange: (page: number) => void
  isLoading: boolean
  isError: boolean
  emptyMessage: string
  errorMessage: string
  getRowKey: (item: T) => string | number
}

export function PaginatedDataTable<T>({
  columns,
  items,
  total,
  page,
  onPageChange,
  isLoading,
  isError,
  emptyMessage,
  errorMessage,
  getRowKey,
}: PaginatedDataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  if (isError) {
    return <p className="text-sm text-destructive py-4 text-center">{errorMessage}</p>
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.header}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                Cargando...
              </TableCell>
            </TableRow>
          )}
          {!isLoading && items.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            items.map((item) => (
              <TableRow key={getRowKey(item)}>
                {columns.map((column) => (
                  <TableCell key={column.header}>{column.cell(item)}</TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (page > 1) onPageChange(page - 1)
                }}
                className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive onClick={(event) => event.preventDefault()}>
                {page} / {totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault()
                  if (page < totalPages) onPageChange(page + 1)
                }}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/PaginatedDataTable.tsx
git commit -m "feat: add generic paginated data table component"
```

---

### Task 6: JSON view dialog for order payloads

**Files:**
- Create: `components/admin/JsonViewDialog.tsx`

**Interfaces:**
- Consumes: `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` from `@/components/ui/dialog`.
- Produces: `JsonViewDialog` component with props `{ open: boolean; onOpenChange: (open: boolean) => void; title: string; data: unknown }` — used by Task 10 (`OrdersTab`).

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface JsonViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  data: unknown
}

export function JsonViewDialog({ open, onOpenChange, title, data }: JsonViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <pre className="text-xs bg-muted rounded-md p-4 overflow-x-auto whitespace-pre-wrap break-words">
          {JSON.stringify(data, null, 2)}
        </pre>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/JsonViewDialog.tsx
git commit -m "feat: add JSON view dialog for order payload debugging"
```

---

### Task 7: Products tab

**Files:**
- Create: `components/admin/ProductsTab.tsx`

**Interfaces:**
- Consumes: `useClientProducts` (Task 4), `PaginatedDataTable`, `PAGE_SIZE` (Task 5), `ProductItem` (Task 1), `formatDateTime` (Task 2).
- Produces: `ProductsTab` component with props `{ slug: string }` — used by Task 12 (page wiring).

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useState } from 'react'
import { useClientProducts } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { ProductItem } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

interface ProductsTabProps {
  slug: string
}

export function ProductsTab({ slug }: ProductsTabProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useClientProducts(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'SKU', cell: (item: ProductItem) => item.sku },
    { header: 'Descripción', cell: (item: ProductItem) => item.description ?? '-' },
    { header: 'Código alternativo', cell: (item: ProductItem) => item.alternativeCode ?? '-' },
    { header: 'Unidad', cell: (item: ProductItem) => item.measureUnitCode ?? '-' },
    { header: 'Estado', cell: (item: ProductItem) => (item.disabled ? 'Deshabilitado' : 'Activo') },
    { header: 'Actualizado en Tango', cell: (item: ProductItem) => formatDateTime(item.lastUpdated) },
    { header: 'Sincronizado', cell: (item: ProductItem) => formatDateTime(item.syncedAt) },
  ]

  return (
    <PaginatedDataTable
      columns={columns}
      items={data?.items ?? []}
      total={data?.total ?? 0}
      page={page}
      onPageChange={setPage}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No hay productos para este cliente."
      errorMessage="Error al cargar productos."
      getRowKey={(item) => item.sku}
    />
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/ProductsTab.tsx
git commit -m "feat: add products tab to client detail"
```

---

### Task 8: Stock tab

**Files:**
- Create: `components/admin/StockTab.tsx`

**Interfaces:**
- Consumes: `useClientStock` (Task 4), `PaginatedDataTable`, `PAGE_SIZE` (Task 5), `StockItem` (Task 1), `formatDateTime` (Task 2).
- Produces: `StockTab` component with props `{ slug: string }` — used by Task 12.

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useState } from 'react'
import { useClientStock } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { StockItem } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

interface StockTabProps {
  slug: string
}

export function StockTab({ slug }: StockTabProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useClientStock(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'SKU', cell: (item: StockItem) => item.sku },
    { header: 'Depósito', cell: (item: StockItem) => item.warehouseCode },
    { header: 'Disponible', cell: (item: StockItem) => item.available },
    { header: 'Sincronizado', cell: (item: StockItem) => formatDateTime(item.syncedAt) },
  ]

  return (
    <PaginatedDataTable
      columns={columns}
      items={data?.items ?? []}
      total={data?.total ?? 0}
      page={page}
      onPageChange={setPage}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No hay stock cargado para este cliente."
      errorMessage="Error al cargar el stock."
      getRowKey={(item) => `${item.sku}-${item.warehouseCode}`}
    />
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/StockTab.tsx
git commit -m "feat: add stock tab to client detail"
```

---

### Task 9: Customers tab

**Files:**
- Create: `components/admin/CustomersTab.tsx`

**Interfaces:**
- Consumes: `useClientCustomers` (Task 4), `PaginatedDataTable`, `PAGE_SIZE` (Task 5), `CustomerItem` (Task 1), `formatDateTime` (Task 2).
- Produces: `CustomersTab` component with props `{ slug: string }` — used by Task 12.

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useState } from 'react'
import { useClientCustomers } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { CustomerItem } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

interface CustomersTabProps {
  slug: string
}

export function CustomersTab({ slug }: CustomersTabProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useClientCustomers(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'Usuario Woo', cell: (item: CustomerItem) => item.wooUserId },
    { header: 'Código Tango', cell: (item: CustomerItem) => item.tangoCode ?? '-' },
    { header: 'Documento', cell: (item: CustomerItem) => item.documentNumber ?? '-' },
    { header: 'IVA', cell: (item: CustomerItem) => item.ivaCategory ?? '-' },
    { header: 'Lista de precios', cell: (item: CustomerItem) => item.priceListNumber ?? '-' },
    { header: 'Vinculado', cell: (item: CustomerItem) => formatDateTime(item.createdAt) },
  ]

  return (
    <PaginatedDataTable
      columns={columns}
      items={data?.items ?? []}
      total={data?.total ?? 0}
      page={page}
      onPageChange={setPage}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No hay clientes de WooCommerce vinculados."
      errorMessage="Error al cargar los clientes vinculados."
      getRowKey={(item) => item.id}
    />
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/CustomersTab.tsx
git commit -m "feat: add customers tab to client detail"
```

---

### Task 10: Orders tab (with JSON view modal)

**Files:**
- Create: `components/admin/OrdersTab.tsx`

**Interfaces:**
- Consumes: `useClientOrders` (Task 4), `PaginatedDataTable`, `PAGE_SIZE` (Task 5), `JsonViewDialog` (Task 6), `OrderItem`, `OrderStatus` (Task 1), `formatDateTime` (Task 2), `Badge` from `@/components/ui/badge`, `Button` from `@/components/ui/button`.
- Produces: `OrdersTab` component with props `{ slug: string }` — used by Task 12.

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useState } from 'react'
import { useClientOrders } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { JsonViewDialog } from '@/components/admin/JsonViewDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { OrderItem, OrderStatus } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

const ERROR_STATUSES: OrderStatus[] = ['error', 'rejected', 'observed']

interface OrdersTabProps {
  slug: string
}

export function OrdersTab({ slug }: OrdersTabProps) {
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
  const { data, isLoading, isError } = useClientOrders(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'Pedido Woo', cell: (item: OrderItem) => item.wooOrderId },
    { header: 'Pedido Tango', cell: (item: OrderItem) => item.tangoOrderId ?? '-' },
    {
      header: 'Estado',
      cell: (item: OrderItem) => (
        <Badge variant={ERROR_STATUSES.includes(item.status) ? 'destructive' : 'default'}>
          {item.status}
        </Badge>
      ),
    },
    { header: 'Creado', cell: (item: OrderItem) => formatDateTime(item.createdAt) },
    { header: 'Sincronizado', cell: (item: OrderItem) => formatDateTime(item.syncedAt) },
    {
      header: '',
      cell: (item: OrderItem) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(item)}>
          Ver detalle
        </Button>
      ),
    },
  ]

  return (
    <>
      <PaginatedDataTable
        columns={columns}
        items={data?.items ?? []}
        total={data?.total ?? 0}
        page={page}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No hay pedidos para este cliente."
        errorMessage="Error al cargar pedidos."
        getRowKey={(item) => item.id}
      />
      <JsonViewDialog
        open={selectedOrder !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null)
        }}
        title={selectedOrder ? `Pedido ${selectedOrder.wooOrderId}` : ''}
        data={
          selectedOrder
            ? {
                errorMessage: selectedOrder.errorMessage,
                rawWooPayload: selectedOrder.rawWooPayload,
                rawTangoPayload: selectedOrder.rawTangoPayload,
              }
            : {}
        }
      />
    </>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/OrdersTab.tsx
git commit -m "feat: add orders tab with JSON payload viewer to client detail"
```

---

### Task 11: Sync log tab

**Files:**
- Create: `components/admin/SyncLogTab.tsx`

**Interfaces:**
- Consumes: `useClientSyncLog` (Task 4), `PaginatedDataTable`, `PAGE_SIZE` (Task 5), `SyncLogItem` (Task 1), `formatDateTime` (Task 2), `Badge` from `@/components/ui/badge`.
- Produces: `SyncLogTab` component with props `{ slug: string }` — used by Task 12.

- [ ] **Step 1: Write the component**

```tsx
'use client'

import { useState } from 'react'
import { useClientSyncLog } from '@/src/hooks/useClientDetail'
import { PaginatedDataTable, PAGE_SIZE } from '@/components/admin/PaginatedDataTable'
import { Badge } from '@/components/ui/badge'
import { SyncLogItem } from '@/src/types/clientDetail.type'
import { formatDateTime } from '@/lib/formatDate'

interface SyncLogTabProps {
  slug: string
}

export function SyncLogTab({ slug }: SyncLogTabProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useClientSyncLog(slug, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const columns = [
    { header: 'Tipo', cell: (item: SyncLogItem) => item.type },
    { header: 'Recurso', cell: (item: SyncLogItem) => item.resource ?? '-' },
    {
      header: 'Estado',
      cell: (item: SyncLogItem) => (
        <Badge variant={item.status === 'error' ? 'destructive' : 'default'}>{item.status}</Badge>
      ),
    },
    { header: 'Registros', cell: (item: SyncLogItem) => item.recordsProcessed },
    { header: 'Error', cell: (item: SyncLogItem) => item.errorMessage ?? '-' },
    { header: 'Inicio', cell: (item: SyncLogItem) => formatDateTime(item.startedAt) },
    { header: 'Fin', cell: (item: SyncLogItem) => formatDateTime(item.finishedAt) },
  ]

  return (
    <PaginatedDataTable
      columns={columns}
      items={data?.items ?? []}
      total={data?.total ?? 0}
      page={page}
      onPageChange={setPage}
      isLoading={isLoading}
      isError={isError}
      emptyMessage="No hay corridas de sincronización para este cliente."
      errorMessage="Error al cargar el historial de sincronización."
      getRowKey={(item) => item.id}
    />
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/admin/SyncLogTab.tsx
git commit -m "feat: add sync log tab to client detail"
```

---

### Task 12: Wire tabs into the client detail page

**Files:**
- Modify: `app/admin/clients/[slug]/page.tsx` (full file, replacing lines 1-57)

**Interfaces:**
- Consumes: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`; `ProductsTab` (Task 7), `StockTab` (Task 8), `CustomersTab` (Task 9), `OrdersTab` (Task 10), `SyncLogTab` (Task 11).

- [ ] **Step 1: Rewrite the page**

```tsx
"use client"

import { use } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { ClientForm } from "@/components/admin/ClientForm"
import { ClientCreatedPanel } from "@/components/admin/ClientCreatedPanel"
import { ProductsTab } from "@/components/admin/ProductsTab"
import { StockTab } from "@/components/admin/StockTab"
import { CustomersTab } from "@/components/admin/CustomersTab"
import { OrdersTab } from "@/components/admin/OrdersTab"
import { SyncLogTab } from "@/components/admin/SyncLogTab"
import { useAdminClient, useUpdateClient } from "@/src/hooks/useAdminClients"
import { UpdateClientPayload } from "@/src/types/client.type"

export default function ClientDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: setup, isLoading, isError } = useAdminClient(slug)
  const { mutate: updateClient, isPending, error } = useUpdateClient(slug)

  const handleSubmit = (payload: UpdateClientPayload) => {
    updateClient(payload)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Volver al listado
      </Link>

      {isLoading && <p className="text-sm text-muted-foreground py-4 text-center">Cargando cliente...</p>}
      {isError && <p className="text-sm text-destructive py-4 text-center">No se encontró el cliente.</p>}

      {setup && (
        <Tabs defaultValue="config">
          <TabsList>
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="sync-log">Sync log</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <div className="max-w-3xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{setup.client.name}</CardTitle>
                  <CardDescription>Slug: {setup.client.slug} (no editable)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ClientForm
                    mode="edit"
                    initialValues={setup.client}
                    onSubmit={(payload) => handleSubmit(payload as UpdateClientPayload)}
                    isPending={isPending}
                    error={error}
                  />
                </CardContent>
              </Card>

              <div>
                <h2 className="text-lg font-semibold mb-3">Snippet y webhook</h2>
                <ClientCreatedPanel setup={setup} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <ProductsTab slug={slug} />
          </TabsContent>
          <TabsContent value="stock">
            <StockTab slug={slug} />
          </TabsContent>
          <TabsContent value="customers">
            <CustomersTab slug={slug} />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab slug={slug} />
          </TabsContent>
          <TabsContent value="sync-log">
            <SyncLogTab slug={slug} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual smoke test**

Run: `npm run dev`, then in the browser:
1. Log in and open `/admin`, click into an existing client.
2. Confirm the "Configuración" tab shows the same edit form as before (no regression).
3. Click each of Productos / Stock / Customers / Pedidos / Sync log — confirm real data loads from the middleware for each.
4. If any resource has more than 50 rows, click "Next" in its pagination and confirm the second page loads different rows, then "Previous" to go back.
5. In Pedidos, click "Ver detalle" on a row (ideally one with `status: "error"` or `"rejected"`) and confirm the modal shows `errorMessage`, `rawWooPayload`, and `rawTangoPayload` as formatted JSON, and closes via the X button or clicking outside.
6. Confirm error/observed/rejected order statuses and error sync-log statuses render as a red (`destructive`) badge.

Expected: all tabs load real data, pagination moves between pages correctly, the JSON modal opens/closes correctly, and no console errors appear.

- [ ] **Step 4: Commit**

```bash
git add "app/admin/clients/[slug]/page.tsx"
git commit -m "feat: wire products/stock/customers/orders/sync-log tabs into client detail page"
```
