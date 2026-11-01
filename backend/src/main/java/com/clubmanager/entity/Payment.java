package com.clubmanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.DATE)
    @NotNull(message = "La fecha de pago no puede ser nula.")
    @Column(name = "payment_date", nullable = false)
    private LocalDate paymentDate;

    @Temporal(TemporalType.DATE)
    @NotNull(message = "La fecha de registro no puede ser nula.")
    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;

    @NotNull(message = "El monto no puede ser nulo.")
    @DecimalMin(value = "0.0", inclusive = false, message = "El monto debe ser mayor que 0.")
    @Digits(integer = 10, fraction = 2, message = "El monto debe tener un formato válido (máximo 10 dígitos enteros y 2 decimales).")
    @Column(nullable = false)
    private BigDecimal amount;

    @Size(max = 255, message = "La descripción no puede tener más de 255 caracteres.")
    @Column(length = 255)
    private String description;

    @NotNull(message = "La cuota no puede ser nula.")
    @ManyToOne
    @JoinColumn(name = "fee_id", nullable = false)
    private Fee fee;

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = true)
    private Player player;

   @ManyToOne
   @JoinColumn(name = "member_id", nullable = true)
   private Member member;
   @ManyToOne
   @JoinColumn(name = "user_id", nullable = false)
   private User user;
}
