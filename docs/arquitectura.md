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
| `configuration` | Seguridad (incluido CORS), filtro JWT de la cookie y servicio de tokens |
| `exception` | Excepciones propias y manejador global |

### Autenticación

1. El usuario envía email y contraseña a `POST /auth/login`.
2. El backend valida las credenciales y genera un JWT firmado con HS256, válido por una hora, que incluye el rol del usuario.
3. El token se devuelve en la cookie `authToken`, HttpOnly y con una hora de duración. JavaScript no puede leerla.
4. En cada pedido, un filtro lee la cookie, valida el token y carga el usuario en el contexto de Spring Security.
5. Todas las rutas requieren autenticación, salvo `/auth/login` y `/auth/logout`. Las operaciones de administración exigen el rol `ADMIN` (ver [API](api.md)).
6. Sin sesión válida, el backend responde `401`. Al cerrar sesión, el backend devuelve la cookie vencida para que el navegador la borre.

La clave de firma se toma de la variable `JWT_SECRET`. El dominio de la cookie y si exige HTTPS se configuran con `COOKIE_DOMAIN` y `COOKIE_SECURE`.

### Errores

Los servicios lanzan excepciones propias del dominio y `GlobalExceptionHandler` las convierte en respuestas HTTP. Los controladores no tienen `try/catch`. Todas las respuestas de error tienen la forma `{"error": "mensaje"}`.

| Excepción | Código | Cuándo |
|---|---|---|
| `ResourceNotFoundException` | 404 | El socio, jugador, cuota o usuario pedido no existe |
| `DuplicateValueException` | 409 | Ya existe un registro con ese DNI o número de socio |
| `InvalidValueException` | 400 | Falta un dato obligatorio |
| `InvalidCredentialsException` | 401 | Email o contraseña incorrectos |
| `DisabledUserException` | 403 | El usuario está deshabilitado |
| Cualquier otra | 500 | Se registra en el log y al cliente se le da un mensaje genérico |

## Frontend

Organizado por módulo funcional dentro de `src/`:

| Carpeta | Contenido |
|---|---|
| `Pages` | Login, panel de inicio, página 404 y footer |
| `Navbar` | Menú de navegación y definición de rutas (`AppRoutes`) |
| `Members`, `Players`, `Categories`, `Fees`, `Payments`, `Revenue`, `Users` | Pantallas de cada módulo |
| `Components` | Tabla genérica (`TableGeneric`), estructura de las pantallas de alta (`FormPage`), franja de totales y comprobante de pago en PDF |
| `Auth` | Contexto de sesión (usuario y rol) y aviso de sesión expirada |
| `Config` | Cliente axios; la URL de la API sale de `VITE_API_URL` |
| `Utils` | Formato de moneda y fechas, estilos de los gráficos |

El código (componentes, variables, clases CSS y API) está en inglés; los textos que ve el usuario, en castellano.

Como la cookie es HttpOnly, al cargar la aplicación se piden los datos del usuario a `/api/users/me` y el rol se usa para mostrar u ocultar menús. Si cualquier pedido recibe `401`, se muestra el aviso de sesión vencida y se vuelve al login.

## Despliegue

- Frontend: el resultado de `npm run build` (`dist/`) se publica como sitio estático.
- Backend: se empaqueta con `mvn package` y se ejecuta como JAR con las variables de entorno configuradas.
- Si frontend y backend están en subdominios distintos, `COOKIE_DOMAIN` tiene que ser el dominio común (por ejemplo `.midominio.com`) y `COOKIE_SECURE` tiene que ser `true`.
