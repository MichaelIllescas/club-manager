package com.clubmanager.auth;

import com.clubmanager.exception.DisabledUserException;

import com.clubmanager.exception.InvalidCredentialsException;

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

    public AuthenticationResponse registerUser(RegisterRequest request) {
        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dni(request.getDni())
                .phone(request.getPhone())
                .address(request.getAddress())
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
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Usuario no encontrado."));

        if (!user.isEnabled()) {
            throw new DisabledUserException("El usuario está deshabilitado.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException("Usuario o contraseña incorrectos.");
        }

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