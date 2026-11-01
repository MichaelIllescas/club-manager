package com.clubmanager.exception;

// Falta un dato obligatorio o no es válido (400)
public class DatoInvalidoException extends RuntimeException {
    public DatoInvalidoException(String mensaje) {
        super(mensaje);
    }
}
