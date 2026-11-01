# Arquitectura

## Vista general

```
Navegador ──> Frontend (React, sitio estático)
                 │  axios, con credenciales (cookie authToken)
                 ▼
              Backend (Spring Boot, API REST) ──> MySQL
```

El frontend es una aplicación de una sola página servida como archivos estáticos. Toda la información la obtiene del backend por HTTP.

## Backend

Organizado en capas dentro de `com.clubmanager`:

| Paquete | Responsabilidad |
|---|---|
| `controller` | Endpoints REST por recurso |
| `auth` | Login, logout y registro de usuarios |
| `service` | Reglas de negocio y conversión a DTO |
| `repository` | Acceso a datos con Spring Data JPA |
| `entity` | Entidades JPA |
| `dto` | Objetos de entrada y salida de la API |
| `configuration` | Seguridad, filtros JWT y servicio de tokens |
| `security` | CORS y configuración web |
| `exception` | Excepciones propias y manejador global |

### Autenticación

1. El usuario envía email y contraseña a `POST /auth/login`.
2. El backend valida las credenciales y genera un JWT firmado con HS256, válido por una hora, que incluye el rol del usuario.
3. El token se devuelve en la cookie `authToken`, marcada como Secure y con una hora de duración. No es HttpOnly, porque el frontend la lee para detectar si la sesión venció.
4. En cada pedido, un filtro lee la cookie, valida el token y carga el usuario en el contexto de Spring Security.
5. Todas las rutas requieren autenticación, salvo las de `/auth/**`.

La clave de firma se toma de la variable `JWT_SECRET`. El dominio de la cookie y si exige HTTPS se configuran con `COOKIE_DOMAIN` y `COOKIE_SECURE`.

### Errores

`GlobalExceptionHandler` convierte las excepciones en respuestas HTTP: credenciales inválidas, usuario deshabilitado, jugador inexistente y errores de validación.

## Frontend

Organizado por módulo funcional dentro de `src/`:

| Carpeta | Contenido |
|---|---|
| `Index` | Login, panel de inicio con gráfico y footer |
| `Navbar` | Menú de navegación y definición de rutas |
| `Socios`, `Jugadores`, `Categoria`, `Cuotas`, `Pagos`, `Recaudaciones`, `Usuarios` | Pantallas de cada módulo |
| `Components` | Tabla genérica con búsqueda, orden, paginación y exportación a Excel, y comprobante de pago en PDF |
| `Auth` | Lectura de cookies y control de sesión expirada |
| `Config` | Cliente axios; la URL de la API sale de `VITE_API_URL` |
| `Utils` | Formato de moneda argentino |

El control de sesión revisa cada cinco segundos si la cookie sigue presente y, si venció, muestra un aviso y vuelve al login.

## Despliegue

- Frontend: el resultado de `npm run build` (`dist/`) se publica como sitio estático.
- Backend: se empaqueta con `mvn package` y se ejecuta como JAR con las variables de entorno configuradas.
- Si frontend y backend están en subdominios distintos, `COOKIE_DOMAIN` tiene que ser el dominio común (por ejemplo `.midominio.com`) y `COOKIE_SECURE` tiene que ser `true`.
