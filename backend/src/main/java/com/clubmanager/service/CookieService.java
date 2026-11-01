package com.clubmanager.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

    @Value("${app.cookie.domain:}")
    private String domain;

    @Value("${app.cookie.secure:false}")
    private boolean secure;

    public ResponseCookie createAuthCookie(String jwt) {
        ResponseCookie.ResponseCookieBuilder cookie = ResponseCookie.from("authToken", jwt)
                .httpOnly(false)  // Permitir acceso desde el frontend
                .secure(secure)   // En producción, sólo por HTTPS
                .sameSite(secure ? "None" : "Lax")
                .path("/")
                .maxAge(3600);    // Duración de la cookie en segundos (1 hora)
        if (!domain.isBlank()) {
            cookie.domain(domain); // Permite compartir entre subdominios
        }
        return cookie.build();
    }
}
