package com.clubmanager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre no puede estar vacío.")
    @Size(max = 50, message = "El nombre no puede tener más de 50 caracteres.")
    @Column(nullable = false)
    private String firstName;

    @NotBlank(message = "El apellido no puede estar vacío.")
    @Size(max = 50, message = "El apellido no puede tener más de 50 caracteres.")
    @Column(nullable = false)
    private String lastName;

    @NotBlank(message = "El DNI no puede estar vacío.")
    @Pattern(regexp = "\\d{7,8}", message = "El DNI debe tener entre 7 y 8 dígitos.")
    @Column(nullable = false, unique = true)
    private String dni;

    @NotBlank(message = "La dirección no puede estar vacía.")
    @Size(max = 255, message = "La dirección no puede tener más de 255 caracteres.")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "El teléfono no puede estar vacío.")
    @Column(nullable = false)
    private String phone;

    @Email(message = "El email debe ser válido.")
    @Column(nullable = true, unique = false)
    private String email;

    @Column(name = "member_number", nullable = true, unique = true)
    private String memberNumber;

    @NotNull(message = "La fecha de registro no puede ser nula.")
    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;

    @Column(name = "deactivation_date")
    private LocalDate deactivationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MemberStatus status;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Payment> payments;

    public enum MemberStatus {
        ACTIVE,
        INACTIVE
    }

    public void deactivate() {
        this.status = MemberStatus.INACTIVE;
        this.deactivationDate = LocalDate.now();
    }

    public void activate() {
        this.status = MemberStatus.ACTIVE;
        this.deactivationDate = null;
    }

    public boolean isActive() {
        return this.status == MemberStatus.ACTIVE;
    }
}
