package com.clubmanager.exception;

// Wrong email or password (401)
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
