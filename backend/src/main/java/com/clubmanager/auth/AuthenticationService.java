package com.clubmanager.auth;

import com.clubmanager.exception.UsuarioDeshabilitadoException;

import com.clubmanager.exception.CredencialesInvalidasException;

import com.clubmanager.configuration.JwtService;
import com.clubmanager.entity.Role;
import com.clubmanager.entity.User;
import com.clubmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse registrarUsuario(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dni(request.getDni())
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole().equals(Role.USER.name()) ? Role.USER : Role.ADMIN)
                .enabled(true)
                .build();
        userRepository.save(user);
        var jwt = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
                .jwt(jwt)
                .build();
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        // Buscar al usuario en la base de datos
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CredencialesInvalidasException("Usuario no encontrado."));

        // Verificar si el usuario está deshabilitado
        if (!user.isEnabled()) {
            throw new UsuarioDeshabilitadoException("El usuario está deshabilitado.");
        }

        try {
            // Verificar las credenciales del usuario
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new CredencialesInvalidasException("Usuario o contraseña incorrectos.");
        }

        // Generar el token JWT
        Map<String, Object> claims = new HashMap<>();
        String jwt = jwtService.generateToken(claims, user);

        return AuthenticationResponse.builder()
                .jwt(jwt)
                .build();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}