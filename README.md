# Club Manager

Sistema web para la administración de clubes deportivos: socios, jugadores por categoría, cuotas, pagos, recaudaciones y usuarios del sistema.

## Funcionalidades

**Socios**
- Alta, edición y listado de socios.
- Validación de DNI y número de socio duplicados.
- Baja y rehabilitación (anular y habilitar).

**Jugadores y categorías**
- Alta, edición y listado de jugadores, cada uno asignado a una categoría.
- Listado de jugadores por categoría.
- Baja y rehabilitación de jugadores.
- Alta, edición y baja de categorías.

**Cuotas y pagos**
- Definición de tipos de cuota con su monto.
- Registro de pagos de socios y de jugadores, con el usuario que lo registró.
- Comprobante de pago en PDF.
- Historial de pagos filtrado por día, mes o año, por categoría y por período.
- Estado de pagos de una categoría en un mes: quién pagó y quién debe.

**Recaudaciones y panel**
- Recaudación mensual de un año y por trimestre.
- Panel de inicio con cantidad de jugadores, socios, categorías activas, recaudación total y gráfico mensual.
- Exportación de tablas a Excel.

**Usuarios**
- Inicio de sesión con JWT guardado en una cookie.
- Roles `ADMIN` y `USER`.
- Alta, edición, baja y rehabilitación de usuarios, cambio y reseteo de contraseña.

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA, JJWT, SpringDoc (Swagger) |
| Frontend | React 18, Vite, React Router, React Bootstrap, Chart.js, React PDF, SheetJS |
| Base de datos | MySQL 8 |
| Tests | JUnit 5 y Mockito en el backend, Vitest y Testing Library en el frontend |

## Estructura

```
club-manager/
├── backend/     API REST (Spring Boot)
├── frontend/    aplicación web (React + Vite)
└── docs/        arquitectura, modelo de datos y API
```

## Documentación

- [Arquitectura](docs/arquitectura.md)
- [Modelo de datos](docs/modelo-de-datos.md)
- [API REST](docs/api.md)

## Ejecutar en local

### Backend

Requisitos: Java 17, Maven y MySQL 8.

Variables de entorno (ver `backend/.env.example`):

| Variable | Descripción |
|---|---|
| `DB_URL` | URL JDBC. Por defecto, la base `club_manager_db` en `localhost:3306` |
| `DB_USERNAME` | Usuario de MySQL. Por defecto `root` |
| `DB_PASSWORD` | Contraseña de MySQL |
| `JWT_SECRET` | Clave para firmar los tokens, en Base64, de al menos 256 bits |
| `COOKIE_DOMAIN` | Dominio de la cookie de sesión. Vacío en local |
| `COOKIE_SECURE` | `true` para exigir HTTPS. Por defecto `false` |
| `CORS_ALLOWED_ORIGINS` | Orígenes del frontend, separados por coma. Por defecto `http://localhost:3000` |

```bash
cd backend
mvn spring-boot:run
```

La API queda en `http://localhost:8080` y la documentación interactiva en `http://localhost:8080/swagger-ui`.

### Frontend

Requisitos: Node.js 18 o superior.

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:3000`. La URL de la API se toma de la variable `VITE_API_URL` (por defecto `http://localhost:8080`).

## Tests

```bash
cd backend && mvn test
cd frontend && npm test
```

El backend cubre las reglas de socios, jugadores, pagos, recaudaciones y la generación y validación de tokens. El frontend cubre el formato de moneda, la lectura de cookies y la tabla genérica (paginación, búsqueda y acciones).

## Primer acceso

Al arrancar por primera vez, el backend crea un usuario administrador `admin@admin.com` con contraseña `admin`. Conviene cambiarla después del primer ingreso.

## Licencia

Distribuido bajo licencia MIT. Ver [LICENSE](LICENSE).

## Autor

Jonathan Illescas · [GitHub](https://github.com/MichaelIllescas)
