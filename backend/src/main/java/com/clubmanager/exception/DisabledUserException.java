package com.clubmanager.exception;

// The user exists but is disabled (403)
public class DisabledUserException extends RuntimeException {
    public DisabledUserException(String message) {
        super(message);
    }
}
