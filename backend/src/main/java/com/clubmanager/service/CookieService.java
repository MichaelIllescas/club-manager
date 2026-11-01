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
        return buildCookie(jwt, 3600); // 1 hora, igual que el token
    }

    // Cookie vacía con los mismos atributos, para que el navegador la borre
    public ResponseCookie clearAuthCookie() {
        return buildCookie("", 0);
    }

    private ResponseCookie buildCookie(String value, long maxAge) {
        ResponseCookie.ResponseCookieBuilder cookie = ResponseCookie.from("authToken", value)
                .httpOnly(true)   // JavaScript no puede leer el token
                .secure(secure)   // En producción, sólo por HTTPS
                .sameSite(secure ? "None" : "Lax")
                .path("/")
                .maxAge(maxAge);
        if (!domain.isBlank()) {
            cookie.domain(domain); // Permite compartir entre subdominios
        }
        return cookie.build();
    }
}
