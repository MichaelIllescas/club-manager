package com.clubmanager.service;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class CookieServiceTest {

    private CookieService cookieService(String domain, boolean secure) {
        CookieService service = new CookieService();
        ReflectionTestUtils.setField(service, "domain", domain);
        ReflectionTestUtils.setField(service, "secure", secure);
        return service;
    }

    @Test
    void sessionCookieIsHttpOnly() {
        ResponseCookie cookie = cookieService("", false).createAuthCookie("token");

        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getMaxAge().getSeconds()).isEqualTo(3600);
    }

    @Test
    void locallySetsNoDomainAndNoHttps() {
        ResponseCookie cookie = cookieService("", false).createAuthCookie("token");

        assertThat(cookie.getDomain()).isNull();
        assertThat(cookie.isSecure()).isFalse();
        assertThat(cookie.getSameSite()).isEqualTo("Lax");
    }

    @Test
    void inProductionUsesDomainAndHttps() {
        ResponseCookie cookie = cookieService(".midominio.com", true).createAuthCookie("token");

        assertThat(cookie.getDomain()).isEqualTo(".midominio.com");
        assertThat(cookie.isSecure()).isTrue();
        assertThat(cookie.getSameSite()).isEqualTo("None");
    }

    @Test
    void logoutExpiresCookieWithSameAttributes() {
        ResponseCookie cookie = cookieService(".midominio.com", true).clearAuthCookie();

        assertThat(cookie.getValue()).isEmpty();
        assertThat(cookie.getMaxAge().getSeconds()).isZero();
        assertThat(cookie.getDomain()).isEqualTo(".midominio.com");
        assertThat(cookie.isHttpOnly()).isTrue();
    }
}
