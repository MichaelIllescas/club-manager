package com.clubmanager.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlayerStatusDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String dni;
    private String status;

    public PlayerStatusDTO(Long id, String firstName, String lastName, String dni, String status) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni = dni;
        this.status = status;
    }
}
