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
        return buildCookie(jwt, 3600);  // 1 hour, same as the token
    }

    // Empty cookie with the same attributes, so the browser deletes it
    public ResponseCookie clearAuthCookie() {
        return buildCookie("", 0);
    }

    private ResponseCookie buildCookie(String value, long maxAge) {
        ResponseCookie.ResponseCookieBuilder cookie = ResponseCookie.from("authToken", value)
                .httpOnly(true)  // JavaScript cannot read the token
                .secure(secure)  // HTTPS only in production
                .sameSite(secure ? "None" : "Lax")
                .path("/")
                .maxAge(maxAge);
        if (!domain.isBlank()) {
            cookie.domain(domain);  // Shared across subdomains
        }
        return cookie.build();
    }
}
