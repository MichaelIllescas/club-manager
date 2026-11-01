package com.clubmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String dni;
    private String phone;
    private String email;
    private String registrationDate;
    private String category;
    private String status;

    public PlayerDTO(Long id, String firstName, String lastName, String dni, String phone, String email, String registrationDate, String categoryName, String status) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni = dni;
        this.phone = phone;
        this.email = email;
        this.registrationDate = registrationDate;
        this.category = categoryName;
        this.status = status;
    }
}
