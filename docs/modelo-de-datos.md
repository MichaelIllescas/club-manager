# Modelo de datos

Las tablas las genera Hibernate a partir de las entidades (`ddl-auto=update`).

## Diagrama

```
Category 1 ──── * Player 1 ──── * Payment * ──── 1 Member
                                    │
                           Fee 1 ───┤
                                    │
                          User 1 ───┘   (usuario que registró el pago)
```

Cada pago corresponde a un jugador o a un socio, siempre a una cuota y al usuario que lo cargó.

## Entidades

### Member: socio (`members`)

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| firstName, lastName | String | Obligatorios |
| dni | String | Único |
| memberNumber | String | Número de socio. Único, opcional |
| address, phone, email | String | Opcionales |
| registrationDate | LocalDate | Se asigna al crear |
| deactivationDate | LocalDate | |
| status | MemberStatus | `ACTIVE` o `INACTIVE` |

### Player: jugador (`players`)

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| firstName, lastName | String | Obligatorios |
| dni | String | Único |
| email | String | Único |
| phone | String | |
| category | Category | Categoría en la que juega |
| registrationDate | LocalDate | Se asigna al crear |
| deactivationDate | LocalDate | |
| status | PlayerStatus | `ACTIVE` o `INACTIVE`; empieza en `ACTIVE` |

### Category: categoría

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| name | String | Único, hasta 100 caracteres |
| description | String | |

### Fee: cuota

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| name | String | Nombre de la cuota |
| amount | Double | |
| registrationDate, lastUpdated | LocalDateTime | |

### Payment: pago (`payments`)

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| paymentDate | LocalDate | Fecha del pago |
| registrationDate | LocalDate | Fecha de carga en el sistema |
| amount | BigDecimal | |
| description | String | |
| fee | Fee | Obligatoria |
| player | Player | Si el pago es de un jugador |
| member | Member | Si el pago es de un socio |
| user | User | Quién registró el pago |

### User: usuario (`users`)

| Campo | Tipo | Notas |
|---|---|---|
| id | Long | Clave primaria |
| firstName, lastName | String | |
| dni, phone, address | String | |
| email | String | Se usa como nombre de usuario |
| password | String | Hash con BCrypt |
| enabled | boolean | Usuario habilitado |
| role | Role | `ADMIN` o `USER` |
