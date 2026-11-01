package com.clubmanager.exception;

// The requested record does not exist (404)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
