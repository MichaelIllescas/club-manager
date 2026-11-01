package com.clubmanager.configuration;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    // Clave de prueba en Base64 (256 bits), sólo para los tests
    private static final String CLAVE_TEST = "dGVzdC1zZWNyZXQta2V5LWZvci1qd3QtdGVzdHMtMDEyMzQ1Njc4OQ==";

    private JwtService jwtService;
    private UserDetails usuario;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", CLAVE_TEST);
        usuario = User.withUsername("admin@club.com").password("x")
                .authorities(List.of(new SimpleGrantedAuthority("ADMIN"))).build();
    }

    @Test
    void generaUnTokenConElUsuarioYSuRol() {
        String token = jwtService.generateToken(usuario);

        assertThat(jwtService.extractUserName(token)).isEqualTo("admin@club.com");
        assertThat(jwtService.extractAllClaims(token).get("role")).isEqualTo("ADMIN");
    }

    @Test
    void elTokenEsValidoSoloParaSuUsuario() {
        String token = jwtService.generateToken(usuario);
        UserDetails otro = User.withUsername("otro@club.com").password("x").authorities(List.of()).build();

        assertThat(jwtService.isTokenValid(token, usuario)).isTrue();
        assertThat(jwtService.isTokenValid(token, otro)).isFalse();
    }
}
