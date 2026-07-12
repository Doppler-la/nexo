# Diseño: pantalla de detalle de cliente (productos, stock, customers, pedidos, sync log)

## Contexto

El backend (`TAN-WC-MIDDLE`) ya implementó 5 endpoints nuevos, documentados en
[`2026-07-12-frontend-admin-client-detail-handoff.md`](../../../2026-07-12-frontend-admin-client-detail-handoff.md):

- `GET /api/admin/clients/:slug/products`
- `GET /api/admin/clients/:slug/stock`
- `GET /api/admin/clients/:slug/customers`
- `GET /api/admin/clients/:slug/orders`
- `GET /api/admin/clients/:slug/sync-log`

Los 5 comparten forma: paginación por `limit`/`offset` (query params opcionales,
clampeados server-side) y respuesta `{ total, limit, offset, items }`. Mismo
auth que el resto de `/api/admin/*` (JWT admin) y mismo error 404
`client_not_found` si el slug no existe.

Hoy, `app/admin/clients/[slug]/page.tsx` solo muestra un Card con el form de
edición del cliente (`ClientForm` + `ClientCreatedPanel`). No hay tabs, tablas
ni paginación en ninguna pantalla del panel admin. Este diseño agrega esa
visibilidad sin tocar el backend.

## Alcance

- Consumir los 5 endpoints nuevos desde el frontend.
- Agregar una navegación por tabs a nivel de página en el detalle de cliente:
  **Configuración** (lo que ya existe, sin cambios) + **Productos / Stock /
  Customers / Pedidos / Sync log**.
- Paginación numerada (usando el componente `Pagination` de shadcn, ya
  presente y sin usar en el repo).
- Modal con JSON formateado para inspeccionar `rawWooPayload` /
  `rawTangoPayload` / `errorMessage` de un pedido.
- Sin búsqueda ni filtros (el backend no los expone todavía).
- Sin estado de tab/página en la URL (estado local por tab, vía `useState`).

Fuera de alcance: cualquier cambio en el backend, filtros de búsqueda,
exportar datos, editar/eliminar desde estas tablas (son de solo lectura).

## Tipos

Nuevo archivo `src/types/clientDetail.type.ts`:

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
  | "pending"
  | "sending"
  | "sent"
  | "processed"
  | "observed"
  | "rejected"
  | "error"

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
  type: "full" | "incremental" | "webhook"
  resource: "products" | "prices" | "stock" | "customers" | null
  status: "running" | "success" | "error"
  recordsProcessed: number
  errorMessage: string | null
  startedAt: string
  finishedAt: string | null
}
```

## Capa de datos

**Repository** — nuevo archivo `src/repositories/adminClientDetailRepository.ts`
(se mantiene separado de `adminClientsRepository.ts`, que sigue enfocado en
CRUD de clientes). Cinco funciones async con la misma firma:

```ts
type PageParams = { limit?: number; offset?: number }

export const adminClientDetailRepository = {
  getProducts: (slug: string, params?: PageParams) =>
    httpClient.get<PaginatedResponse<ProductItem>>(`/api/admin/clients/${slug}/products`, { params }),
  getStock: (slug: string, params?: PageParams) => ...,
  getCustomers: (slug: string, params?: PageParams) => ...,
  getOrders: (slug: string, params?: PageParams) => ...,
  getSyncLog: (slug: string, params?: PageParams) => ...,
}
```

Cada función devuelve `data` del response de axios (mismo patrón que
`adminClientsRepository.ts`).

**Hooks** — nuevo archivo `src/hooks/useClientDetail.ts`. Un hook de
TanStack Query por recurso, mismo patrón que `useAdminClients.ts`:

```ts
const QUERY_KEY = ['admin-clients']

export function useClientProducts(slug: string, params: { limit: number; offset: number }) {
  return useQuery({
    queryKey: [...QUERY_KEY, slug, 'products', params],
    queryFn: () => adminClientDetailRepository.getProducts(slug, params),
  })
}
// idem useClientStock, useClientCustomers, useClientOrders, useClientSyncLog
```

Sin `staleTime` custom (se hereda el default global de `QueryProvider`). Al
incluir `params` en la query key, cambiar de página dispara un nuevo fetch y
React Query cachea cada página independientemente (volver a una página ya
vista no re-fetchea).

## Componentes UI

`app/admin/clients/[slug]/page.tsx` se reestructura para envolver el
contenido en un `Tabs` con 6 tabs: **Configuración** (contenido actual, sin
cambios) + **Productos / Stock / Customers / Pedidos / Sync log**.

**`components/admin/PaginatedDataTable.tsx`** (nuevo, genérico, reutilizado
por las 5 tabs): recibe `columns`, `data`, `total`, `page`, `onPageChange`,
`isLoading`, `emptyMessage`. Renderiza `Table` + `Pagination` de shadcn.
Tamaño de página fijo en 50 (el default del backend) — no hay selector de
page size.

Cinco componentes de tab, uno por recurso (`ProductsTab.tsx`, `StockTab.tsx`,
`CustomersTab.tsx`, `OrdersTab.tsx`, `SyncLogTab.tsx`), cada uno:
- mantiene su propia página en `useState` (no compartida entre tabs, no
  reseteada al cambiar de tab),
- llama a su hook correspondiente,
- define sus columnas específicas,
- usa `PaginatedDataTable` para el render.

**Badges de status**: `Badge` variant `destructive` para `error` /
`rejected` / `observed` (Pedidos) y `error` (Sync log); variant default para
el resto.

**`components/admin/JsonViewDialog.tsx`** (nuevo, genérico): recibe `title` y
un `object`, renderiza un `Dialog` con el JSON pretty-printed
(`JSON.stringify(obj, null, 2)` en un `<pre>`). Usado solo en `OrdersTab`: un
botón "Ver detalle" por fila abre el modal mostrando `rawWooPayload`,
`rawTangoPayload` y `errorMessage` juntos. No se usa en Sync log — su
`errorMessage` ya es una columna visible y no amerita modal.

## Manejo de errores y estados

- **Loading**: texto "Cargando..." centrado en la tabla mientras
  `isLoading` (sin skeleton, no hay ese patrón en el repo hoy).
- **Vacío**: fila única con `emptyMessage` (ej. "No hay productos para este
  cliente") cuando `items.length === 0`.
- **Error de fetch**: mensaje "Error al cargar {recurso}" arriba de la
  tabla; sin retry UI custom (el retry de React Query ya es 3 por default
  global).
- **404 `client_not_found`**: no debería ocurrir en la práctica (ya estamos
  parados en un cliente cargado por `useAdminClient`), pero de darse, mismo
  mensaje de error genérico.
- Cada tab hace su propio fetch solo cuando está activa/montada; React Query
  cachea por query key así que volver a una tab ya visitada no siempre
  re-fetchea.

## Testing / verificación

No hay test runner configurado en el proyecto. Verificación manual: `npm run
dev`, entrar a un cliente existente, click en cada una de las 5 tabs nuevas,
confirmar datos reales del middleware, probar paginación numerada (si hay
más de 50 registros), y abrir el modal de un pedido con `status: "error"` u
similar para confirmar que se ve el JSON completo.
