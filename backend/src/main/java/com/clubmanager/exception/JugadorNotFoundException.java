package com.clubmanager.exception;

public class JugadorNotFoundException extends RuntimeException {
    public JugadorNotFoundException(String message) {
        super(message);
    }
}
