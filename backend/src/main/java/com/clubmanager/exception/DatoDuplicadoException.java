package com.clubmanager.exception;

// Ya existe un registro con ese dato único, como un DNI (409)
public class DatoDuplicadoException extends RuntimeException {
    public DatoDuplicadoException(String mensaje) {
        super(mensaje);
    }
}
