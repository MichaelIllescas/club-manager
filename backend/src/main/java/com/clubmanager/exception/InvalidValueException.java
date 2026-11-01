package com.clubmanager.exception;

// A required value is missing or invalid (400)
public class InvalidValueException extends RuntimeException {
    public InvalidValueException(String message) {
        super(message);
    }
}
