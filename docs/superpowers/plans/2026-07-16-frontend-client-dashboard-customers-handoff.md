# Handoff: listado de customers propio para el dashboard de cliente + user en alta de cliente

Este doc es para la sesión de Claude Code que trabaja en el repo del **dashboard/frontend**. Describe dos cambios ya implementados en el backend (`TAN-WC-MIDDLE`):

1. Un endpoint nuevo, `GET /api/customers/mine`, para que un usuario logueado (role `client`) liste sus propios customers vinculados sin depender de una API key.
2. `POST /api/admin/clients` ahora también crea el user de dashboard del cliente en la misma llamada.

**Estado del backend:** implementado y mergeado a `main`. No hace falta tocar nada del backend, solo consumir/actualizar estos endpoints.

**Base URL:**
- Local: `http://localhost:3000`
- Producción: `https://tan-wc-middle-production.up.railway.app`

## 1. `GET /api/customers/mine` — customers vinculados del cliente logueado

### Por qué existe

Antes de esto, el dashboard estaba usando `GET /api/customers` (protegido por `X-API-Key`) para listar customers. Ese endpoint es **server-to-server para el snippet de WooCommerce**: resuelve el tenant por la API key fija que se manda en el header, no por el usuario logueado. Si el dashboard manda siempre la misma key hardcodeada, todos los usuarios ven los customers del mismo cliente (el dueño de esa key), sin importar con qué cuenta se loguearon.

`GET /api/customers/mine` resuelve el tenant desde el **JWT**, no desde una API key. Es el que el dashboard debería usar de acá en adelante para esta pantalla.

### Auth

JWT (dashboard), igual que el resto de rutas de dashboard:

```
Authorization: Bearer <token>
```

- Sin token → `401`.
- Usuario `role: "client"` → siempre ve los customers de su propio `clientId` (el del JWT), no hace falta mandar nada más.
- Usuario `role: "admin"` (super admin, sin `clientId`) → **tiene que mandar `?clientId=<id>`** en la query. Sin eso, `400 { "error": "missing_client_id", "message": "Especifica clientId en la query" }`.

### Response (200)

```ts
{
  customers: Array<{
    id: number
    clientId: number
    wooUserId: number
    tangoCode: string | null
    tangoCustomerId: string | null
    documentType: string | null       // 80=CUIT, 96=DNI, etc.
    documentNumber: string | null
    ivaCategory: string | null        // RI, CF, RS, etc.
    priceListNumber: number | null
    saleConditionCode: string | null  // contado vs cuenta corriente
    discountPercentage: string        // decimal como string
    sellerCode: string | null
    transportCode: string | null
    createdAt: string
    updatedAt: string
  }>
}
```

Sin paginación por ahora (a diferencia de los endpoints `/api/admin/clients/:slug/*` que sí paginan) — devuelve todos los customers del cliente en una sola respuesta. Si el volumen lo justifica, avisar para agregar `limit`/`offset`.

### Migración sugerida

Reemplazar en el frontend cualquier llamada a `GET /api/customers` con `X-API-Key` (para esta pantalla del dashboard) por `GET /api/customers/mine` con `Authorization: Bearer <token>`. El endpoint viejo (`GET /api/customers`, con API key) sigue existiendo tal cual — lo sigue usando el snippet de WooCommerce, no tocar eso.

Para borrar un vínculo ya existe `DELETE /api/customers/:wooUserId` (mismo JWT, mismo criterio de scoping: `client` usa su propio `clientId`, `admin` manda `?clientId=`) — no cambió.

## 2. `POST /api/admin/clients` — ahora crea también el user del cliente

### Qué cambió

El body ahora requiere dos campos nuevos, obligatorios:

```ts
{
  slug: string
  name: string
  userEmail: string      // NUEVO, requerido
  userPassword: string   // NUEVO, requerido, minimo 8 caracteres
  tangoAccessToken: string
  // ...el resto de campos sigue igual (tangoApiUrl, depositoId, talonario, etc.)
}
```

Internamente crea el `client` y su `user` de dashboard (`role: "client"`, vinculado por `clientId`) en una transacción — si falla cualquiera de los dos, no se crea ninguno.

### Errores nuevos

- `409 { "error": "email_taken", "message": "El email \"<email>\" ya esta en uso" }` si `userEmail` ya existe en la tabla de users.
- `409 { "error": "slug_taken", ... }` (ya existía, sin cambios).
- Validación de schema: si falta `userEmail`/`userPassword`, o `userPassword` tiene menos de 8 caracteres, Fastify devuelve `400` de validación estándar antes de llegar al handler.

### Impacto en UI

El form de alta de cliente necesita dos campos nuevos: email y contraseña del user que va a loguearse en el dashboard como ese cliente. Con esas credenciales, el cliente ya puede loguearse en `POST /api/auth/login` y usar `GET /api/customers/mine` para gestionar sus propios customers — ese es el flujo completo que esto habilita (antes había que crear el user a mano en la DB).

La respuesta del endpoint (`buildOnboardingResponse`) no cambió — sigue sin devolver la contraseña en texto plano (obvio, va hasheada a la DB). Si la UI necesita mostrar/confirmar las credenciales después del alta, tiene que guardarlas del lado del form antes de enviarlas (ya las tiene, las mandó el propio admin).
