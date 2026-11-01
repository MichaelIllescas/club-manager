package com.clubmanager.exception;

// A record with that unique value already exists, such as a DNI (409)
public class DuplicateValueException extends RuntimeException {
    public DuplicateValueException(String message) {
        super(message);
    }
}
