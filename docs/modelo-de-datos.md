# Modelo de datos

Las tablas las genera Hibernate a partir de las entidades (`ddl-auto=update`).

## Diagrama

```
Categoria 1 ──── * Jugador 1 ──── * Pago * ──── 1 Socio
                                    │
                         Cuota 1 ───┤
                                    │
                          User 1 ───┘   (usuario que registró el pago)
```

Cada pago corresponde a un jugador o a un socio, siempre a una cuota y al usuario que lo cargó.

## Entidades

### Socio (`socios`)

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| nombre, apellido | String | Obligatorios |
| dni | String | Único |
| numeroSocio | String | Único, opcional |
| direccion, telefono, email | String | Opcionales |
| fechaRegistro | LocalDate | Se asigna al crear |
| fechaBaja | LocalDate | |
| estado | Enum | `ACTIVO` o `ANULADO` |

### Jugador (`jugadores`)

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| nombre, apellido | String | Obligatorios |
| dni | String | Único |
| email | String | Único |
| telefono | String | |
| categoria | Categoria | Categoría a la que pertenece |
| fechaRegistro | LocalDate | Se asigna al crear |
| fechaBaja | LocalDate | |
| estado | EstadoJugador | `ACTIVO` o `ANULADO`; empieza en `ACTIVO` |

### Categoria

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| nombre | String | Único, hasta 100 caracteres |
| descripcion | String | |

### Cuota

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| tipo | String | Nombre de la cuota |
| monto | Double | |
| fechaRegistro, fechaUltimaActualizacion | LocalDateTime | |

### Pago (`pagos`)

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| fechaPago | LocalDate | Fecha del pago |
| fechaRegistro | LocalDate | Fecha de carga en el sistema |
| monto | BigDecimal | |
| descripcion | String | |
| cuota | Cuota | Obligatoria |
| jugador | Jugador | Si el pago es de un jugador |
| socio | Socio | Si el pago es de un socio |
| usuario | User | Quién registró el pago |

### User

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| firstName, lastName | String | |
| dni, telefono, direccion | String | |
| email | String | Se usa como nombre de usuario |
| password | String | Hash con BCrypt |
| enabled | boolean | Usuario habilitado |
| role | Role | `ADMIN` o `USER` |
