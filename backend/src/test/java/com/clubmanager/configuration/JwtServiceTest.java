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

    // Base64 test key (256 bits), tests only
    private static final String TEST_KEY = "dGVzdC1zZWNyZXQta2V5LWZvci1qd3QtdGVzdHMtMDEyMzQ1Njc4OQ==";

    private JwtService jwtService;
    private UserDetails user;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", TEST_KEY);
        user = User.withUsername("admin@club.com").password("x")
                .authorities(List.of(new SimpleGrantedAuthority("ADMIN"))).build();
    }

    @Test
    void generatesTokenWithUserAndRole() {
        String token = jwtService.generateToken(user);

        assertThat(jwtService.extractUserName(token)).isEqualTo("admin@club.com");
        assertThat(jwtService.extractAllClaims(token).get("role")).isEqualTo("ADMIN");
    }

    @Test
    void tokenIsValidOnlyForItsUser() {
        String token = jwtService.generateToken(user);
        UserDetails other = User.withUsername("otro@club.com").password("x").authorities(List.of()).build();

        assertThat(jwtService.isTokenValid(token, user)).isTrue();
        assertThat(jwtService.isTokenValid(token, other)).isFalse();
    }
}
