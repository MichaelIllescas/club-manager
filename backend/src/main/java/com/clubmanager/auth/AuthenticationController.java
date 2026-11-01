package com.clubmanager.auth;

import com.clubmanager.dto.UserDTO;
import com.clubmanager.entity.Role;
import com.clubmanager.exception.DisabledUserException;
import com.clubmanager.exception.InvalidCredentialsException;
import com.clubmanager.service.CookieService;
import com.clubmanager.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final CookieService cookieService;


    @PostMapping("/registrarUsuario")
    public ResponseEntity<AuthenticationResponse> registrarUsuario(
            @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.registrarUsuario(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody AuthenticationRequest request,
            HttpServletResponse response
    ) {
        try {
            // Llamar al servicio para manejar el login y obtener la respuesta de autenticación
            AuthenticationResponse authResponse = authenticationService.login(request);

            // Usar el servicio para crear la cookie
            ResponseCookie cookie = cookieService.createAuthCookie(authResponse.getJwt());

            // Agregar la cookie a la respuesta HTTP
            response.addHeader("Set-Cookie", cookie.toString());

            UserDTO userDto = userService.toDTO(authenticationService.getUserByEmail(request.getEmail()).get());

            // Devolver el UserDTO en la respuesta
            return ResponseEntity.ok(userDto);
        } catch (InvalidCredentialsException e) {
            // Manejar credenciales inválidas
            return ResponseEntity.status(401).body(e.getMessage());
        } catch (DisabledUserException e) {
            // Manejar usuario deshabilitado con código 403
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }catch (Exception e) {
            // Manejar errores inesperados
            return ResponseEntity.status(500).body("Error al conectarse al servidor. Intente más tarde.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Cookie con tiempo de vida 0 y los mismos atributos, para eliminarla
        ResponseCookie cookie = cookieService.clearAuthCookie();

        // Agregar la cookie a la respuesta HTTP
        response.addHeader("Set-Cookie", cookie.toString());

        // Devolver una respuesta de logout exitoso
        return ResponseEntity.ok("Logout successful!");
    }

    @GetMapping("/roles")
    public ResponseEntity<List<String>> getRoles() {
        // Convertir los valores del enum a una lista de Strings
        List<String> roles = Arrays.stream(Role.values())
                .map(Enum::name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }
}
