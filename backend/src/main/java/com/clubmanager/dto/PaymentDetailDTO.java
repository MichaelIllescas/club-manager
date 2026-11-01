package com.clubmanager.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentDetailDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String dni;
    private String category;  // Null when the payment belongs to a member instead of a player
    private String paymentDate;
    private BigDecimal amount;
    private String description;
    private String feeName;
    private String registeredBy;

    public PaymentDetailDTO(Long id, String firstName, String lastName, String dni, String category, String paymentDate, BigDecimal amount, String description, String feeName, String registeredBy) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.dni = dni;
        this.category = category;
        this.paymentDate = paymentDate;
        this.amount = amount;
        this.description = description;
        this.feeName = feeName;
        this.registeredBy= registeredBy;
    }

    public PaymentDetailDTO() {}
}
