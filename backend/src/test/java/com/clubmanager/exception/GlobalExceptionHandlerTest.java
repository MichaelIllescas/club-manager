package com.clubmanager.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void registroInexistenteResponde404ConElMensaje() {
        ResponseEntity<Map<String, String>> respuesta =
                handler.noEncontrado(new RecursoNoEncontradoException("Socio no encontrado con el ID: 9"));

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(respuesta.getBody()).containsEntry("error", "Socio no encontrado con el ID: 9");
    }

    @Test
    void datoDuplicadoResponde409() {
        ResponseEntity<Map<String, String>> respuesta =
                handler.duplicado(new DatoDuplicadoException("Ya existe un socio con el DNI: 30111222"));

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }

    @Test
    void datoInvalidoResponde400() {
        ResponseEntity<Map<String, String>> respuesta =
                handler.invalido(new DatoInvalidoException("El DNI del socio es obligatorio."));

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void errorInesperadoNoExponeElDetalleInterno() {
        ResponseEntity<Map<String, String>> respuesta =
                handler.inesperado(new IllegalStateException("SQL: tabla socios bloqueada"));

        assertThat(respuesta.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(respuesta.getBody().get("error")).doesNotContain("SQL");
    }
}
