package com.clubmanager.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "players")
@Data

@AllArgsConstructor
public class Player {

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

    @NotBlank(message = "El teléfono no puede estar vacío.")
    @Column(nullable = false)
    private String phone;

    @NotBlank(message = "El email no puede estar vacío.")
    @Email(message = "El email debe ser válido.")
    @Column(nullable = false, unique = true)
    private String email;

    @NotNull(message = "La fecha de registro no puede ser nula.")
    @Column(name = "registration_date", nullable = false)
    private LocalDate registrationDate;

    @Column(name = "deactivation_date")
    private LocalDate deactivationDate;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Payment> payments;

    @NotNull(message = "La categoría no puede ser nula.")
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlayerStatus status;

    // New players start as ACTIVE
    public Player() {
        this.status = PlayerStatus.ACTIVE;
    }

    public void deactivate() {
        this.status = PlayerStatus.INACTIVE;
        this.deactivationDate = LocalDate.now();
    }
    public void activate() {
        this.status = PlayerStatus.ACTIVE;

    }

    public boolean isActive() {
        return this.status == PlayerStatus.ACTIVE;
    }
}
