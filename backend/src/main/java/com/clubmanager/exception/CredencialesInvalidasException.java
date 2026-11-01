package com.clubmanager.exception;

// Email o contraseña incorrectos (401)
public class CredencialesInvalidasException extends RuntimeException {
    public CredencialesInvalidasException(String mensaje) {
        super(mensaje);
    }
}
