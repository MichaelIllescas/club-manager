package com.clubmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerPaymentStatusDTO {
    private String firstName;
    private String lastName;
    private String dni;
    private String status;

    public PlayerPaymentStatusDTO(String firstName, String lastName, String dni, String status) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni=dni;
        this.status = status;
    }

}

