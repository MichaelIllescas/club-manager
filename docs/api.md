# API REST

Todas las rutas, salvo `/auth/login` y `/auth/logout`, requieren la cookie de sesión `authToken`. Sin sesión válida, el backend responde `401`; sin el rol necesario, `403`. La documentación interactiva completa está en `/swagger-ui` con el backend en ejecución.

Los errores tienen siempre la forma `{"error": "mensaje"}`. Los mensajes están en castellano porque se muestran tal cual al usuario.

## Autenticación (`/auth`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Inicia sesión y devuelve la cookie |
| POST | `/auth/logout` | Cierra la sesión |
| POST | `/auth/register` | Registra un usuario (sólo `ADMIN`) |
| GET | `/auth/roles` | Lista los roles disponibles |

## Socios (`/api/members`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/members` | Crea un socio |
| GET | `/api/members` | Lista los socios |
| GET | `/api/members/{id}` | Obtiene un socio |
| PUT | `/api/members/{id}` | Actualiza un socio |
| PUT | `/api/members/{id}/deactivate` | Da de baja un socio |
| PUT | `/api/members/{id}/activate` | Rehabilita un socio |

## Jugadores (`/api/players`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/players` | Crea un jugador |
| GET | `/api/players` | Lista los jugadores |
| GET | `/api/players/{id}` | Obtiene un jugador |
| GET | `/api/players/category/{categoryId}` | Jugadores de una categoría |
| GET | `/api/players/statuses` | Jugadores con su estado |
| PUT | `/api/players/{id}` | Actualiza un jugador |
| PUT | `/api/players/{id}/deactivate` | Da de baja un jugador |
| PUT | `/api/players/{id}/activate` | Rehabilita un jugador |
| DELETE | `/api/players/{id}` | Registra la fecha de baja del jugador |

## Categorías (`/api/categories`) y cuotas (`/api/fees`)

Ambos recursos tienen el mismo conjunto de operaciones. Crear una categoría y crear, modificar o eliminar una cuota requiere rol `ADMIN`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/{recurso}` | Crea |
| GET | `/api/{recurso}` | Lista |
| GET | `/api/{recurso}/{id}` | Obtiene |
| PUT | `/api/{recurso}/{id}` | Actualiza |
| DELETE | `/api/{recurso}/{id}` | Elimina |

## Pagos (`/api/payments`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/payments` | Registra un pago |
| GET | `/api/payments/people` | Socios y jugadores activos a los que se puede cobrar |
| GET | `/api/payments/details` | Todos los pagos con sus datos completos |
| GET | `/api/payments/player/{playerId}` | Pagos de un jugador |
| GET | `/api/payments/member/{memberId}` | Pagos de un socio |
| GET | `/api/payments/by-dates?start=&end=` | Pagos de jugadores entre dos fechas |
| GET | `/api/payments/by-period?day=&month=&year=` | Pagos filtrados por día, mes o año |
| GET | `/api/payments/status?categoryId=&month=&year=` | Quién pagó y quién debe en una categoría y mes |
| DELETE | `/api/payments/{id}` | Elimina un pago |

## Recaudaciones y panel

Las recaudaciones son sólo para `ADMIN`.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/revenue/monthly?year=` | Recaudación de cada mes de un año |
| GET | `/api/revenue/quarterly?year=` | Recaudación por trimestre de un año |
| GET | `/api/dashboard` | Totales y datos del gráfico del panel de inicio |

## Usuarios (`/api/users`)

Sólo `ADMIN`, salvo `/me` y `/me/password`, disponibles para cualquier usuario logueado.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/users` | Crea un usuario |
| GET | `/api/users` | Lista los usuarios |
| GET | `/api/users/{id}` | Obtiene un usuario |
| GET | `/api/users/me` | Perfil del usuario actual |
| GET | `/api/users/statuses` | Usuarios con su estado |
| PUT | `/api/users/{id}` | Actualiza un usuario |
| PUT | `/api/users/{id}/deactivate` | Deshabilita un usuario |
| PUT | `/api/users/{id}/activate` | Habilita un usuario |
| PUT | `/api/users/me/password` | Cambia la contraseña propia |
| POST | `/api/users/{id}/reset-password` | Restablece la contraseña de un usuario |
| DELETE | `/api/users/{id}` | Elimina un usuario |
