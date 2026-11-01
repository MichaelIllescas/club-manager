package com.clubmanager.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void missingRecordReturns404WithMessage() {
        ResponseEntity<Map<String, String>> response =
                handler.notFound(new ResourceNotFoundException("Socio no encontrado con el ID: 9"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).containsEntry("error", "Socio no encontrado con el ID: 9");
    }

    @Test
    void duplicateValueReturns409() {
        ResponseEntity<Map<String, String>> response =
                handler.duplicate(new DuplicateValueException("Ya existe un socio con el DNI: 30111222"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void invalidValueReturns400() {
        ResponseEntity<Map<String, String>> response =
                handler.invalid(new InvalidValueException("El DNI del socio es obligatorio."));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void unexpectedErrorHidesInternalDetail() {
        ResponseEntity<Map<String, String>> response =
                handler.unexpected(new IllegalStateException("SQL: tabla socios bloqueada"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody().get("error")).doesNotContain("SQL");
    }
}
