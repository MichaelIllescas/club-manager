# API REST

Todas las rutas, salvo las de `/auth`, requieren la cookie de sesión `authToken`. La documentación interactiva completa está en `/swagger-ui` con el backend en ejecución.

## Autenticación (`/auth`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Inicia sesión y devuelve la cookie |
| POST | `/auth/logout` | Cierra la sesión |
| POST | `/auth/registrarUsuario` | Registra un usuario |
| GET | `/auth/roles` | Lista los roles disponibles |

## Socios (`/api/socios`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/socios` | Crea un socio |
| GET | `/api/socios` | Lista los socios |
| GET | `/api/socios/{id}` | Obtiene un socio |
| PUT | `/api/socios/{id}` | Actualiza un socio |
| PUT | `/api/socios/{id}/anular` | Da de baja un socio |
| PUT | `/api/socios/{id}/habilitar` | Rehabilita un socio |

## Jugadores (`/api/jugadores`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/jugadores` | Crea un jugador |
| GET | `/api/jugadores` | Lista los jugadores |
| GET | `/api/jugadores/{id}` | Obtiene un jugador |
| GET | `/api/jugadores/categoria/{categoriaId}` | Jugadores de una categoría |
| GET | `/api/jugadores/estados` | Jugadores con su estado |
| PUT | `/api/jugadores/{id}` | Actualiza un jugador |
| PUT | `/api/jugadores/deshabilitar/{id}` | Da de baja un jugador |
| PUT | `/api/jugadores/habilitar/{id}` | Rehabilita un jugador |
| DELETE | `/api/jugadores/{id}` | Elimina un jugador |

## Categorías (`/api/categorias`) y cuotas (`/api/cuotas`)

Ambos recursos tienen el mismo conjunto de operaciones:

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/{recurso}` | Crea |
| GET | `/api/{recurso}` | Lista |
| GET | `/api/{recurso}/{id}` | Obtiene |
| PUT | `/api/{recurso}/{id}` | Actualiza |
| DELETE | `/api/{recurso}/{id}` | Elimina |

## Pagos (`/api/pagos`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/pagos` | Registra un pago |
| GET | `/api/pagos/listadoGeneral` | Socios y jugadores activos a los que se puede cobrar |
| GET | `/api/pagos/listadoGeneralPagos` | Todos los pagos con sus datos completos |
| GET | `/api/pagos/jugador/{jugadorId}` | Pagos de un jugador |
| GET | `/api/pagos/socio/{socioId}` | Pagos de un socio |
| GET | `/api/pagos/fechas` | Pagos de jugadores entre dos fechas |
| GET | `/api/pagos/por-periodo` | Pagos filtrados por día, mes o año |
| GET | `/api/pagos/estado-pagos` | Quién pagó y quién debe en una categoría y mes |
| DELETE | `/api/pagos/{id}` | Elimina un pago |

## Recaudaciones y panel

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/recaudaciones/mensuales` | Recaudación de cada mes de un año |
| GET | `/api/recaudaciones/trimestrales` | Recaudación por trimestre de un año |
| GET | `/api/dashboard` | Totales y datos del gráfico del panel de inicio |

## Usuarios (`/api/users`)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/users` | Crea un usuario |
| GET | `/api/users/getAllUsers` | Lista los usuarios |
| GET | `/api/users/{id}` | Obtiene un usuario |
| GET | `/api/users/perfil` | Perfil del usuario actual |
| GET | `/api/users/estados-usuarios` | Usuarios con su estado |
| PUT | `/api/users/{id}` | Actualiza un usuario |
| PUT | `/api/users/{id}/anular` | Deshabilita un usuario |
| PUT | `/api/users/{id}/habilitar` | Habilita un usuario |
| PUT | `/api/users/update-password` | Cambia la contraseña propia |
| POST | `/api/users/resetearClave/{id}` | Resetea la contraseña de un usuario |
| DELETE | `/api/users/{id}` | Elimina un usuario |
