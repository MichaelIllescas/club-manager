package com.clubmanager.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String dni;
    private String type;  // "player" or "member"

    public PersonDTO(Long id, String firstName, String lastName, String dni, String type) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni = dni;
        this.type = type;
    }

    public PersonDTO() {}
}
