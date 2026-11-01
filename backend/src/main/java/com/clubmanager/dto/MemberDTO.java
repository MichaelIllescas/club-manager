package com.clubmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String dni;
    private String phone;
    private String email;
    private String memberNumber;
    private String registrationDate;  // ISO-8601 format (yyyy-MM-dd)
    private String address;
    private String status;  // ACTIVE or INACTIVE
}
