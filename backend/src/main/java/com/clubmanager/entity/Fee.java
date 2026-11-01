package com.clubmanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El tipo de cuota es obligatorio")
    @Size(max = 50, message = "El tipo de cuota no puede tener más de 50 caracteres")
        private String name;

    @NotNull(message = "El monto no puede ser nulo")
    @DecimalMin(value = "0.0", inclusive = false, message = "El monto debe ser mayor a 0")
    private Double amount;

    @NotNull(message = "La fecha de registro es obligatoria")
    private LocalDateTime registrationDate;

    @NotNull(message = "La fecha de última actualización es obligatoria")
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        registrationDate = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
