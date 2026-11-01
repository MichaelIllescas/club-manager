package com.clubmanager.dto;

import com.clubmanager.entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String dni;
    private String phone;
    private String address;
    private String email;
    private String status;
    private Role role;
}
