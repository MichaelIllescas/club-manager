package com.clubmanager.exception;

// El usuario existe pero está deshabilitado (403)
public class UsuarioDeshabilitadoException extends RuntimeException {
    public UsuarioDeshabilitadoException(String mensaje) {
        super(mensaje);
    }
}
